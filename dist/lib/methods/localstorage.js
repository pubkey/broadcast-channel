'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.type = exports.microSeconds = undefined;
exports.getLocalStorage = getLocalStorage;
exports.storageKey = storageKey;
exports.postMessage = postMessage;
exports.addStorageEventListener = addStorageEventListener;
exports.removeStorageEventListener = removeStorageEventListener;
exports.create = create;
exports.close = close;
exports.onMessage = onMessage;
exports.canBeUsed = canBeUsed;
exports.averageResponseTime = averageResponseTime;

var _obliviousSet = require('../oblivious-set');

var _obliviousSet2 = _interopRequireDefault(_obliviousSet);

var _options = require('../options');

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */

var isNode = require('detect-node');
var microSeconds = exports.microSeconds = _util.microSeconds;

var KEY_PREFIX = 'pubkey.broadcastChannel-';
var type = exports.type = 'localstorage';

/**
 * copied from crosstab
 * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
 */
function getLocalStorage() {
    var localStorage = void 0;
    if (typeof window === 'undefined') return null;
    try {
        localStorage = window.localStorage;
        localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
    } catch (e) {
        // New versions of Firefox throw a Security exception
        // if cookies are disabled. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
    }
    return localStorage;
}

function storageKey(channelName) {
    return KEY_PREFIX + channelName;
}

/**
* writes the new message to the storage
* and fires the storage-event so other readers can find it
*/
function postMessage(channelState, messageJson) {
    return new Promise(function (res) {
        (0, _util.sleep)().then(function () {
            var key = storageKey(channelState.channelName);
            var writeObj = {
                token: (0, _util.randomToken)(10),
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

function addStorageEventListener(channelName, fn) {
    var key = storageKey(channelName);
    var listener = function listener(ev) {
        if (ev.key === key) {
            fn(JSON.parse(ev.newValue));
        }
    };
    window.addEventListener('storage', listener);
    return listener;
}
function removeStorageEventListener(listener) {
    window.removeEventListener('storage', listener);
}

function create(channelName, options) {
    options = (0, _options.fillOptionsWithDefaults)(options);
    if (!canBeUsed()) {
        throw new Error('BroadcastChannel: localstorage cannot be used');
    }

    var startTime = new Date().getTime();
    var uuid = (0, _util.randomToken)(10);

    // contains all messages that have been emitted before
    var emittedMessagesIds = new _obliviousSet2['default'](options.localstorage.removeTimeout);

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

function close(channelState) {
    removeStorageEventListener(channelState.listener);
}

function onMessage(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
}

function canBeUsed() {
    if (isNode) return false;
    var ls = getLocalStorage();

    if (!ls) return false;
    return true;
}

function averageResponseTime() {
    return 120;
}