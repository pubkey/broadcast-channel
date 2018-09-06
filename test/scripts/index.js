/* eslint-disable */
/**
 * used in docs/index.html
 */
require('@babel/polyfill');
var BroadcastChannel = require('../../');
import {
    getParameterByName
} from './util.js';

var methodType = getParameterByName('methodType');
if (!methodType || methodType === '' || methodType === 'default') methodType = undefined;

var autoStart = getParameterByName('autoStart');

// set select-input
var selectEl = document.getElementById('method-type-select');
selectEl.onchange = function (ev) {
    var newValue = selectEl.value;
    var newUrl = location.origin + location.pathname + '?methodType=' + newValue;
    location = newUrl;
};
if (methodType) {
    selectEl.value = methodType;
}

var TEST_MESSAGES = 50;
var body = document.getElementById('body');
var msgContainer = document.getElementById('messages');
var rightContainer = document.getElementById('right');
var messageCountContainer = document.getElementById('msg-count');
var stateContainer = document.getElementById('state');
const iframeEl = document.getElementById('test-iframe');

document.getElementById('user-agent').innerHTML = navigator.userAgent;

var startTime;
const options = {};
console.log('++++++');
console.log(typeof BroadcastChannel);
var channel = new BroadcastChannel('foobar', {
    type: methodType
});
document.getElementById('method').innerHTML = channel.type;

/**
 * to measure the speed, we:
 * 1. send message
 * 2. wait until iframe and worker answers
 * 3. repeat from 1. for TEST_MESSAGES times
 */
var messagesSend = 0;
var answerPool = {};
let useWorker = false;

function gotAllAnswers(answerPool) {
    if (!answerPool.iframe) return false;
    if (useWorker && !answerPool.worker) return false;
    return true;
}

channel.onmessage = function (msg) {
    console.log('main: recieved msg' + JSON.stringify(msg));

    answerPool[msg.from] = msg;
    var textnode = document.createTextNode(JSON.stringify(msg) + '</br>');
    msgContainer.appendChild(textnode);

    if (gotAllAnswers(answerPool)) {
        answerPool = {}; // reset

        if (messagesSend >= TEST_MESSAGES) {
            // sucess
            console.log('main: sucess');
            body.style.backgroundColor = 'green';
            stateContainer.innerHTML = 'SUCCESS'
            const amountTime = new Date().getTime() - startTime;
            document.getElementById('time-amount').innerHTML = amountTime + 'ms';
        } else {
            // send next message
            messagesSend++;
            console.log('main: send next message (' + messagesSend + ') ====================');
            messageCountContainer.innerHTML = messagesSend;
            channel.postMessage({
                from: 'main',
                foo: 'bar',
                step: messagesSend
            });
        }
    }
};

window.startBroadcastChannel = async function () {
    stateContainer.innerHTML = 'running..'
    const rand = new Date().getTime();

    // load iframe
    iframeEl.src = './iframe.html?channelName=' + channel.name + '&methodType=' + channel.type + '&t=' + rand;
    await new Promise(res => iframeEl.onload = () => res());
    console.log('main: Iframe has loaded');

    // spawn web-worker if possible
    if (channel.type !== 'localstorage' && typeof window.Worker === 'function') {
        useWorker = true;
        const worker = new Worker('worker.js?t=' + rand);
        worker.onerror = event => {
            throw new Error('worker: ' + event.message + " (" + event.filename + ":" + event.lineno + ")");
        };
        await new Promise(res => {
            worker.addEventListener('message', e => {
                // run when message returned, so we know the worker has started
                setTimeout(() => {
                    console.log('main: Worker has started');
                    res();
                }, 200);
            }, false);
            worker.postMessage({
                'cmd': 'start',
                'msg': {
                    channelName: channel.name,
                    methodType: channel.type
                }
            });
        });
    }
    console.log('========== START SENDING MESSAGES ' + channel.type);
    startTime = new Date().getTime();
    channel.postMessage({
        from: 'main',
        step: 0
    });
    console.log('main: message send (0)');
}










// LEADER-ELECTION
window.startLeaderElection = async function () {

    stateContainer.innerHTML = 'running..'

    const FRAMES_COUNT = 5;
    const rand = new Date().getTime();
    const frameSrc = './leader-iframe.html?channelName=' + channel.name + '&methodType=' + channel.type + '&t=' + rand;
    var leaderIframes = document.getElementById('leader-iframes');

    // create iframes
    let leaderFramesCache = new Array(FRAMES_COUNT)
        .fill(0)
        .map(() => {
            const ifrm = document.createElement('iframe');
            ifrm.setAttribute('src', frameSrc);
            leaderIframes.appendChild(ifrm);
            return ifrm;
        });

    // wait until all iframes have loaded
    await Promise.all(
        leaderFramesCache.map(iframe => {
            return new Promise(res => iframe.onload = () => res());
        })
    );

    startTime = new Date().getTime();

    /**
     * remove the leader-iframe until no iframe is left
     */
    while (leaderFramesCache.length > 0) {
        leaderFramesCache = await removeLeaderIframe(leaderFramesCache);
    }

    // done
    body.style.backgroundColor = 'green';
    stateContainer.innerHTML = 'SUCCESS'
    const amountTime = new Date().getTime() - startTime;
    document.getElementById('time-amount').innerHTML = amountTime + 'ms';

}

const removeLeaderIframe = async (leaderFramesCache) => {
    const leaders = leaderFramesCache.filter(frame => {
        const boxText = frame.contentDocument.getElementById('box').innerHTML;
        return boxText === 'Leader';
    });
    if (leaders.length === 0) {
        return new Promise(res => setTimeout(() => {
            res(leaderFramesCache);
        }, 50));
    }
    if (leaders.length > 1) {
        throw new Error('LeaderElection: There is more then one leader!');
    }
    // remove iframe
    leaders[0].parentNode.removeChild(leaders[0]);

    return leaderFramesCache.filter(f => f !== leaders[0]);
}


if (autoStart && autoStart !== '') {
    window[autoStart]();
}
