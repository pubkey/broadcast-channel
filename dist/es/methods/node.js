import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";

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

var _require = require('oblivious-set'),
    ObliviousSet = _require.ObliviousSet;
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
var chmod = util.promisify(fs.chmod);
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

function ensureBaseFolderExists() {
  return _ensureBaseFolderExists.apply(this, arguments);
}

function _ensureBaseFolderExists() {
  _ensureBaseFolderExists = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!ENSURE_BASE_FOLDER_EXISTS_PROMISE) {
              ENSURE_BASE_FOLDER_EXISTS_PROMISE = mkdir(TMP_FOLDER_BASE)["catch"](function () {
                return null;
              });
            }

            return _context4.abrupt("return", ENSURE_BASE_FOLDER_EXISTS_PROMISE);

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _ensureBaseFolderExists.apply(this, arguments);
}

function ensureFoldersExist(_x, _x2) {
  return _ensureFoldersExist.apply(this, arguments);
}
/**
 * removes the tmp-folder
 * @return {Promise<true>}
 */


function _ensureFoldersExist() {
  _ensureFoldersExist = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(channelName, paths) {
    var chmodValue;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            paths = paths || getPaths(channelName);
            _context5.next = 3;
            return ensureBaseFolderExists();

          case 3:
            _context5.next = 5;
            return mkdir(paths.channelBase)["catch"](function () {
              return null;
            });

          case 5:
            _context5.next = 7;
            return Promise.all([mkdir(paths.readers)["catch"](function () {
              return null;
            }), mkdir(paths.messages)["catch"](function () {
              return null;
            })]);

          case 7:
            // set permissions so other users can use the same channel
            chmodValue = '777';
            _context5.next = 10;
            return Promise.all([chmod(paths.channelBase, chmodValue), chmod(paths.readers, chmodValue), chmod(paths.messages, chmodValue)])["catch"](function () {
              return null;
            });

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _ensureFoldersExist.apply(this, arguments);
}

function clearNodeFolder() {
  return _clearNodeFolder.apply(this, arguments);
}

function _clearNodeFolder() {
  _clearNodeFolder = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!(!TMP_FOLDER_BASE || TMP_FOLDER_BASE === '' || TMP_FOLDER_BASE === '/')) {
              _context6.next = 2;
              break;
            }

            throw new Error('BroadcastChannel.clearNodeFolder(): path is wrong');

          case 2:
            ENSURE_BASE_FOLDER_EXISTS_PROMISE = null;
            _context6.next = 5;
            return removeDir(TMP_FOLDER_BASE);

          case 5:
            ENSURE_BASE_FOLDER_EXISTS_PROMISE = null;
            return _context6.abrupt("return", true);

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
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
 * returns the amount of channel-folders in the tmp-directory
 * @return {Promise<number>}
 */


function countChannelFolders() {
  return _countChannelFolders.apply(this, arguments);
}

function _countChannelFolders() {
  _countChannelFolders = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
    var folders;
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return ensureBaseFolderExists();

          case 2:
            _context7.next = 4;
            return readdir(TMP_FOLDER_BASE);

          case 4:
            folders = _context7.sent;
            return _context7.abrupt("return", folders.length);

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _countChannelFolders.apply(this, arguments);
}

function connectionError(_x3) {
  return _connectionError.apply(this, arguments);
}
/**
 * creates the socket-file and subscribes to it
 * @return {{emitter: EventEmitter, server: any}}
 */


function _connectionError() {
  _connectionError = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(originalError) {
    var count, addObj, text, newError;
    return _regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return countChannelFolders();

          case 2:
            count = _context8.sent;

            if (!(count < 30)) {
              _context8.next = 5;
              break;
            }

            return _context8.abrupt("return", originalError);

          case 5:
            addObj = {};
            Object.entries(originalError).forEach(function (_ref4) {
              var k = _ref4[0],
                  v = _ref4[1];
              return addObj[k] = v;
            });
            text = 'BroadcastChannel.create(): error: ' + 'This might happen if you have created to many channels, ' + 'like when you use BroadcastChannel in unit-tests.' + 'Try using BroadcastChannel.clearNodeFolder() to clear the tmp-folder before each test.' + 'See https://github.com/pubkey/broadcast-channel#clear-tmp-folder';
            newError = new Error(text + ': ' + JSON.stringify(addObj, null, 2));
            return _context8.abrupt("return", newError);

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _connectionError.apply(this, arguments);
}

function createSocketEventEmitter(_x4, _x5, _x6) {
  return _createSocketEventEmitter.apply(this, arguments);
}

function _createSocketEventEmitter() {
  _createSocketEventEmitter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(channelName, readerUuid, paths) {
    var pathToSocket, emitter, server;
    return _regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            pathToSocket = socketPath(channelName, readerUuid, paths);
            emitter = new events.EventEmitter();
            server = net.createServer(function (stream) {
              stream.on('end', function () {});
              stream.on('data', function (msg) {
                emitter.emit('data', msg.toString());
              });
            });
            _context11.next = 5;
            return new Promise(function (resolve, reject) {
              server.on('error', /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(err) {
                  var useErr;
                  return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                      switch (_context9.prev = _context9.next) {
                        case 0:
                          _context9.next = 2;
                          return connectionError(err);

                        case 2:
                          useErr = _context9.sent;
                          reject(useErr);

                        case 4:
                        case "end":
                          return _context9.stop();
                      }
                    }
                  }, _callee9);
                }));

                return function (_x24) {
                  return _ref5.apply(this, arguments);
                };
              }());
              server.listen(pathToSocket, /*#__PURE__*/function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(err, res) {
                  var useErr;
                  return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          if (!err) {
                            _context10.next = 7;
                            break;
                          }

                          _context10.next = 3;
                          return connectionError(err);

                        case 3:
                          useErr = _context10.sent;
                          reject(useErr);
                          _context10.next = 8;
                          break;

                        case 7:
                          resolve(res);

                        case 8:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                }));

                return function (_x25, _x26) {
                  return _ref6.apply(this, arguments);
                };
              }());
            });

          case 5:
            return _context11.abrupt("return", {
              path: pathToSocket,
              emitter: emitter,
              server: server
            });

          case 6:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _createSocketEventEmitter.apply(this, arguments);
}

