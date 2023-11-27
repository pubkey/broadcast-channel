"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeMethod = void 0;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.type = void 0;
var _util = require("../util.js");
var microSeconds = exports.microSeconds = _util.microSeconds;
var type = exports.type = 'native';
function create(channelName) {
  var state = {
    time: (0, _util.microSeconds)(),
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: [] // subscriberFunctions
  };

  state.bc.onmessage = function (msgEvent) {
    if (state.messagesCallback) {
      state.messagesCallback(msgEvent.data);
    }
  };
  return state;
}
function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  try {
    channelState.bc.postMessage(messageJson, false);
    return _util.PROMISE_RESOLVED_VOID;
  } catch (err) {
    return Promise.reject(err);
  }
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  // Deno runtime
  // eslint-disable-next-line
  if (typeof globalThis !== 'undefined' && globalThis.Deno && globalThis.Deno.args) {
    return true;
  }

  // Browser runtime
  if ((typeof window !== 'undefined' || typeof self !== 'undefined') && typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }
    return true;
  } else {
    return false;
  }
}
function averageResponseTime() {
  return 150;
}
var NativeMethod = exports.NativeMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};