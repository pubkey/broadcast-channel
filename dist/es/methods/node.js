import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
/**
 * this method is used in nodejs-environments.
 * The ipc is handled via sockets and file-writes to the tmp-folder
 */

import * as util from 'util';
import * as fs from 'fs';
import * as os from 'os';
import * as events from 'events';
import * as net from 'net';
import * as path from 'path';
import { sha3_224 } from 'js-sha3';

import isNode from 'detect-node';
import IdleQueue from 'custom-idle-queue';
import unload from 'unload';

import { fillOptionsWithDefaults } from '../options';

import { randomInt, randomToken } from '../util';

/**
 * windows sucks, so we have handle windows-type of socket-paths
 * @link https://gist.github.com/domenic/2790533#gistcomment-331356
 */
export function cleanPipeName(str) {
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

var TMP_FOLDER_NAME = 'pubkey.broadcast-channel';

export function getPaths(channelName) {
    var folderPathBase = path.join(os.tmpdir(), TMP_FOLDER_NAME);
    var channelPathBase = path.join(os.tmpdir(), TMP_FOLDER_NAME, sha3_224(channelName) // use hash incase of strange characters
    );
    var folderPathReaders = path.join(channelPathBase, 'readers');
    var folderPathMessages = path.join(channelPathBase, 'messages');

    return {
        base: folderPathBase,
        channelBase: channelPathBase,
        readers: folderPathReaders,
        messages: folderPathMessages
    };
}

export var ensureFoldersExist = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(channelName) {
        var paths;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        paths = getPaths(channelName);
                        _context.next = 3;
                        return mkdir(paths.base)['catch'](function () {
                            return null;
                        });

                    case 3:
                        _context.next = 5;
                        return mkdir(paths.channelBase)['catch'](function () {
                            return null;
                        });

                    case 5:
                        _context.t0 = Promise;
                        _context.next = 8;
                        return mkdir(paths.readers)['catch'](function () {
                            return null;
                        });

                    case 8:
                        _context.t1 = _context.sent;
                        _context.next = 11;
                        return mkdir(paths.messages)['catch'](function () {
                            return null;
                        });

                    case 11:
                        _context.t2 = _context.sent;
                        _context.t3 = [_context.t1, _context.t2];
                        _context.next = 15;
                        return _context.t0.all.call(_context.t0, _context.t3);

                    case 15:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function ensureFoldersExist(_x) {
        return _ref.apply(this, arguments);
    };
}();

export function socketPath(channelName, readerUuid) {

    var paths = getPaths(channelName);
    var socketPath = path.join(paths.readers, readerUuid + '.s');
    return cleanPipeName(socketPath);
}

export function socketInfoPath(channelName, readerUuid) {
    var paths = getPaths(channelName);
    var socketPath = path.join(paths.readers, readerUuid + '.json');
    return socketPath;
}

/**
 * Because it is not possible to get all socket-files in a folder,
 * when used under fucking windows,
 * we have to set a normal file so other readers know our socket exists
 */
export var createSocketInfoFile = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(channelName, readerUuid) {
        var pathToFile;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return ensureFoldersExist(channelName);

                    case 2:
                        pathToFile = socketInfoPath(channelName, readerUuid);
                        _context2.next = 5;
                        return writeFile(pathToFile, JSON.stringify({
                            time: new Date().getTime()
                        }));

                    case 5:
                        return _context2.abrupt('return', pathToFile);

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function createSocketInfoFile(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();

/**
 * creates the socket-file and subscribes to it
 * @return {{emitter: EventEmitter, server: any}}
 */
export var createSocketEventEmitter = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(channelName, readerUuid) {
        var pathToSocket, emitter, server;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        pathToSocket = socketPath(channelName, readerUuid);
                        emitter = new events.EventEmitter();
                        server = net.createServer(function (stream) {
                            stream.on('end', function () {
                                // console.log('server: end');
                            });

                            stream.on('data', function (msg) {
                                // console.log('server: got data:');
                                // console.dir(msg.toString());
                                emitter.emit('data', msg.toString());
                            });
                        });
                        _context3.next = 5;
                        return new Promise(function (res) {
                            server.listen(pathToSocket, function () {
                                res();
                            });
                        });

                    case 5:
                        server.on('connection', function () {
                            // console.log('server: Client connected.');
                        });

                        return _context3.abrupt('return', {
                            path: pathToSocket,
                            emitter: emitter,
                            server: server
                        });

                    case 7:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function createSocketEventEmitter(_x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}();

export var openClientConnection = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(channelName, readerUuid) {
        var pathToSocket, client;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        pathToSocket = socketPath(channelName, readerUuid);
                        client = new net.Socket();
                        _context4.next = 4;
                        return new Promise(function (res) {
                            client.connect(pathToSocket, res);
                        });

                    case 4:
                        return _context4.abrupt('return', client);

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function openClientConnection(_x6, _x7) {
        return _ref4.apply(this, arguments);
    };
}();

/**
 * writes the new message to the file-system
 * so other readers can find it
 */
export var writeMessage = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(channelName, readerUuid, messageJson) {
        var time, writeObject, token, fileName, msgPath;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        time = new Date().getTime();
                        writeObject = {
                            uuid: readerUuid,
                            time: time,
                            data: messageJson
                        };
                        token = randomToken(12);
                        fileName = time + '_' + readerUuid + '_' + token + '.json';
                        msgPath = path.join(getPaths(channelName).messages, fileName);
                        _context5.next = 7;
                        return writeFile(msgPath, JSON.stringify(writeObject));

                    case 7:
                        return _context5.abrupt('return', {
                            time: time,
                            uuid: readerUuid,
                            token: token,
                            path: msgPath
                        });

                    case 8:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function writeMessage(_x8, _x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

/**
 * returns the uuids of all readers
 * @return {string[]}
 */
export var getReadersUuids = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(channelName) {
        var readersPath, files;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        readersPath = getPaths(channelName).readers;
                        _context6.next = 3;
                        return readdir(readersPath);

                    case 3:
                        files = _context6.sent;
                        return _context6.abrupt('return', files.map(function (file) {
                            return file.split('.');
                        }).filter(function (split) {
                            return split[1] === 'json';
                        }) // do not scan .socket-files
                        .map(function (split) {
                            return split[0];
                        }));

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function getReadersUuids(_x11) {
        return _ref6.apply(this, arguments);
    };
}();

export var messagePath = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(channelName, time, token, writerUuid) {
        var fileName, msgPath;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        fileName = time + '_' + writerUuid + '_' + token + '.json';
                        msgPath = path.join(getPaths(channelName).messages, fileName);
                        return _context7.abrupt('return', msgPath);

                    case 3:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function messagePath(_x12, _x13, _x14, _x15) {
        return _ref7.apply(this, arguments);
    };
}();

export var getAllMessages = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(channelName) {
        var messagesPath, files;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        messagesPath = getPaths(channelName).messages;
                        _context8.next = 3;
                        return readdir(messagesPath);

                    case 3:
                        files = _context8.sent;
                        return _context8.abrupt('return', files.map(function (file) {
                            var fileName = file.split('.')[0];
                            var split = fileName.split('_');

                            return {
                                path: path.join(messagesPath, file),
                                time: parseInt(split[0]),
                                senderUuid: split[1],
                                token: split[2]
                            };
                        }));

                    case 5:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function getAllMessages(_x16) {
        return _ref8.apply(this, arguments);
    };
}();

export function getSingleMessage(channelName, msgObj) {
    var messagesPath = getPaths(channelName).messages;

    return {
        path: path.join(messagesPath, msgObj.t + '_' + msgObj.u + '_' + msgObj.to + '.json'),
        time: msgObj.t,
        senderUuid: msgObj.u,
        token: msgObj.to
    };
}

export var readMessage = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(messageObj) {
        var content;
        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return readFile(messageObj.path, 'utf8');

                    case 2:
                        content = _context9.sent;
                        return _context9.abrupt('return', JSON.parse(content));

                    case 4:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function readMessage(_x17) {
        return _ref9.apply(this, arguments);
    };
}();

export var cleanOldMessages = function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(messageObjects, ttl) {
        var olderThen;
        return _regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        olderThen = new Date().getTime() - ttl;
                        _context10.next = 3;
                        return Promise.all(messageObjects.filter(function (obj) {
                            return obj.time < olderThen;
                        }).map(function (obj) {
                            return unlink(obj.path)['catch'](function () {
                                return null;
                            });
                        }));

                    case 3:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    return function cleanOldMessages(_x18, _x19) {
        return _ref10.apply(this, arguments);
    };
}();

export var type = 'node';

export var create = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(channelName) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var uuid, _ref12, otherReaderUuids, socketEE, infoFilePath, otherReaderClients, readQueue, writeQueue, state;

        return _regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        options = fillOptionsWithDefaults(options);

                        _context12.next = 3;
                        return ensureFoldersExist(channelName);

                    case 3:
                        uuid = randomToken(10);
                        _context12.next = 6;
                        return Promise.all([getReadersUuids(channelName), createSocketEventEmitter(channelName, uuid), createSocketInfoFile(channelName, uuid)]);

                    case 6:
                        _ref12 = _context12.sent;
                        otherReaderUuids = _ref12[0];
                        socketEE = _ref12[1];
                        infoFilePath = _ref12[2];
                        otherReaderClients = {};
                        _context12.next = 13;
                        return Promise.all(otherReaderUuids.filter(function (readerUuid) {
                            return readerUuid !== uuid;
                        }) // not own
                        .map(function () {
                            var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(readerUuid) {
                                var client;
                                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                                    while (1) {
                                        switch (_context11.prev = _context11.next) {
                                            case 0:
                                                _context11.next = 2;
                                                return openClientConnection(channelName, readerUuid);

                                            case 2:
                                                client = _context11.sent;

                                                otherReaderClients[readerUuid] = client;

                                            case 4:
                                            case 'end':
                                                return _context11.stop();
                                        }
                                    }
                                }, _callee11, _this);
                            }));

                            return function (_x22) {
                                return _ref13.apply(this, arguments);
                            };
                        }()));

                    case 13:

                        // ensures we do not read messages in parrallel
                        readQueue = new IdleQueue(1);
                        writeQueue = new IdleQueue(1);
                        state = {
                            channelName: channelName,
                            options: options,
                            uuid: uuid,
                            socketEE: socketEE,
                            infoFilePath: infoFilePath,
                            // contains all messages that have been emitted before
                            emittedMessagesIds: new Set(),
                            messagesCallbackTime: null,
                            messagesCallback: null,
                            readQueue: readQueue,
                            writeQueue: writeQueue,
                            otherReaderUuids: otherReaderUuids,
                            otherReaderClients: otherReaderClients,
                            // ensure if process crashes, everything is cleaned up
                            removeUnload: unload.add(function () {
                                return close(state);
                            })
                        };

                        // when new message comes in, we read it and emit it

                        socketEE.emitter.on('data', function (data) {
                            var obj = JSON.parse(data);
                            if (obj.a === 'msg') {
                                handleMessagePing(state, obj.d);
                                return;
                            }
                        });

                        return _context12.abrupt('return', state);

                    case 18:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    }));

    return function create(_x20) {
        return _ref11.apply(this, arguments);
    };
}();

