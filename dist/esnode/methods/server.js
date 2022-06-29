import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
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
import { log } from '../util';
import { fillOptionsWithDefaults } from '../options';
import { sleep, randomToken, microSeconds as micro } from '../util';
export var microSeconds = micro; // PASS IN STRING/BUFFER TO GET BUFFER

export function keccak256(a) {
  return createKeccakHash('keccak256').update(a).digest();
}
var KEY_PREFIX = 'pubkey.broadcastChannel-';
export var type = 'server';
var SOCKET_CONN_INSTANCE = null;
export function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
 * writes the new message to the storage
 * and fires the storage-event so other readers can find it
 */

export function postMessage(channelState, messageJson) {
  return new Promise(function (res, rej) {
    sleep().then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var key, channelEncPrivKey, encData;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              key = storageKey(channelState.channelName);
              channelEncPrivKey = keccak256(key);
              _context.next = 4;
              return encryptData(channelEncPrivKey.toString('hex'), {
                token: randomToken(),
                time: new Date().getTime(),
                data: messageJson,
                uuid: channelState.uuid
              });

            case 4:
              encData = _context.sent;
              _context.t0 = fetch;
              _context.t1 = channelState.serverUrl + '/channel/set';
              _context.t2 = JSON;
              _context.t3 = getPublic(channelEncPrivKey).toString('hex');
              _context.t4 = encData;
              _context.next = 12;
              return sign(channelEncPrivKey, keccak256(encData));

            case 12:
              _context.t5 = _context.sent.toString('hex');
              _context.t6 = {
                key: _context.t3,
                data: _context.t4,
                signature: _context.t5
              };
              _context.t7 = _context.t2.stringify.call(_context.t2, _context.t6);
              _context.t8 = {
                'Content-Type': 'application/json; charset=utf-8'
              };
              _context.t9 = {
                method: 'POST',
                body: _context.t7,
                headers: _context.t8
              };
              return _context.abrupt("return", (0, _context.t0)(_context.t1, _context.t9).then(res)["catch"](rej));

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  });
}
export function getSocketInstance(serverUrl) {
  if (SOCKET_CONN_INSTANCE) {
    return SOCKET_CONN_INSTANCE;
  }

  var SOCKET_CONN = io(serverUrl, {
    transports: ['websocket', 'polling'],
    // use WebSocket first, if available
    withCredentials: true,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 10
  });
  SOCKET_CONN.on('connect_error', function (err) {
    // revert to classic upgrade
    SOCKET_CONN.io.opts.transports = ['polling', 'websocket'];
    log.error('connect error', err);
  });
  SOCKET_CONN.on('connect', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var engine;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            engine = SOCKET_CONN.io.engine;
            log.debug('initially connected to', engine.transport.name); // in most cases, prints "polling"

            engine.once('upgrade', function () {
              // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
              log.debug('upgraded', engine.transport.name); // in most cases, prints "websocket"
            });
            engine.once('close', function (reason) {
              // called when the underlying connection is closed
              log.debug('connection closed', reason);
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  SOCKET_CONN.on('error', function (err) {
    log.error('socket errored', err);
    SOCKET_CONN.disconnect();
  });
  SOCKET_CONN.on('disconnect', function () {
    log.debug('socket disconnected');
  });
  SOCKET_CONN_INSTANCE = SOCKET_CONN;
  return SOCKET_CONN;
}
export function setupSocketConnection(serverUrl, channelName, fn) {
  var socketConn = getSocketInstance(serverUrl);
  var key = storageKey(channelName);
  var channelEncPrivKey = keccak256(key);
  var channelPubKey = getPublic(channelEncPrivKey).toString('hex');

  if (socketConn.connected) {
    socketConn.emit('check_auth_status', channelPubKey);
  } else {
    socketConn.once('connect', function () {
      log.debug('connected with socket');
      socketConn.emit('check_auth_status', channelPubKey);
    });
  }

  var visibilityListener = function visibilityListener() {
    // if channel is closed, then remove the listener.
    if (!socketConn) {
      document.removeEventListener('visibilitychange', visibilityListener);
      return;
    } // if not connected, then wait for connection and ping server for latest msg.


    if (!socketConn.connected && document.visibilityState === 'visible') {
      socketConn.once('connect', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                socketConn.emit('check_auth_status', channelPubKey);

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      })));
    }
  };

  var listener = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(ev) {
      var decData;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return decryptData(channelEncPrivKey.toString('hex'), ev);

            case 3:
              decData = _context4.sent;
              log.info(decData);
              fn(decData);
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              log.error(_context4.t0);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 8]]);
    }));

    return function listener(_x) {
      return _ref4.apply(this, arguments);
    };
  }();

  socketConn.on(channelPubKey + "_success", listener);
  document.addEventListener('visibilitychange', visibilityListener);
  return socketConn;
}
export function removeStorageEventListener() {
  if (SOCKET_CONN_INSTANCE) {
    SOCKET_CONN_INSTANCE.disconnect();
  }
}
export function create(channelName, options) {
  options = fillOptionsWithDefaults(options);

  if (!canBeUsed(options)) {
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
    eMIs: eMIs,
    // emittedMessagesIds
    serverUrl: options.server.url
  };
  setupSocketConnection(options.server.url, channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener

    if (msgObj.uuid === state.uuid) return; // own message

    if (!msgObj.token || state.eMIs.has(msgObj.token)) return; // already emitted
    // if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

    state.eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
export function close() {// give 2 sec for all msgs which are in transit to be consumed
  // by receiver.
  // window.setTimeout(() => {
  //     removeStorageEventListener(channelState);
  //     SOCKET_CONN_INSTANCE = null;
  // }, 1000);
}
export function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
export function canBeUsed() {
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