import { microSeconds as micro } from '../util';
export var microSeconds = micro;
export var type = 'simulate';
var SIMULATE_CHANNELS = new Set();
export function create(channelName) {
  var state = {
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
export function close(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
export function postMessage(channelState, messageJson) {
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
export function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
export function canBeUsed() {
  return true;
}
export function averageResponseTime() {
  return 5;
}
export default {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};