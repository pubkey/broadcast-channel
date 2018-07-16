import { isPromise } from './util.js';

import { chooseMethod } from './method-chooser.js';

import { fillOptionsWithDefaults } from './options.js';

var BroadcastChannel = function BroadcastChannel(name, options) {
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
    _post: function _post(type, msg) {
        var _this = this;

        var msgObj = {
            time: new Date().getTime(),
            type: type,
            data: msg
        };

        var awaitPrepare = this._preparePromise ? this._preparePromise : Promise.resolve();
        return awaitPrepare.then(function () {
            return _this.method.postMessage(_this._state, msgObj);
        });
    },
    postMessage: function postMessage(msg) {
        if (this.closed) {
            throw new Error('BroadcastChannel.postMessage(): ' + 'Cannot post message after channel has closed');
        }
        return this._post('message', msg);
    },
    postInternal: function postInternal(msg) {
        return this._post('internal', msg);
    },

    set onmessage(fn) {
        var time = new Date().getTime();
        var listenObj = {
            time: time,
            fn: fn
        };
        _removeListenerObject(this, 'message', this._onMessageListener);
        if (fn && typeof fn === 'function') {
            this._onMessageListener = listenObj;
            _addListenerObject(this, 'message', listenObj);
        } else {
            this._onMessageListener = null;
        }
    },

    addEventListener: function addEventListener(type, fn) {
        var time = new Date().getTime();
        var listenObj = {
            time: time,
            fn: fn
        };
        _addListenerObject(this, type, listenObj);
    },
    removeEventListener: function removeEventListener(type, fn) {
        var obj = this._addEventListeners[type].find(function (obj) {
            return obj.fn === fn;
        });
        _removeListenerObject(this, type, obj);
    },
    close: function close() {
        var _this2 = this;

        if (this.closed) return;
        this.closed = true;
        var awaitPrepare = this._preparePromise ? this._preparePromise : Promise.resolve();

        this._onMessageListener = null;
        this._addEventListeners.message = [];

        return awaitPrepare.then(function () {
            return Promise.all(_this2._beforeClose.map(function (fn) {
                return fn();
            }));
        }).then(function () {
            return _this2.method.close(_this2._state);
        });
    },

    get type() {
        return this.method.type;
    }
};

function _prepareChannel(channel) {
    var maybePromise = channel.method.create(channel.name, channel.options);
    if (isPromise(maybePromise)) {
        channel._preparePromise = maybePromise;
        maybePromise.then(function (s) {
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
    channel._addEventListeners[type] = channel._addEventListeners[type].filter(function (o) {
        return o !== obj;
    });
    _stopListening(channel);
}

function _startListening(channel) {
    if (!channel._isListening && _hasMessageListeners(channel)) {
        // someone is listening, start subscribing

        var listenerFn = function listenerFn(msgObj) {
            channel._addEventListeners[msgObj.type].forEach(function (obj) {
                if (msgObj.time >= obj.time) {
                    obj.fn(msgObj.data);
                }
            });
        };

        var time = new Date().getTime() - 5;
        if (channel._preparePromise) {
            channel._preparePromise.then(function () {
                channel._isListening = true;
                channel.method.onMessage(channel._state, listenerFn, time);
            });
        } else {
            channel._isListening = true;
            channel.method.onMessage(channel._state, listenerFn, time);
        }
    }
}

function _stopListening(channel) {
    if (channel._isListening && !_hasMessageListeners(channel)) {
        // noone is listening, stop subscribing
        channel._isListening = false;
        var time = new Date().getTime() - 5;
        channel.method.onMessage(channel._state, null, time);
    }
}

export default BroadcastChannel;