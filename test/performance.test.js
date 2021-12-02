const AsyncTestUtil = require('async-test-util');
const {
    BroadcastChannel,
    clearNodeFolder,
    createLeaderElection
} = require('../');

const benchmark = {
    openClose: {},
    sendRecieve: {}
};


const elapsedTime = before => {
    return AsyncTestUtil.performanceNow() - before;
};

describe('performance.test.js', () => {
    it('clear tmp-folder', async () => {
        await clearNodeFolder();
    });
    it('wait a bit for jit etc..', async () => {
        await AsyncTestUtil.wait(2000);
    });
    it('open/close channels', async () => {
        const channelName = AsyncTestUtil.randomString(10);

        const amount = 110;
        const channels = [];

        const startTime = AsyncTestUtil.performanceNow();
        for (let i = 0; i < amount; i++) {
            const channel = new BroadcastChannel(channelName);
            channels.push(channel);
        }
        await Promise.all(
            channels.map(c => c.close())
        );

        const elapsed = elapsedTime(startTime);
        benchmark.openClose = elapsed;
    });
    it('sendRecieve.parallel', async () => {
        const channelName = AsyncTestUtil.randomString(10);
        const channelSender = new BroadcastChannel(channelName);
        const channelReciever = new BroadcastChannel(channelName);
        const msgAmount = 2000;
        let emittedCount = 0;
        const waitPromise = new Promise(res => {
            channelReciever.onmessage = () => {
                emittedCount++;
                if (emittedCount === msgAmount) {
                    res();
                }
            };
        });

        const startTime = AsyncTestUtil.performanceNow();
        for (let i = 0; i < msgAmount; i++) {
            channelSender.postMessage('foobar');
        }
        await waitPromise;

        channelSender.close();
        channelReciever.close();

        const elapsed = elapsedTime(startTime);
        benchmark.sendRecieve.parallel = elapsed;
    });
    it('sendRecieve.series', async () => {
        const channelName = AsyncTestUtil.randomString(10);
        const channelSender = new BroadcastChannel(channelName);
        const channelReciever = new BroadcastChannel(channelName);
        const msgAmount = 600;
        let emittedCount = 0;


        channelReciever.onmessage = () => {
            channelReciever.postMessage('pong');
        };

        const waitPromise = new Promise(res => {
            channelSender.onmessage = () => {
                emittedCount++;
                if (emittedCount === msgAmount) {
                    res();
                } else {
                    channelSender.postMessage('ping');
                }
            };
        });

        const startTime = AsyncTestUtil.performanceNow();
        channelSender.postMessage('ping');
        await waitPromise;

        channelSender.close();
        channelReciever.close();

        const elapsed = elapsedTime(startTime);
        benchmark.sendRecieve.series = elapsed;
    });
    it('leaderElection', async () => {
        const startTime = AsyncTestUtil.performanceNow();

        let t = 10;
        const channelsToClose = [];
        while (t > 0) {
            t--;
            const channelName = AsyncTestUtil.randomString(10);
            const channelA = new BroadcastChannel(channelName);
            channelsToClose.push(channelA);
            const channelB = new BroadcastChannel(channelName);
            channelsToClose.push(channelB);
            const leaderElectorA = createLeaderElection(channelA);
            const leaderElectorB = createLeaderElection(channelB);

            leaderElectorA.applyOnce();
            leaderElectorB.applyOnce();

            while (
                !leaderElectorA.isLeader &&
                !leaderElectorB.isLeader
            ) {
                await Promise.all([
                    leaderElectorA.applyOnce(),
                    leaderElectorB.applyOnce(),
                    /**
                     * We apply twice to better simulate
                     * real world usage.
                     */
                    leaderElectorA.applyOnce(),
                    leaderElectorB.applyOnce()
                ]);
            }
        }

        const elapsed = elapsedTime(startTime);
        benchmark.leaderElection = elapsed;

        await channelsToClose.forEach(channel => channel.close());
    });
    it('show result', () => {
        console.log('benchmark result:');
        console.log(JSON.stringify(benchmark, null, 2));
    });
});
