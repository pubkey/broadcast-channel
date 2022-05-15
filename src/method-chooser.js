import NativeMethod from './methods/native.js';
import IndexeDbMethod from './methods/indexed-db.js';
import LocalstorageMethod from './methods/localstorage.js';
import ServerMethod from './methods/server.js';
import SimulateMethod from './methods/simulate.js';

// order is important
const METHODS = [
    NativeMethod, // fastest
    IndexeDbMethod,
    LocalstorageMethod,
    ServerMethod,
];

export function chooseMethod(options) {
    let chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);

    // directly chosen
    if (options.type) {
        if (options.type === 'simulate') {
            // only use simulate-method if directly chosen
            return SimulateMethod;
        }
        const ret = chooseMethods.find((m) => m.type === options.type);
        if (!ret) throw new Error('method-type ' + options.type + ' not found');
        else return ret;
    }

    /**
     * if no webworker support is needed,
     * remove idb from the list so that localstorage is been chosen
     */
    if (!options.webWorkerSupport) {
        chooseMethods = chooseMethods.filter((m) => m.type !== 'idb');
    }

    const useMethod = chooseMethods.find((method) => method.canBeUsed(options));
    if (!useMethod) throw new Error(`No useable method found in ${JSON.stringify(METHODS.map((m) => m.type))}`);
    else return useMethod;
}
