/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 * 
 * When working on this, ensure to use these performance optimizations:
 * @link https://rxdb.info/slow-indexeddb.html
 */

import {
    sleep,
    randomInt,
    randomToken,
    microSeconds as micro,
    PROMISE_RESOLVED_VOID
} from '../util.js';

export const microSeconds = micro;
import { ObliviousSet } from 'oblivious-set';

import {
    fillOptionsWithDefaults
} from '../options.js';

const DB_PREFIX = 'pubkey.broadcast-channel-0-';
const OBJECT_STORE_ID = 'messages';

/**
 * Use relaxed durability for faster performance on all transactions.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
export const TRANSACTION_SETTINGS = { durability: 'relaxed' };

export const type = 'idb';

export function getIdb() {
    if (typeof indexedDB !== 'undefined') return indexedDB;
    if (typeof window !== 'undefined') {
        if (typeof window.mozIndexedDB !== 'undefined') return window.mozIndexedDB;
        if (typeof window.webkitIndexedDB !== 'undefined') return window.webkitIndexedDB;
        if (typeof window.msIndexedDB !== 'undefined') return window.msIndexedDB;
    }

    return false;
}


/**
 * If possible, we should explicitly commit IndexedDB transactions
 * for better performance.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
export function commitIndexedDBTransaction(tx) {
    if (tx.commit) {
        tx.commit();
    }
}


export function createDatabase(channelName) {
    const IndexedDB = getIdb();

    // create table
    const dbName = DB_PREFIX + channelName;

    /**
     * All IndexedDB databases are opened without version
     * because it is a bit faster, especially on firefox
     * @link http://nparashuram.com/IndexedDB/perf/#Open%20Database%20with%20version
     */
    const openRequest = IndexedDB.open(dbName);

    openRequest.onupgradeneeded = ev => {
        const db = ev.target.result;
        db.createObjectStore(OBJECT_STORE_ID, {
            keyPath: 'id',
            autoIncrement: true
        });
    };
    return new Promise((res, rej) => {
        openRequest.onerror = ev => rej(ev);
        openRequest.onsuccess = () => {
            res(openRequest.result);
        };
    });
}

/**
 * writes the new message to the database
 * so other readers can find it
 */
export function writeMessage(db, readerUuid, messageJson) {
    const time = Date.now();
    const writeObject = {
        uuid: readerUuid,
        time,
        data: messageJson
    };

    const tx = db.transaction([OBJECT_STORE_ID], 'readwrite', TRANSACTION_SETTINGS);

    return new Promise((res, rej) => {
        tx.oncomplete = () => res();
        tx.onerror = ev => rej(ev);

        const objectStore = tx.objectStore(OBJECT_STORE_ID);
        objectStore.add(writeObject);
        commitIndexedDBTransaction(tx);
    });
}

export function getAllMessages(db) {
    const tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
    const objectStore = tx
        .objectStore(OBJECT_STORE_ID);
    const ret = [];
    return new Promise(res => {
        objectStore.openCursor().onsuccess = ev => {
            const cursor = ev.target.result;
            if (cursor) {
                ret.push(cursor.value);
                //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
                cursor.continue();
            } else {
                commitIndexedDBTransaction(tx);
                res(ret);
            }
        };
    });
}

export function getMessagesHigherThan(db, lastCursorId) {
    const tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
    const objectStore = tx.objectStore(OBJECT_STORE_ID);
    const ret = [];


    let keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);

    /**
     * Optimization shortcut,
     * if getAll() can be used, do not use a cursor.
     * @link https://rxdb.info/slow-indexeddb.html
     */
    if (objectStore.getAll) {
        const getAllRequest = objectStore.getAll(keyRangeValue);
        return new Promise((res, rej) => {
            getAllRequest.onerror = err => rej(err);
            getAllRequest.onsuccess = function (e) {
                res(e.target.result);
            };
        });
    }

    function openCursor() {
        // Occasionally Safari will fail on IDBKeyRange.bound, this
        // catches that error, having it open the cursor to the first
        // item. When it gets data it will advance to the desired key.
        try {
            keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
            return objectStore.openCursor(keyRangeValue);
        } catch (e) {
            return objectStore.openCursor();
        }
    }

    return new Promise((res, rej) => {
        const openCursorRequest = openCursor();
        openCursorRequest.onerror = err => rej(err);
        openCursorRequest.onsuccess = ev => {
            const cursor = ev.target.result;
            if (cursor) {
                if (cursor.value.id < lastCursorId + 1) {
                    cursor.continue(lastCursorId + 1);
                } else {
                    ret.push(cursor.value);
                    cursor.continue();
                }
            } else {
                commitIndexedDBTransaction(tx);
                res(ret);
            }
        };
    });
}

