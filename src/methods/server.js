/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */

import { ObliviousSet } from 'oblivious-set';
import { io } from 'socket.io-client';
import { getPublic, sign } from '@toruslabs/eccrypto';
import { encryptData, decryptData } from '@toruslabs/metadata-helpers';
import createKeccakHash from 'keccak';
import { log } from '../util';
import { fillOptionsWithDefaults } from '../options';

import { sleep, randomToken, microSeconds as micro } from '../util';

export const microSeconds = micro;

// PASS IN STRING/BUFFER TO GET BUFFER
export function keccak256(a) {
    return createKeccakHash('keccak256').update(a).digest();
}

const KEY_PREFIX = 'pubkey.broadcastChannel-';
export const type = 'server';

const SOCKET_CONN_INSTANCES = {};

export function storageKey(channelName) {
    return KEY_PREFIX + channelName;
}

/**
 * writes the new message to the storage
 * and fires the storage-event so other readers can find it
 */
export function postMessage(channelState, messageJson) {
    return new Promise((res, rej) => {
        sleep().then(async () => {
            const key = storageKey(channelState.channelName);
            const channelEncPrivKey = keccak256(key);
            const encData = await encryptData(channelEncPrivKey.toString('hex'), {
                token: randomToken(),
                time: new Date().getTime(),
                data: messageJson,
                uuid: channelState.uuid,
            });
            const socketConn = SOCKET_CONN_INSTANCES[channelState.channelName];
            const _setMessage = async () => {
                return fetch(channelState.serverUrl + '/channel/set', {
                    method: 'POST',
                    body: JSON.stringify({
                        key: getPublic(channelEncPrivKey).toString('hex'),
                        data: encData,
                        signature: (await sign(channelEncPrivKey, keccak256(encData))).toString('hex'),
                    }),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                })
                    .then(res)
                    .catch(rej);
            };
            if (socketConn && socketConn.connected) {
                return _setMessage();
            }
            let currentAttempts = 0;
            const waitingInterval = window.setInterval(async () => {
                if (currentAttempts >= 5) {
                    window.clearInterval(waitingInterval);
                    return rej(new Error('Could not post message after 5 attempts to socket channel'));
                }
                if (socketConn && socketConn.connected) {
                    window.clearInterval(waitingInterval);
                    return _setMessage();
                } else {
                    currentAttempts++;
                }
            }, 500);
        });
    });
}

export function addStorageEventListener(channelName, serverUrl, fn) {
    const key = storageKey(channelName);
    const channelEncPrivKey = keccak256(key);
    const SOCKET_CONN = io(serverUrl, {
        transports: ['websocket', 'polling'], // use WebSocket first, if available
        withCredentials: true,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: 10,
    });
    const visibilityListener = () => {
        // if channel is closed, then remove the listener.
        if (!SOCKET_CONN_INSTANCES[channelName]) {
            document.removeEventListener('visibilitychange', visibilityListener);
            return;
        }
        // if not connected, then wait for connection and ping server for latest msg.
        if (!SOCKET_CONN.connected && document.visibilityState === 'visible') {
            SOCKET_CONN.once('connect', async () => {
                SOCKET_CONN.emit('check_auth_status', getPublic(channelEncPrivKey).toString('hex'));
            });
        }
    };
    const listener = async (ev) => {
        try {
            const decData = await decryptData(channelEncPrivKey.toString('hex'), ev);
            fn(decData);
        } catch (error) {
            log.error(error);
        }
    };
    SOCKET_CONN.on('connect_error', () => {
        // revert to classic upgrade
        SOCKET_CONN.io.opts.transports = ['polling', 'websocket'];
    });
    SOCKET_CONN.on('connect', async () => {
        log.debug('connected with socket');
        SOCKET_CONN.emit('check_auth_status', getPublic(channelEncPrivKey).toString('hex'));
        const { engine } = SOCKET_CONN.io;
        log.debug('initially connected to', engine.transport.name); // in most cases, prints "polling"
        engine.once('upgrade', () => {
            // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
            log.debug('upgraded', engine.transport.name); // in most cases, prints "websocket"
        });
        engine.on('close', (reason) => {
            // called when the underlying connection is closed
            log.debug('connection closed', reason);
        });
    });

    SOCKET_CONN.on('error', (err) => {
        log.debug('socket errored', err);
        SOCKET_CONN.disconnect();
    });
    SOCKET_CONN.once('disconnect', () => {
        log.debug('socket disconnected');
        if (SOCKET_CONN_INSTANCES[channelName]) visibilityListener();
    });

    SOCKET_CONN.on('success', listener);
    document.addEventListener('visibilitychange', visibilityListener);
    SOCKET_CONN_INSTANCES[channelName] = SOCKET_CONN;
    return listener;
}
export function removeStorageEventListener(channelState) {
    if (SOCKET_CONN_INSTANCES[channelState.channelName]) SOCKET_CONN_INSTANCES[channelState.channelName].disconnect();
}

export function create(channelName, options) {
    options = fillOptionsWithDefaults(options);
    if (!canBeUsed(options)) {
        throw new Error('BroadcastChannel: server cannot be used');
    }

    const uuid = randomToken();

    /**
     * eMIs
     * contains all messages that have been emitted before
     * @type {ObliviousSet}
     */
    const eMIs = new ObliviousSet(options.server.removeTimeout);

    const state = {
        channelName,
        uuid,
        eMIs, // emittedMessagesIds
        serverUrl: options.server.url,
    };

    state.listener = addStorageEventListener(channelName, options.server.url, (msgObj) => {
        if (!state.messagesCallback) return; // no listener
        if (msgObj.uuid === uuid) return; // own message
        if (!msgObj.token || eMIs.has(msgObj.token)) return; // already emitted
        // if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

        eMIs.add(msgObj.token);
        state.messagesCallback(msgObj.data);
    });

    return state;
}

export function close(channelState) {
    // give 2 sec for all msgs which are in transit to be consumed
    // by receiver.
    window.setTimeout(() => {
        removeStorageEventListener(channelState);
        delete SOCKET_CONN_INSTANCES[channelState.channelName];
    }, 1000);
}

export function onMessage(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
}

export function canBeUsed() {
    return true;
}

export function averageResponseTime() {
    const defaultTime = 500;
    // TODO: Maybe increase it based on operation
    return defaultTime;
}

export default {
    create,
    close,
    onMessage,
    postMessage,
    canBeUsed,
    type,
    averageResponseTime,
    microSeconds,
};