function openClientConnection(_x7, _x8) {
  return _openClientConnection.apply(this, arguments);
}
/**
 * writes the new message to the file-system
 * so other readers can find it
 * @return {Promise}
 */


function _openClientConnection() {
  _openClientConnection = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(channelName, readerUuid) {
    var pathToSocket, client;
    return _regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            pathToSocket = socketPath(channelName, readerUuid);
            client = new net.Socket();
            return _context12.abrupt("return", new Promise(function (res, rej) {
              client.connect(pathToSocket, function () {
                return res(client);
              });
              client.on('error', function (err) {
                return rej(err);
              });
            }));

          case 3:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
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
  var token = randomToken();
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


function getReadersUuids(_x9, _x10) {
  return _getReadersUuids.apply(this, arguments);
}

function _getReadersUuids() {
  _getReadersUuids = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(channelName, paths) {
    var readersPath, files;
    return _regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            paths = paths || getPaths(channelName);
            readersPath = paths.readers;
            _context13.next = 4;
            return readdir(readersPath);

          case 4:
            files = _context13.sent;
            return _context13.abrupt("return", files.map(function (file) {
              return file.split('.');
            }).filter(function (split) {
              return split[1] === 'json';
            }) // do not scan .socket-files
            . // do not scan .socket-files
            map(function (split) {
              return split[0];
            }));

          case 6:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _getReadersUuids.apply(this, arguments);
}

function messagePath(_x11, _x12, _x13, _x14) {
  return _messagePath.apply(this, arguments);
}

function _messagePath() {
  _messagePath = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14(channelName, time, token, writerUuid) {
    var fileName, msgPath;
    return _regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            fileName = time + '_' + writerUuid + '_' + token + '.json';
            msgPath = path.join(getPaths(channelName).messages, fileName);
            return _context14.abrupt("return", msgPath);

          case 3:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _messagePath.apply(this, arguments);
}

function getAllMessages(_x15, _x16) {
  return _getAllMessages.apply(this, arguments);
}

function _getAllMessages() {
  _getAllMessages = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(channelName, paths) {
    var messagesPath, files;
    return _regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            paths = paths || getPaths(channelName);
            messagesPath = paths.messages;
            _context15.next = 4;
            return readdir(messagesPath);

          case 4:
            files = _context15.sent;
            return _context15.abrupt("return", files.map(function (file) {
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
            return _context15.stop();
        }
      }
    }, _callee15);
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

function cleanOldMessages(_x17, _x18) {
  return _cleanOldMessages.apply(this, arguments);
}

function _cleanOldMessages() {
  _cleanOldMessages = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(messageObjects, ttl) {
    var olderThen;
    return _regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            olderThen = Date.now() - ttl;
            _context16.next = 3;
            return Promise.all(messageObjects.filter(function (obj) {
              return obj.time / 1000 < olderThen;
            }).map(function (obj) {
              return unlink(obj.path)["catch"](function () {
                return null;
              });
            }));

          case 3:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));
  return _cleanOldMessages.apply(this, arguments);
}

var type = 'node';
/**
 * creates a new channelState
 * @return {Promise<any>}
 */

function create(_x19) {
  return _create.apply(this, arguments);
}

function _create() {
  _create = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(channelName) {
    var options,
        time,
        paths,
        ensureFolderExistsPromise,
        uuid,
        state,
        _yield$Promise$all2,
        socketEE,
        infoFilePath,
        _args17 = arguments;

    return _regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            options = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : {};
            options = fillOptionsWithDefaults(options);
            time = microSeconds();
            paths = getPaths(channelName);
            ensureFolderExistsPromise = ensureFoldersExist(channelName, paths);
            uuid = randomToken();
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
            _context17.next = 11;
            return ensureFolderExistsPromise;

          case 11:
            _context17.next = 13;
            return Promise.all([createSocketEventEmitter(channelName, uuid, paths), createSocketInfoFile(channelName, uuid, paths), refreshReaderClients(state)]);

          case 13:
            _yield$Promise$all2 = _context17.sent;
            socketEE = _yield$Promise$all2[0];
            infoFilePath = _yield$Promise$all2[1];
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
            return _context17.abrupt("return", state);

          case 20:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
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


function handleMessagePing(_x20, _x21) {
  return _handleMessagePing.apply(this, arguments);
}
/**
 * ensures that the channelState is connected with all other readers
 * @return {Promise<void>}
 */


function _handleMessagePing() {
  _handleMessagePing = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18(state, msgObj) {
    var messages, useMessages;
    return _regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            if (state.messagesCallback) {
              _context18.next = 2;
              break;
            }

            return _context18.abrupt("return");

          case 2:
            if (msgObj) {
              _context18.next = 8;
              break;
            }

            _context18.next = 5;
            return getAllMessages(state.channelName, state.paths);

          case 5:
            messages = _context18.sent;
            _context18.next = 9;
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
              _context18.next = 12;
              break;
            }

            return _context18.abrupt("return");

          case 12:
            _context18.next = 14;
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
            return _context18.stop();
        }
      }
    }, _callee18);
  }));
  return _handleMessagePing.apply(this, arguments);
}

