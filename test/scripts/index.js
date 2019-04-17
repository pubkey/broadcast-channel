/* eslint-disable */
/**
 * used in docs/index.html
 */
require('@babel/polyfill');
var BroadcastChannel = require('../../');
var LeaderElection = require('../../leader-election');

import {
    getParameterByName
} from './util.js';

var channelName = 'demo';

var channel = new BroadcastChannel(channelName);

// leader election
var leaderElector = LeaderElection.create(channel);
leaderElector.awaitLeadership().then(function() {
    console.log('is leader');
    document.title = '♛ Is Leader!';
});

var messageInput = document.getElementById('message-input');
var submitButton = document.getElementById('submit-button');
var messagesBox = document.getElementById('messages');

messageInput.onkeyup = function(){
   if(messageInput.value!=='') submitButton.disabled = false;
   else submitButton.disabled = true;
};

submitButton.onclick = function(){
    if(submitButton.disabled) return;
    else {
        console.log('postMessage ' + messageInput.value);
        channel.postMessage(messageInput.value);
        addTextToMessageBox('send: ' + messageInput.value);
        messageInput.value = '';
    }
}

function addTextToMessageBox(text){
    var textnode = document.createTextNode(text);
    var lineBreak = document.createElement('br');
    messagesBox.appendChild(textnode);
    messagesBox.appendChild(lineBreak);
}

channel.onmessage = function(message) {
    console.dir('recieved message: ' + message);
    addTextToMessageBox('recieved: ' + message);
}