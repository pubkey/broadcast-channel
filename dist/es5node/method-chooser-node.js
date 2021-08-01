"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseMethod = chooseMethod;

var _methodChooser = require("./method-chooser.js");

var NodeMethod = _interopRequireWildcard(require("./methods/node.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// the line below will be removed from es5/browser builds
function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods).filter(Boolean); // process.browser check allows ES6 builds to be used on server or client. Bundlers like
  // Browserify, Webpack, etc. define process.browser and can then dead code eliminate the unused
  // import. However, we still use sed during build of es5/browser build to remove the import so
  // that it's also removed from non-minified version

  if (!process.browser) {
    // the line below will be removed from es5/browser builds
    chooseMethods.push(NodeMethod);
  }

  options.methods = chooseMethods;
  return (0, _methodChooser.chooseMethod)(options);
}