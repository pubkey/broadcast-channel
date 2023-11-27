/**
 * returns true if the given object is a promise
 */
export function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}
export var PROMISE_RESOLVED_FALSE = Promise.resolve(false);
export var PROMISE_RESOLVED_TRUE = Promise.resolve(true);
export var PROMISE_RESOLVED_VOID = Promise.resolve();
export function sleep(time, resolveWith) {
  if (!time) time = 0;
  return new Promise(function (res) {
    return setTimeout(function () {
      return res(resolveWith);
    }, time);
  });
}
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * https://stackoverflow.com/a/8084248
 */
export function randomToken() {
  return Math.random().toString(36).substring(2);
}
var lastMs = 0;

/**
 * Returns the current unix time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */
export function microSeconds() {
  var ret = Date.now() * 1000; // milliseconds to microseconds
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
  if (typeof navigator !== 'undefined' && typeof navigator.locks !== 'undefined' && typeof navigator.locks.request === 'function') {
    return true;
  } else {
    return false;
  }
}