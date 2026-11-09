/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */

import { ObliviousSet } from "oblivious-set";

import { fillOptionsWithDefaults } from "../options";
import { MessageObject } from "../types";
import { generateRandomId, microSeconds as micro, sleep } from "../util";

export const microSeconds = micro;

const KEY_PREFIX = "pubkey.broadcastChannel-";
export const type = "localstorage";

interface StorageMessage {
  token: string;
  time: number;
  data: MessageObject;
  uuid: string;
}

interface ChannelState {
  channelName: string;
  uuid: string;
  time: number;
  eMIs: ObliviousSet<string>;
  listener?: (ev: StorageEvent) => void;
  messagesCallback?: (data: MessageObject) => void;
  messagesCallbackTime?: number;
}

interface LocalStorageOptions {
  localstorage: {
    removeTimeout: number;
  };
}

/**
 * copied from crosstab
 * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
 */
export function getLocalStorage(): Storage | null {
  let localStorage: Storage | null = null;
  if (typeof window === "undefined") return null;
  try {
    localStorage = window.localStorage;
    localStorage =
      (window as Window & typeof globalThis & { "ie8-eventlistener/storage"?: Storage })["ie8-eventlistener/storage"] || window.localStorage;
  } catch {
    // New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }
  return localStorage;
}

export function storageKey(channelName: string): string {
  return KEY_PREFIX + channelName;
}

/**
 * writes the new message to the storage
 * and fires the storage-event so other readers can find it
 */
export function postMessage(channelState: ChannelState, messageJson: MessageObject): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    sleep()
      // oxlint-disable-next-line promise/always-return
      .then(() => {
        const key = storageKey(channelState.channelName);
        const writeObj: StorageMessage = {
          token: generateRandomId(),
          time: Date.now(),
          data: messageJson,
          uuid: channelState.uuid,
        };
        const value = JSON.stringify(writeObj);
        getLocalStorage()?.setItem(key, value);

        /**
         * StorageEvent does not fire the 'storage' event
         * in the window that changes the state of the local storage.
         * So we fire it manually
         */
        const ev = document.createEvent("StorageEvent") as StorageEvent;
        ev.initStorageEvent("storage", true, true, key, null, value, "", null);
        window.dispatchEvent(ev);

        resolve();
      })
      .catch(reject);
  });
}

export function addStorageEventListener(channelName: string, fn: (msg: StorageMessage) => void): (ev: StorageEvent) => void {
  const key = storageKey(channelName);
  const listener = (ev: StorageEvent) => {
    if (ev.key === key && ev.newValue) {
      fn(JSON.parse(ev.newValue));
    }
  };
  window.addEventListener("storage", listener);
  return listener;
}

export function removeStorageEventListener(listener: (ev: StorageEvent) => void): void {
  window.removeEventListener("storage", listener);
}

export function canBeUsed(): boolean {
  const ls = getLocalStorage();

  if (!ls) return false;

  try {
    const key = "__broadcastchannel_check";
    ls.setItem(key, "works");
    ls.removeItem(key);
  } catch {
    // Safari 10 in private mode will not allow write access to local
    // storage and fail with a QuotaExceededError. See
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API#Private_Browsing_Incognito_modes
    return false;
  }

  return true;
}

export function create(channelName: string, options: LocalStorageOptions): ChannelState {
  const filledOptions = fillOptionsWithDefaults(options);
  if (!canBeUsed()) {
    throw new Error("BroadcastChannel: localstorage cannot be used");
  }

  const uuid = generateRandomId();

  /**
   * eMIs
   * contains all messages that have been emitted before
   */
  const eMIs = new ObliviousSet<string>(filledOptions.localstorage.removeTimeout);

  const state: ChannelState = {
    channelName,
    uuid,
    time: micro(),
    eMIs, // emittedMessagesIds
  };

  state.listener = addStorageEventListener(channelName, (msgObj) => {
    if (!state.messagesCallback) return; // no listener
    if (msgObj.uuid === uuid) return; // own message
    if (!msgObj.token || eMIs.has(msgObj.token)) return; // already emitted

    if (msgObj.data.time && msgObj.data.time < (state.messagesCallbackTime || 0)) return; // too old

    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });

  return state;
}

export function close(channelState: ChannelState): void {
  if (channelState.listener) {
    removeStorageEventListener(channelState.listener);
  }
}

export function onMessage(channelState: ChannelState, fn: (msg: MessageObject) => void, time: number): void {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}

export function averageResponseTime(): number {
  const defaultTime = 120;
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    // safari is much slower so this time is higher
    return defaultTime * 2;
  }
  return defaultTime;
}
