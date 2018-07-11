const isNode = require('detect-node');

const NativeMethod = require('./methods/native.js');
const IndexeDbMethod = require('./methods/indexed-db.js');
const LocalstorageMethod = require('./methods/localstorage.js');

// order is important
const METHODS = [
    NativeMethod, // fastest
    IndexeDbMethod,
    LocalstorageMethod
];

const REQUIRE_FUN = require;

/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */
if (isNode) {
    const NodeMethod = REQUIRE_FUN('./methods/node.js');
    METHODS.push(NodeMethod);
}


export function chooseMethod(options) {
    // directly chosen
    if (options.type) {
        const ret = METHODS.find(m => m.type === options.type);
        if (!ret) throw new Error('method-type ' + options.type + ' not found');
        else return ret;
    }

    let chooseMethods = METHODS;
    if (!options.webWorkerSupport && !isNode) {
        // prefer localstorage over idb when no webworker-support needed
        chooseMethods = METHODS.filter(m => m.type !== 'idb');
    }

    const useMethod = chooseMethods.find(method => typeof method === 'function' && method.canBeUsed());
    if (!useMethod)
        throw new Error('No useable methode found:' + JSON.stringify(METHODS.map(m => m.type)));
    else
        return useMethod;
}