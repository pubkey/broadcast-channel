import {
    microSeconds as micro,
    PROMISE_RESOLVED_VOID
} from '../util.js';

export const microSeconds = micro;

export const type = 'native';

export function create(channelName) {
    const state = {
        messagesCallback: null,
        bc: new BroadcastChannel(channelName),
        subFns: [] // subscriberFunctions
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
    if (
        (typeof window !== 'undefined' || typeof self !== 'undefined') &&
        typeof BroadcastChannel === 'function'
    ) {
        if (BroadcastChannel._pubkey) {
            throw new Error(
                'BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill'
            );
        }
        return true;
    } else {
        return false;
    }
}


export function averageResponseTime() {
    return 150;
}

export const NativeMethod = {
    create,
    close,
    onMessage,
    postMessage,
    canBeUsed,
    type,
    averageResponseTime,
    microSeconds
};
