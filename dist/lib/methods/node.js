"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * this method is used in nodejs-environments.
 * The ipc is handled via sockets and file-writes to the tmp-folder
 */
var util = require('util');

var fs = require('fs');

var os = require('os');

var events = require('events');

var net = require('net');

var path = require('path');

var micro = require('nano-time');

var rimraf = require('rimraf');

var sha3_224 = require('js-sha3').sha3_224;

var isNode = require('detect-node');

var unload = require('unload');

var fillOptionsWithDefaults = require('../../dist/lib/options.js').fillOptionsWithDefaults;

var ownUtil = require('../../dist/lib/util.js');

var randomInt = ownUtil.randomInt;
var randomToken = ownUtil.randomToken;

var ObliviousSet = require('../../dist/lib/oblivious-set')["default"];
/**
 * windows sucks, so we have handle windows-type of socket-paths
 * @link https://gist.github.com/domenic/2790533#gistcomment-331356
 */


function cleanPipeName(str) {
  if (process.platform === 'win32' && !str.startsWith('\\\\.\\pipe\\')) {
    str = str.replace(/^\//, '');
    str = str.replace(/\//g, '-');
    return '\\\\.\\pipe\\' + str;
  } else {
    return str;
  }
}

var mkdir = util.promisify(fs.mkdir);
var writeFile = util.promisify(fs.writeFile);
var readFile = util.promisify(fs.readFile);
var unlink = util.promisify(fs.unlink);
var readdir = util.promisify(fs.readdir);
var removeDir = util.promisify(rimraf);
var OTHER_INSTANCES = {};
var TMP_FOLDER_NAME = 'pubkey.bc';
var TMP_FOLDER_BASE = path.join(os.tmpdir(), TMP_FOLDER_NAME);
var getPathsCache = new Map();

function getPaths(channelName) {
  if (!getPathsCache.has(channelName)) {
    var channelHash = sha3_224(channelName); // use hash incase of strange characters

    /**
     * because the lenght of socket-paths is limited, we use only the first 20 chars
     * and also start with A to ensure we do not start with a number
     * @link https://serverfault.com/questions/641347/check-if-a-path-exceeds-maximum-for-unix-domain-socket
     */

    var channelFolder = 'A' + channelHash.substring(0, 20);
    var channelPathBase = path.join(TMP_FOLDER_BASE, channelFolder);
    var folderPathReaders = path.join(channelPathBase, 'rdrs');
    var folderPathMessages = path.join(channelPathBase, 'messages');
    var ret = {
      base: TMP_FOLDER_BASE,
      channelBase: channelPathBase,
      readers: folderPathReaders,
      messages: folderPathMessages
    };
    getPathsCache.set(channelName, ret);
    return ret;
  }

  return getPathsCache.get(channelName);
}

var ENSURE_BASE_FOLDER_EXISTS_PROMISE = null;

function ensureFoldersExist(_x, _x2) {
  return _ensureFoldersExist.apply(this, arguments);
}
/**
 * removes the tmp-folder
 * @return {Promise<true>}
 */


function _ensureFoldersExist() {
  _ensureFoldersExist = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(channelName, paths) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            paths = paths || getPaths(channelName);

            if (!ENSURE_BASE_FOLDER_EXISTS_PROMISE) {
              ENSURE_BASE_FOLDER_EXISTS_PROMISE = mkdir(paths.base)["catch"](function () {
                return null;
              });
            }

            _context4.next = 4;
            return ENSURE_BASE_FOLDER_EXISTS_PROMISE;

          case 4:
            _context4.next = 6;
            return mkdir(paths.channelBase)["catch"](function () {
              return null;
            });

          case 6:
            _context4.next = 8;
            return Promise.all([mkdir(paths.readers)["catch"](function () {
              return null;
            }), mkdir(paths.messages)["catch"](function () {
              return null;
            })]);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _ensureFoldersExist.apply(this, arguments);
}

function clearNodeFolder() {
  return _clearNodeFolder.apply(this, arguments);
}

function _clearNodeFolder() {
  _clearNodeFolder = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5() {
    var paths, removePath;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            paths = getPaths('foobar');
            removePath = paths.base;

            if (!(!removePath || removePath === '' || removePath === '/')) {
              _context5.next = 4;
              break;
            }

            throw new Error('BroadcastChannel.clearNodeFolder(): path is wrong');

          case 4:
            ENSURE_BASE_FOLDER_EXISTS_PROMISE = null;
            _context5.next = 7;
            return removeDir(paths.base);

          case 7:
            ENSURE_BASE_FOLDER_EXISTS_PROMISE = null;
            return _context5.abrupt("return", true);

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _clearNodeFolder.apply(this, arguments);
}

function socketPath(channelName, readerUuid, paths) {
  paths = paths || getPaths(channelName);
  var socketPath = path.join(paths.readers, readerUuid + '.s');
  return cleanPipeName(socketPath);
}

function socketInfoPath(channelName, readerUuid, paths) {
  paths = paths || getPaths(channelName);
  var socketPath = path.join(paths.readers, readerUuid + '.json');
  return socketPath;
}
/**
 * Because it is not possible to get all socket-files in a folder,
 * when used under fucking windows,
 * we have to set a normal file so other readers know our socket exists
 */


function createSocketInfoFile(channelName, readerUuid, paths) {
  var pathToFile = socketInfoPath(channelName, readerUuid, paths);
  return writeFile(pathToFile, JSON.stringify({
    time: microSeconds()
  })).then(function () {
    return pathToFile;
  });
}
/**
 * creates the socket-file and subscribes to it
 * @return {{emitter: EventEmitter, server: any}}
 */


function createSocketEventEmitter(_x3, _x4, _x5) {
  return _createSocketEventEmitter.apply(this, arguments);
}

function _createSocketEventEmitter() {
  _createSocketEventEmitter = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(channelName, readerUuid, paths) {
    var pathToSocket, emitter, server;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            pathToSocket = socketPath(channelName, readerUuid, paths);
            emitter = new events.EventEmitter();
            server = net.createServer(function (stream) {
              stream.on('end', function () {});
              stream.on('data', function (msg) {
                emitter.emit('data', msg.toString());
              });
            });
            _context6.next = 5;
            return new Promise(function (resolve, reject) {
              server.listen(pathToSocket, function (err, res) {
                if (err) reject(err);else resolve(res);
              });
            });

          case 5:
            return _context6.abrupt("return", {
              path: pathToSocket,
              emitter: emitter,
              server: server
            });

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return _createSocketEventEmitter.apply(this, arguments);
}

function openClientConnection(_x6, _x7) {
  return _openClientConnection.apply(this, arguments);
}
/**
 * writes the new message to the file-system
 * so other readers can find it
 * @return {Promise}
 */


function _openClientConnection() {
  _openClientConnection = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7(channelName, readerUuid) {
    var pathToSocket, client;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            pathToSocket = socketPath(channelName, readerUuid);
            client = new net.Socket();
            _context7.next = 4;
            return new Promise(function (res) {
              client.connect(pathToSocket, res);
            });

          case 4:
            return _context7.abrupt("return", client);

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return _openClientConnection.apply(this, arguments);
}

function writeMessage(channelName, readerUuid, messageJson, paths) {
  paths = paths || getPaths(channelName);
  var time = microSeconds();
  var writeObject = {
    uuid: readerUuid,
    time: time,
    data: messageJson
  };
  var token = randomToken(12);
  var fileName = time + '_' + readerUuid + '_' + token + '.json';
  var msgPath = path.join(paths.messages, fileName);
  return writeFile(msgPath, JSON.stringify(writeObject)).then(function () {
    return {
      time: time,
      uuid: readerUuid,
      token: token,
      path: msgPath
    };
  });
}
/**
 * returns the uuids of all readers
 * @return {string[]}
 */


function getReadersUuids(_x8, _x9) {
  return _getReadersUuids.apply(this, arguments);
}

function _getReadersUuids() {
  _getReadersUuids = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8(channelName, paths) {
    var readersPath, files;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            paths = paths || getPaths(channelName);
            readersPath = paths.readers;
            _context8.next = 4;
            return readdir(readersPath);

          case 4:
            files = _context8.sent;
            return _context8.abrupt("return", files.map(function (file) {
              return file.split('.');
            }).filter(function (split) {
              return split[1] === 'json';
            }) // do not scan .socket-files
            .map(function (split) {
              return split[0];
            }));

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return _getReadersUuids.apply(this, arguments);
}

function messagePath(_x10, _x11, _x12, _x13) {
  return _messagePath.apply(this, arguments);
}

function _messagePath() {
  _messagePath = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee9(channelName, time, token, writerUuid) {
    var fileName, msgPath;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            fileName = time + '_' + writerUuid + '_' + token + '.json';
            msgPath = path.join(getPaths(channelName).messages, fileName);
            return _context9.abrupt("return", msgPath);

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));
  return _messagePath.apply(this, arguments);
}

function getAllMessages(_x14, _x15) {
  return _getAllMessages.apply(this, arguments);
}

function _getAllMessages() {
  _getAllMessages = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee10(channelName, paths) {
    var messagesPath, files;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            paths = paths || getPaths(channelName);
            messagesPath = paths.messages;
            _context10.next = 4;
            return readdir(messagesPath);

          case 4:
            files = _context10.sent;
            return _context10.abrupt("return", files.map(function (file) {
              var fileName = file.split('.')[0];
              var split = fileName.split('_');
              return {
                path: path.join(messagesPath, file),
                time: parseInt(split[0]),
                senderUuid: split[1],
                token: split[2]
              };
            }));

          case 6:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));
  return _getAllMessages.apply(this, arguments);
}

function getSingleMessage(channelName, msgObj, paths) {
  paths = paths || getPaths(channelName);
  return {
    path: path.join(paths.messages, msgObj.t + '_' + msgObj.u + '_' + msgObj.to + '.json'),
    time: msgObj.t,
    senderUuid: msgObj.u,
    token: msgObj.to
  };
}

function readMessage(messageObj) {
  return readFile(messageObj.path, 'utf8').then(function (content) {
    return JSON.parse(content);
  });
}

function cleanOldMessages(_x16, _x17) {
  return _cleanOldMessages.apply(this, arguments);
}

function _cleanOldMessages() {
  _cleanOldMessages = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee11(messageObjects, ttl) {
    var olderThen;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            olderThen = Date.now() - ttl;
            _context11.next = 3;
            return Promise.all(messageObjects.filter(function (obj) {
              return obj.time / 1000 < olderThen;
            }).map(function (obj) {
              return unlink(obj.path)["catch"](function () {
                return null;
              });
            }));

          case 3:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));
  return _cleanOldMessages.apply(this, arguments);
}

var type = 'node';
/**
 * creates a new channelState
 * @return {Promise<any>}
 */

function create(_x18) {
  return _create.apply(this, arguments);
}

function _create() {
  _create = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee12(channelName) {
    var options,
        time,
        paths,
        ensureFolderExistsPromise,
        uuid,
        state,
        _ref5,
        socketEE,
        infoFilePath,
        _args12 = arguments;

    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            options = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {};
            options = fillOptionsWithDefaults(options);
            time = microSeconds();
            paths = getPaths(channelName);
            ensureFolderExistsPromise = ensureFoldersExist(channelName, paths);
            uuid = randomToken(10);
            state = {
              time: time,
              channelName: channelName,
              options: options,
              uuid: uuid,
              paths: paths,
              // contains all messages that have been emitted before
              emittedMessagesIds: new ObliviousSet(options.node.ttl * 2),
              messagesCallbackTime: null,
              messagesCallback: null,
              // ensures we do not read messages in parrallel
              writeBlockPromise: Promise.resolve(),
              otherReaderClients: {},
              // ensure if process crashes, everything is cleaned up
              removeUnload: unload.add(function () {
                return close(state);
              }),
              closed: false
            };
            if (!OTHER_INSTANCES[channelName]) OTHER_INSTANCES[channelName] = [];
            OTHER_INSTANCES[channelName].push(state);
            _context12.next = 11;
            return ensureFolderExistsPromise;

          case 11:
            _context12.next = 13;
            return Promise.all([createSocketEventEmitter(channelName, uuid, paths), createSocketInfoFile(channelName, uuid, paths), refreshReaderClients(state)]);

          case 13:
            _ref5 = _context12.sent;
            socketEE = _ref5[0];
            infoFilePath = _ref5[1];
            state.socketEE = socketEE;
            state.infoFilePath = infoFilePath; // when new message comes in, we read it and emit it

            socketEE.emitter.on('data', function (data) {
              // if the socket is used fast, it may appear that multiple messages are flushed at once
              // so we have to split them before
              var singleOnes = data.split('|');
              singleOnes.filter(function (single) {
                return single !== '';
              }).forEach(function (single) {
                try {
                  var obj = JSON.parse(single);
                  handleMessagePing(state, obj);
                } catch (err) {
                  throw new Error('could not parse data: ' + single);
                }
              });
            });
            return _context12.abrupt("return", state);

          case 20:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));
  return _create.apply(this, arguments);
}

function _filterMessage(msgObj, state) {
  if (msgObj.senderUuid === state.uuid) return false; // not send by own

  if (state.emittedMessagesIds.has(msgObj.token)) return false; // not already emitted

  if (!state.messagesCallback) return false; // no listener

  if (msgObj.time < state.messagesCallbackTime) return false; // not older then onMessageCallback

  if (msgObj.time < state.time) return false; // msgObj is older then channel

  state.emittedMessagesIds.add(msgObj.token);
  return true;
}
/**
 * when the socket pings, so that we now new messages came,
 * run this
 */


function handleMessagePing(_x19, _x20) {
  return _handleMessagePing.apply(this, arguments);
}
/**
 * ensures that the channelState is connected with all other readers
 * @return {Promise<void>}
 */


function _handleMessagePing() {
  _handleMessagePing = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee13(state, msgObj) {
    var messages, useMessages;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            if (state.messagesCallback) {
              _context13.next = 2;
              break;
            }

            return _context13.abrupt("return");

          case 2:
            if (msgObj) {
              _context13.next = 8;
              break;
            }

            _context13.next = 5;
            return getAllMessages(state.channelName, state.paths);

          case 5:
            messages = _context13.sent;
            _context13.next = 9;
            break;

          case 8:
            // get single message
            messages = [getSingleMessage(state.channelName, msgObj, state.paths)];

          case 9:
            useMessages = messages.filter(function (msgObj) {
              return _filterMessage(msgObj, state);
            }).sort(function (msgObjA, msgObjB) {
              return msgObjA.time - msgObjB.time;
            }); // sort by time
            // if no listener or message, so not do anything

            if (!(!useMessages.length || !state.messagesCallback)) {
              _context13.next = 12;
              break;
            }

            return _context13.abrupt("return");

          case 12:
            _context13.next = 14;
            return Promise.all(useMessages.map(function (msgObj) {
              return readMessage(msgObj).then(function (content) {
                return msgObj.content = content;
              });
            }));

          case 14:
            useMessages.forEach(function (msgObj) {
              state.emittedMessagesIds.add(msgObj.token);

              if (state.messagesCallback) {
                // emit to subscribers
                state.messagesCallback(msgObj.content.data);
              }
            });

          case 15:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));
  return _handleMessagePing.apply(this, arguments);
}

function refreshReaderClients(channelState) {
  return getReadersUuids(channelState.channelName, channelState.paths).then(function (otherReaders) {
    // remove subscriptions to closed readers
    Object.keys(channelState.otherReaderClients).filter(function (readerUuid) {
      return !otherReaders.includes(readerUuid);
    }).forEach(
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(readerUuid) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return channelState.otherReaderClients[readerUuid].destroy();

              case 3:
                _context.next = 7;
                break;

              case 5:
                _context.prev = 5;
                _context.t0 = _context["catch"](0);

              case 7:
                delete channelState.otherReaderClients[readerUuid];

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 5]]);
      }));

      return function (_x21) {
        return _ref.apply(this, arguments);
      };
    }()); // add new readers

    return Promise.all(otherReaders.filter(function (readerUuid) {
      return readerUuid !== channelState.uuid;
    }) // not own
    .filter(function (readerUuid) {
      return !channelState.otherReaderClients[readerUuid];
    }) // not already has client
    .map(
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(readerUuid) {
        var client;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                if (!channelState.closed) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                _context2.next = 5;
                return openClientConnection(channelState.channelName, readerUuid);

              case 5:
                client = _context2.sent;
                channelState.otherReaderClients[readerUuid] = client;
                _context2.next = 11;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 9]]);
      }));

      return function (_x22) {
        return _ref2.apply(this, arguments);
      };
    }()));
  });
}
/**
 * post a message to the other readers
 * @return {Promise<void>}
 */


