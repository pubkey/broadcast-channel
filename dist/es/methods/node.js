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

var getPathsCache = new Map();
export function getPaths(channelName) {
    if (!getPathsCache.has(channelName)) {
        var folderPathBase = path.join(os.tmpdir(), TMP_FOLDER_NAME);
        var channelPathBase = path.join(os.tmpdir(), TMP_FOLDER_NAME, sha3_224(channelName) // use hash incase of strange characters
        );
        var folderPathReaders = path.join(channelPathBase, 'readers');
        var folderPathMessages = path.join(channelPathBase, 'messages');

        var ret = {
            base: folderPathBase,
            channelBase: channelPathBase,
            readers: folderPathReaders,
            messages: folderPathMessages
        };
        getPathsCache.set(channelName, ret);
        return ret;
    }
    return getPathsCache.get(channelName);
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
export function createSocketInfoFile(channelName, readerUuid) {
    var pathToFile = socketInfoPath(channelName, readerUuid);
    return writeFile(pathToFile, JSON.stringify({
        time: new Date().getTime()
    })).then(function () {
        return pathToFile;
    });
}

/**
 * creates the socket-file and subscribes to it
 * @return {{emitter: EventEmitter, server: any}}
 */
export var createSocketEventEmitter = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(channelName, readerUuid) {
        var pathToSocket, emitter, server;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
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
                        _context2.next = 5;
                        return new Promise(function (res) {
                            server.listen(pathToSocket, function () {
                                res();
                            });
                        });

                    case 5:
                        server.on('connection', function () {
                            // console.log('server: Client connected.');
                        });

                        return _context2.abrupt('return', {
                            path: pathToSocket,
                            emitter: emitter,
                            server: server
                        });

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function createSocketEventEmitter(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();

export var openClientConnection = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(channelName, readerUuid) {
        var pathToSocket, client;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        pathToSocket = socketPath(channelName, readerUuid);
                        client = new net.Socket();
                        _context3.next = 4;
                        return new Promise(function (res) {
                            client.connect(pathToSocket, res);
                        });

                    case 4:
                        return _context3.abrupt('return', client);

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function openClientConnection(_x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}();

/**
 * writes the new message to the file-system
 * so other readers can find it
 */
export var writeMessage = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(channelName, readerUuid, messageJson) {
        var time, writeObject, token, fileName, msgPath;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
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
                        _context4.next = 7;
                        return writeFile(msgPath, JSON.stringify(writeObject));

                    case 7:
                        return _context4.abrupt('return', {
                            time: time,
                            uuid: readerUuid,
                            token: token,
                            path: msgPath
                        });

                    case 8:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function writeMessage(_x6, _x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

/**
 * returns the uuids of all readers
 * @return {string[]}
 */
export var getReadersUuids = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(channelName) {
        var readersPath, files;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        readersPath = getPaths(channelName).readers;
                        _context5.next = 3;
                        return readdir(readersPath);

                    case 3:
                        files = _context5.sent;
                        return _context5.abrupt('return', files.map(function (file) {
                            return file.split('.');
                        }).filter(function (split) {
                            return split[1] === 'json';
                        }) // do not scan .socket-files
                        .map(function (split) {
                            return split[0];
                        }));

                    case 5:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function getReadersUuids(_x9) {
        return _ref5.apply(this, arguments);
    };
}();

export var messagePath = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(channelName, time, token, writerUuid) {
        var fileName, msgPath;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        fileName = time + '_' + writerUuid + '_' + token + '.json';
                        msgPath = path.join(getPaths(channelName).messages, fileName);
                        return _context6.abrupt('return', msgPath);

                    case 3:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function messagePath(_x10, _x11, _x12, _x13) {
        return _ref6.apply(this, arguments);
    };
}();

export var getAllMessages = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(channelName) {
        var messagesPath, files;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        messagesPath = getPaths(channelName).messages;
                        _context7.next = 3;
                        return readdir(messagesPath);

                    case 3:
                        files = _context7.sent;
                        return _context7.abrupt('return', files.map(function (file) {
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
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function getAllMessages(_x14) {
        return _ref7.apply(this, arguments);
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

export function readMessage(messageObj) {
    return readFile(messageObj.path, 'utf8').then(function (content) {
        return JSON.parse(content);
    });
}

export var cleanOldMessages = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(messageObjects, ttl) {
        var olderThen;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        olderThen = new Date().getTime() - ttl;
                        _context8.next = 3;
                        return Promise.all(messageObjects.filter(function (obj) {
                            return obj.time < olderThen;
                        }).map(function (obj) {
                            return unlink(obj.path)['catch'](function () {
                                return null;
                            });
                        }));

                    case 3:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function cleanOldMessages(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();

export var type = 'node';

export var create = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(channelName) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var uuid, writeQueue, state, _ref10, socketEE, infoFilePath;

        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        options = fillOptionsWithDefaults(options);

                        _context9.next = 3;
                        return ensureFoldersExist(channelName);

                    case 3:
                        uuid = randomToken(10);

                        // ensures we do not read messages in parrallel

                        writeQueue = new IdleQueue(1);
                        state = {
                            channelName: channelName,
                            options: options,
                            uuid: uuid,
                            // contains all messages that have been emitted before
                            emittedMessagesIds: new Set(),
                            messagesCallbackTime: null,
                            messagesCallback: null,
                            writeQueue: writeQueue,
                            otherReaderClients: {},
                            // ensure if process crashes, everything is cleaned up
                            removeUnload: unload.add(function () {
                                return close(state);
                            }),
                            closed: false
                        };
                        _context9.next = 8;
                        return Promise.all([createSocketEventEmitter(channelName, uuid), createSocketInfoFile(channelName, uuid), refreshReaderClients(state)]);

                    case 8:
                        _ref10 = _context9.sent;
                        socketEE = _ref10[0];
                        infoFilePath = _ref10[1];

                        state.socketEE = socketEE;
                        state.infoFilePath = infoFilePath;

                        // when new message comes in, we read it and emit it
                        socketEE.emitter.on('data', function (data) {
                            var obj = JSON.parse(data);
                            handleMessagePing(state, obj);
                        });

                        return _context9.abrupt('return', state);

                    case 15:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function create(_x17) {
        return _ref9.apply(this, arguments);
    };
}();

export function _filterMessage(msgObj, state) {
    if (msgObj.senderUuid === state.uuid) return false; // not send by own
    if (state.emittedMessagesIds.has(msgObj.token)) return false; // not already emitted
    if (msgObj.time < state.messagesCallbackTime) return false; // not older then onMessageCallback
    return true;
}

/**
 * when the socket pings, so that we now new messages came,
 * run this
 */
export var handleMessagePing = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(state, msgObj) {
        var messages, useMessages;
        return _regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        if (state.messagesCallback) {
                            _context10.next = 2;
                            break;
                        }

                        return _context10.abrupt('return');

                    case 2:
                        messages = void 0;

                        if (msgObj) {
                            _context10.next = 9;
                            break;
                        }

                        _context10.next = 6;
                        return getAllMessages(state.channelName);

                    case 6:
                        messages = _context10.sent;
                        _context10.next = 10;
                        break;

                    case 9:
                        // get single message
                        messages = [getSingleMessage(state.channelName, msgObj)];

                    case 10:
                        useMessages = messages.filter(function (msgObj) {
                            return _filterMessage(msgObj, state);
                        }).sort(function (msgObjA, msgObjB) {
                            return msgObjA.time - msgObjB.time;
                        }); // sort by time    


                        // if no listener or message, so not do anything

                        if (!(!useMessages.length || !state.messagesCallback)) {
                            _context10.next = 13;
                            break;
                        }

                        return _context10.abrupt('return');

                    case 13:
                        _context10.next = 15;
                        return Promise.all(useMessages.map(function (msgObj) {
                            return readMessage(msgObj).then(function (content) {
                                return msgObj.content = content;
                            });
                        }));

                    case 15:

                        useMessages.forEach(function (msgObj) {
                            state.emittedMessagesIds.add(msgObj.token);
                            setTimeout(function () {
                                return state.emittedMessagesIds['delete'](msgObj.token);
                            }, state.options.node.ttl * 2);

                            if (state.messagesCallback) {
                                state.messagesCallback(msgObj.content.data);
                            }
                        });

                    case 16:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    return function handleMessagePing(_x19, _x20) {
        return _ref11.apply(this, arguments);
    };
}();

export var refreshReaderClients = function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(channelState) {
        var _this = this;

        var otherReaders;
        return _regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return getReadersUuids(channelState.channelName);

                    case 2:
                        otherReaders = _context13.sent;


                        // remove subscriptions to closed readers
                        Object.keys(channelState.otherReaderClients).filter(function (readerUuid) {
                            return !otherReaders.includes(readerUuid);
                        }).forEach(function () {
                            var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(readerUuid) {
                                return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                                    while (1) {
                                        switch (_context11.prev = _context11.next) {
                                            case 0:
                                                _context11.prev = 0;
                                                _context11.next = 3;
                                                return channelState.otherReaderClients[readerUuid].destroy();

                                            case 3:
                                                _context11.next = 7;
                                                break;

                                            case 5:
                                                _context11.prev = 5;
                                                _context11.t0 = _context11['catch'](0);

                                            case 7:
                                                delete channelState.otherReaderClients[readerUuid];

                                            case 8:
                                            case 'end':
                                                return _context11.stop();
                                        }
                                    }
                                }, _callee11, _this, [[0, 5]]);
                            }));

                            return function (_x22) {
                                return _ref13.apply(this, arguments);
                            };
                        }());

                        _context13.next = 6;
                        return Promise.all(otherReaders.filter(function (readerUuid) {
                            return readerUuid !== channelState.uuid;
                        }) // not own
                        .filter(function (readerUuid) {
                            return !channelState.otherReaderClients[readerUuid];
                        }) // not already has client
                        .map(function () {
                            var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(readerUuid) {
                                var client;
                                return _regeneratorRuntime.wrap(function _callee12$(_context12) {
                                    while (1) {
                                        switch (_context12.prev = _context12.next) {
                                            case 0:
                                                _context12.prev = 0;

                                                if (!channelState.closed) {
                                                    _context12.next = 3;
                                                    break;
                                                }

                                                return _context12.abrupt('return');

                                            case 3:
                                                _context12.next = 5;
                                                return openClientConnection(channelState.channelName, readerUuid);

                                            case 5:
                                                client = _context12.sent;

                                                channelState.otherReaderClients[readerUuid] = client;
                                                _context12.next = 11;
                                                break;

                                            case 9:
                                                _context12.prev = 9;
                                                _context12.t0 = _context12['catch'](0);

                                            case 11:
                                            case 'end':
                                                return _context12.stop();
                                        }
                                    }
                                }, _callee12, _this, [[0, 9]]);
                            }));

                            return function (_x23) {
                                return _ref14.apply(this, arguments);
                            };
                        }()
                        // this might throw if the other channel is closed at the same time when this one is running refresh
                        // so we do not throw an error
                        ));

                    case 6:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee13, this);
    }));

    return function refreshReaderClients(_x21) {
        return _ref12.apply(this, arguments);
    };
}();

export function postMessage(channelState, messageJson) {
    var _this2 = this;

    // ensure we do this not in parallel
    return channelState.writeQueue.requestIdlePromise().then(function () {
        return channelState.writeQueue.wrapCall(_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14() {
            var _ref16, msgObj, pingStr;

            return _regeneratorRuntime.wrap(function _callee14$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            _context14.next = 2;
                            return Promise.all([writeMessage(channelState.channelName, channelState.uuid, messageJson), refreshReaderClients(channelState)]);

                        case 2:
                            _ref16 = _context14.sent;
                            msgObj = _ref16[0];
                            pingStr = '{"t":' + msgObj.time + ',"u":"' + msgObj.uuid + '","to":"' + msgObj.token + '"}';
                            _context14.next = 7;
                            return Promise.all(Object.values(channelState.otherReaderClients).filter(function (client) {
                                return client.writable;
                            }) // client might have closed in between
                            .map(function (client) {
                                return new Promise(function (res) {
                                    client.write(pingStr, res);
                                });
                            }));

                        case 7:

                            /**
                             * clean up old messages
                             * to not waste resources on cleaning up,
                             * only if random-int matches, we clean up old messages
                             */
                            if (randomInt(0, 50) === 0) {
                                /* await */getAllMessages(channelState.channelName).then(function (allMessages) {
                                    return cleanOldMessages(allMessages, channelState.options.node.ttl);
                                });
                            }

                            // emit to own eventEmitter
                            // channelState.socketEE.emitter.emit('data', JSON.parse(JSON.stringify(messageJson)));

                        case 8:
                        case 'end':
                            return _context14.stop();
                    }
                }
            }, _callee14, _this2);
        })));
    });
}

export function onMessage(channelState, fn) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date().getTime();

    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    handleMessagePing(channelState);
}

export function close(channelState) {
    if (channelState.closed) return;
    channelState.closed = true;

    if (typeof channelState.removeUnload === 'function') channelState.removeUnload();

    /**
     * the server get closed lazy because others might still write on it
     * and have not found out that the infoFile was deleted
     */
    setTimeout(function () {
        return channelState.socketEE.server.close();
    }, 200);

    channelState.socketEE.emitter.removeAllListeners();
    channelState.writeQueue.clear();

    Object.values(channelState.otherReaderClients).forEach(function (client) {
        return client.destroy();
    });

    unlink(channelState.infoFilePath)['catch'](function () {
        return null;
    });
}

export function canBeUsed() {
    return isNode;
}

export function averageResponseTime() {
    return 50;
}