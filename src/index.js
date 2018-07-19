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
    this.options = fillOptionsWithDefaults(options);
    this.method = chooseMethod(this.options);

    this._isListening = false;

    /**
     * setting onmessage twice,
     * will overwrite the first listener
     */
    this._onMessageListener = null;

    this._addEventListeners = {
        message: [],
        internal: []
    };

    /**
     * array of promises that will be awaited
     * before the channel is closed
     */
    this._beforeClose = [];

    this._preparePromise = null;
    _prepareChannel(this);
};

BroadcastChannel.prototype = {
    _post(type, msg) {
        const time = this.method.microSeconds();
        const msgObj = {
            time,
            type,
            data: msg
        };

        const awaitPrepare = this._preparePromise ? this._preparePromise : Promise.resolve();
        return awaitPrepare.then(() => {
            return this.method.postMessage(
                this._state,
                msgObj
            );
        });
    },
    postMessage(msg) {
        if (this.closed) {
            throw new Error(
                'BroadcastChannel.postMessage(): ' +
                'Cannot post message after channel has closed'
            );
        }
        return this._post('message', msg);
    },
    postInternal(msg) {
        return this._post('internal', msg);
    },
    set onmessage(fn) {
        const time = this.method.microSeconds();
        const listenObj = {
            time,
            fn
        };
        _removeListenerObject(this, 'message', this._onMessageListener);
        if (fn && typeof fn === 'function') {
            this._onMessageListener = listenObj;
            _addListenerObject(this, 'message', listenObj);
        } else {
            this._onMessageListener = null;
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
        const obj = this._addEventListeners[type].find(obj => obj.fn === fn);
        _removeListenerObject(this, type, obj);
    },

    close() {
        if (this.closed) return;
        this.closed = true;
        const awaitPrepare = this._preparePromise ? this._preparePromise : Promise.resolve();

        this._onMessageListener = null;
        this._addEventListeners.message = [];

        return awaitPrepare
            .then(() => Promise.all(this._beforeClose.map(fn => fn())))
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

function _prepareChannel(channel) {
    const maybePromise = channel.method.create(channel.name, channel.options);
    if (isPromise(maybePromise)) {
        channel._preparePromise = maybePromise;
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
    if (channel._addEventListeners.message.length > 0) return true;
    if (channel._addEventListeners.internal.length > 0) return true;
    return false;
}

function _addListenerObject(channel, type, obj) {
    channel._addEventListeners[type].push(obj);
    _startListening(channel);
}
function _removeListenerObject(channel, type, obj) {
    channel._addEventListeners[type] = channel._addEventListeners[type].filter(o => o !== obj);
    _stopListening(channel);
}

function _startListening(channel) {
    if (!channel._isListening && _hasMessageListeners(channel)) {
        // someone is listening, start subscribing

        const listenerFn = msgObj => {
            channel._addEventListeners[msgObj.type].forEach(obj => {

                /*
                console.log('... message time:');
                console.dir(msgObj);
                console.log('listener time:');
                console.dir(obj);*/

                if (msgObj.time >= obj.time) {
                    obj.fn(msgObj.data);
                }
            });
        };

        const time = channel.method.microSeconds();
        if (channel._preparePromise) {
            channel._preparePromise.then(() => {
                channel._isListening = true;
                channel.method.onMessage(
                    channel._state,
                    listenerFn,
                    time
                );
            });
        } else {
            channel._isListening = true;
            channel.method.onMessage(
                channel._state,
                listenerFn,
                time
            );
        }
    }
}

function _stopListening(channel) {
    if (channel._isListening && !_hasMessageListeners(channel)) {
        // noone is listening, stop subscribing
        channel._isListening = false;
        const time = channel.method.microSeconds();
        channel.method.onMessage(
            channel._state,
            null,
            time
        );
    }
}

export default BroadcastChannel;