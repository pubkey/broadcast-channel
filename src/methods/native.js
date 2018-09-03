const isNode = require('detect-node');

import {
    randomToken,
    microSeconds as micro
} from '../util';

export const microSeconds = micro;

export const type = 'native';

export function create(channelName, options) {
    if (!options) options = {};
    const state = {
        uuid: randomToken(10),
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

    if (typeof BroadcastChannel === 'function') {
        if (BroadcastChannel._pubkey) {
            throw new Error(
                'BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill'
            );
        }
        return true;
    } else return false;
}


export function averageResponseTime() {
    return 100;
}
