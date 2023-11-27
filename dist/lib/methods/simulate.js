"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimulateMethod = exports.SIMULATE_DELAY_TIME = void 0;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.type = void 0;
var _util = require("../util.js");
var microSeconds = exports.microSeconds = _util.microSeconds;
var type = exports.type = 'simulate';
var SIMULATE_CHANNELS = new Set();
function create(channelName) {
  var state = {
    time: microSeconds(),
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
var SIMULATE_DELAY_TIME = exports.SIMULATE_DELAY_TIME = 5;
function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    return setTimeout(function () {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.forEach(function (channel) {
        if (channel.name === channelState.name &&
        // has same name
        channel !== channelState &&
        // not own channel
        !!channel.messagesCallback &&
        // has subscribers
        channel.time < messageJson.time // channel not created after postMessage() call
        ) {
          channel.messagesCallback(messageJson);
        }
      });
      res();
    }, SIMULATE_DELAY_TIME);
  });
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  return true;
}
function averageResponseTime() {
  return SIMULATE_DELAY_TIME;
}
var SimulateMethod = exports.SimulateMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};