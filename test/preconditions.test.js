/**
 * this file contains some tests
 * to ensure some preconditions are correct
 * and dependencies are working as should
 */

const AsyncTestUtil = require('async-test-util');
const isNode = require('detect-node');
const path = require('path');
const os = require('os');
const net = require('net');
const fs = require('fs');
const util = require('util');
const assert = require('assert');

const mkdir = util.promisify(fs.mkdir);

describe('preconditions.test.js', () => {
    // does not work on OSX for whatever reason
    it('listen to multiple sockets at the same time', async () => {
        if (!isNode) return;

        // create sub-folder in tmp
        const basePath = path.join(
            os.tmpdir(),
            'pubkey.precondition-sockets'
        );
        console.log('create base path:' + basePath);
        await mkdir(basePath).catch(() => null);

        const subPath = path.join(
            basePath,
            'whatever'
        );
        console.log('create subPath path:' + subPath);
        await mkdir(subPath).catch(() => null);

        const readerPath = path.join(
            subPath,
            'readers'
        );
        console.log('create readerPath path:' + readerPath);
        await mkdir(readerPath).catch(() => null);

        console.log('check readers path:');
        const exists = fs.existsSync(readerPath);
        assert.ok(exists);


        console.log('# create server 1');
        const server1Path = path.join(
            readerPath,
            'asdf1.s'
        );
        console.log('server1Path: ' + server1Path);
        const server1 = net
            .createServer(stream => {
                stream.on('end', function() {});
                stream.on('data', function() {});
            });
        server1.on('error', err => {
            console.log('server1: server.on.(error): ' + err.code);
            console.dir(err);
            throw err;
        });
        await new Promise((resolve, reject) => {
            server1.listen(server1Path, (err, res) => {
                if (err) {
                    console.log('server1: server.listen failed with: ');
                    console.dir(err);
                    reject(err);
                } else resolve(res);
            });
        });
        server1.on('connection', () => {});


        // w8 a bit
        await AsyncTestUtil.wait(2000);

        console.log('# create server 2');
        const server2Path = path.join(
            readerPath,
            'asdf2.s'
        );
        console.log('server2Path: ' + server2Path);
        const server2 = net
            .createServer(stream => {
                stream.on('end', function() {});
                stream.on('data', function() {});
            });
        server2.on('error', err => {
            console.log('server2: server.on.(error): ' + err.code);
            console.dir(err);
            throw err;
        });
        await new Promise((resolve, reject) => {
            server2.listen(server2Path, (err, res) => {
                if (err) {
                    console.log('server2: server.listen failed with: ');
                    console.dir(err);
                    reject(err);
                } else resolve(res);
            });
        });
        server2.on('connection', () => {});

        server1.close();
        server2.close();
    });
});
