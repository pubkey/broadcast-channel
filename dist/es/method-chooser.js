import isNode from 'detect-node';

import NativeMethod from './methods/native.js';
import IndexeDbMethod from './methods/indexed-db.js';
import LocalstorageMethod from './methods/localstorage.js';

// order is important
var METHODS = [NativeMethod, // fastest
IndexeDbMethod, LocalstorageMethod];

var REQUIRE_FUN = require;

/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */
if (isNode) {

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

export function chooseMethod(options) {
    // directly chosen
    if (options.type) {
        var ret = METHODS.find(function (m) {
            return m.type === options.type;
        });
        if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
    }

    var chooseMethods = METHODS;
    if (!options.webWorkerSupport && !isNode) {
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