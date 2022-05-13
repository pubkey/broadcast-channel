import { are3PCSupported } from './util';

export function fillOptionsWithDefaults(originalOptions = {}) {
    const options = JSON.parse(JSON.stringify(originalOptions));

    if (typeof options.support3PC === 'undefined') options.support3PC = are3PCSupported();

    // main
    if (typeof options.webWorkerSupport === 'undefined') options.webWorkerSupport = true;

    // indexed-db
    if (!options.idb) options.idb = {};
    //  after this time the messages get deleted
    if (!options.idb.ttl) options.idb.ttl = 1000 * 45;
    if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
    //  handles abrupt db onclose events.
    if (originalOptions.idb && typeof originalOptions.idb.onclose === 'function') options.idb.onclose = originalOptions.idb.onclose;

    // localstorage
    if (!options.localstorage) options.localstorage = {};
    if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1000 * 60;

    // server
    if (!options.server) options.server = {};
    if (!options.server.url) options.server.url = 'https://broadcast-server.tor.us';
    if (!options.server.removeTimeout) options.server.removeTimeout = 1000 * 60 * 5; // 5 minutes

    // custom methods
    if (originalOptions.methods) options.methods = originalOptions.methods;

    return options;
}
