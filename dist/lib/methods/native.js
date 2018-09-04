'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.type = exports.microSeconds = undefined;
exports.create = create;
exports.close = close;
exports.postMessage = postMessage;
exports.onMessage = onMessage;
exports.canBeUsed = canBeUsed;
exports.averageResponseTime = averageResponseTime;

var _util = require('../util');

var isNode = require('detect-node');

var microSeconds = exports.microSeconds = _util.microSeconds;

var type = exports.type = 'native';

function create(channelName, options) {
    if (!options) options = {};
    var state = {
        uuid: (0, _util.randomToken)(10),
        channelName: channelName,
        options: options,
        messagesCallback: null,
        bc: new BroadcastChannel(channelName),
        subscriberFunctions: []
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
    channelState.subscriberFunctions = [];
}

function postMessage(channelState, messageJson) {
    channelState.bc.postMessage(messageJson, false);
}

function onMessage(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
}

function canBeUsed() {

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

function averageResponseTime() {
    return 100;
}