"use strict";

var BroadcastChannel = require('./index.es5.js');

var LeaderElection = require('./leader-election/index.es5.js');

window['BroadcastChannel2'] = BroadcastChannel;
window['LeaderElection'] = LeaderElection;