function refreshReaderClients(channelState) {
  return getReadersUuids(channelState.channelName, channelState.paths).then(function (otherReaders) {
    // remove subscriptions to closed readers
    Object.keys(channelState.otherReaderClients).filter(function (readerUuid) {
      return !otherReaders.includes(readerUuid);
    }).forEach( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(readerUuid) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
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
        }, _callee, null, [[0, 5]]);
      }));

      return function (_x22) {
        return _ref.apply(this, arguments);
      };
    }()); // add new readers

    return Promise.all(otherReaders.filter(function (readerUuid) {
      return readerUuid !== channelState.uuid;
    }) // not own
    .filter(function (readerUuid) {
      return !channelState.otherReaderClients[readerUuid];
    }) // not already has client
    .map( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(readerUuid) {
        var client;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
                _context2.prev = 3;
                _context2.next = 6;
                return openClientConnection(channelState.channelName, readerUuid);

              case 6:
                client = _context2.sent;
                channelState.otherReaderClients[readerUuid] = client;
                _context2.next = 12;
                break;

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](3);

              case 12:
                _context2.next = 16;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t1 = _context2["catch"](0);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 14], [3, 10]]);
      }));

      return function (_x23) {
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
  channelState.writeBlockPromise = channelState.writeBlockPromise.then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
    var _yield$Promise$all, msgObj, pingStr, writeToReadersPromise;

    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
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
            _yield$Promise$all = _context3.sent;
            msgObj = _yield$Promise$all[0];
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
    }, _callee3);
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
/**
 * closes the channel
 * @return {Promise}
 */


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

  return new Promise(function (res) {
    if (channelState.socketEE) channelState.socketEE.emitter.removeAllListeners();
    Object.values(channelState.otherReaderClients).forEach(function (client) {
      return client.destroy();
    });

    if (channelState.infoFilePath) {
      try {
        fs.unlinkSync(channelState.infoFilePath);
      } catch (err) {}
    }
    /**
     * the server get closed lazy because others might still write on it
     * and have not found out that the infoFile was deleted
     */


    setTimeout(function () {
      channelState.socketEE.server.close();
      res();
    }, 200);
  });
}

function canBeUsed() {
  return isNode;
}
/**
 * on node we use a relatively height averageResponseTime,
 * because the file-io might be in use.
 * Also it is more important that the leader-election is reliable,
 * then to have a fast election.
 */


function averageResponseTime() {
  return 200;
}

function microSeconds() {
  return parseInt(micro.microseconds());
}

module.exports = {
  TMP_FOLDER_BASE: TMP_FOLDER_BASE,
  cleanPipeName: cleanPipeName,
  getPaths: getPaths,
  ensureFoldersExist: ensureFoldersExist,
  clearNodeFolder: clearNodeFolder,
  socketPath: socketPath,
  socketInfoPath: socketInfoPath,
  createSocketInfoFile: createSocketInfoFile,
  countChannelFolders: countChannelFolders,
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