/**
 * when the socket pings, so that we now new messages came,
 * run this
 */
export var handleMessagePing = function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14(state) {
        var _this2 = this;

        var msgObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return _regeneratorRuntime.wrap(function _callee14$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        if (state.messagesCallback) {
                            _context15.next = 2;
                            break;
                        }

                        return _context15.abrupt('return');

                    case 2:
                        _context15.next = 4;
                        return state.readQueue.requestIdlePromise();

                    case 4:
                        _context15.next = 6;
                        return state.readQueue.wrapCall(_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13() {
                            var messages, useMessages, _loop, _iterator, _isArray, _i, _ref16, _ret;

                            return _regeneratorRuntime.wrap(function _callee13$(_context14) {
                                while (1) {
                                    switch (_context14.prev = _context14.next) {
                                        case 0:
                                            messages = void 0;

                                            if (msgObj) {
                                                _context14.next = 7;
                                                break;
                                            }

                                            _context14.next = 4;
                                            return getAllMessages(state.channelName);

                                        case 4:
                                            messages = _context14.sent;
                                            _context14.next = 8;
                                            break;

                                        case 7:
                                            // get single message
                                            messages = [getSingleMessage(state.channelName, msgObj)];

                                        case 8:
                                            useMessages = messages.filter(function (msgObj) {
                                                return msgObj.senderUuid !== state.uuid;
                                            }) // not send by own
                                            .filter(function (msgObj) {
                                                return !state.emittedMessagesIds.has(msgObj.token);
                                            }) // not already emitted
                                            .filter(function (msgObj) {
                                                return msgObj.time >= state.messagesCallbackTime;
                                            }) // not older then onMessageCallback
                                            .sort(function (msgObjA, msgObjB) {
                                                return msgObjA.time - msgObjB.time;
                                            }); // sort by time    

                                            if (!state.messagesCallback) {
                                                _context14.next = 18;
                                                break;
                                            }

                                            _loop = /*#__PURE__*/_regeneratorRuntime.mark(function _loop() {
                                                var msgObj, content;
                                                return _regeneratorRuntime.wrap(function _loop$(_context13) {
                                                    while (1) {
                                                        switch (_context13.prev = _context13.next) {
                                                            case 0:
                                                                if (!_isArray) {
                                                                    _context13.next = 6;
                                                                    break;
                                                                }

                                                                if (!(_i >= _iterator.length)) {
                                                                    _context13.next = 3;
                                                                    break;
                                                                }

                                                                return _context13.abrupt('return', 'break');

                                                            case 3:
                                                                _ref16 = _iterator[_i++];
                                                                _context13.next = 10;
                                                                break;

                                                            case 6:
                                                                _i = _iterator.next();

                                                                if (!_i.done) {
                                                                    _context13.next = 9;
                                                                    break;
                                                                }

                                                                return _context13.abrupt('return', 'break');

                                                            case 9:
                                                                _ref16 = _i.value;

                                                            case 10:
                                                                msgObj = _ref16;
                                                                _context13.next = 13;
                                                                return readMessage(msgObj);

                                                            case 13:
                                                                content = _context13.sent;

                                                                state.emittedMessagesIds.add(msgObj.token);
                                                                setTimeout(function () {
                                                                    return state.emittedMessagesIds['delete'](msgObj.token);
                                                                }, state.options.node.ttl * 2);

                                                                if (state.messagesCallback) {
                                                                    state.messagesCallback(content.data);
                                                                }

                                                            case 17:
                                                            case 'end':
                                                                return _context13.stop();
                                                        }
                                                    }
                                                }, _loop, _this2);
                                            });
                                            _iterator = useMessages, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                                        case 12:
                                            return _context14.delegateYield(_loop(), 't0', 13);

                                        case 13:
                                            _ret = _context14.t0;

                                            if (!(_ret === 'break')) {
                                                _context14.next = 16;
                                                break;
                                            }

                                            return _context14.abrupt('break', 18);

                                        case 16:
                                            _context14.next = 12;
                                            break;

                                        case 18:
                                        case 'end':
                                            return _context14.stop();
                                    }
                                }
                            }, _callee13, _this2);
                        })));

                    case 6:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee14, this);
    }));

    return function handleMessagePing(_x23) {
        return _ref14.apply(this, arguments);
    };
}();

