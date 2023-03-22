import {
    randomToken
} from './util.js';
import {
    sendLeaderMessage,
    beLeader
} from './leader-election-util.js';

/**
 * A faster version of the leader elector that uses the WebLock API
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 */
export const LeaderElectionWebLock = function (broadcastChannel, options) {
    this.broadcastChannel = broadcastChannel;
    broadcastChannel._befC.push(() => this.die());
    this._options = options;

    this.isLeader = false;
    this.isDead = false;
    this.token = randomToken();
    this._lstns = [];
    this._unl = [];
    this._dpL = () => { }; // onduplicate listener
    this._dpLC = false; // true when onduplicate called

    this._wKMC = {}; // stuff for cleanup
};



LeaderElectionWebLock.prototype = {
    hasLeader() {
        return navigator.locks.query().then(locks => {
            if (locks.held && locks.held.length > 0) {
                return true;
            } else {
                return false;
            }
        });
    },
    awaitLeadership() {
        if (!this._wLMP) {
            this._wKMC.c = new AbortController();
            const returnPromise = new Promise((res, rej) => {
                this._wKMC.res = res;
                this._wKMC.rej = rej;
            });
            this._wLMP = new Promise((res) => {
                const lockId = 'pubkey-bc||' + this.broadcastChannel.method.type + '||' + this.broadcastChannel.name;
                navigator.locks.request(
                    lockId,
                    {
                        signal: this._wKMC.c.signal
                    },
                    () => {
                        beLeader(this);
                        res();
                        return returnPromise;
                    }
                );
            });
        }
        return this._wLMP;
    },

    set onduplicate(_fn) {
        // Do nothing because there are no duplicates in the WebLock version
    },
    die() {
        const ret = sendLeaderMessage(this, 'death');
        this._lstns.forEach(listener => this.broadcastChannel.removeEventListener('internal', listener));
        this._lstns = [];
        this._unl.forEach(uFn => uFn.remove());
        this._unl = [];
        if (this.isLeader) {
            this.isLeader = false;
        }
        this.isDead = true;
        if (this._wKMC.res) {
            this._wKMC.res();
        }
        if (this._wKMC.c) {
            this._wKMC.c.abort();
        }
        return ret;
    }
};
