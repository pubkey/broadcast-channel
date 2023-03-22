import {
    add as unloadAdd
} from 'unload';

/**
 * sends and internal message over the broadcast-channel
 */
export function sendLeaderMessage(leaderElector, action) {
    const msgJson = {
        context: 'leader',
        action,
        token: leaderElector.token
    };
    return leaderElector.broadcastChannel.postInternal(msgJson);
}

export function beLeader(leaderElector) {
    leaderElector.isLeader = true;
    leaderElector._hasLeader = true;
    const unloadFn = unloadAdd(() => leaderElector.die());
    leaderElector._unl.push(unloadFn);

    const isLeaderListener = msg => {
        if (msg.context === 'leader' && msg.action === 'apply') {
            sendLeaderMessage(leaderElector, 'tell');
        }

        if (msg.context === 'leader' && msg.action === 'tell' && !leaderElector._dpLC) {
            /**
             * another instance is also leader!
             * This can happen on rare events
             * like when the CPU is at 100% for long time
             * or the tabs are open very long and the browser throttles them.
             * @link https://github.com/pubkey/broadcast-channel/issues/414
             * @link https://github.com/pubkey/broadcast-channel/issues/385
             */
            leaderElector._dpLC = true;
            leaderElector._dpL(); // message the lib user so the app can handle the problem
            sendLeaderMessage(leaderElector, 'tell'); // ensure other leader also knows the problem
        }
    };
    leaderElector.broadcastChannel.addEventListener('internal', isLeaderListener);
    leaderElector._lstns.push(isLeaderListener);
    return sendLeaderMessage(leaderElector, 'tell');
}
