import {
    isPromise
} from './util.js';

import {
    chooseMethod
} from './method-chooser.js';

import {
    fillOptionsWithDefaults
} from './options.js';


const BroadcastChannel = function (name, options) {
    this.name = name;

    if (ENFORCED_OPTIONS) {
        options = ENFORCED_OPTIONS;
    }
    this.options = fillOptionsWithDefaults(options);

    this.method = chooseMethod(this.options);

    // isListening
    this._iL = false;

    /**
     * _onMessageListener
     * setting onmessage twice,
     * will overwrite the first listener
     */
    this._onML = null;

    /**
     * _addEventListeners
     */
    this._addEL = {
        message: [],
        internal: []
    };

    /**
     * _beforeClose
     * array of promises that will be awaited
     * before the channel is closed
     */
    this._befC = [];

    /**
     * _preparePromise
     */
    this._prepP = null;
    _prepareChannel(this);
};

// STATICS

/**
 * used to identify if someone overwrites
 * window.BroadcastChannel with this
 * See methods/native.js
 */
BroadcastChannel._pubkey = true;

/**
 * clears the tmp-folder if is node
 * @return {Promise<boolean>} true if has run, false if not node
 */
BroadcastChannel.clearNodeFolder = function (options) {
    options = fillOptionsWithDefaults(options);
    const method = chooseMethod(options);
    if (method.type === 'node') {
        return method.clearNodeFolder().then(() => true);
    } else {
        return Promise.resolve(false);
    }
};

/**
 * if set, this method is enforced,
 * no mather what the options are
 */
let ENFORCED_OPTIONS;
BroadcastChannel.enforceOptions = function (options) {
    ENFORCED_OPTIONS = options;
};


// PROTOTYPE
BroadcastChannel.prototype = {
    postMessage(msg) {
        if (this.closed) {
            throw new Error(
                'BroadcastChannel.postMessage(): ' +
                'Cannot post message after channel has closed'
            );
        }
        return _post(this, 'message', msg);
    },
    postInternal(msg) {
        return _post(this, 'internal', msg);
    },
    set onmessage(fn) {
        const time = this.method.microSeconds();
        const listenObj = {
            time,
            fn
        };
        _removeListenerObject(this, 'message', this._onML);
        if (fn && typeof fn === 'function') {
            this._onML = listenObj;
            _addListenerObject(this, 'message', listenObj);
        } else {
            this._onML = null;
        }
    },

    addEventListener(type, fn) {
        const time = this.method.microSeconds();
        const listenObj = {
            time,
            fn
        };
        _addListenerObject(this, type, listenObj);
    },
    removeEventListener(type, fn) {
        const obj = this._addEL[type].find(obj => obj.fn === fn);
        _removeListenerObject(this, type, obj);
    },

    close() {
        if (this.closed) return;
        this.closed = true;
        const awaitPrepare = this._prepP ? this._prepP : Promise.resolve();

        this._onML = null;
        this._addEL.message = [];

        return awaitPrepare
            .then(() => Promise.all(this._befC.map(fn => fn())))
            .then(() => {
                return this.method.close(
                    this._state
                );
            });
    },
    get type() {
        return this.method.type;
    }
};


function _post(broadcastChannel, type, msg) {
    const time = broadcastChannel.method.microSeconds();
    const msgObj = {
        time,
        type,
        data: msg
    };

    const awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : Promise.resolve();
    return awaitPrepare.then(() => {
        return broadcastChannel.method.postMessage(
            broadcastChannel._state,
            msgObj
        );
    });
}

function _prepareChannel(channel) {
    const maybePromise = channel.method.create(channel.name, channel.options);
    if (isPromise(maybePromise)) {
        channel._prepP = maybePromise;
        maybePromise.then(s => {
            // used in tests to simulate slow runtime
            /*if (channel.options.prepareDelay) {
                 await new Promise(res => setTimeout(res, this.options.prepareDelay));
            }*/
            channel._state = s;
        });
    } else {
        channel._state = maybePromise;
    }
}


function _hasMessageListeners(channel) {
    if (channel._addEL.message.length > 0) return true;
    if (channel._addEL.internal.length > 0) return true;
    return false;
}

function _addListenerObject(channel, type, obj) {
    channel._addEL[type].push(obj);
    _startListening(channel);
}

function _removeListenerObject(channel, type, obj) {
    channel._addEL[type] = channel._addEL[type].filter(o => o !== obj);
    _stopListening(channel);
}

function _startListening(channel) {
    if (!channel._iL && _hasMessageListeners(channel)) {
        // someone is listening, start subscribing

        const listenerFn = msgObj => {
            channel._addEL[msgObj.type].forEach(obj => {
                if (msgObj.time >= obj.time) {
                    obj.fn(msgObj.data);
                }
            });
        };

        const time = channel.method.microSeconds();
        if (channel._prepP) {
            channel._prepP.then(() => {
                channel._iL = true;
                channel.method.onMessage(
                    channel._state,
                    listenerFn,
                    time
                );
            });
        } else {
            channel._iL = true;
            channel.method.onMessage(
                channel._state,
                listenerFn,
                time
            );
        }
    }
}

function _stopListening(channel) {
    if (channel._iL && !_hasMessageListeners(channel)) {
        // noone is listening, stop subscribing
        channel._iL = false;
        const time = channel.method.microSeconds();
        channel.method.onMessage(
            channel._state,
            null,
            time
        );
    }
}

export default BroadcastChannel;
