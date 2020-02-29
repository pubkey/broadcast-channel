const electron = require('electron');
const renderTest = require('./test/render.test.js');
// const BroadcastChannel = require('broadcast-channel');

require('babel-polyfill');


const RxDB = require('rxdb');
RxDB.plugin(require('pouchdb-adapter-idb'));

async function run() {
    /**
     * to check if rxdb works correctly, we run some integration-tests here
     * if you want to use this electron-example as boilerplate, remove this line
     */
    await renderTest();
}
run();
