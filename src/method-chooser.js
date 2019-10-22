import NativeMethod from './methods/native.js';
import IndexeDbMethod from './methods/indexed-db.js';
import LocalstorageMethod from './methods/localstorage.js';
import SimulateMethod from './methods/simulate.js';

import {
    isNode,
    checkIsIframe
} from './util';

// order is important
const METHODS = [
    NativeMethod, // fastest
    IndexeDbMethod,
    LocalstorageMethod
];

/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */
if (isNode) {

    /**
     * we use the non-transpiled code for nodejs
     * because it runs faster
     */
    const NodeMethod = require(
        '../../src/methods/' +
        // use this hack so that browserify and others
        // do not import the node-method by default
        // when bundling.
        'node.js'
    );

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
        if (options.type === 'simulate') {
            // only use simulate-method if directly chosen
            return SimulateMethod;
        }
        const ret = METHODS.find(m => m.type === options.type);
        if (!ret) throw new Error('method-type ' + options.type + ' not found');
        else return ret;
    }

    /**
     * if no webworker support is needed,
     * or is iframe(Safari doesn't like indexeddb from an iframe of a third party origin),
     * remove idb from the list so that localstorage is been chosen
     */
    let chooseMethods = METHODS;
    const isIframe = checkIsIframe();
    if ((!options.webWorkerSupport || isIframe) && !isNode) {
        chooseMethods = METHODS.filter(m => m.type !== 'idb');
    }

    const useMethod = chooseMethods.find(method => method.canBeUsed());
    if (!useMethod)
        throw new Error('No useable methode found:' + JSON.stringify(METHODS.map(m => m.type)));
    else
        return useMethod;
}
