/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 */

const isNode = require('detect-node');

import {
    sleep,
    randomInt,
    randomToken
} from '../util.js';

import {
    fillOptionsWithDefaults
} from '../options';

const DB_PREFIX = 'pubkey.broadcast-channel-0-';
const OBJECT_STORE_ID = 'messages';

export const type = 'idb';

export function getIdb() {
    if (typeof indexedDB !== 'undefined') return indexedDB;
    if (typeof mozIndexedDB !== 'undefined') return mozIndexedDB;
    if (typeof webkitIndexedDB !== 'undefined') return webkitIndexedDB;
    if (typeof msIndexedDB !== 'undefined') return msIndexedDB;

    return false;
}

export function createDatabase(channelName) {
    const IndexedDB = getIdb();

    // create table
    const dbName = DB_PREFIX + channelName;
    const openRequest = IndexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = ev => {
        const db = ev.target.result;
        db.createObjectStore(OBJECT_STORE_ID, {
            keyPath: 'id',
            autoIncrement: true
        });
    };
    const dbPromise = new Promise((res, rej) => {
        openRequest.onerror = ev => rej(ev);
        openRequest.onsuccess = () => {
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
    const time = new Date().getTime();
    const writeObject = {
        uuid: readerUuid,
        time,
        data: messageJson
    };

    const transaction = db.transaction([OBJECT_STORE_ID], 'readwrite');

    return new Promise((res, rej) => {
        transaction.oncomplete = () => res();
        transaction.onerror = ev => rej(ev);

        const objectStore = transaction.objectStore(OBJECT_STORE_ID);
        objectStore.add(writeObject);
    });
}

export function getAllMessages(db) {
    const objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
    const ret = [];
    return new Promise(res => {
        objectStore.openCursor().onsuccess = ev => {
            const cursor = ev.target.result;
            if (cursor) {
                ret.push(cursor.value);
                //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                cursor.continue();
            } else {
                res(ret);
            }
        };
    });
}

export function getMessagesHigherThen(db, lastCursorId) {
    const objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
    const ret = [];
    const keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
    return new Promise(res => {
        objectStore.openCursor(keyRangeValue).onsuccess = ev => {
            const cursor = ev.target.result;
            if (cursor) {
                ret.push(cursor.value);
                //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                cursor.continue();
            } else {
                res(ret);
            }
        };
    });
}

export function removeMessageById(db, id) {
    const request = db.transaction([OBJECT_STORE_ID], 'readwrite')
        .objectStore(OBJECT_STORE_ID)
        .delete(id);
    return new Promise(res => {
        request.onsuccess = () => res();
    });
}

export function getOldMessages(db, ttl) {
    const olderThen = new Date().getTime() - ttl;
    const objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
    const ret = [];
    return new Promise(res => {
        objectStore.openCursor().onsuccess = ev => {
            const cursor = ev.target.result;
            if (cursor) {
                const msgObk = cursor.value;
                if (msgObk.time < olderThen) {
                    ret.push(msgObk);
                    //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                    cursor.continue();
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
    return getOldMessages(db, ttl)
        .then(tooOld => {
            return Promise.all(
                tooOld.map(msgObj => removeMessageById(db, msgObj.id))
            );
        });
}

export function create(channelName, options) {
    options = fillOptionsWithDefaults(options);

    const uuid = randomToken(10);

    return createDatabase(channelName).then(db => {
        const state = {
            closed: false,
            lastCursorId: 0,
            channelName,
            options,
            uuid,
            // contains all messages that have been emitted before
            emittedMessagesIds: new Set(),
            messagesCallback: null,
            readQueuePromises: [],
            db
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

    return readNewMessages(state)
        .then(() => sleep(state.options.idb.fallbackInterval))
        .then(() => _readLoop(state));
}

/**
 * reads all new messages from the database and emits them
 */
function readNewMessages(state) {
    return getMessagesHigherThen(state.db, state.lastCursorId)
        .then(newerMessages => {
            const useMessages = newerMessages
                .map(msgObj => {
                    if (msgObj.id > state.lastCursorId) {
                        state.lastCursorId = msgObj.id;
                    }
                    return msgObj;
                })
                .filter(msgObj => msgObj.uuid !== state.uuid) // not send by own
                .filter(msgObj => !state.emittedMessagesIds.has(msgObj.id)) // not already emitted
                .filter(msgObj => msgObj.time >= state.messagesCallbackTime) // not older then onMessageCallback
                .sort((msgObjA, msgObjB) => msgObjA.time - msgObjB.time); // sort by time


            useMessages.forEach(msgObj => {
                if (state.messagesCallback) {
                    state.emittedMessagesIds.add(msgObj.id);
                    setTimeout(
                        () => state.emittedMessagesIds.delete(msgObj.id),
                        state.options.idb.ttl * 2
                    );

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
    return writeMessage(
        channelState.db,
        channelState.uuid,
        messageJson
    ).then(() => {
        if (randomInt(0, 10) === 0) {
            /* await (do not await) */ cleanOldMessages(
                channelState.db,
                channelState.options.idb.ttl
            );
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
    const idb = getIdb();

    if (!idb) return false;
    return true;
};
