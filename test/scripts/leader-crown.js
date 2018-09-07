/* eslint-disable */

require('@babel/polyfill');
var BroadcastChannel = require('../../');
var LeaderElection = require('../../leader-election');

var channelName = 'leader-crown';
var channel = new BroadcastChannel(channelName);

var leaderElector = LeaderElection.create(channel);

leaderElector.awaitLeadership().then(function() {
    console.log('is leader');
    document.title = '♛ Is Leader!';
});
