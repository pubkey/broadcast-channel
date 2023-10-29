import {
    microSeconds as micro,
    PROMISE_RESOLVED_VOID
} from '../util.js';

export const microSeconds = micro;

export const type = 'deno';

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
    // eslint-disable-next-line
    if (globalThis.Deno && globalThis.Deno.BroadcastChannel) {
        return true;
    } else {
        return false;
    }
}


export function averageResponseTime() {
    return 150;
}

export const DenoMethod = {
    create,
    close,
    onMessage,
    postMessage,
    canBeUsed,
    type,
    averageResponseTime,
    microSeconds
};
