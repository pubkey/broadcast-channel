import { setChooseMethod } from './broadcast-channel.mjs';
import { chooseMethod } from './method-chooser-node.mjs';
setChooseMethod(chooseMethod);
export { BroadcastChannel, clearNodeFolder, enforceOptions } from './broadcast-channel.mjs';
export { createLeaderElection, beLeader } from './leader-election.mjs';