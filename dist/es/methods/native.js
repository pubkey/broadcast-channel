var isNode = require('detect-node');

import { randomToken, microSeconds as micro } from '../util';

export var microSeconds = micro;

export var type = 'native';

export function create(channelName, options) {
    if (!options) options = {};
    var state = {
        uuid: randomToken(10),
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

export function close(channelState) {
    channelState.bc.close();
    channelState.subscriberFunctions = [];
}

export function postMessage(channelState, messageJson) {
    channelState.bc.postMessage(messageJson, false);
}

export function onMessage(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
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
    return 100;
}