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
import {
    sha3_224
} from 'js-sha3';

import isNode from 'detect-node';
import IdleQueue from 'custom-idle-queue';
import unload from 'unload';

import {
    fillOptionsWithDefaults
} from '../options';

import {
    randomInt,
    randomToken
} from '../util';

/**
 * windows sucks, so we have handle windows-type of socket-paths
 * @link https://gist.github.com/domenic/2790533#gistcomment-331356
 */
export function cleanPipeName(str) {
    if (
        process.platform === 'win32' &&
        !str.startsWith('\\\\.\\pipe\\')
    ) {
        str = str.replace(/^\//, '');
        str = str.replace(/\//g, '-');
        return '\\\\.\\pipe\\' + str;
    } else {
        return str;
    }
}

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);


const TMP_FOLDER_NAME = 'pubkey.broadcast-channel';

export function getPaths(channelName) {
    const folderPathBase = path.join(
        os.tmpdir(),
        TMP_FOLDER_NAME
    );
    const channelPathBase = path.join(
        os.tmpdir(),
        TMP_FOLDER_NAME,
        sha3_224(channelName) // use hash incase of strange characters
    );
    const folderPathReaders = path.join(
        channelPathBase,
        'readers'
    );
    const folderPathMessages = path.join(
        channelPathBase,
        'messages'
    );

    return {
        base: folderPathBase,
        channelBase: channelPathBase,
        readers: folderPathReaders,
        messages: folderPathMessages
    };
}

export async function ensureFoldersExist(channelName) {

    const paths = getPaths(channelName);


    await mkdir(paths.base).catch(() => null);
    await mkdir(paths.channelBase).catch(() => null);
    await Promise.all([
        await mkdir(paths.readers).catch(() => null),
        await mkdir(paths.messages).catch(() => null)
    ]);
}

export function socketPath(channelName, readerUuid) {

    const paths = getPaths(channelName);
    const socketPath = path.join(
        paths.readers,
        readerUuid + '.s'
    );
    return cleanPipeName(socketPath);
}

export function socketInfoPath(channelName, readerUuid) {
    const paths = getPaths(channelName);
    const socketPath = path.join(
        paths.readers,
        readerUuid + '.json'
    );
    return socketPath;
}


/**
 * Because it is not possible to get all socket-files in a folder,
 * when used under fucking windows,
 * we have to set a normal file so other readers know our socket exists
 */
export async function createSocketInfoFile(channelName, readerUuid) {
    await ensureFoldersExist(channelName);
    const pathToFile = socketInfoPath(channelName, readerUuid);
    await writeFile(
        pathToFile,
        JSON.stringify({
            time: new Date().getTime()
        })
    );
    return pathToFile;
}

/**
 * creates the socket-file and subscribes to it
 * @return {{emitter: EventEmitter, server: any}}
 */
export async function createSocketEventEmitter(channelName, readerUuid) {
    const pathToSocket = socketPath(channelName, readerUuid);

    const emitter = new events.EventEmitter();
    const server = net
        .createServer(stream => {
            stream.on('end', function () {
                // console.log('server: end');
            });

            stream.on('data', function (msg) {
                // console.log('server: got data:');
                // console.dir(msg.toString());
                emitter.emit('data', msg.toString());
            });
        });

    await new Promise(res => {
        server.listen(pathToSocket, () => {
            res();
        });
    });
    server.on('connection', () => {
        // console.log('server: Client connected.');
    });

    return {
        path: pathToSocket,
        emitter,
        server
    };
}

export async function openClientConnection(channelName, readerUuid) {
    const pathToSocket = socketPath(channelName, readerUuid);
    const client = new net.Socket();
    await new Promise(res => {
        client.connect(
            pathToSocket,
            res
        );
    });
    return client;
}


/**
 * writes the new message to the file-system
 * so other readers can find it
 */
export async function writeMessage(channelName, readerUuid, messageJson) {
    const time = new Date().getTime();
    const writeObject = {
        uuid: readerUuid,
        time,
        data: messageJson
    };

    const token = randomToken(12);
    const fileName = time + '_' + readerUuid + '_' + token + '.json';

    const msgPath = path.join(
        getPaths(channelName).messages,
        fileName
    );

    await writeFile(
        msgPath,
        JSON.stringify(writeObject)
    );

    return {
        time,
        uuid: readerUuid,
        token,
        path: msgPath
    };
}

/**
 * returns the uuids of all readers
 * @return {string[]}
 */
export async function getReadersUuids(channelName) {
    const readersPath = getPaths(channelName).readers;
    const files = await readdir(readersPath);

    return files
        .map(file => file.split('.'))
        .filter(split => split[1] === 'json') // do not scan .socket-files
        .map(split => split[0]);
}

export async function messagePath(channelName, time, token, writerUuid) {
    const fileName = time + '_' + writerUuid + '_' + token + '.json';

    const msgPath = path.join(
        getPaths(channelName).messages,
        fileName
    );
    return msgPath;
}

export async function getAllMessages(channelName) {
    const messagesPath = getPaths(channelName).messages;
    const files = await readdir(messagesPath);
    return files.map(file => {
        const fileName = file.split('.')[0];
        const split = fileName.split('_');

        return {
            path: path.join(
                messagesPath,
                file
            ),
            time: parseInt(split[0]),
            senderUuid: split[1],
            token: split[2]
        };
    });
}

export function getSingleMessage(channelName, msgObj) {
    const messagesPath = getPaths(channelName).messages;

    return {
        path: path.join(
            messagesPath,
            msgObj.t + '_' + msgObj.u + '_' + msgObj.to + '.json'
        ),
        time: msgObj.t,
        senderUuid: msgObj.u,
        token: msgObj.to
    };
}


export async function readMessage(messageObj) {
    const content = await readFile(messageObj.path, 'utf8');
    return JSON.parse(content);
}

export async function cleanOldMessages(messageObjects, ttl) {
    const olderThen = new Date().getTime() - ttl;

    await Promise.all(
        messageObjects
            .filter(obj => obj.time < olderThen)
            .map(obj => unlink(obj.path).catch(() => null))
    );
}



export const type = 'node';

export async function create(channelName, options = {}) {
    options = fillOptionsWithDefaults(options);

    await ensureFoldersExist(channelName);
    const uuid = randomToken(10);

    const [
        otherReaderUuids,
        socketEE,
        infoFilePath
    ] = await Promise.all([
        getReadersUuids(channelName),
        createSocketEventEmitter(channelName, uuid),
        createSocketInfoFile(channelName, uuid)
    ]);

    // ensures we do not read messages in parrallel
    const writeQueue = new IdleQueue(1);

    const state = {
        channelName,
        options,
        uuid,
        socketEE,
        infoFilePath,
        // contains all messages that have been emitted before
        emittedMessagesIds: new Set(),
        messagesCallbackTime: null,
        messagesCallback: null,
        writeQueue,
        otherReaderUuids,
        otherReaderClients: {},
        // ensure if process crashes, everything is cleaned up
        removeUnload: unload.add(() => close(state)),
        closed: false
    };

    await refreshReaderClients(state);

    // when new message comes in, we read it and emit it
    socketEE.emitter.on('data', data => {
        const obj = JSON.parse(data);
        handleMessagePing(state, obj);
    });

    return state;
}


/**
 * when the socket pings, so that we now new messages came,
 * run this
 */
export async function handleMessagePing(state, msgObj = null) {
    /**
     * when there are no listener, we do nothing
     */
    if (!state.messagesCallback) return;


    let messages;
    if (!msgObj) {
        // get all
        messages = await getAllMessages(state.channelName);
    } else {
        // get single message
        messages = [
            getSingleMessage(state.channelName, msgObj)
        ];
    }

    const useMessages = messages
        .filter(msgObj => msgObj.senderUuid !== state.uuid) // not send by own
        .filter(msgObj => !state.emittedMessagesIds.has(msgObj.token)) // not already emitted
        .filter(msgObj => msgObj.time >= state.messagesCallbackTime) // not older then onMessageCallback
        .sort((msgObjA, msgObjB) => msgObjA.time - msgObjB.time); // sort by time    

    if (state.messagesCallback) {
        for (const msgObj of useMessages) {
            const content = await readMessage(msgObj);
            state.emittedMessagesIds.add(msgObj.token);
            setTimeout(
                () => state.emittedMessagesIds.delete(msgObj.token),
                state.options.node.ttl * 2
            );

            if (state.messagesCallback) {
                state.messagesCallback(content.data);
            }
        }
    }
}

export async function refreshReaderClients(channelState) {
    // ensure we have subscribed to all readers
    const otherReaders = await getReadersUuids(channelState.channelName);

    // remove subscriptions to closed readers
    Object.keys(channelState.otherReaderClients)
        .filter(readerUuid => !otherReaders.includes(readerUuid))
        .forEach(async (readerUuid) => {
            try {
                await channelState.otherReaderClients[readerUuid].destroy();
            } catch (err) { }
            delete channelState.otherReaderClients[readerUuid];
        });

    await Promise.all(
        otherReaders
            .filter(readerUuid => readerUuid !== channelState.uuid) // not own
            .filter(readerUuid => !channelState.otherReaderClients[readerUuid]) // not already has client
            .map(async (readerUuid) => {
                try {
                    if (channelState.closed) return;
                    const client = await openClientConnection(channelState.channelName, readerUuid);
                    channelState.otherReaderClients[readerUuid] = client;
                } catch (err) {
                    // this might throw if the other channel is closed at the same time when this one is running refresh
                    // so we do not throw an error
                }
            })
    );
}

export async function postMessage(channelState, messageJson) {

    // ensure we do this not in parallel
    await channelState.writeQueue.requestIdlePromise();
    await channelState.writeQueue.wrapCall(
        async () => {
            await refreshReaderClients(channelState);
            const msgObj = await writeMessage(
                channelState.channelName,
                channelState.uuid,
                messageJson
            );

            const pingStr = '{"t":' + msgObj.time + ',"u":"' + msgObj.uuid + '","to":"' + msgObj.token + '"}';

            await Promise.all(
                Object.values(channelState.otherReaderClients)
                    .filter(client => client.writable) // client might have closed in between
                    .map(client => {
                        return new Promise(res => {
                            client.write(pingStr, res);
                        });
                    })
            );

            /**
             * clean up old messages
             * to not waste resources on cleaning up,
             * only if random-int matches, we clean up old messages
             */
            if (randomInt(0, 50) === 0) {
                const messages = await getAllMessages(channelState.channelName);
                /*await*/ cleanOldMessages(messages, channelState.options.node.ttl);
            }

            // emit to own eventEmitter
            // channelState.socketEE.emitter.emit('data', JSON.parse(JSON.stringify(messageJson)));
        }
    );
}


export function onMessage(channelState, fn, time = new Date().getTime()) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    handleMessagePing(channelState);
}

export async function close(channelState) {
    if (channelState.closed) return;
    channelState.closed = true;

    if (typeof channelState.removeUnload === 'function')
        channelState.removeUnload();

    /**
     * the server get closed lazy because others might still write on it
     * and have not found out that the infoFile was deleted
     */
    setTimeout(() => channelState.socketEE.server.close(), 200);

    channelState.socketEE.emitter.removeAllListeners();
    channelState.writeQueue.clear();

    await unlink(channelState.infoFilePath).catch(() => null);

    Object.values(channelState.otherReaderClients)
        .forEach(client => client.destroy());
}


export function canBeUsed() {
    return isNode;
}


export function averageResponseTime() {
    return 50;
}