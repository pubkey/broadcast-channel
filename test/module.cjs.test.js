const assert = require('assert');
const { BroadcastChannel } = require('../');

describe('CJS module', () => {
    it('should require without error', () => {
        assert.ok(BroadcastChannel.prototype.postMessage);
    });
});
