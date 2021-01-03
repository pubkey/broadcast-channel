"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.close = close;
exports.postMessage = postMessage;
exports.onMessage = onMessage;
exports.canBeUsed = canBeUsed;
exports.averageResponseTime = averageResponseTime;
exports["default"] = exports.type = exports.microSeconds = void 0;

var _util = require("../util");

var microSeconds = _util.microSeconds;
exports.microSeconds = microSeconds;
var type = 'native';
exports.type = type;

function create(channelName) {
  var state = {
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: [] // subscriberFunctions

  };

  state.bc.onmessage = function (msg) {
    if (state.messagesCallback) {
      state.messagesCallback(msg.data);
    }
  };

  return state;
}

function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}

function postMessage(channelState, messageJson) {
  channelState.bc.postMessage(messageJson, false);
}

function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}

function canBeUsed() {
  /**
   * in the electron-renderer, isNode will be true even if we are in browser-context
   * so we also check if window is undefined
   */
  if (_util.isNode && typeof window === 'undefined') return false;

  if (typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }

    return true;
  } else return false;
}

function averageResponseTime() {
  return 150;
}

var _default = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};
exports["default"] = _default;