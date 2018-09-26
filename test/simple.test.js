/**
 * a simple test which just checks if the basics work
 */
const BroadcastChannel = require('../');

async function run() {
    const channelName = 'simpleTestChannel';
    const channel = new BroadcastChannel(channelName);
    const channel2 = new BroadcastChannel(channelName);
    await channel.postMessage({
        foo: 'bar'
    });
    const messages = [];
    channel.onmessage = msg => messages.push(msg);

    await channel2.postMessage({
        foo: 'bar'
    });


    await channel.close();
    await channel2.close();
}
run();
