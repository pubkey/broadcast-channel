import {
    microSeconds as micro,
} from '../util.js';

export const microSeconds = micro;

export const type = 'simulate';

const SIMULATE_CHANNELS = new Set();

export function create(channelName) {
    const state = {
        time: microSeconds(),
        name: channelName,
        messagesCallback: null
    };
    SIMULATE_CHANNELS.add(state);
    return state;
}

export function close(channelState) {
    SIMULATE_CHANNELS.delete(channelState);
}

export const SIMULATE_DELAY_TIME = 5;

export function postMessage(channelState, messageJson) {
    return new Promise(res => setTimeout(() => {
        const channelArray = Array.from(SIMULATE_CHANNELS);
        channelArray.forEach(channel => {
            if (
                channel.name === channelState.name && // has same name
                channel !== channelState && // not own channel
                !!channel.messagesCallback && // has subscribers
                channel.time < messageJson.time // channel not created after postMessage() call
            ) {
                channel.messagesCallback(messageJson);
            }
        });
        res();
    }, SIMULATE_DELAY_TIME));
}

export function onMessage(channelState, fn) {
    channelState.messagesCallback = fn;
}

export function canBeUsed() {
    return true;
}


export function averageResponseTime() {
    return SIMULATE_DELAY_TIME;
}

export const SimulateMethod = {
    create,
    close,
    onMessage,
    postMessage,
    canBeUsed,
    type,
    averageResponseTime,
    microSeconds
};
