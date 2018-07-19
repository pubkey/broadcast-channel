const isNode = require('detect-node');

import {
    microSeconds as micro
} from '../util';

export const microSeconds = micro;

export const type = 'native';

export function create(channelName, options) {
    if (!options) options = {};
    const state = {
        channelName,
        options,
        messagesCallback: null,
        bc: new BroadcastChannel(channelName),
        subscriberFunctions: []
    };

    state.bc.onmessage = msg => {
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
    if (isNode) return false;

    if (typeof BroadcastChannel === 'function') return true;
}


export function averageResponseTime() {
    return 100;
}