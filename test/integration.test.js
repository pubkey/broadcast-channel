const AsyncTestUtil = require('async-test-util');
const assert = require('assert');
const isNode = require('detect-node');
const clone = require('clone');
const unload = require('unload');
const BroadcastChannel = require('../');
const LeaderElection = require('../leader-election');

/**
 * we run this test once per method
 */
function runTest(channelOptions) {
    describe('integration.test.js (' + JSON.stringify(channelOptions) + ')', () => {

        describe('BroadcastChannel', () => {
            describe('.constructor()', () => {
                it('asdf', () => {
                    console.log('Started: ' + JSON.stringify(channelOptions));
                });
                it('should create a channel', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    channel.close();
                });
            });
            describe('.postMessage()', () => {
                it('should post a message', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    await channel.postMessage('foobar');
                    channel.close();
                });
                it('should throw if channel is already closed', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    channel.close();
                    await AsyncTestUtil.assertThrows(
                        () => channel.postMessage('foobar'),
                        Error,
                        'closed'
                    );
                });
            });
            describe('.onmessage', () => {
                /**
                 * the window.BroadcastChannel
                 * does not emit postMessage to own subscribers,
                 * if you want to do that, you have to create another channel
                 */
                it('should NOT recieve the message on own', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);

                    const emitted = [];
                    channel.onmessage = msg => emitted.push(msg);
                    await channel.postMessage({
                        foo: 'bar'
                    });

                    await AsyncTestUtil.wait(100);
                    assert.equal(emitted.length, 0);

                    channel.close();
                });
                it('should recieve the message on other channel', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const otherChannel = new BroadcastChannel(channelName, channelOptions);


                    const emitted = [];
                    otherChannel.onmessage = msg => emitted.push(msg);
                    await channel.postMessage({
                        foo: 'bar'
                    });
                    await AsyncTestUtil.waitUntil(() => emitted.length === 1);
                    assert.equal(emitted[0].foo, 'bar');
                    channel.close();
                    otherChannel.close();
                });
                it('should work with strange channelName', async () => {
                    const channelName = '  asdf  / ' + AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const otherChannel = new BroadcastChannel(channelName, channelOptions);

                    const emitted = [];
                    otherChannel.onmessage = msg => emitted.push(msg);
                    await channel.postMessage({
                        foo: 'bar'
                    });
                    await AsyncTestUtil.waitUntil(() => emitted.length === 1);
                    assert.equal(emitted[0].foo, 'bar');
                    channel.close();
                    otherChannel.close();
                });
                it('should have the same message-data', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel1 = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);

                    const emitted = [];
                    channel2.onmessage = msg => emitted.push(msg);

                    const msgJson = {
                        foo: 'bar'
                    };
                    await channel1.postMessage(msgJson);


                    await AsyncTestUtil.waitUntil(() => emitted.length === 1);
                    assert.deepEqual(emitted[0], msgJson);

                    channel1.close();
                    channel2.close();
                });
                it('should work with big message-data', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel1 = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);

                    const emitted = [];
                    channel2.onmessage = msg => emitted.push(msg);

                    const msgJson = {
                        one: AsyncTestUtil.randomString(1000),
                        two: AsyncTestUtil.randomString(1000),
                        three: AsyncTestUtil.randomString(1000),
                    };
                    await channel1.postMessage(msgJson);


                    await AsyncTestUtil.waitUntil(() => emitted.length === 1);
                    assert.deepEqual(emitted[0], msgJson);

                    channel1.close();
                    channel2.close();
                });
                it('should not loose the message if _prepare() takes a while', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const slowerOptions = clone(channelOptions);
                    slowerOptions.prepareDelay = 300;
                    const channel1 = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, slowerOptions);

                    const emitted = [];
                    channel2.onmessage = msg => emitted.push(msg);

                    const msgJson = {
                        foo: 'bar'
                    };
                    await channel1.postMessage(msgJson);


                    await AsyncTestUtil.waitUntil(() => emitted.length === 1);
                    assert.deepEqual(emitted[0], msgJson);

                    channel1.close();
                    channel2.close();
                });
                it('should NOT emit all events if subscribed directly after postMessage', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel1 = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);

                    channel1.postMessage('foo1');
                    channel1.postMessage('foo2');

                    const emitted = [];
                    channel2.onmessage = msg => emitted.push(msg);

                    channel1.postMessage('foo3');

                    await AsyncTestUtil.waitUntil(() => emitted.length === 1);
                    await AsyncTestUtil.wait(100);
                    assert.equal(emitted.length, 1);

                    channel1.close();
                    channel2.close();
                });
                it('should not emit messages, send before onmessage was set, when one tick was done', async () => {
                    const channelName = AsyncTestUtil.randomString(12);

                    const channel1 = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);

                    channel1.postMessage('foo1');
                    channel1.postMessage('foo2');


                    await AsyncTestUtil.wait(50);

                    const emitted = [];
                    channel2.onmessage = msg => emitted.push(msg);

                    const msgJson = {
                        foo: 'bar'
                    };
                    channel1.postMessage(msgJson);

                    await AsyncTestUtil.waitUntil(() => emitted.length >= 1);
                    assert.equal(emitted.length, 1);
                    assert.deepEqual(emitted[0], msgJson);

                    channel1.close();
                    channel2.close();
                });
                it('should not confuse messages between different channels', async () => {
                    const channel = new BroadcastChannel(AsyncTestUtil.randomString(12), channelOptions);
                    const otherChannel = new BroadcastChannel(AsyncTestUtil.randomString(12), channelOptions);

                    const emitted = [];
                    otherChannel.onmessage = msg => emitted.push(msg);
                    await channel.postMessage({
                        foo: 'bar'
                    });
                    await AsyncTestUtil.wait(100);
                    assert.equal(emitted.length, 0);

                    channel.close();
                    otherChannel.close();
                });
                it('should not read messages created before the channel was created', async () => {
                    await AsyncTestUtil.wait(100);

                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);

                    await channel.postMessage('foo1');
                    await AsyncTestUtil.wait(50);

                    const otherChannel = new BroadcastChannel(channelName, channelOptions);
                    const emittedOther = [];
                    otherChannel.onmessage = msg => emittedOther.push(msg);

                    await channel.postMessage('foo2');
                    await channel.postMessage('foo3');

                    await AsyncTestUtil.waitUntil(() => emittedOther.length >= 2);
                    await AsyncTestUtil.wait(100);

                    assert.equal(emittedOther.length, 2);

                    channel.close();
                    otherChannel.close();
                });
                it('should only run the last onmessage-callback', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);

                    const emitted1 = [];
                    const emitted2 = [];

                    channel2.onmessage = msg => {
                        emitted1.push(msg);
                    };
                    channel2.onmessage = msg => {
                        emitted2.push(msg);
                    };

                    await channel.postMessage('foobar');

                    await AsyncTestUtil.waitUntil(() => emitted2.length >= 1);
                    await AsyncTestUtil.wait(100);

                    assert.equal(emitted1.length, 0);
                    assert.equal(emitted2.length, 1);

                    channel.close();
                    channel2.close();
                });
            });
            describe('.addEventListener()', () => {
                it('should emit events to all subscribers', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const otherChannel = new BroadcastChannel(channelName, channelOptions);

                    const emitted1 = [];
                    const emitted2 = [];

                    otherChannel.addEventListener('message', msg => emitted1.push(msg));
                    otherChannel.addEventListener('message', msg => emitted2.push(msg));

                    const msg = {
                        foo: 'bar'
                    };
                    await channel.postMessage(msg);

                    await AsyncTestUtil.waitUntil(() => emitted1.length === 1);
                    await AsyncTestUtil.waitUntil(() => emitted2.length === 1);

                    assert.deepEqual(msg, emitted1[0]);
                    assert.deepEqual(msg, emitted2[0]);

                    channel.close();
                    otherChannel.close();
                });
            });
            describe('.removeEventListener()', () => {
                it('should no longer emit the message', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const otherChannel = new BroadcastChannel(channelName, channelOptions);

                    const emitted = [];
                    const fn = msg => emitted.push(msg);
                    otherChannel.addEventListener('message', fn);

                    const msg = {
                        foo: 'bar'
                    };
                    await channel.postMessage(msg);

                    await AsyncTestUtil.waitUntil(() => emitted.length === 1);

                    otherChannel.removeEventListener('message', fn);

                    await channel.postMessage(msg);
                    await AsyncTestUtil.wait(100);

                    assert.equal(emitted.length, 1);

                    channel.close();
                    otherChannel.close();
                });
            });
            describe('.type', () => {
                it('should get a type', async () => {
                    const channel = new BroadcastChannel(AsyncTestUtil.randomString(12), channelOptions);
                    const type = channel.type;
                    assert.equal(typeof type, 'string');
                    assert.notEqual(type, '');

                    channel.close();
                });
            });
            describe('other', () => {
                it('should prefer localstorage if webWorkerSupport: false', async () => {
                    if (isNode) return;
                    // disable BroadcastChannel
                    const broadcastChannelBefore = window.BroadcastChannel;
                    Object.defineProperty(window, 'BroadcastChannel', {
                        enumerable: false,
                        configurable: false,
                        writable: true,
                        value: false
                    });

                    const options = {
                        webWorkerSupport: false
                    };
                    const channel = new BroadcastChannel(AsyncTestUtil.randomString(12), options);
                    assert.equal(channel.type, 'localstorage');

                    window.BroadcastChannel = broadcastChannelBefore;
                });
            });
        });
        describe('LeaderElection', () => {
            describe('.create()', () => {
                it('should create an elector', () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    LeaderElection.create(channel);
                    channel.close();
                });
            });
            describe('election', () => {
                it('should elect single elector as leader', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);

                    await elector.applyOnce();
                    assert.ok(elector.isLeader);

                    channel.close();
                });
                it('from two electors, only one should become leader', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);
                    const elector2 = LeaderElection.create(channel2);

                    await Promise.all([
                        elector.applyOnce(),
                        elector2.applyOnce()
                    ]);

                    await AsyncTestUtil.waitUntil(() => elector.isLeader || elector2.isLeader);
                    await AsyncTestUtil.wait(200);

                    assert.notEqual(elector.isLeader, elector2.isLeader);

                    channel.close();
                    channel2.close();
                });
                it('from many electors, only one should become leader', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const clients = new Array(20).fill(0).map(() => {
                        const channel = new BroadcastChannel(channelName, channelOptions);
                        const elector = LeaderElection.create(channel);
                        return {
                            channel,
                            elector
                        };
                    });

                    await Promise.all(clients.map(c => c.elector.applyOnce()));
                    await AsyncTestUtil.waitUntil(() => clients.find(c => c.elector.isLeader));
                    await AsyncTestUtil.wait(200);

                    const leaderCount = clients.filter(c => c.elector.isLeader).length;
                    assert.equal(leaderCount, 1);

                    clients.forEach(c => c.channel.close());
                });
            });
            describe('.die()', () => {
                it('if leader dies, other should be able to become leader', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);
                    const elector2 = LeaderElection.create(channel2);

                    await elector.applyOnce();

                    await elector.die();
                    await AsyncTestUtil.wait(200);

                    await elector2.applyOnce();
                    assert.ok(elector2.isLeader);

                    channel.close();
                    channel2.close();
                });
                it('if channel is closed, leader should die', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);
                    const elector2 = LeaderElection.create(channel2);

                    await elector.applyOnce();
                    await channel.close();
                    assert.ok(elector.isDead);
                    await AsyncTestUtil.wait(200);

                    await elector2.applyOnce();
                    assert.ok(elector2.isLeader);

                    channel2.close();
                });
                it('should clean up all unloaded when dead', async () => {
                    return; // TODO run this once unload-module has been fixed
                    /*
                    console.log('======');

                    const cacheLengthBefore = Object.keys(unload._getCache()).length;
                    console.dir(cacheLengthBefore);

                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);
                    await elector.awaitLeadership();

                    await elector.die();

                    const cacheLengthAfter = Object.keys(unload._getCache()).length;

                    assert.equal(cacheLengthBefore, cacheLengthAfter);

                    process.exit();*/
                });
            });
            describe('.awaitLeadership()', () => {
                it('should resolve when elector becomes leader', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);

                    await elector.awaitLeadership();

                    channel.close();
                });
                it('should resolve when other leader dies', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);
                    const elector2 = LeaderElection.create(channel2);

                    await elector.awaitLeadership();

                    let resolved = false;
                    elector2.awaitLeadership().then(() => resolved = true);

                    elector.die();

                    await AsyncTestUtil.waitUntil(() => resolved === true);

                    channel.close();
                    channel2.close();
                });
                it('should resolve when other leader no longers responds', async () => {
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);
                    const elector2 = LeaderElection.create(channel2);

                    await elector.awaitLeadership();

                    let resolved = false;
                    elector2.awaitLeadership().then(() => resolved = true);

                    // overwrite postInternal to simulate non-responding leader
                    channel.postInternal = () => Promise.resolve();

                    await AsyncTestUtil.waitUntil(() => resolved === true);

                    channel.close();
                    channel2.close();
                });
                it('should resolve when leader-process exits', async () => {
                    await AsyncTestUtil.wait(150);
                    const channelName = AsyncTestUtil.randomString(12);
                    const channel = new BroadcastChannel(channelName, channelOptions);
                    const channel2 = new BroadcastChannel(channelName, channelOptions);
                    const elector = LeaderElection.create(channel);
                    const elector2 = LeaderElection.create(channel2);

                    await elector.awaitLeadership();

                    let resolved = false;
                    elector2.awaitLeadership().then(() => resolved = true);

                    // run all unloads to simulate closing process
                    unload.runAll();
                    unload._resetUnloaded();

                    await AsyncTestUtil.waitUntil(() => resolved === true);

                    channel.close();
                    channel2.close();
                });
                it('log', () => {
                    console.log('Finished: ' + JSON.stringify(channelOptions));
                });        
            });
        });
    });
}

const useOptions = [];

if (isNode) {
    useOptions.push({
        type: 'node',
        node: {
            useFastPath: true
        }
    });
    useOptions.push({
        type: 'node',
        node: {
            useFastPath: false
        }
    });
} else {
    useOptions.push({
        type: 'native'
    });
    useOptions.push({
        type: 'idb'
    });
    useOptions.push({
        type: 'localstorage'
    });
}

useOptions.forEach(o => runTest(o));