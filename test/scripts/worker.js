/* eslint-disable */
/**
 * used in the test-docs as web-worker
 */
require('babel-polyfill');
var BroadcastChannel = require('../../');

// overwrite console.log
try{
    var logBefore = console.log;
//    console.log = function (str) { logBefore('worker: ' + str); }    
}catch(err){
    // does not work in IE11
}


/**
 * because shitware microsof-edge stucks the worker
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
            var messages = [];
            channel.onmessage = function (msg) {
                console.log('recieved message(' + msg.step + ') from ' + msg.from + ': ' + JSON.stringify(msg));
                if (!msg.answer) {
                    console.log('(' + msg.step + ') answer back');
                    channel.postMessage({
                        answer: true,
                        from: 'worker',
                        original: msg
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
