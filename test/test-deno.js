import { BroadcastChannel } from '../dist/esbrowser/index.js';
import { randomString } from 'async-test-util';
import assert from 'assert';
export async function run() {

    console.log('--- 1');

    console.dir({
        // eslint-disable-next-line
        'globalThis.Deno': !!globalThis.Deno,
        // eslint-disable-next-line
        'globalThis.Deno.args': !!globalThis.Deno.args
    });
    console.log('--- 2');
    // eslint-disable-next-line
    console.log(Object.keys(Deno).sort().join(', '));

    console.log('--- 3');


    const bc = new BroadcastChannel(randomString());
    console.log('bc.type: ' + bc.type);


    /**
     * Deno should use its global native BroadcastChannel
     * @link https://docs.deno.com/deploy/api/runtime-broadcast-channel
    */
    assert.strictEqual(bc.type, 'native');

    await bc.postMessage({ foo: 'bar' });
    await bc.close();
}
run();
