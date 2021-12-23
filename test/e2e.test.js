import {
    Selector
} from 'testcafe';
import AsyncTestUtil from 'async-test-util';

const BASE_PAGE = 'http://localhost:8080/e2e.html';

fixture`Example page`
    .page`http://localhost:8080/`;

/**
 * Checks if there where errors on the browser console.
 * If yes, this will kill the process
 */
async function assertNoErrors(t) {
    const logs = await t.getBrowserConsoleMessages();
    console.log('logs:');
    console.dir(logs);
    if (logs.error.length > 0) {
        console.log('assertNoErrors got ' + logs.error.length + ' errors:');
        console.dir(logs.error);
        process.kill(process.pid);
    }
}

async function nativeBroadcastChannelExists(t) {
    const prop = await t.eval(() => window.BroadcastChannel);
    const ret = !!prop;
    console.log('nativeBroadcastChannelExists: ' + ret);
    return ret;
}

// BroadcastChannel
[
    'native',
    'idb',
    'localstorage',
    'default'
].forEach(methodType => {
    test.page(BASE_PAGE + '?methodType=' + methodType + '&autoStart=startBroadcastChannel')
        (
            'test(BroadcastChannel) with method: ' + methodType,
            async (t) => {
                console.log('##### START BroadcastChannel TEST WITH ' + methodType);

                if (methodType === 'native' && !(await nativeBroadcastChannelExists(t))) {
                    console.log('skipping native method since it is not supported by the browser');
                    return;
                }

                await assertNoErrors(t);
                await AsyncTestUtil.waitUntil(async () => {
                    await assertNoErrors(t);
                    const stateContainer = Selector('#state');
                    const exists = await stateContainer.exists;
                    if (!exists) {
                        console.log('stateContainer not exists');
                        /*
                        const out = await t.getBrowserConsoleMessages();
                        console.log('out:');
                        console.log(JSON.stringify(out));
                        */
                        return false;
                    } else {
                        console.log('stateContainer exists');
                    }
                    const value = await stateContainer.innerText;
                    //       console.log(value);


                    // make a console.log so travis does not terminate because of no output
                    console.log('BroadcastChannel(' + methodType + ') still no success');

                    return value === 'SUCCESS';
                }, 0, 500);
            });
});


// LeaderElection
[
    'native',
    'idb',
    'localstorage',
    'default'
].forEach(methodType => {
    test.page(BASE_PAGE + '?methodType=' + methodType + '&autoStart=startLeaderElection')('test(LeaderElection) with method: ' + methodType, async (t) => {
        console.log('##### START LeaderElection TEST WITH ' + methodType);

        if (methodType === 'native' && !(await nativeBroadcastChannelExists(t))) {
            console.log('skipping native method since it is not supported by the browser');
            return;
        }

        await assertNoErrors(t);

        await AsyncTestUtil.waitUntil(async () => {
            await assertNoErrors(t);
            const stateContainer = Selector('#state');
            const value = await stateContainer.innerText;

            // make a console.log so travis does not terminate because of no output
            const iframeAmount = await Selector('#leader-iframes iframe').count;
            console.log('LeaderElection(' + methodType + ') still no success (' + iframeAmount + ' iframes left)');

            return value === 'SUCCESS';
        }, 0, 1000);
        console.log('LeaderElection(' + methodType + ') DONE');
    });
});


// Worker
[
    'native',
    'idb',
    // 'localstorage', // WebWorker does not work with localstorage method
    'default'
].forEach(methodType => {
    test.page(BASE_PAGE + '?methodType=' + methodType + '&autoStart=startWorkerTest')('test(startWorkerTest) with method: ' + methodType, async (t) => {
        console.log('##### START LeaderElection TEST WITH ' + methodType);

        if (methodType === 'native' && !(await nativeBroadcastChannelExists(t))) {
            console.log('skipping native method since it is not supported by the browser');
            return;
        }

        await assertNoErrors(t);
        await AsyncTestUtil.waitUntil(async () => {
            await assertNoErrors(t);
            const stateContainer = Selector('#state');
            const exists = await stateContainer.exists;
            if (!exists) {
                console.log('stateContainer not exists');
                /*
                const out = await t.getBrowserConsoleMessages();
                console.log('out:');
                console.log(JSON.stringify(out));
                */
                return false;
            } else {
                console.log('stateContainer exists');
            }
            const value = await stateContainer.innerText;
            //       console.log(value);


            // make a console.log so travis does not terminate because of no output
            console.log('BroadcastChannel(' + methodType + ') still no success');

            return value === 'SUCCESS';
        }, 0, 500);
    });
});
