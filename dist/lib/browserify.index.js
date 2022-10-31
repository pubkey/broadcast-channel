"use strict";

var _module = require('./index.es5.js');
var BroadcastChannel = _module.BroadcastChannel;
var createLeaderElection = _module.createLeaderElection;
window['BroadcastChannel2'] = BroadcastChannel;
window['createLeaderElection'] = createLeaderElection;