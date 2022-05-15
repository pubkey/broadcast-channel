const module = require('./index.es5.js');
const BroadcastChannel = module.BroadcastChannel;

window['BroadcastChannel2'] = BroadcastChannel;
