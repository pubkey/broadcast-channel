"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROMISE_RESOLVED_VOID = exports.PROMISE_RESOLVED_TRUE = exports.PROMISE_RESOLVED_FALSE = void 0;
exports.are3PCSupported = are3PCSupported;
exports.isNode = void 0;
exports.isPromise = isPromise;
exports.microSeconds = microSeconds;
exports.randomInt = randomInt;
exports.randomToken = randomToken;
exports.sleep = sleep;

var _bowser = _interopRequireWildcard(require("bowser"));

var _loglevel = _interopRequireDefault(require("loglevel"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var PROMISE_RESOLVED_FALSE = Promise.resolve(false);
exports.PROMISE_RESOLVED_FALSE = PROMISE_RESOLVED_FALSE;
var PROMISE_RESOLVED_TRUE = Promise.resolve(true);
exports.PROMISE_RESOLVED_TRUE = PROMISE_RESOLVED_TRUE;
var PROMISE_RESOLVED_VOID = Promise.resolve();
exports.PROMISE_RESOLVED_VOID = PROMISE_RESOLVED_VOID;

function sleep(time, resolveWith) {
  if (!time) time = 0;
  return new Promise(function (res) {
    return setTimeout(function () {
      return res(resolveWith);
    }, time);
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
 */


var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
exports.isNode = isNode;

function are3PCSupported() {
  var browserInfo = _bowser["default"].parse(navigator.userAgent);

  _loglevel["default"].info(JSON.stringify(browserInfo), 'current browser info');

  var thirdPartyCookieSupport = true; // brave

  if (navigator.brave) {
    thirdPartyCookieSupport = false;
  } // All webkit & gecko engine instances use itp (intelligent tracking prevention -
  // https://webkit.org/tracking-prevention/#intelligent-tracking-prevention-itp)


  if (browserInfo.engine.name === _bowser.ENGINE_MAP.WebKit || browserInfo.engine.name === _bowser.ENGINE_MAP.Gecko) {
    thirdPartyCookieSupport = false;
  }

  return thirdPartyCookieSupport;
}