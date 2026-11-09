/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 *
 * When working on this, ensure to use these performance optimizations:
 * @link https://rxdb.info/slow-indexeddb.html
 */

import { generateRandomId, microSeconds as micro, PROMISE_RESOLVED_VOID, randomInt, sleep } from "../util";

export const microSeconds = micro;
import { ObliviousSet } from "oblivious-set";

import { fillOptionsWithDefaults } from "../options";
import { MessageObject, Options } from "../types";

const DB_PREFIX = "pubkey.broadcast-channel-0-";
const OBJECT_STORE_ID = "messages";

/**
 * Use relaxed durability for faster performance on all transactions.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
export const TRANSACTION_SETTINGS: IDBTransactionOptions = { durability: "relaxed" };

export const type = "idb";

interface ExtendedWindow extends Window {
  mozIndexedDB?: IDBFactory;
  webkitIndexedDB?: IDBFactory;
  msIndexedDB?: IDBFactory;
}

export function getIdb(): IDBFactory | false {
  if (typeof indexedDB !== "undefined") return indexedDB;
  if (typeof window !== "undefined") {
    const extWindow = window as ExtendedWindow;
    if (typeof extWindow.mozIndexedDB !== "undefined") return extWindow.mozIndexedDB;
    if (typeof extWindow.webkitIndexedDB !== "undefined") return extWindow.webkitIndexedDB;
    if (typeof extWindow.msIndexedDB !== "undefined") return extWindow.msIndexedDB;
  }

  return false;
}

/**
 * If possible, we should explicitly commit IndexedDB transactions
 * for better performance.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
export function commitIndexedDBTransaction(tx: IDBTransaction): void {
  if (tx.commit) {
    tx.commit();
  }
}

interface Message {
  id: number;
  uuid: string;
  time: number;
  data: MessageObject;
}

export function createDatabase(channelName: string): Promise<IDBDatabase> {
  const IndexedDB = getIdb();
  if (!IndexedDB) return Promise.reject(new Error("IndexedDB not available"));

  // create table
  const dbName = DB_PREFIX + channelName;

  /**
   * All IndexedDB databases are opened without version
   * because it is a bit faster, especially on firefox
   * @link http://nparashuram.com/IndexedDB/perf/#Open%20Database%20with%20version
   */
  const openRequest = IndexedDB.open(dbName);

  openRequest.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
    const db = (ev.target as IDBOpenDBRequest).result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: "id",
      autoIncrement: true,
    });
  };
  const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    openRequest.onerror = (ev) => reject(ev);
    openRequest.onsuccess = () => {
      resolve(openRequest.result);
    };
  });

  return dbPromise;
}

/**
 * writes the new message to the database
 * so other readers can find it
 */
export function writeMessage(db: IDBDatabase, readerUuid: string, messageJson: MessageObject): Promise<void> {
  const time = Date.now();
  const writeObject = {
    uuid: readerUuid,
    time,
    data: messageJson,
  };

  const tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = (ev) => reject(ev);

    const objectStore = tx.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
    commitIndexedDBTransaction(tx);
  });
}

export function getAllMessages(db: IDBDatabase): Promise<Message[]> {
  const tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  const objectStore = tx.objectStore(OBJECT_STORE_ID);
  const ret: Message[] = [];
  return new Promise((resolve) => {
    objectStore.openCursor().onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        ret.push(cursor.value);
        cursor.continue();
      } else {
        commitIndexedDBTransaction(tx);
        resolve(ret);
      }
    };
  });
}

export function getMessagesHigherThan(db: IDBDatabase, lastCursorId: number): Promise<Message[]> {
  const tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  const objectStore = tx.objectStore(OBJECT_STORE_ID);
  const ret: Message[] = [];

  let keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);

  /**
   * Optimization shortcut,
   * if getAll() can be used, do not use a cursor.
   * @link https://rxdb.info/slow-indexeddb.html
   */
  if (objectStore.getAll) {
    const getAllRequest = objectStore.getAll(keyRangeValue);
    return new Promise<Message[]>((resolve, reject) => {
      getAllRequest.onerror = (err) => reject(err);
      getAllRequest.onsuccess = function (e) {
        resolve((e.target as IDBRequest).result);
      };
    });
  }

  function openCursor(): IDBRequest {
    // Occasionally Safari will fail on IDBKeyRange.bound, this
    // catches that error, having it open the cursor to the first
    // item. When it gets data it will advance to the desired key.
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch {
      return objectStore.openCursor();
    }
  }

  return new Promise<Message[]>((resolve, reject) => {
    const openCursorRequest = openCursor();
    openCursorRequest.onerror = (err) => reject(err);
    openCursorRequest.onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        if (cursor.value.id < lastCursorId + 1) {
          cursor.continue(lastCursorId + 1);
        } else {
          ret.push(cursor.value);
          cursor.continue();
        }
      } else {
        commitIndexedDBTransaction(tx);
        resolve(ret);
      }
    };
  });
}

