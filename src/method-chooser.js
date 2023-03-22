import { NativeMethod } from './methods/native.js';
import { IndexedDBMethod } from './methods/indexed-db.js';
import { LocalstorageMethod } from './methods/localstorage.js';
import { SimulateMethod } from './methods/simulate.js';
// the line below will be removed from es5/browser builds
import * as NodeMethod from './methods/node.js';

// order is important
const METHODS = [
    NativeMethod, // fastest
    IndexedDBMethod,
    LocalstorageMethod
];

export function chooseMethod(options) {
    let chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);

    // the line below will be removed from es5/browser builds
    chooseMethods.push(NodeMethod);

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
     * remove idb from the list so that localstorage will be chosen
     */
    if (!options.webWorkerSupport) {
        chooseMethods = chooseMethods.filter(m => m.type !== 'idb');
    }

    const useMethod = chooseMethods.find(method => method.canBeUsed());
    if (!useMethod) {
        throw new Error(`No usable method found in ${JSON.stringify(METHODS.map(m => m.type))}`);
    } else {
        return useMethod;
    }
}
