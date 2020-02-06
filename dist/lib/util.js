"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPromise = isPromise;
exports.sleep = sleep;
exports.randomInt = randomInt;
exports.randomToken = randomToken;
exports.microSeconds = microSeconds;
exports.isNode = exports.isElectronBrowser = exports.isNodeOrElectron = void 0;

/**
 * returns true if the given object is a promise
 */
function isPromise(obj) {
  if (obj && typeof obj.then === 'function') {
    return true;
  } else {
    return false;
  }
}

function sleep(time) {
  if (!time) time = 0;
  return new Promise(function (res) {
    return setTimeout(res, time);
  });
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * https://stackoverflow.com/a/8084248
 */


function randomToken() {
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

function microSeconds() {
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
 * But the problem was that electron-chrome was also detected as node-js,
 * so we do additional stuff
 * @link https://github.com/pubkey/broadcast-channel/pull/93
 * @link https://github.com/electron/electron/issues/2288#issuecomment-123226816
 */


var isNodeOrElectron = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
exports.isNodeOrElectron = isNodeOrElectron;
var versions = isNodeOrElectron && process.versions;
var isElectronBrowser = versions && versions.electron && versions.chrome;
exports.isElectronBrowser = isElectronBrowser;
var isNode = isNodeOrElectron && !isElectronBrowser;
exports.isNode = isNode;