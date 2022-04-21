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

var _loglevel = _interopRequireDefault(require("loglevel"));

var _options = require("../options");

var _util = require("../util");

var _this = void 0;

var microSeconds = _util.microSeconds; // PASS IN STRING/BUFFER TO GET BUFFER

exports.microSeconds = microSeconds;

function keccak256(a) {
  return (0, _keccak["default"])('keccak256').update(a).digest();
}

var KEY_PREFIX = 'pubkey.broadcastChannel-';
var type = 'server';
exports.type = type;
var BROADCAST_SERVER_URL = 'https://broadcast-server.tor.us';
var SOCKET_CONN = (0, _socket.io)(BROADCAST_SERVER_URL, {
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
SOCKET_CONN.on('connect', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var engine;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _loglevel["default"].debug('connected with socket');

          engine = _this.SOCKET_CONN.io.engine;

          _loglevel["default"].debug('initially connected to', engine.transport.name); // in most cases, prints "polling"


          engine.once('upgrade', function () {
            // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
            _loglevel["default"].debug('upgraded', engine.transport.name); // in most cases, prints "websocket"

          });
          engine.on('close', function (reason) {
            // called when the underlying connection is closed
            _loglevel["default"].debug('connection closed', reason);
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));

function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
 * writes the new message to the storage
 * and fires the storage-event so other readers can find it
 */


function postMessage(channelState, messageJson) {
  return new Promise(function (res, rej) {
    (0, _util.sleep)().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var key, channelEncPrivKey, encData;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              key = storageKey(channelState.channelName);
              channelEncPrivKey = keccak256(key);
              _context2.next = 4;
              return (0, _metadataHelpers.encryptData)(channelEncPrivKey.toString('hex'), messageJson);

            case 4:
              encData = _context2.sent;
              _context2.t0 = fetch;
              _context2.t1 = BROADCAST_SERVER_URL + '/channel/set';
              _context2.t2 = JSON;
              _context2.t3 = (0, _eccrypto.getPublic)(channelEncPrivKey).toString('hex');
              _context2.t4 = encData;
              _context2.next = 12;
              return (0, _eccrypto.sign)(channelEncPrivKey, keccak256(encData));

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

function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var channelEncPrivKey = keccak256(key);

  var listener = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(ev) {
      var decData;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _metadataHelpers.decryptData)(channelEncPrivKey.toString('hex'), ev);

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
  SOCKET_CONN.emit('check_auth_status', (0, _eccrypto.getPublic)(channelEncPrivKey).toString('hex'));
  return listener;
}

function removeStorageEventListener() {
  SOCKET_CONN.disconnect();
}

function create(channelName, options) {
  options = (0, _options.fillOptionsWithDefaults)(options);

  if (!canBeUsed()) {
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
    eMIs: eMIs // emittedMessagesIds

  };
  state.listener = addStorageEventListener(channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener
    // eMIs.add(channelName);

    state.messagesCallback(msgObj);
  });
  return state;
}

function close(channelState) {
  removeStorageEventListener(channelState.listener);
}

function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}

function canBeUsed() {
  if (_util.isNode) return false;
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