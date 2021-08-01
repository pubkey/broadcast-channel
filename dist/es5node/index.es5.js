"use strict";

var _broadcastChannel = require("./broadcast-channel");

var _methodChooserNode = require("./method-chooser-node.js");

var _index = require("./index.js");

(0, _broadcastChannel.setChooseMethod)(_methodChooserNode.chooseMethod);
/**
 * because babel can only export on default-attribute,
 * we use this for the non-module-build
 * this ensures that users do not have to use
 * var BroadcastChannel = require('broadcast-channel').default;
 * but
 * var BroadcastChannel = require('broadcast-channel');
 */

module.exports = {
  BroadcastChannel: _index.BroadcastChannel,
  createLeaderElection: _index.createLeaderElection,
  clearNodeFolder: _index.clearNodeFolder,
  enforceOptions: _index.enforceOptions,
  beLeader: _index.beLeader
};