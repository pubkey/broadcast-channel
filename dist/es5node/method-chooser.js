"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseMethod = chooseMethod;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _native = _interopRequireDefault(require("./methods/native.js"));

var _indexedDb = _interopRequireDefault(require("./methods/indexed-db.js"));

var _localstorage = _interopRequireDefault(require("./methods/localstorage.js"));

var _simulate = _interopRequireDefault(require("./methods/simulate.js"));

var _util = require("./util");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || (0, _typeof2["default"])(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var NodeMethod;

if (_util.isNode) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./methods/node.js'));
  }).then(function (m) {
    return NodeMethod = m;
  })["catch"](function (err) {
    throw new Error("could not load NodeMethod, error: " + err);
  });
} // order is important


var METHODS = [_native["default"], // fastest
_indexedDb["default"], _localstorage["default"]];

function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean); // process.browser check allows ES6 builds to be used on server or client. Bundlers like
  // Browserify, Webpack, etc. define process.browser and can then dead code eliminate the unused
  // import. However, we still use sed during build of es5/browser build to remove the import so
  // that it's also removed from non-minified version

  if (typeof process !== 'undefined' && !process.browser) {
    // the line below will be removed from es5/browser builds
    chooseMethods.push(NodeMethod);
  } // directly chosen


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


  if (!options.webWorkerSupport && !_util.isNode) {
    chooseMethods = chooseMethods.filter(function (m) {
      return m.type !== 'idb';
    });
  }

  var useMethod = chooseMethods.find(function (method) {
    return method.canBeUsed();
  });
  if (!useMethod) throw new Error("No useable method found in " + JSON.stringify(METHODS.map(function (m) {
    return m.type;
  })));else return useMethod;
}