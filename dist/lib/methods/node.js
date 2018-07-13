'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.close = exports.postMessage = exports.refreshReaderClients = exports.handleMessagePing = exports.create = exports.type = exports.cleanOldMessages = exports.readMessage = exports.getAllMessages = exports.messagePath = exports.getReadersUuids = exports.writeMessage = exports.openClientConnection = exports.createSocketEventEmitter = exports.createSocketInfoFile = exports.ensureFoldersExist = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var ensureFoldersExist = exports.ensureFoldersExist = function () {
    var _ref = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee(channelName) {
        var paths;
        return _regenerator2['default'].wrap(function _callee$(_context) {
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

/**
 * Because it is not possible to get all socket-files in a folder,
 * when used under fucking windows,
 * we have to set a normal file so other readers know our socket exists
 */
var createSocketInfoFile = exports.createSocketInfoFile = function () {
    var _ref2 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee2(channelName, readerUuid) {
        var pathToFile;
        return _regenerator2['default'].wrap(function _callee2$(_context2) {
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


var createSocketEventEmitter = exports.createSocketEventEmitter = function () {
    var _ref3 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee3(channelName, readerUuid) {
        var pathToSocket, emitter, server;
        return _regenerator2['default'].wrap(function _callee3$(_context3) {
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

var openClientConnection = exports.openClientConnection = function () {
    var _ref4 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee4(channelName, readerUuid) {
        var pathToSocket, client;
        return _regenerator2['default'].wrap(function _callee4$(_context4) {
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


var writeMessage = exports.writeMessage = function () {
    var _ref5 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee5(channelName, readerUuid, messageJson) {
        var time, writeObject, token, fileName, msgPath;
        return _regenerator2['default'].wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        time = new Date().getTime();
                        writeObject = {
                            uuid: readerUuid,
                            time: time,
                            data: messageJson
                        };
                        token = (0, _util2.randomToken)(12);
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


var getReadersUuids = exports.getReadersUuids = function () {
    var _ref6 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee6(channelName) {
        var readersPath, files;
        return _regenerator2['default'].wrap(function _callee6$(_context6) {
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

var messagePath = exports.messagePath = function () {
    var _ref7 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee7(channelName, time, token, writerUuid) {
        var fileName, msgPath;
        return _regenerator2['default'].wrap(function _callee7$(_context7) {
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

var getAllMessages = exports.getAllMessages = function () {
    var _ref8 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee8(channelName) {
        var messagesPath, files;
        return _regenerator2['default'].wrap(function _callee8$(_context8) {
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

var readMessage = exports.readMessage = function () {
    var _ref9 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee9(messageObj) {
        var content;
        return _regenerator2['default'].wrap(function _callee9$(_context9) {
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

var cleanOldMessages = exports.cleanOldMessages = function () {
    var _ref10 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee10(messageObjects, ttl) {
        var olderThen;
        return _regenerator2['default'].wrap(function _callee10$(_context10) {
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

var create = exports.create = function () {
    var _ref11 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee11(channelName) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var uuid, _ref12, _ref13, otherReaderUuids, socketEE, infoFilePath, readQueue, writeQueue, state;

        return _regenerator2['default'].wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        options = (0, _options.fillOptionsWithDefaults)(options);

                        _context11.next = 3;
                        return ensureFoldersExist(channelName);

                    case 3:
                        uuid = (0, _util2.randomToken)(10);
                        _context11.next = 6;
                        return Promise.all([getReadersUuids(channelName), createSocketEventEmitter(channelName, uuid), createSocketInfoFile(channelName, uuid)]);

                    case 6:
                        _ref12 = _context11.sent;
                        _ref13 = (0, _slicedToArray3['default'])(_ref12, 3);
                        otherReaderUuids = _ref13[0];
                        socketEE = _ref13[1];
                        infoFilePath = _ref13[2];


                        // ensures we do not read messages in parrallel
                        readQueue = new _customIdleQueue2['default'](1);
                        writeQueue = new _customIdleQueue2['default'](1);
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
                            otherReaderClients: {},
                            // ensure if process crashes, everything is cleaned up
                            removeUnload: _unload2['default'].add(function () {
                                return close(state);
                            }),
                            closed: false
                        };
                        _context11.next = 16;
                        return refreshReaderClients(state);

                    case 16:

                        // when new message comes in, we read it and emit it
                        socketEE.emitter.on('data', function (data) {
                            var obj = JSON.parse(data);
                            if (obj.a === 'msg') {
                                handleMessagePing(state, obj.d);
                                return;
                            }
                        });

                        return _context11.abrupt('return', state);

                    case 18:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, this);
    }));

    return function create(_x21) {
        return _ref11.apply(this, arguments);
    };
}();

/**
 * when the socket pings, so that we now new messages came,
 * run this
 */


var handleMessagePing = exports.handleMessagePing = function () {
    var _ref14 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee13(state) {
        var _this = this;

        var msgObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return _regenerator2['default'].wrap(function _callee13$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        if (state.messagesCallback) {
                            _context14.next = 2;
                            break;
                        }

                        return _context14.abrupt('return');

                    case 2:
                        _context14.next = 4;
                        return state.readQueue.requestIdlePromise();

                    case 4:
                        _context14.next = 6;
                        return state.readQueue.wrapCall((0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee12() {
                            var messages, useMessages, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

                            return _regenerator2['default'].wrap(function _callee12$(_context13) {
                                while (1) {
                                    switch (_context13.prev = _context13.next) {
                                        case 0:
                                            messages = void 0;

                                            if (msgObj) {
                                                _context13.next = 7;
                                                break;
                                            }

                                            _context13.next = 4;
                                            return getAllMessages(state.channelName);

                                        case 4:
                                            messages = _context13.sent;
                                            _context13.next = 8;
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
                                                _context13.next = 35;
                                                break;
                                            }

                                            _iteratorNormalCompletion = true;
                                            _didIteratorError = false;
                                            _iteratorError = undefined;
                                            _context13.prev = 13;
                                            _loop = /*#__PURE__*/_regenerator2['default'].mark(function _loop() {
                                                var msgObj, content;
                                                return _regenerator2['default'].wrap(function _loop$(_context12) {
                                                    while (1) {
                                                        switch (_context12.prev = _context12.next) {
                                                            case 0:
                                                                msgObj = _step.value;
                                                                _context12.next = 3;
                                                                return readMessage(msgObj);

                                                            case 3:
                                                                content = _context12.sent;

                                                                state.emittedMessagesIds.add(msgObj.token);
                                                                setTimeout(function () {
                                                                    return state.emittedMessagesIds['delete'](msgObj.token);
                                                                }, state.options.node.ttl * 2);

                                                                if (state.messagesCallback) {
                                                                    state.messagesCallback(content.data);
                                                                }

                                                            case 7:
                                                            case 'end':
                                                                return _context12.stop();
                                                        }
                                                    }
                                                }, _loop, _this);
                                            });
                                            _iterator = useMessages[Symbol.iterator]();

                                        case 16:
                                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                                _context13.next = 21;
                                                break;
                                            }

                                            return _context13.delegateYield(_loop(), 't0', 18);

                                        case 18:
                                            _iteratorNormalCompletion = true;
                                            _context13.next = 16;
                                            break;

                                        case 21:
                                            _context13.next = 27;
                                            break;

                                        case 23:
                                            _context13.prev = 23;
                                            _context13.t1 = _context13['catch'](13);
                                            _didIteratorError = true;
                                            _iteratorError = _context13.t1;

                                        case 27:
                                            _context13.prev = 27;
                                            _context13.prev = 28;

                                            if (!_iteratorNormalCompletion && _iterator['return']) {
                                                _iterator['return']();
                                            }

                                        case 30:
                                            _context13.prev = 30;

                                            if (!_didIteratorError) {
                                                _context13.next = 33;
                                                break;
                                            }

                                            throw _iteratorError;

                                        case 33:
                                            return _context13.finish(30);

                                        case 34:
                                            return _context13.finish(27);

                                        case 35:
                                        case 'end':
                                            return _context13.stop();
                                    }
                                }
                            }, _callee12, _this, [[13, 23, 27, 35], [28,, 30, 34]]);
                        })));

                    case 6:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee13, this);
    }));

    return function handleMessagePing(_x23) {
        return _ref14.apply(this, arguments);
    };
}();

var refreshReaderClients = exports.refreshReaderClients = function () {
    var _ref16 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee16(channelState) {
        var _this2 = this;

        var otherReaders;
        return _regenerator2['default'].wrap(function _callee16$(_context17) {
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
                        }).forEach(function () {
                            var _ref17 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee14(readerUuid) {
                                return _regenerator2['default'].wrap(function _callee14$(_context15) {
                                    while (1) {
                                        switch (_context15.prev = _context15.next) {
                                            case 0:
                                                _context15.prev = 0;
                                                _context15.next = 3;
                                                return channelState.otherReaderClients[readerUuid].destroy();

                                            case 3:
                                                _context15.next = 7;
                                                break;

                                            case 5:
                                                _context15.prev = 5;
                                                _context15.t0 = _context15['catch'](0);

                                            case 7:
                                                delete channelState.otherReaderClients[readerUuid];

                                            case 8:
                                            case 'end':
                                                return _context15.stop();
                                        }
                                    }
                                }, _callee14, _this2, [[0, 5]]);
                            }));

                            return function (_x25) {
                                return _ref17.apply(this, arguments);
                            };
                        }());

                        _context17.next = 6;
                        return Promise.all(otherReaders.filter(function (readerUuid) {
                            return readerUuid !== channelState.uuid;
                        }) // not own
                        .filter(function (readerUuid) {
                            return !channelState.otherReaderClients[readerUuid];
                        }) // not already has client
                        .map(function () {
                            var _ref18 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee15(readerUuid) {
                                var client;
                                return _regenerator2['default'].wrap(function _callee15$(_context16) {
                                    while (1) {
                                        switch (_context16.prev = _context16.next) {
                                            case 0:
                                                _context16.prev = 0;

                                                if (!channelState.closed) {
                                                    _context16.next = 3;
                                                    break;
                                                }

                                                return _context16.abrupt('return');

                                            case 3:
                                                _context16.next = 5;
                                                return openClientConnection(channelState.channelName, readerUuid);

                                            case 5:
                                                client = _context16.sent;

                                                channelState.otherReaderClients[readerUuid] = client;
                                                _context16.next = 11;
                                                break;

                                            case 9:
                                                _context16.prev = 9;
                                                _context16.t0 = _context16['catch'](0);

                                            case 11:
                                            case 'end':
                                                return _context16.stop();
                                        }
                                    }
                                }, _callee15, _this2, [[0, 9]]);
                            }));

                            return function (_x26) {
                                return _ref18.apply(this, arguments);
                            };
                        }()
                        // this might throw if the other channel is closed at the same time when this one is running refresh
                        // so we do not throw an error
                        ));

                    case 6:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _callee16, this);
    }));

    return function refreshReaderClients(_x24) {
        return _ref16.apply(this, arguments);
    };
}();

var postMessage = exports.postMessage = function () {
    var _ref19 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee18(channelState, messageJson) {
        var _this3 = this;

        return _regenerator2['default'].wrap(function _callee18$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        _context19.next = 2;
                        return channelState.writeQueue.requestIdlePromise();

                    case 2:
                        _context19.next = 4;
                        return channelState.writeQueue.wrapCall((0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee17() {
                            var msgObj, pingObj, messages;
                            return _regenerator2['default'].wrap(function _callee17$(_context18) {
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
                                            return Promise.all(Object.values(channelState.otherReaderClients).filter(function (client) {
                                                return client.writable;
                                            }) // client might have closed in between
                                            .map(function (client) {
                                                return client.write(JSON.stringify(pingObj));
                                            }));

                                        case 8:
                                            if (!((0, _util2.randomInt)(0, 10) === 0)) {
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
                            }, _callee17, _this3);
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

var close = exports.close = function () {
    var _ref21 = (0, _asyncToGenerator3['default'])( /*#__PURE__*/_regenerator2['default'].mark(function _callee19(channelState) {
        return _regenerator2['default'].wrap(function _callee19$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        if (!channelState.closed) {
                            _context20.next = 2;
                            break;
                        }

                        return _context20.abrupt('return');

                    case 2:
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
                        channelState.readQueue.clear();
                        channelState.writeQueue.clear();

                        _context20.next = 10;
                        return unlink(channelState.infoFilePath)['catch'](function () {
                            return null;
                        });

                    case 10:

                        Object.values(channelState.otherReaderClients).forEach(function (client) {
                            return client.destroy();
                        });

                    case 11:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, _callee19, this);
    }));

    return function close(_x30) {
        return _ref21.apply(this, arguments);
    };
}();

exports.cleanPipeName = cleanPipeName;
exports.getPaths = getPaths;
exports.socketPath = socketPath;
exports.socketInfoPath = socketInfoPath;
exports.getSingleMessage = getSingleMessage;
exports.onMessage = onMessage;
exports.canBeUsed = canBeUsed;
exports.averageResponseTime = averageResponseTime;

var _util = require('util');

var util = _interopRequireWildcard(_util);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _os = require('os');

var os = _interopRequireWildcard(_os);

var _events = require('events');

var events = _interopRequireWildcard(_events);

var _net = require('net');

var net = _interopRequireWildcard(_net);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _jsSha = require('js-sha3');

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

var _customIdleQueue = require('custom-idle-queue');

var _customIdleQueue2 = _interopRequireDefault(_customIdleQueue);

var _unload = require('unload');

var _unload2 = _interopRequireDefault(_unload);

var _options = require('../options');

var _util2 = require('../util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * windows sucks, so we have handle windows-type of socket-paths
 * @link https://gist.github.com/domenic/2790533#gistcomment-331356
 */
/**
 * this method is used in nodejs-environments.
 * The ipc is handled via sockets and file-writes to the tmp-folder
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

var TMP_FOLDER_NAME = 'pubkey.broadcast-channel';

function getPaths(channelName) {
    var folderPathBase = path.join(os.tmpdir(), TMP_FOLDER_NAME);
    var channelPathBase = path.join(os.tmpdir(), TMP_FOLDER_NAME, (0, _jsSha.sha3_224)(channelName) // use hash incase of strange characters
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

function socketPath(channelName, readerUuid) {

    var paths = getPaths(channelName);
    var socketPath = path.join(paths.readers, readerUuid + '.s');
    return cleanPipeName(socketPath);
}

function socketInfoPath(channelName, readerUuid) {
    var paths = getPaths(channelName);
    var socketPath = path.join(paths.readers, readerUuid + '.json');
    return socketPath;
}function getSingleMessage(channelName, msgObj) {
    var messagesPath = getPaths(channelName).messages;

    return {
        path: path.join(messagesPath, msgObj.t + '_' + msgObj.u + '_' + msgObj.to + '.json'),
        time: msgObj.t,
        senderUuid: msgObj.u,
        token: msgObj.to
    };
}

var type = exports.type = 'node';

function onMessage(channelState, fn) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date().getTime();

    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    handleMessagePing(channelState);
}

function canBeUsed() {
    return _detectNode2['default'];
}

function averageResponseTime() {
    return 50;
}