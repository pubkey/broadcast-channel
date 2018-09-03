const isNode = require('detect-node');
const BroadcastChannel = require('../');
const AsyncTestUtil = require('async-test-util');

describe('issues.test.js', () => {
    it('#4 should throw when window.BroadcastChannel is overwritten', async () => {
        if (isNode) return;
        const bcBefore = window.BroadcastChannel;
        window.BroadcastChannel = BroadcastChannel;

        let bc;
        await AsyncTestUtil.assertThrows(
            () => {
                bc = new BroadcastChannel();
            },
            Error,
            'polyfill'
        );
        if (bc) bc.close();

        // reset
        window.BroadcastChannel = bcBefore;
    });
});