export var refreshReaderClients = function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(channelState) {
        var _this3 = this;

        var otherReaders;
        return _regeneratorRuntime.wrap(function _callee16$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        _context17.next = 2;
                        return getReadersUuids(channelState.channelName);

                    case 2:
                        otherReaders = _context17.sent;


                        // remove subscriptions to closed readers
                        Object.keys(channelState.otherReaderClients).filter(function (readerUuid) {
                            return !otherReaders.includes(readerUuid);
                        }).forEach(function (readerUuid) {
                            channelState.otherReaderClients[readerUuid].destroy();
                            delete channelState.otherReaderClients[readerUuid];
                        });

                        _context17.next = 6;
                        return Promise.all(otherReaders.filter(function (readerUuid) {
                            return readerUuid !== channelState.uuid;
                        }) // not own
                        .filter(function (readerUuid) {
                            return !channelState.otherReaderClients[readerUuid];
                        }) // not already has client
                        .map(function () {
                            var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(readerUuid) {
                                var client;
                                return _regeneratorRuntime.wrap(function _callee15$(_context16) {
                                    while (1) {
                                        switch (_context16.prev = _context16.next) {
                                            case 0:
                                                _context16.next = 2;
                                                return openClientConnection(channelState.channelName, readerUuid);

                                            case 2:
                                                client = _context16.sent;

                                                channelState.otherReaderClients[readerUuid] = client;

                                            case 4:
                                            case 'end':
                                                return _context16.stop();
                                        }
                                    }
                                }, _callee15, _this3);
                            }));

                            return function (_x26) {
                                return _ref18.apply(this, arguments);
                            };
                        }()));

                    case 6:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _callee16, this);
    }));

    return function refreshReaderClients(_x25) {
        return _ref17.apply(this, arguments);
    };
}();

