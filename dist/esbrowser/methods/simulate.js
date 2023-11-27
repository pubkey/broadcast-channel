import { microSeconds as micro } from '../util.js';
export var microSeconds = micro;
export var type = 'simulate';
var SIMULATE_CHANNELS = new Set();
export function create(channelName) {
  var state = {
    time: microSeconds(),
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
export function close(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
export var SIMULATE_DELAY_TIME = 5;
export function postMessage(channelState, messageJson) {
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
export function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
export function canBeUsed() {
  return true;
}
export function averageResponseTime() {
  return SIMULATE_DELAY_TIME;
}
export var SimulateMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};