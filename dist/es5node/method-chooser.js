"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseMethod = chooseMethod;

var _native = _interopRequireDefault(require("./methods/native.js"));

var _indexedDb = _interopRequireDefault(require("./methods/indexed-db.js"));

var _localstorage = _interopRequireDefault(require("./methods/localstorage.js"));

var _server = _interopRequireDefault(require("./methods/server.js"));

var _simulate = _interopRequireDefault(require("./methods/simulate.js"));

// order is important
var METHODS = [_native["default"], // fastest
_indexedDb["default"], _localstorage["default"], _server["default"]];

function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean); // directly chosen

  if (options.type) {
    if (options.type === 'simulate') {
      // only use simulate-method if directly chosen
      return _simulate["default"];
    }

    var ret = chooseMethods.find(function (m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
  }
  /**
   * if no webworker support is needed,
   * remove idb from the list so that localstorage is been chosen
   */


  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter(function (m) {
      return m.type !== 'idb';
    });
  }

  var useMethod = chooseMethods.find(function (method) {
    return method.canBeUsed(options);
  });
  if (!useMethod) throw new Error("No useable method found in " + JSON.stringify(METHODS.map(function (m) {
    return m.type;
  })));else return useMethod;
}