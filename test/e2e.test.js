import {
    Selector
} from 'testcafe';
import AsyncTestUtil from 'async-test-util';

const BASE_PAGE = 'http://127.0.0.1:8080/';

fixture`Example page`
    .page`http://127.0.0.1:8080/`;


// BroadcastChannel
[
    'idb',
    'native',
    'localstorage',
    'default'
].forEach(methodType => {
    test.page(BASE_PAGE + '?methodType=' + methodType + '&autoStart=startBroadcastChannel')('test(BroadcastChannel) with method: ' + methodType, async () => {
        console.log('##### START BroadcastChannel TEST WITH ' + methodType);
        const stateContainer = Selector('#state');

        await AsyncTestUtil.waitUntil(async () => {
            const value = await stateContainer.innerText;
            //       console.log(value);

            // const out = await t.getBrowserConsoleMessages();
            // console.log('out:');
            // console.log(JSON.stringify(out));

            // make a console.log so travis does not terminate because of no output
            console.log('BroadcastChannel(' + methodType + ') still no success');

            return value === 'SUCCESS';
        }, 0, 500);
    });
});


// LeaderElection
[
    'idb',
    'native',
    'localstorage',
    'default'
].forEach(methodType => {
    test.page(BASE_PAGE + '?methodType=' + methodType + '&autoStart=startLeaderElection')('test(LeaderElection) with method: ' + methodType, async () => {
        console.log('##### START LeaderElection TEST WITH ' + methodType);
        const stateContainer = Selector('#state');

        await AsyncTestUtil.waitUntil(async () => {
            const value = await stateContainer.innerText;
            //       console.log(value);

            // const out = await t.getBrowserConsoleMessages();
            // console.log('out:');
            // console.log(JSON.stringify(out));

            // make a console.log so travis does not terminate because of no output

            const iframeAmount = await Selector('#leader-iframes iframe').count;
            console.log('LeaderElection(' + methodType + ') still no success (' + iframeAmount + ' iframes left)');

            return value === 'SUCCESS';
        }, 0, 1000);
    });
});
