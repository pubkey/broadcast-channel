"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("./util.js");

var _methodChooser = require("./method-chooser.js");

var _options = require("./options.js");

var BroadcastChannel = function BroadcastChannel(name, options) {
  this.name = name;

  if (ENFORCED_OPTIONS) {
    options = ENFORCED_OPTIONS;
  }

  this.options = (0, _options.fillOptionsWithDefaults)(options);
  this.method = (0, _methodChooser.chooseMethod)(this.options); // isListening

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
}; // STATICS

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
  options = (0, _options.fillOptionsWithDefaults)(options);
  var method = (0, _methodChooser.chooseMethod)(options);

  if (method.type === 'node') {
    return method.clearNodeFolder().then(function () {
      return true;
    });
  } else {
    return Promise.resolve(false);
  }
};
/**
 * if set, this method is enforced,
 * no mather what the options are
 */


var ENFORCED_OPTIONS;

BroadcastChannel.enforceOptions = function (options) {
  ENFORCED_OPTIONS = options;
}; // PROTOTYPE


BroadcastChannel.prototype = {
  postMessage: function postMessage(msg) {
    if (this.closed) {
      throw new Error('BroadcastChannel.postMessage(): ' + 'Cannot post message after channel has closed');
    }

    return _post(this, 'message', msg);
  },
  postInternal: function postInternal(msg) {
    return _post(this, 'internal', msg);
  },

  set onmessage(fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };

    _removeListenerObject(this, 'message', this._onML);

    if (fn && typeof fn === 'function') {
      this._onML = listenObj;

      _addListenerObject(this, 'message', listenObj);
    } else {
      this._onML = null;
    }
  },

  addEventListener: function addEventListener(type, fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };

    _addListenerObject(this, type, listenObj);
  },
  removeEventListener: function removeEventListener(type, fn) {
    var obj = this._addEL[type].find(function (obj) {
      return obj.fn === fn;
    });

    _removeListenerObject(this, type, obj);
  },
  close: function close() {
    var _this = this;

    if (this.closed) return;
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : Promise.resolve();
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare.then(function () {
      return Promise.all(_this._befC.map(function (fn) {
        return fn();
      }));
    }).then(function () {
      return _this.method.close(_this._state);
    });
  },

  get type() {
    return this.method.type;
  }

};

function _post(broadcastChannel, type, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time: time,
    type: type,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : Promise.resolve();
  return awaitPrepare.then(function () {
    return broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
  });
}

function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);

  if ((0, _util.isPromise)(maybePromise)) {
    channel._prepP = maybePromise;
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
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}

function _addListenerObject(channel, type, obj) {
  channel._addEL[type].push(obj);

  _startListening(channel);
}

function _removeListenerObject(channel, type, obj) {
  channel._addEL[type] = channel._addEL[type].filter(function (o) {
    return o !== obj;
  });

  _stopListening(channel);
}

function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    // someone is listening, start subscribing
    var listenerFn = function listenerFn(msgObj) {
      channel._addEL[msgObj.type].forEach(function (obj) {
        if (msgObj.time >= obj.time) {
          obj.fn(msgObj.data);
        }
      });
    };

    var time = channel.method.microSeconds();

    if (channel._prepP) {
      channel._prepP.then(function () {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}

function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    // noone is listening, stop subscribing
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}

var _default = BroadcastChannel;
exports["default"] = _default;