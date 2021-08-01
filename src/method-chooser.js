import NativeMethod from './methods/native.js';
import IndexeDbMethod from './methods/indexed-db.js';
import LocalstorageMethod from './methods/localstorage.js';
import SimulateMethod from './methods/simulate.js';

import {
    isNode
} from './util';

let NodeMethod;

if (isNode) {
    import('./methods/node.js')
        .then(m => NodeMethod = m)
        .catch(err => {
            throw new Error(`could not load NodeMethod, error: ${err}`);
        });
}

// order is important
const METHODS = [
    NativeMethod, // fastest
    IndexeDbMethod,
    LocalstorageMethod
];

export function chooseMethod(options) {
    let chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);

    // process.browser check allows ES6 builds to be used on server or client. Bundlers like
    // Browserify, Webpack, etc. define process.browser and can then dead code eliminate the unused
    // import. However, we still use sed during build of es5/browser build to remove the import so
    // that it's also removed from non-minified version
    if (typeof process !== 'undefined' && !process.browser) {
        // the line below will be removed from es5/browser builds
        chooseMethods.push(NodeMethod);
    }

    // directly chosen
    if (options.type) {
        if (options.type === 'simulate') {
            // only use simulate-method if directly chosen
            return SimulateMethod;
        }
        const ret = chooseMethods.find(m => m.type === options.type);
        if (!ret) throw new Error('method-type ' + options.type + ' not found');
        else return ret;
    }

    /**
     * if no webworker support is needed,
     * remove idb from the list so that localstorage is been chosen
     */
    if (!options.webWorkerSupport && !isNode) {
        chooseMethods = chooseMethods.filter(m => m.type !== 'idb');
    }

    const useMethod = chooseMethods.find(method => method.canBeUsed());
    if (!useMethod)
        throw new Error(`No useable method found in ${JSON.stringify(METHODS.map(m => m.type))}`);
    else
        return useMethod;
}
