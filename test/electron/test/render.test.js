const assert = require('assert');
const { BroadcastChannel } = require('broadcast-channel');

/**
 * this tests run inside of the browser-windows so we can ensure
 * everything there works correctly
 */
module.exports = (function () {
    const runTests = async function () {
        const channel = new BroadcastChannel('foobar');
        assert.ok(channel);
        channel.postMessage('lulz');
    };
    return runTests;
}());
