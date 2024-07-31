/**
 * returns true if the given object is a promise
 */
export function isPromise(obj) {
    return obj &&
        typeof obj.then === 'function';
}

export const PROMISE_RESOLVED_FALSE = Promise.resolve(false);
export const PROMISE_RESOLVED_TRUE = Promise.resolve(true);
export const PROMISE_RESOLVED_VOID = Promise.resolve();

export function sleep(time, resolveWith) {
    if (!time) time = 0;
    return new Promise(res => setTimeout(() => res(resolveWith), time));
}

export function randomInt(min, max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const randomFloat = arr[0] * Math.pow(2, -32);
    return Math.floor(randomFloat * (max - min + 1) + min);
}

export function randomToken() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomArray = new Uint8Array(11);
    crypto.getRandomValues(randomArray);
    randomArray.forEach((number) => {
        result += chars[number % chars.length];
    });
    return result;
}


let lastMs = 0;

/**
 * Returns the current unix time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */
export function microSeconds() {
    let ret = Date.now() * 1000; // milliseconds to microseconds
    if (ret <= lastMs) {
        ret = lastMs + 1;
    }
    lastMs = ret;
    return ret;
}

/**
 * Check if WebLock API is supported.
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 */
export function supportsWebLockAPI() {
    if (
        typeof navigator !== 'undefined' &&
        typeof navigator.locks !== 'undefined' &&
        typeof navigator.locks.request === 'function'
    ) {
        return true;
    } else {
        return false;
    }
}
