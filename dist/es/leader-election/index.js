import { sleep, randomToken } from '../util.js';

import unload from 'unload';

var LeaderElection = function LeaderElection(channel, options) {
    this._channel = channel;
    this._options = options;

    this.isLeader = false;
    this.isDead = false;
    this.token = randomToken(10);

    this._isApplying = false;
    this._reApply = false;

    // things to clean up
    this._unloads = [];
    this._listeners = [];
    this._intervals = [];
};

LeaderElection.prototype = {
    applyOnce: function applyOnce() {
        var _this = this;

        if (this.isLeader) return Promise.resolve(false);
        if (this.isDead) return Promise.resolve(false);

        // do nothing if already running
        if (this._isApplying) {
            this._reApply = true;
            return Promise.resolve(false);
        }
        this._isApplying = true;

        var stopCriteria = false;
        var recieved = [];

        var handleMessage = function handleMessage(msg) {
            if (msg.context === 'leader' && msg.token != _this.token) {
                recieved.push(msg);

                if (msg.action === 'apply') {
                    // other is applying
                    if (msg.token > _this.token) {
                        // other has higher token, stop applying
                        stopCriteria = true;
                    }
                }

                if (msg.action === 'tell') {
                    // other is already leader
                    stopCriteria = true;
                }
            }
        };
        this._channel.addEventListener('internal', handleMessage);

        var ret = this._sendMessage('apply') // send out that this one is applying
        .then(function () {
            return sleep(_this._options.responseTime);
        }) // let others time to respond
        .then(function () {
            if (stopCriteria) return Promise.reject(new Error());else return _this._sendMessage('apply');
        }).then(function () {
            return sleep(_this._options.responseTime);
        }) // let others time to respond
        .then(function () {
            if (stopCriteria) return Promise.reject(new Error());else return _this._sendMessage();
        }).then(function () {
            return _this._beLeader();
        }) // no one disagreed -> this one is now leader
        .then(function () {
            return true;
        })['catch'](function () {
            return false;
        }) // apply not successfull
        .then(function (success) {
            _this._channel.removeEventListener('internal', handleMessage);
            _this._isApplying = false;
            if (!success && _this._reApply) {
                _this._reApply = false;
                return _this.applyOnce();
            } else return success;
        });
        return ret;
    },
    _awaitLeadershipOnce: function _awaitLeadershipOnce() {
        var _this2 = this;

        if (this.isLeader) return Promise.resolve();

        return new Promise(function (res) {
            var resolved = false;

            var finish = function finish() {
                if (resolved) return;
                resolved = true;
                clearInterval(interval);
                _this2._channel.removeEventListener('internal', whenDeathListener);
                res(true);
            };

            // try once now
            _this2.applyOnce().then(function () {
                if (_this2.isLeader) finish();
            });

            // try on fallbackInterval
            var interval = setInterval(function () {
                _this2.applyOnce().then(function () {
                    if (_this2.isLeader) finish();
                });
            }, _this2._options.fallbackInterval);
            _this2._intervals.push(interval);

            // try when other leader dies
            var whenDeathListener = function whenDeathListener(msg) {
                if (msg.context === 'leader' && msg.action === 'death') {
                    _this2.applyOnce().then(function () {
                        if (_this2.isLeader) finish();
                    });
                }
            };
            _this2._channel.addEventListener('internal', whenDeathListener);
            _this2._listeners.push(whenDeathListener);
        });
    },
    awaitLeadership: function awaitLeadership() {
        if (!this._awaitLeadershipPromise) {
            this._awaitLeadershipPromise = this._awaitLeadershipOnce();
        }
        return this._awaitLeadershipPromise;
    },
    die: function die() {
        var _this3 = this;

        if (this.isDead) return;
        this.isDead = true;

        this._listeners.forEach(function (listener) {
            return _this3._channel.removeEventListener('internal', listener);
        });
        this._intervals.forEach(function (interval) {
            return clearInterval(interval);
        });
        this._unloads.forEach(function (uFn) {
            uFn.remove();
        });
        return this._sendMessage('death');
    },


    /**
     * sends and internal message over the broadcast-channel
     */
    _sendMessage: function _sendMessage(action) {
        var msgJson = {
            context: 'leader',
            action: action,
            token: this.token
        };
        return this._channel.postInternal(msgJson);
    },
    _beLeader: function _beLeader() {
        var _this4 = this;

        this.isLeader = true;
        var unloadFn = unload.add(function () {
            return _this4.die();
        });
        this._unloads.push(unloadFn);

        var isLeaderListener = function isLeaderListener(msg) {
            if (msg.context === 'leader' && msg.action === 'apply') {
                _this4._sendMessage('tell');
            }
        };
        this._channel.addEventListener('internal', isLeaderListener);
        this._listeners.push(isLeaderListener);
        return this._sendMessage('tell');
    }
};

function fillOptionsWithDefaults(options, channel) {
    if (!options) options = {};
    options = JSON.parse(JSON.stringify(options));

    if (!options.fallbackInterval) {
        options.fallbackInterval = 3000;
    }

    if (!options.responseTime) {
        options.responseTime = channel.method.averageResponseTime(channel.options);
    }

    return options;
}

export function create(channel, options) {
    if (channel._leaderElector) {
        throw new Error('BroadcastChannel already has a leader-elector');
    }

    options = fillOptionsWithDefaults(options, channel);
    var elector = new LeaderElection(channel, options);
    channel._beforeClose.push(function () {
        return elector.die();
    });

    channel._leaderElector = elector;
    return elector;
}

export default {
    create: create
};