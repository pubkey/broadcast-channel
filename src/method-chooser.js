import NativeMethod from './methods/native.js';
import IndexeDbMethod from './methods/indexed-db.js';
import LocalstorageMethod from './methods/localstorage.js';
import SimulateMethod from './methods/simulate.js';

import {
    isNode
} from './util';

// order is important
const METHODS = [
    NativeMethod, // fastest
    IndexeDbMethod,
    LocalstorageMethod,
    SimulateMethod
];

const REQUIRE_FUN = require;

/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */
if (isNode) {

    /**
     * we use the non-transpiled code for nodejs
     * because it runs faster
     */
    const NodeMethod = REQUIRE_FUN('../../src/methods/node.js');

    /**
     * this will be false for webpackbuilds
     * which will shim the node-method with an empty object {}
     */
    if (typeof NodeMethod.canBeUsed === 'function') {
        // must be first so it's chosen by default
        METHODS.unshift(NodeMethod);
    }
}


export function chooseMethod(options) {
    // directly chosen
    if (options.type) {
        const ret = METHODS.find(m => m.type === options.type);
        if (!ret) throw new Error('method-type ' + options.type + ' not found');
        else return ret;
    }

    /**
     * if no webworker support is needed,
     * remove idb from the list so that localstorage is been chosen
     */
    let chooseMethods = METHODS;
    if (!options.webWorkerSupport && !isNode) {
        chooseMethods = METHODS.filter(m => m.type !== 'idb');
    }

    const useMethod = chooseMethods.find(method => {
        // do never choose the simulate method if not explicitly set
        return method.type !== 'simulate' && method.canBeUsed();
    });
    if (!useMethod)
        throw new Error('No useable methode found:' + JSON.stringify(METHODS.map(m => m.type)));
    else
        return useMethod;
}
