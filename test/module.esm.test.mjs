import assert from 'assert';
import { BroadcastChannel } from '../dist/esnode/index.js';

describe('ESM module', () => {
    it('should import without error', () => {
        assert.ok(BroadcastChannel.prototype.postMessage);
    });
});
