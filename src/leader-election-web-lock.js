import {
    randomToken
} from './util.js';


/**
 * A faster version of the leader elector that uses the WebLock API
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 */
export const LeaderElectionWebLock = function (broadcastChannel, options) {
    this.broadcastChannel = broadcastChannel;
    this._options = options;

    this.isLeader = false;
    this.hasLeader = false;
    this.isDead = false;
    this.token = randomToken();


    this._wKMC = {}; // stuff for cleanup
};



LeaderElectionWebLock.prototype = {
    awaitLeadership() {
        if (!this._wLMP) {
            this._wKMC.c = new AbortController();
            const returnPromise = new Promise((res, rej) => {
                this._wKMC.res = res;
                this._wKMC.rej = rej;
            });
            this._wLMP = new Promise((res) => {
                console.dir(this);
                const lockId = 'pubkey-bc||' + this.broadcastChannel.method.type + '||' + this.broadcastChannel.name;
                navigator.locks.request(
                    lockId,
                    {
                        signal: this._wKMC.c.signal
                    },
                    () => {
                        res();
                        return returnPromise;
                    }
                );
            });
        }
        return this._wLMP;
    },

    set onduplicate(fn) {
        this._dpL = fn;
    },

    die() {
        if (this.isLeader) {
            this.hasLeader = false;
            this.isLeader = false;
        }
        this.isDead = true;
        if (this._wKMC.res) {
            this._wKMC.res();
        }
        if (this._wKMC.c) {
            this._wKMC.c.abort();
        }
    }
};