export function removeMessagesById(db: IDBDatabase, ids: number[]): Promise<void[]> {
  const tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
  const objectStore = tx.objectStore(OBJECT_STORE_ID);

  return Promise.all(
    ids.map((id) => {
      const deleteRequest = objectStore.delete(id);
      return new Promise<void>((resolve) => {
        deleteRequest.onsuccess = () => resolve();
      });
    })
  );
}

export function getOldMessages(db: IDBDatabase, ttl: number): Promise<Message[]> {
  const olderThen = Date.now() - ttl;
  const tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  const objectStore = tx.objectStore(OBJECT_STORE_ID);
  const ret: Message[] = [];
  return new Promise<Message[]>((resolve) => {
    objectStore.openCursor().onsuccess = (ev) => {
      const cursor = (ev.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        const msgObk = cursor.value;
        if (msgObk.time < olderThen) {
          ret.push(msgObk);
          cursor.continue();
        } else {
          // no more old messages,
          commitIndexedDBTransaction(tx);
          resolve(ret);
        }
      } else {
        resolve(ret);
      }
    };
  });
}

export function cleanOldMessages(db: IDBDatabase, ttl: number): Promise<void[]> {
  return getOldMessages(db, ttl).then((tooOld) => {
    return removeMessagesById(
      db,
      tooOld.map((msg) => msg.id)
    );
  });
}

interface ChannelState {
  closed: boolean;
  lastCursorId: number;
  channelName: string;
  options: Options;
  uuid: string;
  eMIs: ObliviousSet;
  writeBlockPromise: Promise<void>;
  messagesCallback: ((data: MessageObject) => void) | null;
  messagesCallbackTime?: number;
  readQueuePromises: Promise<unknown>[];
  db: IDBDatabase;
  time: number;
}

export function create(channelName: string, options: Options): Promise<ChannelState> {
  options = fillOptionsWithDefaults(options);

  return createDatabase(channelName).then((db) => {
    const state: ChannelState = {
      closed: false,
      lastCursorId: 0,
      channelName,
      options,
      uuid: generateRandomId(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new ObliviousSet(options.idb!.ttl! * 2),
      // ensures we do not read messages in parrallel
      writeBlockPromise: PROMISE_RESOLVED_VOID,
      messagesCallback: null,
      readQueuePromises: [],
      db,
      time: micro(),
    };

    /**
     * Handle abrupt closes that do not originate from db.close().
     * This could happen, for example, if the underlying storage is
     * removed or if the user clears the database in the browser's
     * history preferences.
     */
    db.onclose = function () {
      state.closed = true;

      if (options.idb!.onclose) options.idb!.onclose();
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

function _readLoop(state: ChannelState): void {
  if (state.closed) return;

  readNewMessages(state)
    .then(() => sleep(state.options.idb!.fallbackInterval))
    .then(() => _readLoop(state))
    .catch((e) => {
      throw e;
    });
}

function _filterMessage(msgObj: Message, state: ChannelState): boolean {
  if (msgObj.uuid === state.uuid) return false; // send by own
  if (state.eMIs.has(msgObj.id)) return false; // already emitted
  if (msgObj.data.time < state.messagesCallbackTime!) return false; // older then onMessageCallback
  return true;
}

/**
 * reads all new messages from the database and emits them
 */
function readNewMessages(state: ChannelState): Promise<void> {
  // channel already closed
  if (state.closed) return PROMISE_RESOLVED_VOID;

  // if no one is listening, we do not need to scan for new messages
  if (!state.messagesCallback) return PROMISE_RESOLVED_VOID;

  return getMessagesHigherThan(state.db, state.lastCursorId).then((newerMessages) => {
    const useMessages = newerMessages
      /**
       * there is a bug in iOS where the msgObj can be undefined some times
       * so we filter them out
       * @link https://github.com/pubkey/broadcast-channel/issues/19
       */
      .filter((msgObj): msgObj is Message => !!msgObj)
      .map((msgObj) => {
        if (msgObj.id > state.lastCursorId) {
          state.lastCursorId = msgObj.id;
        }
        return msgObj;
      })
      .filter((msgObj) => _filterMessage(msgObj, state))
      .sort((msgObjA, msgObjB) => msgObjA.time - msgObjB.time); // sort by time
    useMessages.forEach((msgObj) => {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });

    return PROMISE_RESOLVED_VOID;
  });
}

export function close(channelState: ChannelState): void {
  channelState.closed = true;
  channelState.db.close();
}

export function postMessage(channelState: ChannelState, messageJson: MessageObject): Promise<void> {
  channelState.writeBlockPromise = channelState.writeBlockPromise
    .then(() => writeMessage(channelState.db, channelState.uuid, messageJson))
    .then(() => {
      if (randomInt(0, 10) === 0) {
        /* await (do not await) */
        cleanOldMessages(channelState.db, channelState.options.idb!.ttl!);
      }

      return PROMISE_RESOLVED_VOID;
    });

  return channelState.writeBlockPromise;
}

export function onMessage(channelState: ChannelState, fn: (data: MessageObject) => void, time: number): void {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}

export function canBeUsed(): boolean {
  const idb = getIdb();

  if (!idb) return false;
  return true;
}

export function averageResponseTime(options: Options): number {
  return options.idb!.fallbackInterval! * 2;
}
