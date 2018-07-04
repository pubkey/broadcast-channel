const BroadcastChannel = require('./index.es5.js');
const LeaderElection = require('./leader-election/index.es5.js');

window['BroadcastChannel2'] = BroadcastChannel;
window['LeaderElection'] = LeaderElection;