"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimulateMethod = void 0;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.type = void 0;
var _util = require("../util.js");
var microSeconds = _util.microSeconds;
exports.microSeconds = microSeconds;
var type = 'simulate';
exports.type = type;
var SIMULATE_CHANNELS = new Set();
function create(channelName) {
  var state = {
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    return setTimeout(function () {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.filter(function (channel) {
        return channel.name === channelState.name;
      }).filter(function (channel) {
        return channel !== channelState;
      }).filter(function (channel) {
        return !!channel.messagesCallback;
      }).forEach(function (channel) {
        return channel.messagesCallback(messageJson);
      });
      res();
    }, 5);
  });
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  return true;
}
function averageResponseTime() {
  return 5;
}
var SimulateMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};
exports.SimulateMethod = SimulateMethod;