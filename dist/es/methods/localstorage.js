/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */
import isNode from 'detect-node';
import ObliviousSet from '../oblivious-set';
import { fillOptionsWithDefaults } from '../options';
import { sleep, randomToken, microSeconds as micro } from '../util';
export var microSeconds = micro;
var KEY_PREFIX = 'pubkey.broadcastChannel-';
export var type = 'localstorage';
/**
 * copied from crosstab
 * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
 */

export function getLocalStorage() {
  var localStorage;
  if (typeof window === 'undefined') return null;

  try {
    localStorage = window.localStorage;
    localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
  } catch (e) {// New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }

  return localStorage;
}
export function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
* writes the new message to the storage
* and fires the storage-event so other readers can find it
*/

export function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    sleep().then(function () {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: randomToken(10),
        time: new Date().getTime(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      localStorage.setItem(key, value);
      /**
       * StorageEvent does not fire the 'storage' event
       * in the window that changes the state of the local storage.
       * So we fire it manually
       */

      var ev = document.createEvent('Event');
      ev.initEvent('storage', true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
export function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);

  var listener = function listener(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };

  window.addEventListener('storage', listener);
  return listener;
}
export function removeStorageEventListener(listener) {
  window.removeEventListener('storage', listener);
}
export function create(channelName, options) {
  options = fillOptionsWithDefaults(options);

  if (!canBeUsed()) {
    throw new Error('BroadcastChannel: localstorage cannot be used');
  }

  var startTime = new Date().getTime();
  var uuid = randomToken(10); // contains all messages that have been emitted before

  var emittedMessagesIds = new ObliviousSet(options.localstorage.removeTimeout);
  var state = {
    startTime: startTime,
    channelName: channelName,
    options: options,
    uuid: uuid,
    emittedMessagesIds: emittedMessagesIds
  };
  state.listener = addStorageEventListener(channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener

    if (msgObj.uuid === uuid) return; // own message

    if (!msgObj.token || emittedMessagesIds.has(msgObj.token)) return; // already emitted

    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

    emittedMessagesIds.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
export function close(channelState) {
  removeStorageEventListener(channelState.listener);
}
export function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
export function canBeUsed() {
  if (isNode) return false;
  var ls = getLocalStorage();
  if (!ls) return false;
  return true;
}
export function averageResponseTime() {
  return 120;
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