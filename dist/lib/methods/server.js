"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addStorageEventListener = addStorageEventListener;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports["default"] = void 0;
exports.keccak256 = keccak256;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.removeStorageEventListener = removeStorageEventListener;
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
var SOCKET_CONN_INSTANCES = {};

function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
 * writes the new message to the storage
 * and fires the storage-event so other readers can find it
 */


function postMessage(channelState, messageJson) {
  return new Promise(function (res, rej) {
    (0, _util.sleep)().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var key, channelEncPrivKey, encData, socketConn, _setMessage, currentAttempts, waitingInterval;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              key = storageKey(channelState.channelName);
              channelEncPrivKey = keccak256(key);
              _context3.next = 4;
              return (0, _metadataHelpers.encryptData)(channelEncPrivKey.toString('hex'), {
                token: (0, _util.randomToken)(),
                time: new Date().getTime(),
                data: messageJson,
                uuid: channelState.uuid
              });

            case 4:
              encData = _context3.sent;
              socketConn = SOCKET_CONN_INSTANCES[channelState.channelName];

              _setMessage = /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.t0 = fetch;
                          _context.t1 = channelState.serverUrl + '/channel/set';
                          _context.t2 = JSON;
                          _context.t3 = (0, _eccrypto.getPublic)(channelEncPrivKey).toString('hex');
                          _context.t4 = encData;
                          _context.next = 7;
                          return (0, _eccrypto.sign)(channelEncPrivKey, keccak256(encData));

                        case 7:
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

                        case 13:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function _setMessage() {
                  return _ref2.apply(this, arguments);
                };
              }();

              if (!(socketConn && socketConn.connected)) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("return", _setMessage());

            case 9:
              currentAttempts = 0;
              waitingInterval = window.setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(currentAttempts >= 5)) {
                          _context2.next = 3;
                          break;
                        }

                        window.clearInterval(waitingInterval);
                        return _context2.abrupt("return", rej(new Error('Could not post message after 5 attempts to socket channel')));

                      case 3:
                        if (!(socketConn && socketConn.connected)) {
                          _context2.next = 8;
                          break;
                        }

                        window.clearInterval(waitingInterval);
                        return _context2.abrupt("return", _setMessage());

                      case 8:
                        currentAttempts++;

                      case 9:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })), 500);

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
}

function addStorageEventListener(channelName, serverUrl, fn) {
  var key = storageKey(channelName);
  var channelEncPrivKey = keccak256(key);
  var SOCKET_CONN = (0, _socket.io)(serverUrl, {
    transports: ['websocket', 'polling'],
    // use WebSocket first, if available
    withCredentials: true,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 10
  });

  var visibilityListener = function visibilityListener() {
    // if channel is closed, then remove the listener.
    if (!SOCKET_CONN_INSTANCES[channelName]) {
      document.removeEventListener('visibilitychange', visibilityListener);
      return;
    } // if not connected, then wait for connection and ping server for latest msg.


    if (!SOCKET_CONN.connected && document.visibilityState === 'visible') {
      SOCKET_CONN.once('connect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                SOCKET_CONN.emit('check_auth_status', (0, _eccrypto.getPublic)(channelEncPrivKey).toString('hex'));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      })));
    }
  };

  var listener = /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(ev) {
      var decData;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return (0, _metadataHelpers.decryptData)(channelEncPrivKey.toString('hex'), ev);

            case 3:
              decData = _context5.sent;
              fn(decData);
              _context5.next = 10;
              break;

            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5["catch"](0);

              _util.log.error(_context5.t0);

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 7]]);
    }));

    return function listener(_x) {
      return _ref5.apply(this, arguments);
    };
  }();

  SOCKET_CONN.on('connect_error', function () {
    // revert to classic upgrade
    SOCKET_CONN.io.opts.transports = ['polling', 'websocket'];
  });
  SOCKET_CONN.on('connect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var engine;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _util.log.debug('connected with socket');

            SOCKET_CONN.emit('check_auth_status', (0, _eccrypto.getPublic)(channelEncPrivKey).toString('hex'));
            engine = SOCKET_CONN.io.engine;

            _util.log.debug('initially connected to', engine.transport.name); // in most cases, prints "polling"


            engine.once('upgrade', function () {
              // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
              _util.log.debug('upgraded', engine.transport.name); // in most cases, prints "websocket"

            });
            engine.on('close', function (reason) {
              // called when the underlying connection is closed
              _util.log.debug('connection closed', reason);
            });

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  SOCKET_CONN.on('error', function (err) {
    _util.log.debug('socket errored', err);

    SOCKET_CONN.disconnect();
  });
  SOCKET_CONN.once('disconnect', function () {
    _util.log.debug('socket disconnected');

    if (SOCKET_CONN_INSTANCES[channelName]) visibilityListener();
  });
  SOCKET_CONN.on('success', listener);
  document.addEventListener('visibilitychange', visibilityListener);
  SOCKET_CONN_INSTANCES[channelName] = SOCKET_CONN;
  return listener;
}

function removeStorageEventListener(channelState) {
  if (SOCKET_CONN_INSTANCES[channelState.channelName]) SOCKET_CONN_INSTANCES[channelState.channelName].disconnect();
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
  state.listener = addStorageEventListener(channelName, options.server.url, function (msgObj) {
    if (!state.messagesCallback) return; // no listener

    if (msgObj.uuid === uuid) return; // own message

    if (!msgObj.token || eMIs.has(msgObj.token)) return; // already emitted
    // if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}

function close(channelState) {
  // give 2 sec for all msgs which are in transit to be consumed
  // by receiver.
  window.setTimeout(function () {
    removeStorageEventListener(channelState);
    delete SOCKET_CONN_INSTANCES[channelState.channelName];
  }, 1000);
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