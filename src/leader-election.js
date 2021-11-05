import {
    sleep,
    randomToken,
    PROMISE_RESOLVED_FALSE,
    PROMISE_RESOLVED_VOID
} from './util.js';

import unload from 'unload';

const LeaderElection = function (broadcastChannel, options) {
    this.broadcastChannel = broadcastChannel;
    this._options = options;

    this.isLeader = false;
    this.hasLeader = false;
    this.isDead = false;
    this.token = randomToken();

    /**
     * _isApplying
     * Only set when a leader application is
     * running at the moment.
     * @type {Promise<any> | null}
     */
    this._isApl = false; // _isApplying
    this._reApply = false;

    // things to clean up
    this._unl = []; // _unloads
    this._lstns = []; // _listeners
    this._invs = []; // _intervals
    this._dpL = () => { }; // onduplicate listener
    this._dpLC = false; // true when onduplicate called


    /**
     * Even when the own instance is not applying,
     * we still listen to messages to ensure the hasLeader flag
     * is set correctly.
     */
    const hasLeaderListener = (msg => {
        if (msg.context === 'leader') {
            if (msg.action === 'death') {
                this.hasLeader = false;
            }
            if (msg.action === 'tell') {
                this.hasLeader = true;
            }
        }
    });
    this.broadcastChannel.addEventListener('internal', hasLeaderListener);
    this._lstns.push(hasLeaderListener);
};

LeaderElection.prototype = {
    applyOnce() {
        if (this.isLeader) {
            return sleep(0, true);
        }
        if (this.isDead) {
            return PROMISE_RESOLVED_FALSE;
        }

        // do nothing if already running
        if (this._isApl) {
            this._reApply = true;
            return sleep(0, false);
        }

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
                    this.hasLeader = true;
                }
            }
        };
        this.broadcastChannel.addEventListener('internal', handleMessage);
        const applyPromise = _sendMessage(this, 'apply') // send out that this one is applying
            .then(() => sleep(this._options.responseTime)) // let others time to respond
            .then(() => {
                if (stopCriteria) {
                    return Promise.reject(new Error());
                } else {
                    return _sendMessage(this, 'apply');
                }
            })
            .then(() => sleep(this._options.responseTime)) // let others time to respond
            .then(() => {
                if (stopCriteria) {
                    return Promise.reject(new Error());
                } else {
                    return _sendMessage(this);
                }
            })
            .then(() => beLeader(this)) // no one disagreed -> this one is now leader
            .then(() => true)
            .catch(() => false) // apply not successfull
            .then(success => {
                this.broadcastChannel.removeEventListener('internal', handleMessage);
                this._isApl = false;
                if (!success && this._reApply) {
                    this._reApply = false;
                    return this.applyOnce();
                } else {
                    return success;
                }
            });
        this._isApl = applyPromise;
        return applyPromise;
    },

    awaitLeadership() {
        if (
            /* _awaitLeadershipPromise */
            !this._aLP
        ) {
            this._aLP = _awaitLeadershipOnce(this);
        }
        return this._aLP;
    },

    set onduplicate(fn) {
        this._dpL = fn;
    },

    die() {
        this._lstns.forEach(listener => this.broadcastChannel.removeEventListener('internal', listener));
        this._lstns = [];
        this._invs.forEach(interval => clearInterval(interval));
        this._invs = [];
        this._unl.forEach(uFn => uFn.remove());
        this._unl = [];

        if (this.isLeader) {
            this.hasLeader = false;
            this.isLeader = false;
        }
        this.isDead = true;
        return _sendMessage(this, 'death');
    }
};

/**
 * @param leaderElector {LeaderElector}
 */
function _awaitLeadershipOnce(leaderElector) {
    if (leaderElector.isLeader) {
        return PROMISE_RESOLVED_VOID;
    }

    return new Promise((res) => {
        let resolved = false;

        function finish() {
            if (resolved) {
                return;
            }
            resolved = true;
            clearInterval(interval);
            leaderElector.broadcastChannel.removeEventListener('internal', whenDeathListener);
            res(true);
        }

        // try once now
        leaderElector.applyOnce().then(() => {
            if (leaderElector.isLeader) {
                finish();
            }
        });

        // try on fallbackInterval
        const interval = setInterval(() => {
            leaderElector.applyOnce().then(() => {
                if (leaderElector.isLeader) {
                    finish();
                }
            });
        }, leaderElector._options.fallbackInterval);
        leaderElector._invs.push(interval);

        // try when other leader dies
        const whenDeathListener = msg => {
            if (msg.context === 'leader' && msg.action === 'death') {
                leaderElector.hasLeader = false;
                leaderElector.applyOnce()
                    .then(() => {
                        if (leaderElector.isLeader) {
                            finish();
                        }
                    });
            }
        };
        leaderElector.broadcastChannel.addEventListener('internal', whenDeathListener);
        leaderElector._lstns.push(whenDeathListener);
    });
}

/**
 * sends and internal message over the broadcast-channel
 */
function _sendMessage(leaderElector, action) {
    const msgJson = {
        context: 'leader',
        action,
        token: leaderElector.token
    };
    return leaderElector.broadcastChannel.postInternal(msgJson);
}

export function beLeader(leaderElector) {
    leaderElector.isLeader = true;
    leaderElector.hasLeader = true;
    const unloadFn = unload.add(() => leaderElector.die());
    leaderElector._unl.push(unloadFn);

    const isLeaderListener = msg => {
        if (msg.context === 'leader' && msg.action === 'apply') {
            _sendMessage(leaderElector, 'tell');
        }

        if (msg.context === 'leader' && msg.action === 'tell' && !leaderElector._dpLC) {
            /**
             * another instance is also leader!
             * This can happen on rare events
             * like when the CPU is at 100% for long time
             * or the tabs are open very long and the browser throttles them.
             * @link https://github.com/pubkey/broadcast-channel/issues/414
             * @link https://github.com/pubkey/broadcast-channel/issues/385
             */
            leaderElector._dpLC = true;
            leaderElector._dpL(); // message the lib user so the app can handle the problem
            _sendMessage(leaderElector, 'tell'); // ensure other leader also knows the problem
        }
    };
    leaderElector.broadcastChannel.addEventListener('internal', isLeaderListener);
    leaderElector._lstns.push(isLeaderListener);
    return _sendMessage(leaderElector, 'tell');
}


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

export function createLeaderElection(channel, options) {
    if (channel._leaderElector) {
        throw new Error('BroadcastChannel already has a leader-elector');
    }

    options = fillOptionsWithDefaults(options, channel);
    const elector = new LeaderElection(channel, options);
    channel._befC.push(() => elector.die());

    channel._leaderElector = elector;
    return elector;
}