export var postMessage = function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18(channelState, messageJson) {
        var _this4 = this;

        return _regeneratorRuntime.wrap(function _callee18$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        _context19.next = 2;
                        return channelState.writeQueue.requestIdlePromise();

                    case 2:
                        _context19.next = 4;
                        return channelState.writeQueue.wrapCall(_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17() {
                            var msgObj, pingObj, messages;
                            return _regeneratorRuntime.wrap(function _callee17$(_context18) {
                                while (1) {
                                    switch (_context18.prev = _context18.next) {
                                        case 0:
                                            _context18.next = 2;
                                            return refreshReaderClients(channelState);

                                        case 2:
                                            _context18.next = 4;
                                            return writeMessage(channelState.channelName, channelState.uuid, messageJson);

                                        case 4:
                                            msgObj = _context18.sent;


                                            // ping other readers
                                            pingObj = {
                                                a: 'msg',
                                                d: {
                                                    t: msgObj.time,
                                                    u: msgObj.uuid,
                                                    to: msgObj.token
                                                }
                                            };
                                            _context18.next = 8;
                                            return Promise.all(Object.values(channelState.otherReaderClients).map(function (client) {
                                                return client.write(JSON.stringify(pingObj));
                                            }));

                                        case 8:
                                            if (!(randomInt(0, 10) === 0)) {
                                                _context18.next = 14;
                                                break;
                                            }

                                            _context18.next = 11;
                                            return getAllMessages(channelState.channelName);

                                        case 11:
                                            messages = _context18.sent;
                                            _context18.next = 14;
                                            return cleanOldMessages(messages, channelState.options.node.ttl);

                                        case 14:
                                        case 'end':
                                            return _context18.stop();
                                    }
                                }
                            }, _callee17, _this4);
                        }))

                        // emit to own eventEmitter
                        // channelState.socketEE.emitter.emit('data', JSON.parse(JSON.stringify(messageJson)));
                        );

                    case 4:
                    case 'end':
                        return _context19.stop();
                }
            }
        }, _callee18, this);
    }));

    return function postMessage(_x27, _x28) {
        return _ref19.apply(this, arguments);
    };
}();

export function onMessage(channelState, fn) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date().getTime();

    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    handleMessagePing(channelState);
}

export var close = function () {
    var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee19(channelState) {
        return _regeneratorRuntime.wrap(function _callee19$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        channelState.removeUnload();
                        channelState.socketEE.server.close();
                        channelState.socketEE.emitter.removeAllListeners();
                        channelState.readQueue.clear();
                        channelState.writeQueue.clear();

                        _context20.prev = 5;
                        _context20.next = 8;
                        return unlink(channelState.infoFilePath);

                    case 8:
                        _context20.next = 12;
                        break;

                    case 10:
                        _context20.prev = 10;
                        _context20.t0 = _context20['catch'](5);

                    case 12:

                        Object.values(channelState.otherReaderClients).forEach(function (client) {
                            return client.destroy();
                        });

                    case 13:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, _callee19, this, [[5, 10]]);
    }));

    return function close(_x30) {
        return _ref21.apply(this, arguments);
    };
}();

export function canBeUsed() {
    return isNode;
}

export function averageResponseTime() {
    return 50;
}