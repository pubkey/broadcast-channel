import { setChooseMethod } from './broadcast-channel';
import { chooseMethod } from './method-chooser-node.mjs';
setChooseMethod(chooseMethod);
/**
 * because babel can only export on default-attribute,
 * we use this for the non-module-build
 * this ensures that users do not have to use
 * var BroadcastChannel = require('broadcast-channel').default;
 * but
 * var BroadcastChannel = require('broadcast-channel');
 */

import { BroadcastChannel, createLeaderElection, clearNodeFolder, enforceOptions, beLeader } from './index.mjs';
module.exports = {
  BroadcastChannel: BroadcastChannel,
  createLeaderElection: createLeaderElection,
  clearNodeFolder: clearNodeFolder,
  enforceOptions: enforceOptions,
  beLeader: beLeader
};