import {
    sleep,
    randomToken
} from '../util.js';

import unload from 'unload';

const LeaderElection = function (channel, options) {
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

    applyOnce() {
        if (this.isLeader) return Promise.resolve(false);
        if (this.isDead) return Promise.resolve(false);

        // do nothing if already running
        if (this._isApplying) {
            this._reApply = true;
            return Promise.resolve(false);
        }
        this._isApplying = true;

        let stopCriteria = false;
        const recieved = [];

        const handleMessage = (msg) => {
            if (msg.context === 'leader' && msg.token != this.token) {
                recieved.push(msg);

                if (msg.action === 'apply') {
                    // other is applying
                    if (msg.token > this.token) {
                        // other has higher token, stop applying
                        stopCriteria = true;
                    }
                }

                if (msg.action === 'tell') {
                    // other is already leader
                    stopCriteria = true;
                }
            }
        }
        this._channel.addEventListener('internal', handleMessage);



        const ret = this._sendMessage('apply') // send out that this one is applying
            .then(() => sleep(this._options.responseTime)) // let others time to respond
            .then(() => {
                if (stopCriteria) return Promise.reject();
                else return this._sendMessage('apply');
            })
            .then(() => sleep(this._options.responseTime)) // let others time to respond
            .then(() => {
                if (stopCriteria) return Promise.reject();
                else return this._sendMessage();
            })
            .then(() => this._beLeader()) // no one disagreed -> this one is now leader
            .then(() => true)
            .catch(() => false) // apply not successfull
            .then(success => {
                this._channel.removeEventListener('internal', handleMessage);
                this._isApplying = false;
                if (!success && this._reApply) {
                    this._reApply = false;
                    return this.applyOnce();
                } else return success;
            })
        return ret;
    },

    _awaitLeadershipOnce() {
        if (this.isLeader) return Promise.resolve();

        return new Promise((res) => {
            let resolved = false;

            const finish = () => {
                if (resolved) return;
                resolved = true;
                clearInterval(interval);
                this._channel.removeEventListener('internal', whenDeathListener);
                res(true);
            };

            // try once now
            this.applyOnce().then(() => {
                if (this.isLeader) finish();
            });

            // try on fallbackInterval
            const interval = setInterval(() => {
                this.applyOnce().then(() => {
                    if (this.isLeader) finish();
                });
            }, this._options.fallbackInterval);
            this._intervals.push(interval);

            // try when other leader dies
            const whenDeathListener = msg => {
                if (msg.context === 'leader' && msg.action === 'death') {
                    this.applyOnce().then(() => {
                        if (this.isLeader) finish();
                    });
                };
            }
            this._channel.addEventListener('internal', whenDeathListener);
            this._listeners.push(whenDeathListener);
        });
    },

    awaitLeadership() {
        if (!this._awaitLeadershipPromise) {
            this._awaitLeadershipPromise = this._awaitLeadershipOnce();
        }
        return this._awaitLeadershipPromise;
    },

    die() {
        if (this.isDead) return;
        this.isDead = true;

        this._listeners.forEach(listener => this._channel.removeEventListener('internal', listener));
        this._intervals.forEach(interval => clearInterval(interval));
        this._unloads.forEach(uFn => {
            uFn();
        });
        return this._sendMessage('death');
    },

    /**
     * sends and internal message over the broadcast-channel
     */
    _sendMessage(action) {
        const msgJson = {
            context: 'leader',
            action,
            token: this.token
        };
        return this._channel.postInternal(msgJson);
    },

    _beLeader() {
        this.isLeader = true;
        const unloadFn = unload.add(() => this.die());
        this._unloads.push(unloadFn);

        const isLeaderListener = msg => {
            if (msg.context === 'leader' && msg.action === 'apply') {
                this._sendMessage('tell');
            };
        }
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
    const elector = new LeaderElection(channel, options);
    channel._beforeClose.push(() => elector.die());

    channel._leaderElector = elector;
    return elector;
}


export default {
    create
};