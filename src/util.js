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


let lastMs = 0;
let additional = 0;

/**
 * returns the current time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */
export function microSeconds() {
    const ms = new Date().getTime();
    if (ms === lastMs) {
        additional++;
        return ms * 1000 + additional;
    } else {
        lastMs = ms;
        additional = 0;
        return ms * 1000;
    }
}

/**
 * copied from the 'detect-node' npm module
 * We cannot use the module directly because it causes problems with rollup
 * @link https://github.com/iliakan/detect-node/blob/master/index.js
 */
export const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';