const AsyncTestUtil = require('async-test-util');
const assert = require('assert');
const {
    BroadcastChannel
} = require('../../');

describe('unit/custom.method.test.js', () => {
    describe('custom methods', () => {
        it('should select provided method', () => {
            const channelName = AsyncTestUtil.randomString(12);
            const method = {
                type: 'custom',
                canBeUsed: () => true,
                create: () => ({})
            };
            const channel = new BroadcastChannel(channelName, { methods: method });
            assert.equal(channel.method, method);
            channel.close();
        });
        it('should select one of the provided methods', () => {
            const channelName = AsyncTestUtil.randomString(12);
            const method = {
                type: 'custom',
                canBeUsed: () => true,
                create: () => ({})
            };
            const channel = new BroadcastChannel(channelName, { methods: [method] });
            assert.equal(channel.method, method);
            channel.close();
        });
    });
});
