import { BroadcastChannel } from '../dist/esnode/index.js';
import { randomString } from 'async-test-util';
import assert from 'assert';
export async function run() {

    const bc = new BroadcastChannel(randomString());

    assert.strictEqual(bc.type, 'deno');

    await bc.close();
}
run();
