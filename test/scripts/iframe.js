/* eslint-disable */
/**
 * used in docs/iframe.html
 */
require('@babel/polyfill');
import {
    getParameterByName
} from './util.js';

var msgContainer = document.getElementById('messages');

var {
    BroadcastChannel
} = require('../../');

const channelName = getParameterByName('channelName');
const methodType = getParameterByName('methodType');

// overwrite console.log
const logBefore = console.log;
console.log = function (str) { logBefore('iframe: ' + str); }
function logToDom(str){
    var textnode = document.createTextNode(str);
    var lineBreak = document.createElement('br');
    msgContainer.appendChild(textnode);
    msgContainer.appendChild(lineBreak);
}

var channel = new BroadcastChannel(channelName, {
    type: methodType
});

logToDom('created channel with type ' + methodType);

channel.onmessage = function (msg) {
    logToDom('message:');
    logToDom('recieved message(' + msg.step + ') from ' + msg.from + ': ');
    logToDom(JSON.stringify(msg));

    if (!msg.answer) {
        logToDom('answer back(' + msg.step + ')');
        channel.postMessage({
            answer: true,
            from: 'iframe',
            original: msg
        });
    }
};
