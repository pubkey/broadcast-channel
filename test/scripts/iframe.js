/* eslint-disable */
/**
 * used in docs/iframe.html
 */
require('@babel/polyfill');
import {
    getParameterByName
} from './util.js';

var BroadcastChannel = require('../../');

const channelName = getParameterByName('channelName');
const methodType = getParameterByName('methodType');

// overwrite console.log
const logBefore = console.log;
console.log = function (str) { logBefore('iframe: ' + str); }

var channel = new BroadcastChannel(channelName, {
    type: methodType
});
var msgContainer = document.getElementById('messages');
channel.onmessage = function (msg) {
    console.log('recieved message(' + msg.step + ') from ' + msg.from + ': ' + JSON.stringify(msg));

    var textnode = document.createTextNode(JSON.stringify(msg) + '</br>');
    msgContainer.appendChild(textnode);

    if (!msg.answer) {
        console.log('answer back(' + msg.step + ')');
        channel.postMessage({
            answer: true,
            from: 'iframe',
            original: msg
        });
    }
};
