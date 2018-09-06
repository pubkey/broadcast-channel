'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chooseMethod = chooseMethod;

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

var _native = require('./methods/native.js');

var _native2 = _interopRequireDefault(_native);

var _indexedDb = require('./methods/indexed-db.js');

var _indexedDb2 = _interopRequireDefault(_indexedDb);

var _localstorage = require('./methods/localstorage.js');

var _localstorage2 = _interopRequireDefault(_localstorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// order is important
var METHODS = [_native2['default'], // fastest
_indexedDb2['default'], _localstorage2['default']];

var REQUIRE_FUN = require;

/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */
if (_detectNode2['default']) {

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
        METHODS.push(NodeMethod);
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

    var chooseMethods = METHODS;
    if (!options.webWorkerSupport && !_detectNode2['default']) {
        // prefer localstorage over idb when no webworker-support needed
        chooseMethods = METHODS.filter(function (m) {
            return m.type !== 'idb';
        });
    }

    var useMethod = chooseMethods.find(function (method) {
        return method.canBeUsed();
    });
    if (!useMethod) throw new Error('No useable methode found:' + JSON.stringify(METHODS.map(function (m) {
        return m.type;
    })));else return useMethod;
}