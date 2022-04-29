"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OPEN_BROADCAST_CHANNELS = exports.BroadcastChannel = void 0;
exports.clearNodeFolder = clearNodeFolder;
exports.enforceOptions = enforceOptions;

var _util = require("./util.js");

var _methodChooser = require("./method-chooser.js");

var _options = require("./options.js");

/**
 * Contains all open channels,
 * used in tests to ensure everything is closed.
 */
var OPEN_BROADCAST_CHANNELS = new Set();
exports.OPEN_BROADCAST_CHANNELS = OPEN_BROADCAST_CHANNELS;
var lastId = 0;

var BroadcastChannel = function BroadcastChannel(name, options) {
  // identifier of the channel to debug stuff
  this.id = lastId++;
  OPEN_BROADCAST_CHANNELS.add(this);
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
   * Unsend message promises
   * where the sending is still in progress
   * @type {Set<Promise>}
   */

  this._uMP = new Set();
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


exports.BroadcastChannel = BroadcastChannel;
BroadcastChannel._pubkey = true;
/**
 * clears the tmp-folder if is node
 * @return {Promise<boolean>} true if has run, false if not node
 */

function clearNodeFolder(options) {
  options = (0, _options.fillOptionsWithDefaults)(options);
  var method = (0, _methodChooser.chooseMethod)(options);

  if (method.type === 'node') {
    return method.clearNodeFolder().then(function () {
      return true;
    });
  } else {
    return _util.PROMISE_RESOLVED_FALSE;
  }
}
/**
 * if set, this method is enforced,
 * no mather what the options are
 */


var ENFORCED_OPTIONS;

function enforceOptions(options) {
  ENFORCED_OPTIONS = options;
} // PROTOTYPE


BroadcastChannel.prototype = {
  postMessage: function postMessage(msg) {
    if (this.closed) {
      throw new Error('BroadcastChannel.postMessage(): ' + 'Cannot post message after channel has closed ' +
      /**
       * In the past when this error appeared, it was realy hard to debug.
       * So now we log the msg together with the error so it at least
       * gives some clue about where in your application this happens.
       */
      JSON.stringify(msg));
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

    if (this.closed) {
      return;
    }

    OPEN_BROADCAST_CHANNELS["delete"](this);
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : _util.PROMISE_RESOLVED_VOID;
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare // wait until all current sending are processed
    .then(function () {
      return Promise.all(Array.from(_this._uMP));
    }) // run before-close hooks
    .then(function () {
      return Promise.all(_this._befC.map(function (fn) {
        return fn();
      }));
    }) // close the channel
    .then(function () {
      return _this.method.close(_this._state);
    });
  },

  get type() {
    return this.method.type;
  },

  get isClosed() {
    return this.closed;
  }

};
/**
 * Post a message over the channel
 * @returns {Promise} that resolved when the message sending is done
 */

function _post(broadcastChannel, type, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time: time,
    type: type,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : _util.PROMISE_RESOLVED_VOID;
  return awaitPrepare.then(function () {
    var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj); // add/remove to unsend messages list

    broadcastChannel._uMP.add(sendPromise);

    sendPromise["catch"]().then(function () {
      return broadcastChannel._uMP["delete"](sendPromise);
    });
    return sendPromise;
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
      channel._addEL[msgObj.type].forEach(function (listenerObject) {
        /**
         * Getting the current time in JavaScript has no good precision.
         * So instead of only listening to events that happend 'after' the listener
         * was added, we also listen to events that happended 100ms before it.
         * This ensures that when another process, like a WebWorker, sends events
         * we do not miss them out because their timestamp is a bit off compared to the main process.
         * Not doing this would make messages missing when we send data directly after subscribing and awaiting a response.
         * @link https://johnresig.com/blog/accuracy-of-javascript-time/
         */
        var hundredMsInMicro = 100 * 1000;
        var minMessageTime = listenerObject.time - hundredMsInMicro;

        if (msgObj.time >= minMessageTime) {
          listenerObject.fn(msgObj.data);
        } else if (channel.method.type === 'server') {
          // server msg might lag based on connection.
          listenerObject.fn(msgObj.data);
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