/* eslint-disable */
/**
 * this isframe is used to test the leader-election
 * in the e2e tests and the demo-page
 * used in docs/leader-iframe.html
 */

require('babel-polyfill');
import {
    getParameterByName
} from './util.js';

var BroadcastChannel = require('../../');
var LeaderElection = require('../../leader-election');

const channelName = getParameterByName('channelName');
const methodType = getParameterByName('methodType');
const boxEl = document.getElementById('box');

// overwrite console.log
const logBefore = console.log;
console.log = function (str) { logBefore('iframe: ' + str); }

var channel = new BroadcastChannel(channelName, {
    type: methodType
});

var elector = LeaderElection.create(channel);

boxEl.innerHTML = 'start election';
console.log('leader-iframe ('+elector.token+'): start leader-election');
elector.awaitLeadership().then(()=> {
    console.log('leader-iframe ('+elector.token+'): I am now the leader!');
    boxEl.innerHTML = 'Leader ♛';
    document.title = '♛ Leader';
});