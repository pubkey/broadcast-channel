import {
    setChooseMethod
} from './broadcast-channel.js';

import {
    chooseMethod
} from './method-chooser-node.js';

setChooseMethod(chooseMethod);

export {
    BroadcastChannel,
    clearNodeFolder,
    enforceOptions
} from './broadcast-channel.js';
export {
    createLeaderElection,
    beLeader
} from './leader-election.js';
