"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseMethod = chooseMethod;

var _native = _interopRequireDefault(require("./methods/native.js"));

var _indexedDb = _interopRequireDefault(require("./methods/indexed-db.js"));

var _localstorage = _interopRequireDefault(require("./methods/localstorage.js"));

var _simulate = _interopRequireDefault(require("./methods/simulate.js"));

var _util = require("./util");

// order is important
var METHODS = [_native["default"], // fastest
_indexedDb["default"], _localstorage["default"], _simulate["default"]];
var REQUIRE_FUN = require;
/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */

if (_util.isNode) {
  /**
   * we use the non-transpiled code for nodejs
   * because it runs faster
   */
  var NodeMethod = REQUIRE_FUN('../../src/methods/node.js');
  /**
   * this will be false for webpackbuilds
   * which will shim the node-method with an empty object {}
   */

  if (typeof NodeMethod.canBeUsed === 'function') {
    // must be first so it's chosen by default
    METHODS.unshift(NodeMethod);
  }
}

function chooseMethod(options) {
  // directly chosen
  if (options.type) {
    var ret = METHODS.find(function (m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
  }
  /**
   * if no webworker support is needed,
   * remove idb from the list so that localstorage is been chosen
   */


  var chooseMethods = METHODS;

  if (!options.webWorkerSupport && !_util.isNode) {
    chooseMethods = METHODS.filter(function (m) {
      return m.type !== 'idb';
    });
  }

  var useMethod = chooseMethods.find(function (method) {
    // do never choose the simulate method if not explicitly set
    return method.type !== 'simulate' && method.canBeUsed();
  });
  if (!useMethod) throw new Error('No useable methode found:' + JSON.stringify(METHODS.map(function (m) {
    return m.type;
  })));else return useMethod;
}