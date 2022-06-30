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

let SOCKET_CONN_INSTANCE = null;

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
            const body = {
                key: getPublic(channelEncPrivKey).toString('hex'),
                data: encData,
                signature: (await sign(channelEncPrivKey, keccak256(encData))).toString('hex'),
            };
            if (channelState.timeout) body.timeout = channelState.timeout;
            return fetch(channelState.serverUrl + '/channel/set', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })
                .then(res)
                .catch(rej);
        });
    });
}

export function getSocketInstance(serverUrl) {
    if (SOCKET_CONN_INSTANCE) {
        return SOCKET_CONN_INSTANCE;
    }
    const SOCKET_CONN = io(serverUrl, {
        transports: ['websocket', 'polling'], // use WebSocket first, if available
        withCredentials: true,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: 10,
    });

    SOCKET_CONN.on('connect_error', (err) => {
        // revert to classic upgrade
        SOCKET_CONN.io.opts.transports = ['polling', 'websocket'];
        log.error('connect error', err);
    });
    SOCKET_CONN.on('connect', async () => {
        const { engine } = SOCKET_CONN.io;
        log.debug('initially connected to', engine.transport.name); // in most cases, prints "polling"
        engine.once('upgrade', () => {
            // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
            log.debug('upgraded', engine.transport.name); // in most cases, prints "websocket"
        });
        engine.once('close', (reason) => {
            // called when the underlying connection is closed
            log.debug('connection closed', reason);
        });
    });

    SOCKET_CONN.on('error', (err) => {
        log.error('socket errored', err);
        SOCKET_CONN.disconnect();
    });
    SOCKET_CONN.on('disconnect', () => {
        log.debug('socket disconnected');
    });
    SOCKET_CONN_INSTANCE = SOCKET_CONN;
    return SOCKET_CONN;
}

export function setupSocketConnection(serverUrl, channelName, fn) {
    const socketConn = getSocketInstance(serverUrl);

    const key = storageKey(channelName);
    const channelEncPrivKey = keccak256(key);
    const channelPubKey = getPublic(channelEncPrivKey).toString('hex');
    if (socketConn.connected) {
        socketConn.emit('check_auth_status', channelPubKey);
    } else {
        socketConn.once('connect', () => {
            log.debug('connected with socket');
            socketConn.emit('check_auth_status', channelPubKey);
        });
    }

    const visibilityListener = () => {
        // if channel is closed, then remove the listener.
        if (!socketConn) {
            document.removeEventListener('visibilitychange', visibilityListener);
            return;
        }
        // if not connected, then wait for connection and ping server for latest msg.
        if (!socketConn.connected && document.visibilityState === 'visible') {
            socketConn.once('connect', async () => {
                socketConn.emit('check_auth_status', channelPubKey);
            });
        }
    };

    const listener = async (ev) => {
        try {
            const decData = await decryptData(channelEncPrivKey.toString('hex'), ev);
            log.info(decData);
            fn(decData);
        } catch (error) {
            log.error(error);
        }
    };

    socketConn.on(`${channelPubKey}_success`, listener);

    document.addEventListener('visibilitychange', visibilityListener);

    return socketConn;
}

export function removeStorageEventListener() {
    if (SOCKET_CONN_INSTANCE) {
        SOCKET_CONN_INSTANCE.disconnect();
    }
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
    if (options.server.timeout !== null || options.server.timeout !== undefined)
        state.timeout = options.server.timeout;

    setupSocketConnection(options.server.url, channelName, (msgObj) => {
        if (!state.messagesCallback) return; // no listener
        if (msgObj.uuid === state.uuid) return; // own message
        if (!msgObj.token || state.eMIs.has(msgObj.token)) return; // already emitted
        // if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

        state.eMIs.add(msgObj.token);
        state.messagesCallback(msgObj.data);
    });

    return state;
}

export function close() {
    // give 2 sec for all msgs which are in transit to be consumed
    // by receiver.
    // window.setTimeout(() => {
    //     removeStorageEventListener(channelState);
    //     SOCKET_CONN_INSTANCE = null;
    // }, 1000);
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
