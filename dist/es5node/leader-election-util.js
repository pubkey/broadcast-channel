"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beLeader = beLeader;
exports.sendLeaderMessage = sendLeaderMessage;
var _unload = require("unload");
/**
 * sends and internal message over the broadcast-channel
 */
function sendLeaderMessage(leaderElector, action) {
  var msgJson = {
    context: 'leader',
    action: action,
    token: leaderElector.token
  };
  return leaderElector.broadcastChannel.postInternal(msgJson);
}
function beLeader(leaderElector) {
  leaderElector.isLeader = true;
  leaderElector._hasLeader = true;
  var unloadFn = (0, _unload.add)(function () {
    return leaderElector.die();
  });
  leaderElector._unl.push(unloadFn);
  var isLeaderListener = function isLeaderListener(msg) {
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