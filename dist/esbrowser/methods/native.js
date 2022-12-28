import { microSeconds as micro, PROMISE_RESOLVED_VOID } from '../util.js';
export var microSeconds = micro;
export var type = 'native';
export function create(channelName) {
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
export function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
export function postMessage(channelState, messageJson) {
  try {
    channelState.bc.postMessage(messageJson, false);
    return PROMISE_RESOLVED_VOID;
  } catch (err) {
    return Promise.reject(err);
  }
}
export function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
export function canBeUsed() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }
    return true;
  } else {
    return false;
  }
}
export function averageResponseTime() {
  return 150;
}
export var NativeMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};