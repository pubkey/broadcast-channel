import Bowser from 'bowser';
import loglevel from 'loglevel';
/**
 * returns true if the given object is a promise
 */

export function isPromise(obj) {
  if (obj && typeof obj.then === 'function') {
    return true;
  } else {
    return false;
  }
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
var additional = 0;
/**
 * returns the current time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */

export function microSeconds() {
  var ms = new Date().getTime();

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

export var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
export function are3PCSupported() {
  var browserInfo = Bowser.parse(navigator.userAgent);
  log.info(JSON.stringify(browserInfo), 'current browser info');
  var thirdPartyCookieSupport = true; // brave

  if (navigator.brave) {
    thirdPartyCookieSupport = false;
  } // All webkit & gecko engine instances use itp (intelligent tracking prevention -
  // https://webkit.org/tracking-prevention/#intelligent-tracking-prevention-itp)


  if (browserInfo.engine.name === Bowser.ENGINE_MAP.WebKit || browserInfo.engine.name === Bowser.ENGINE_MAP.Gecko) {
    thirdPartyCookieSupport = false;
  }

  return thirdPartyCookieSupport;
}
export var log = loglevel.getLogger('broadcast-channel');
log.setLevel('error');
export var setLogLevel = function setLogLevel(level) {
  log.setLevel(level);
};