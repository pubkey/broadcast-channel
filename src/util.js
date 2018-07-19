const micro = require('microseconds/now.js');

/**
 * returns true if the given object is a promise
 */
export function isPromise(obj) {
    if (obj &&
        typeof obj.then === 'function') {
        return true;
    } else {
        return false;
    }
}

export function sleep(time) {
    if (!time) time = 0;
    return new Promise(res => setTimeout(res, time));
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * https://stackoverflow.com/a/1349426/3443137
 */
export function randomToken(length) {
    if (!length) length = 5;
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxzy0123456789';

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * returns the current time in micro-seconds,
 * by using performance now and a fallback do Date.getTime
 */
export function microSeconds() {
    return micro();
}