function postMessage(channelState, messageJson) {
  var writePromise = writeMessage(channelState.channelName, channelState.uuid, messageJson, channelState.paths);
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3() {
    var _ref4, msgObj, pingStr, writeToReadersPromise;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return new Promise(function (res) {
              return setTimeout(res, 0);
            });

          case 2:
            _context3.next = 4;
            return Promise.all([writePromise, refreshReaderClients(channelState)]);

          case 4:
            _ref4 = _context3.sent;
            msgObj = _ref4[0];
            emitOverFastPath(channelState, msgObj, messageJson);
            pingStr = '{"t":' + msgObj.time + ',"u":"' + msgObj.uuid + '","to":"' + msgObj.token + '"}|';
            writeToReadersPromise = Promise.all(Object.values(channelState.otherReaderClients).filter(function (client) {
              return client.writable;
            }) // client might have closed in between
            .map(function (client) {
              return new Promise(function (res) {
                client.write(pingStr, res);
              });
            }));
            /**
             * clean up old messages
             * to not waste resources on cleaning up,
             * only if random-int matches, we clean up old messages
             */

            if (randomInt(0, 20) === 0) {
              /* await */
              getAllMessages(channelState.channelName, channelState.paths).then(function (allMessages) {
                return cleanOldMessages(allMessages, channelState.options.node.ttl);
              });
            }

            return _context3.abrupt("return", writeToReadersPromise);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  return channelState.writeBlockPromise;
}
/**
 * When multiple BroadcastChannels with the same name
 * are created in a single node-process, we can access them directly and emit messages.
 * This might not happen often in production
 * but will speed up things when this module is used in unit-tests.
 */


function emitOverFastPath(state, msgObj, messageJson) {
  if (!state.options.node.useFastPath) return; // disabled

  var others = OTHER_INSTANCES[state.channelName].filter(function (s) {
    return s !== state;
  });
  var checkObj = {
    time: msgObj.time,
    senderUuid: msgObj.uuid,
    token: msgObj.token
  };
  others.filter(function (otherState) {
    return _filterMessage(checkObj, otherState);
  }).forEach(function (otherState) {
    otherState.messagesCallback(messageJson);
  });
}

function onMessage(channelState, fn) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : microSeconds();
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  handleMessagePing(channelState);
}

