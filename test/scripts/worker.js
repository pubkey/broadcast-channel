/* eslint-disable */
/**
 * used in the test-docs as web-worker
 */
require('@babel/polyfill');
var {
    BroadcastChannel
} = require('../../');

var {
    randomNumber,
    randomBoolean,
    wait
} = require('async-test-util');
var resolved = Promise.resolve();

// overwrite console.log
try {
    var logBefore = console.log;
    //    console.log = function (str) { logBefore('worker: ' + str); }
} catch (err) {
    // does not work in IE11
}


/**
 * because shitware microsoft-edge sucks, the worker
 * when initialisation is done,
 * we have to set a interval here.
 */
setInterval(function () { }, 10 * 1000);

var channel;
self.addEventListener('message', function (e) {
    var data = e.data;
    switch (data.cmd) {
        case 'start':
            console.log('Worker started');
            console.log(JSON.stringify(data.msg));

            channel = new BroadcastChannel(data.msg.channelName, {
                type: data.msg.methodType
            });
            // console.log('Worker channel-uuid: ' + channel._state.uuid);
            channel.onmessage = function (msg) {
                console.log('recieved message(' + msg.step + ') from ' + msg.from + ': ' + JSON.stringify(msg));

                if (!msg.answer) {
                    /**
                     * Wait a random amount of time to simulate 'normal' usage
                     * where the worker would do some work before returning anything.
                     * Sometimes do not wait at all to simulate a direct response.
                     */
                    const waitBefore = randomBoolean() ? resolved : wait(randomNumber(10, 150));
                    waitBefore
                        .then(function () {
                            console.log('(' + msg.step + ') answer back');
                            channel.postMessage({
                                answer: true,
                                from: 'worker',
                                original: msg
                            });
                        });
                }
            };

            self.postMessage('WORKER STARTED: ');
            break;
        case 'stop':
            self.postMessage('WORKER STOPPED: ' + data.msg + '. (buttons will no longer work)');
            channel.close();
            self.close(); // Terminates the worker.
            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    };
}, false);
