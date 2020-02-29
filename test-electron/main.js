const electron = require('electron');
require('electron-window-manager');
const path = require('path');
const url = require('url');

const { BroadcastChannel } = require('broadcast-channel');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const windows = [];

function createWindow() {
    const width = 300;
    const height = 600;
    const w = new BrowserWindow({
        width,
        height,
        webPreferences: {
            nodeIntegration: true
        }
    });

    w.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    const x = windows.length * width;
    const y = 0;
    w.setPosition(x, y);
    w.custom = {
    };
    windows.push(w);
}


app.on('ready', async function () {

    const channel = new BroadcastChannel('foobar');
    channel.postMessage('hi');





    createWindow();
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
