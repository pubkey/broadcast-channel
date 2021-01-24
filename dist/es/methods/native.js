import { microSeconds as micro, isNode } from '../util';
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
  channelState.bc.postMessage(messageJson, false);
}
export function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
export function canBeUsed() {
  /**
   * in the electron-renderer, isNode will be true even if we are in browser-context
   * so we also check if window is undefined
   */
  if (isNode && typeof window === 'undefined') return false;

  if (typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }

    return true;
  } else return false;
}
export function averageResponseTime() {
  return 150;
}
export default {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};