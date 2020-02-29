const assert = require('assert');
const { BroadcastChannel } = require('broadcast-channel');

/**
 * this tests run inside of the browser-windows so we can ensure
 * everything there works correctly
 */
module.exports = (function () {
    const runTests = async function () {

        // normal channel
        const channel = new BroadcastChannel('foobar');
        assert.ok(channel);
        channel.postMessage('lulz');

        // no webworker
        const channelNoWebWorker = new BroadcastChannel('foobar', {
            webWorkerSupport: false
        });
        assert.ok(channelNoWebWorker);
        channelNoWebWorker.postMessage('lulz');

    };
    return runTests;
}());
