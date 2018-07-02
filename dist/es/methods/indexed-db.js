/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 */

var isNode = require('detect-node');

import { sleep, randomInt, randomToken } from '../util.js';

import { fillOptionsWithDefaults } from '../options';

var DB_PREFIX = 'pubkey.broadcast-channel-0-';
var OBJECT_STORE_ID = 'messages';

export var type = 'idb';

export function getIdb() {
    if (typeof indexedDB !== 'undefined') return indexedDB;
    if (typeof mozIndexedDB !== 'undefined') return mozIndexedDB;
    if (typeof webkitIndexedDB !== 'undefined') return webkitIndexedDB;
    if (typeof msIndexedDB !== 'undefined') return msIndexedDB;

    return false;
}

export function createDatabase(channelName) {
    var IndexedDB = getIdb();

    // create table
    var dbName = DB_PREFIX + channelName;
    var openRequest = IndexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = function (ev) {
        var db = ev.target.result;
        db.createObjectStore(OBJECT_STORE_ID, {
            keyPath: 'id',
            autoIncrement: true
        });
    };
    var dbPromise = new Promise(function (res, rej) {
        openRequest.onerror = function (ev) {
            return rej(ev);
        };
        openRequest.onsuccess = function () {
            res(openRequest.result);
        };
    });

    return dbPromise;
}

/**
 * writes the new message to the database
 * so other readers can find it
 */
export function writeMessage(db, readerUuid, messageJson) {
    var time = new Date().getTime();
    var writeObject = {
        uuid: readerUuid,
        time: time,
        data: messageJson
    };

    var transaction = db.transaction([OBJECT_STORE_ID], 'readwrite');

    return new Promise(function (res, rej) {
        transaction.oncomplete = function () {
            return res();
        };
        transaction.onerror = function (ev) {
            return rej(ev);
        };

        var objectStore = transaction.objectStore(OBJECT_STORE_ID);
        objectStore.add(writeObject);
    });
}

export function getAllMessages(db) {
    var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
    var ret = [];
    return new Promise(function (res) {
        objectStore.openCursor().onsuccess = function (ev) {
            var cursor = ev.target.result;
            if (cursor) {
                ret.push(cursor.value);
                //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                cursor['continue']();
            } else {
                res(ret);
            }
        };
    });
}

export function getMessagesHigherThen(db, lastCursorId) {
    var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
    var ret = [];
    var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
    return new Promise(function (res) {
        objectStore.openCursor(keyRangeValue).onsuccess = function (ev) {
            var cursor = ev.target.result;
            if (cursor) {
                ret.push(cursor.value);
                //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                cursor['continue']();
            } else {
                res(ret);
            }
        };
    });
}

export function removeMessageById(db, id) {
    var request = db.transaction([OBJECT_STORE_ID], 'readwrite').objectStore(OBJECT_STORE_ID)['delete'](id);
    return new Promise(function (res) {
        request.onsuccess = function () {
            return res();
        };
    });
}

export function getOldMessages(db, ttl) {
    var olderThen = new Date().getTime() - ttl;
    var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
    var ret = [];
    return new Promise(function (res) {
        objectStore.openCursor().onsuccess = function (ev) {
            var cursor = ev.target.result;
            if (cursor) {
                var msgObk = cursor.value;
                if (msgObk.time < olderThen) {
                    ret.push(msgObk);
                    //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                    cursor['continue']();
                } else {
                    // no more old messages,
                    res(ret);
                    return;
                }
            } else {
                res(ret);
            }
        };
    });
}

export function cleanOldMessages(db, ttl) {
    return getOldMessages(db, ttl).then(function (tooOld) {
        return Promise.all(tooOld.map(function (msgObj) {
            return removeMessageById(db, msgObj.id);
        }));
    });
}

export function create(channelName, options) {
    options = fillOptionsWithDefaults(options);

    var uuid = randomToken(10);

    return createDatabase(channelName).then(function (db) {
        var state = {
            closed: false,
            lastCursorId: 0,
            channelName: channelName,
            options: options,
            uuid: uuid,
            // contains all messages that have been emitted before
            emittedMessagesIds: new Set(),
            messagesCallback: null,
            readQueuePromises: [],
            db: db
        };

        /**
         * if service-workers are used,
         * we have no 'storage'-event if they post a message,
         * therefore we also have to set an interval
         */
        _readLoop(state);

        return state;
    });
}

function _readLoop(state) {
    if (state.closed) return;

    return readNewMessages(state).then(function () {
        return sleep(state.options.idb.fallbackInterval);
    }).then(function () {
        return _readLoop(state);
    });
}

/**
 * reads all new messages from the database and emits them
 */
function readNewMessages(state) {
    return getMessagesHigherThen(state.db, state.lastCursorId).then(function (newerMessages) {
        var useMessages = newerMessages.map(function (msgObj) {
            if (msgObj.id > state.lastCursorId) {
                state.lastCursorId = msgObj.id;
            }
            return msgObj;
        }).filter(function (msgObj) {
            return msgObj.uuid !== state.uuid;
        }) // not send by own
        .filter(function (msgObj) {
            return !state.emittedMessagesIds.has(msgObj.id);
        }) // not already emitted
        .filter(function (msgObj) {
            return msgObj.time >= state.messagesCallbackTime;
        }) // not older then onMessageCallback
        .sort(function (msgObjA, msgObjB) {
            return msgObjA.time - msgObjB.time;
        }); // sort by time


        useMessages.forEach(function (msgObj) {
            if (state.messagesCallback) {
                state.emittedMessagesIds.add(msgObj.id);
                setTimeout(function () {
                    return state.emittedMessagesIds['delete'](msgObj.id);
                }, state.options.idb.ttl * 2);

                state.messagesCallback(msgObj.data);
            }
        });

        return Promise.resolve();
    });
}

export function close(channelState) {
    channelState.closed = true;
    channelState.db.close();
}

export function postMessage(channelState, messageJson) {
    return writeMessage(channelState.db, channelState.uuid, messageJson).then(function () {
        if (randomInt(0, 10) === 0) {
            /* await (do not await) */cleanOldMessages(channelState.db, channelState.options.idb.ttl);
        }
    });
}

export function onMessage(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    readNewMessages(channelState);
}

export function canBeUsed() {
    if (isNode) return false;
    var idb = getIdb();

    if (!idb) return false;
    return true;
};