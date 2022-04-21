import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

var _this = this;

import _regeneratorRuntime from "@babel/runtime/regenerator";

/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */
import { ObliviousSet } from 'oblivious-set';
import { io } from 'socket.io-client';
import { getPublic, sign } from '@toruslabs/eccrypto';
import { encryptData, decryptData } from '@toruslabs/metadata-helpers';
import createKeccakHash from 'keccak';
import log from 'loglevel';
import { fillOptionsWithDefaults } from '../options';
import { sleep, randomToken, microSeconds as micro, isNode } from '../util';
export var microSeconds = micro; // PASS IN STRING/BUFFER TO GET BUFFER

export function keccak256(a) {
  return createKeccakHash('keccak256').update(a).digest();
}
var KEY_PREFIX = 'pubkey.broadcastChannel-';
export var type = 'server';
var BROADCAST_SERVER_URL = 'https://broadcast-server.tor.us';
var SOCKET_CONN = io(BROADCAST_SERVER_URL, {
  transports: ['websocket', 'polling'],
  // use WebSocket first, if available
  withCredentials: true,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: 10
});
SOCKET_CONN.on('connect_error', function () {
  // revert to classic upgrade
  SOCKET_CONN.io.opts.transports = ['polling', 'websocket'];
});
SOCKET_CONN.on('connect', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
  var engine;
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          log.debug('connected with socket');
          engine = _this.SOCKET_CONN.io.engine;
          log.debug('initially connected to', engine.transport.name); // in most cases, prints "polling"

          engine.once('upgrade', function () {
            // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
            log.debug('upgraded', engine.transport.name); // in most cases, prints "websocket"
          });
          engine.on('close', function (reason) {
            // called when the underlying connection is closed
            log.debug('connection closed', reason);
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
export function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
 * writes the new message to the storage
 * and fires the storage-event so other readers can find it
 */

export function postMessage(channelState, messageJson) {
  return new Promise(function (res, rej) {
    sleep().then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var key, channelEncPrivKey, encData;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              key = storageKey(channelState.channelName);
              channelEncPrivKey = keccak256(key);
              _context2.next = 4;
              return encryptData(channelEncPrivKey.toString('hex'), messageJson);

            case 4:
              encData = _context2.sent;
              _context2.t0 = fetch;
              _context2.t1 = BROADCAST_SERVER_URL + '/channel/set';
              _context2.t2 = JSON;
              _context2.t3 = getPublic(channelEncPrivKey).toString('hex');
              _context2.t4 = encData;
              _context2.next = 12;
              return sign(channelEncPrivKey, keccak256(encData));

            case 12:
              _context2.t5 = _context2.sent.toString('hex');
              _context2.t6 = {
                key: _context2.t3,
                data: _context2.t4,
                signature: _context2.t5
              };
              _context2.t7 = _context2.t2.stringify.call(_context2.t2, _context2.t6);
              _context2.t8 = {
                method: 'POST',
                body: _context2.t7
              };
              (0, _context2.t0)(_context2.t1, _context2.t8).then(res)["catch"](rej);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
}
export function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var channelEncPrivKey = keccak256(key);

  var listener = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(ev) {
      var decData;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return decryptData(channelEncPrivKey.toString('hex'), ev);

            case 2:
              decData = _context3.sent;
              fn(decData);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function listener(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  SOCKET_CONN.on('success', listener);
  SOCKET_CONN.emit('check_auth_status', getPublic(channelEncPrivKey).toString('hex'));
  return listener;
}
export function removeStorageEventListener() {
  SOCKET_CONN.disconnect();
}
export function create(channelName, options) {
  options = fillOptionsWithDefaults(options);

  if (!canBeUsed()) {
    throw new Error('BroadcastChannel: server cannot be used');
  }

  var uuid = randomToken();
  /**
   * eMIs
   * contains all messages that have been emitted before
   * @type {ObliviousSet}
   */

  var eMIs = new ObliviousSet(options.server.removeTimeout);
  var state = {
    channelName: channelName,
    uuid: uuid,
    eMIs: eMIs // emittedMessagesIds

  };
  state.listener = addStorageEventListener(channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener
    // eMIs.add(channelName);

    state.messagesCallback(msgObj);
  });
  return state;
}
export function close(channelState) {
  removeStorageEventListener(channelState.listener);
}
export function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
export function canBeUsed() {
  if (isNode) return false;
  return true;
}
export function averageResponseTime() {
  var defaultTime = 500; // TODO: Maybe increase it based on operation

  return defaultTime;
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