export function removeMessagesById(channelState, ids) {
    if (channelState.closed) {
        return Promise.resolve([]);
    }

    const tx = channelState.db.transaction(OBJECT_STORE_ID, 'readwrite', TRANSACTION_SETTINGS);
    const objectStore = tx.objectStore(OBJECT_STORE_ID);

    return Promise.all(
        ids.map(id => {
            const deleteRequest = objectStore.delete(id);
            return new Promise(res => {
                deleteRequest.onsuccess = () => res();
            });
        })
    );
}

export function getOldMessages(db, ttl) {
    const olderThen = Date.now() - ttl;
    const tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
    const objectStore = tx.objectStore(OBJECT_STORE_ID);
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
                    commitIndexedDBTransaction(tx);
                    res(ret);
                }
            } else {
                res(ret);
            }
        };
    });
}

export function cleanOldMessages(channelState) {
    return getOldMessages(channelState.db, channelState.options.idb.ttl)
        .then(tooOld => {
            return removeMessagesById(
                channelState,
                tooOld.map(msg => msg.id)
            );
        });
}

export function create(channelName, options) {
    options = fillOptionsWithDefaults(options);

    return createDatabase(channelName).then(db => {
        const state = {
            closed: false,
            lastCursorId: 0,
            channelName,
            options,
            uuid: randomToken(),
            /**
             * emittedMessagesIds
             * contains all messages that have been emitted before
             * @type {ObliviousSet}
             */
            eMIs: new ObliviousSet(options.idb.ttl * 2),
            // ensures we do not read messages in parallel
            writeBlockPromise: PROMISE_RESOLVED_VOID,
            messagesCallback: null,
            readQueuePromises: [],
            db
        };

        /**
         * Handle abrupt closes that do not originate from db.close().
         * This could happen, for example, if the underlying storage is
         * removed or if the user clears the database in the browser's
         * history preferences.
         */
        db.onclose = function () {
            state.closed = true;

            if (options.idb.onclose) options.idb.onclose();
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

    readNewMessages(state)
        .then(() => sleep(state.options.idb.fallbackInterval))
        .then(() => _readLoop(state));
}


function _filterMessage(msgObj, state) {
    if (msgObj.uuid === state.uuid) return false; // send by own
    if (state.eMIs.has(msgObj.id)) return false; // already emitted
    if (msgObj.data.time < state.messagesCallbackTime) return false; // older then onMessageCallback
    return true;
}

/**
 * reads all new messages from the database and emits them
 */
function readNewMessages(state) {

    // channel already closed
    if (state.closed) return PROMISE_RESOLVED_VOID;

    // if no one is listening, we do not need to scan for new messages
    if (!state.messagesCallback) return PROMISE_RESOLVED_VOID;

    return getMessagesHigherThan(state.db, state.lastCursorId)
        .then(newerMessages => {
            const useMessages = newerMessages
                /**
                 * there is a bug in iOS where the msgObj can be undefined sometimes
                 * so we filter them out
                 * @link https://github.com/pubkey/broadcast-channel/issues/19
                 */
                .filter(msgObj => !!msgObj)
                .map(msgObj => {
                    if (msgObj.id > state.lastCursorId) {
                        state.lastCursorId = msgObj.id;
                    }
                    return msgObj;
                })
                .filter(msgObj => _filterMessage(msgObj, state))
                .sort((msgObjA, msgObjB) => msgObjA.time - msgObjB.time); // sort by time
            useMessages.forEach(msgObj => {
                if (state.messagesCallback) {
                    state.eMIs.add(msgObj.id);
                    state.messagesCallback(msgObj.data);
                }
            });

            return PROMISE_RESOLVED_VOID;
        });
}

export function close(channelState) {
    channelState.closed = true;
    channelState.db.close();
}

export function postMessage(channelState, messageJson) {

    channelState.writeBlockPromise = channelState.writeBlockPromise
        .then(() => writeMessage(
            channelState.db,
            channelState.uuid,
            messageJson
        ))
        .then(() => {
            if (randomInt(0, 10) === 0) {
                /* await (do not await) */
                cleanOldMessages(channelState);
            }
        });

    return channelState.writeBlockPromise;
}

export function onMessage(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    readNewMessages(channelState);
}

export function canBeUsed() {
    return !!getIdb();
}

export function averageResponseTime(options) {
    return options.idb.fallbackInterval * 2;
}

export const IndexedDBMethod = {
    create,
    close,
    onMessage,
    postMessage,
    canBeUsed,
    type,
    averageResponseTime,
    microSeconds
};
