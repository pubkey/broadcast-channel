'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isPromise = isPromise;
exports.sleep = sleep;
exports.randomInt = randomInt;
exports.randomToken = randomToken;
/**
 * returns true if the given object is a promise
 */
function isPromise(obj) {
    if (obj && typeof obj.then === 'function') {
        return true;
    } else {
        return false;
    }
}

function sleep(time) {
    if (!time) time = 0;
    return new Promise(function (res) {
        return setTimeout(res, time);
    });
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * https://stackoverflow.com/a/1349426/3443137
 */
function randomToken(length) {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxzy0123456789';

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }return text;
}