const isNode = require('detect-node');
const BroadcastChannel = require('../');
const AsyncTestUtil = require('async-test-util');

describe('issues.test.js', () => {
    it('#4 should throw when window.BroadcastChannel is overwritten', async () => {
        if (isNode) return; // only on browsers
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
    it('https://github.com/pubkey/rxdb/issues/852 if cleanup did not remove the info-file, it should not crash even if socket-file not exists', async () => {
        if (!isNode) return; // only on node
        const fs = require('fs');
        const channelName = AsyncTestUtil.randomString(12);

        const channel1 = new BroadcastChannel(channelName);
        await channel1._prepP;

        // remove socket-file
        fs.unlinkSync(channel1._state.socketEE.path);

        // send message over other channel
        const channel2 = new BroadcastChannel(channelName);
        await channel2.postMessage({
            foo: 'bar'
        });

        await channel1.close();
        await channel2.close();
    });
});
