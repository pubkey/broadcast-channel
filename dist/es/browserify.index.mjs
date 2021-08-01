var module = require('./index.es5.mjs');

var BroadcastChannel = module.BroadcastChannel;
var createLeaderElection = module.createLeaderElection;
window['BroadcastChannel2'] = BroadcastChannel;
window['createLeaderElection'] = createLeaderElection;