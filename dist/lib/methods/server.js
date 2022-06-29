"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports["default"] = void 0;
exports.getSocketInstance = getSocketInstance;
exports.keccak256 = keccak256;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.removeStorageEventListener = removeStorageEventListener;
exports.setupSocketConnection = setupSocketConnection;
exports.storageKey = storageKey;
exports.type = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _obliviousSet = require("oblivious-set");

var _socket = require("socket.io-client");

var _eccrypto = require("@toruslabs/eccrypto");

var _metadataHelpers = require("@toruslabs/metadata-helpers");

var _keccak = _interopRequireDefault(require("keccak"));

var _util = require("../util");

var _options = require("../options");

/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */
var microSeconds = _util.microSeconds; // PASS IN STRING/BUFFER TO GET BUFFER

exports.microSeconds = microSeconds;

function keccak256(a) {
  return (0, _keccak["default"])('keccak256').update(a).digest();
}

var KEY_PREFIX = 'pubkey.broadcastChannel-';
var type = 'server';
exports.type = type;
var SOCKET_CONN_INSTANCE = null;

function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
 * writes the new message to the storage
 * and fires the storage-event so other readers can find it
 */


function postMessage(channelState, messageJson) {
  return new Promise(function (res, rej) {
    (0, _util.sleep)().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var key, channelEncPrivKey, encData;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              key = storageKey(channelState.channelName);
              channelEncPrivKey = keccak256(key);
              _context.next = 4;
              return (0, _metadataHelpers.encryptData)(channelEncPrivKey.toString('hex'), {
                token: (0, _util.randomToken)(),
                time: new Date().getTime(),
                data: messageJson,
                uuid: channelState.uuid
              });

            case 4:
              encData = _context.sent;
              _context.t0 = fetch;
              _context.t1 = channelState.serverUrl + '/channel/set';
              _context.t2 = JSON;
              _context.t3 = (0, _eccrypto.getPublic)(channelEncPrivKey).toString('hex');
              _context.t4 = encData;
              _context.next = 12;
              return (0, _eccrypto.sign)(channelEncPrivKey, keccak256(encData));

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

function getSocketInstance(serverUrl) {
  if (SOCKET_CONN_INSTANCE) {
    return SOCKET_CONN_INSTANCE;
  }

  var SOCKET_CONN = (0, _socket.io)(serverUrl, {
    transports: ['websocket', 'polling'],
    // use WebSocket first, if available
    withCredentials: true,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 10
  });
  SOCKET_CONN.on('connect_error', function (err) {
    // revert to classic upgrade
    SOCKET_CONN.io.opts.transports = ['polling', 'websocket'];

    _util.log.error('connect error', err);
  });
  SOCKET_CONN.on('connect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var engine;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            engine = SOCKET_CONN.io.engine;

            _util.log.debug('initially connected to', engine.transport.name); // in most cases, prints "polling"


            engine.once('upgrade', function () {
              // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
              _util.log.debug('upgraded', engine.transport.name); // in most cases, prints "websocket"

            });
            engine.once('close', function (reason) {
              // called when the underlying connection is closed
              _util.log.debug('connection closed', reason);
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  SOCKET_CONN.on('error', function (err) {
    _util.log.error('socket errored', err);

    SOCKET_CONN.disconnect();
  });
  SOCKET_CONN.on('disconnect', function () {
    _util.log.debug('socket disconnected');
  });
  SOCKET_CONN_INSTANCE = SOCKET_CONN;
  return SOCKET_CONN;
}

function setupSocketConnection(serverUrl, channelName, fn) {
  var socketConn = getSocketInstance(serverUrl);
  var key = storageKey(channelName);
  var channelEncPrivKey = keccak256(key);
  var channelPubKey = (0, _eccrypto.getPublic)(channelEncPrivKey).toString('hex');

  if (socketConn.connected) {
    socketConn.emit('check_auth_status', channelPubKey);
  } else {
    socketConn.once('connect', function () {
      _util.log.debug('connected with socket');

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
      socketConn.once('connect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
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
    var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ev) {
      var decData;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return (0, _metadataHelpers.decryptData)(channelEncPrivKey.toString('hex'), ev);

            case 3:
              decData = _context4.sent;

              _util.log.info(decData);

              fn(decData);
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);

              _util.log.error(_context4.t0);

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

function removeStorageEventListener() {
  if (SOCKET_CONN_INSTANCE) {
    SOCKET_CONN_INSTANCE.disconnect();
  }
}

function create(channelName, options) {
  options = (0, _options.fillOptionsWithDefaults)(options);

  if (!canBeUsed(options)) {
    throw new Error('BroadcastChannel: server cannot be used');
  }

  var uuid = (0, _util.randomToken)();
  /**
   * eMIs
   * contains all messages that have been emitted before
   * @type {ObliviousSet}
   */

  var eMIs = new _obliviousSet.ObliviousSet(options.server.removeTimeout);
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

function close() {// give 2 sec for all msgs which are in transit to be consumed
  // by receiver.
  // window.setTimeout(() => {
  //     removeStorageEventListener(channelState);
  //     SOCKET_CONN_INSTANCE = null;
  // }, 1000);
}

function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}

function canBeUsed() {
  return true;
}

function averageResponseTime() {
  var defaultTime = 500; // TODO: Maybe increase it based on operation

  return defaultTime;
}

var _default = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};
exports["default"] = _default;