function close(channelState) {
  if (channelState.closed) return;
  channelState.closed = true;
  channelState.emittedMessagesIds.clear();
  OTHER_INSTANCES[channelState.channelName] = OTHER_INSTANCES[channelState.channelName].filter(function (o) {
    return o !== channelState;
  });

  if (channelState.removeUnload) {
    channelState.removeUnload.remove();
  }
  /**
   * the server get closed lazy because others might still write on it
   * and have not found out that the infoFile was deleted
   */


  setTimeout(function () {
    return channelState.socketEE.server.close();
  }, 200);
  channelState.socketEE.emitter.removeAllListeners();
  Object.values(channelState.otherReaderClients).forEach(function (client) {
    return client.destroy();
  });
  unlink(channelState.infoFilePath)["catch"](function () {
    return null;
  });
}

function canBeUsed() {
  return isNode;
}

function averageResponseTime() {
  return 50;
}

function microSeconds() {
  return parseInt(micro.microseconds());
}

module.exports = {
  cleanPipeName: cleanPipeName,
  getPaths: getPaths,
  ensureFoldersExist: ensureFoldersExist,
  clearNodeFolder: clearNodeFolder,
  socketPath: socketPath,
  socketInfoPath: socketInfoPath,
  createSocketInfoFile: createSocketInfoFile,
  createSocketEventEmitter: createSocketEventEmitter,
  openClientConnection: openClientConnection,
  writeMessage: writeMessage,
  getReadersUuids: getReadersUuids,
  messagePath: messagePath,
  getAllMessages: getAllMessages,
  getSingleMessage: getSingleMessage,
  readMessage: readMessage,
  cleanOldMessages: cleanOldMessages,
  type: type,
  create: create,
  _filterMessage: _filterMessage,
  handleMessagePing: handleMessagePing,
  refreshReaderClients: refreshReaderClients,
  postMessage: postMessage,
  emitOverFastPath: emitOverFastPath,
  onMessage: onMessage,
  close: close,
  canBeUsed: canBeUsed,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};