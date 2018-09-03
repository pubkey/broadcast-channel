const AsyncTestUtil = require('async-test-util');
const assert = require('assert');
const isNode = require('detect-node');
const LocalstorageMethod = require('../../dist/lib/methods/localstorage.js');

describe('unit/localstorage.method.test.js', () => {
    if (isNode) return;
    describe('.getLocalStorage()', () => {
        it('should always get a object', () => {
            const ls = LocalstorageMethod.getLocalStorage();
            assert.ok(ls);
            assert.equal(typeof ls.setItem, 'function');
        });
    });
    describe('.postMessage()', () => {
        it('should set the message', async () => {
            const channelState = {
                channelName: AsyncTestUtil.randomString(10),
                uuid: AsyncTestUtil.randomString(10)
            };
            const json = { foo: 'bar' };
            await LocalstorageMethod.postMessage(
                channelState,
                json
            );
            const ls = LocalstorageMethod.getLocalStorage();
            const key = LocalstorageMethod.storageKey(channelState.channelName);
            const value = JSON.parse(ls.getItem(key));
            assert.equal(value.data.foo, 'bar');
        });
        it('should fire an event', async () => {
            const channelState = {
                channelName: AsyncTestUtil.randomString(10),
                uuid: AsyncTestUtil.randomString(10)
            };
            const json = { foo: 'bar' };

            const emitted = [];
            const listener = LocalstorageMethod.addStorageEventListener(
                channelState.channelName,
                ev => {
                    emitted.push(ev);
                }
            );

            LocalstorageMethod.postMessage(
                channelState,
                json
            );

            await AsyncTestUtil.waitUntil(() => emitted.length === 1);
            assert.equal(emitted[0].data.foo, 'bar');

            LocalstorageMethod.removeStorageEventListener(listener);
        });
    });
    describe('.create()', () => {
        it('create an instance', async () => {
            const channelName = AsyncTestUtil.randomString(10);
            const state = LocalstorageMethod.create(channelName);
            assert.ok(state.uuid);
            LocalstorageMethod.close(state);
        });
    });
    describe('.onMessage()', () => {
        it('should emit to the other channel', async () => {
            const channelName = AsyncTestUtil.randomString(12);
            const channelState1 = await LocalstorageMethod.create(channelName);
            const channelState2 = await LocalstorageMethod.create(channelName);

            const emitted = [];
            LocalstorageMethod.onMessage(
                channelState2,
                msg => {
                    emitted.push(msg);
                    console.log('was emitted');
                },
                new Date().getTime()
            );
            const json = {
                foo: 'bar'
            };
            LocalstorageMethod.postMessage(channelState1, json);

            await AsyncTestUtil.waitUntil(() => emitted.length === 1);

            assert.deepEqual(emitted[0], json);

            LocalstorageMethod.close(channelState1);
            LocalstorageMethod.close(channelState2);
        });
    });
});
