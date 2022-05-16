"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BroadcastChannel", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.BroadcastChannel;
  }
});
Object.defineProperty(exports, "OPEN_BROADCAST_CHANNELS", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.OPEN_BROADCAST_CHANNELS;
  }
});
Object.defineProperty(exports, "beLeader", {
  enumerable: true,
  get: function get() {
    return _leaderElection.beLeader;
  }
});
Object.defineProperty(exports, "clearNodeFolder", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.clearNodeFolder;
  }
});
Object.defineProperty(exports, "createLeaderElection", {
  enumerable: true,
  get: function get() {
    return _leaderElection.createLeaderElection;
  }
});
Object.defineProperty(exports, "enforceOptions", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.enforceOptions;
  }
});

var _broadcastChannel = require("./broadcast-channel");

var _leaderElection = require("./leader-election");