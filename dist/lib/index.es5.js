"use strict";

var _index = require("./index.js");

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
  enforceOptions: _index.enforceOptions
};