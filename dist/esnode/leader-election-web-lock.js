import { randomToken } from './util.js';
import { sendLeaderMessage, beLeader } from './leader-election-util.js';

/**
 * A faster version of the leader elector that uses the WebLock API
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 */
export var LeaderElectionWebLock = function LeaderElectionWebLock(broadcastChannel, options) {
  var _this = this;
  this.broadcastChannel = broadcastChannel;
  broadcastChannel._befC.push(function () {
    return _this.die();
  });
  this._options = options;
  this.isLeader = false;
  this.isDead = false;
  this.token = randomToken();
  this._lstns = [];
  this._unl = [];
  this._dpL = function () {}; // onduplicate listener
  this._dpLC = false; // true when onduplicate called

  this._wKMC = {}; // stuff for cleanup
};

LeaderElectionWebLock.prototype = {
  hasLeader: function hasLeader() {
    return navigator.locks.query().then(function (locks) {
      if (locks.held && locks.held.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  },
  awaitLeadership: function awaitLeadership() {
    var _this2 = this;
    if (!this._wLMP) {
      this._wKMC.c = new AbortController();
      var returnPromise = new Promise(function (res, rej) {
        _this2._wKMC.res = res;
        _this2._wKMC.rej = rej;
      });
      this._wLMP = new Promise(function (res) {
        var lockId = 'pubkey-bc||' + _this2.broadcastChannel.method.type + '||' + _this2.broadcastChannel.name;
        navigator.locks.request(lockId, {
          signal: _this2._wKMC.c.signal
        }, function () {
          beLeader(_this2);
          res();
          return returnPromise;
        });
      });
    }
    return this._wLMP;
  },
  set onduplicate(_fn) {
    // Do nothing because there are no duplicates in the WebLock version
  },
  die: function die() {
    var _this3 = this;
    var ret = sendLeaderMessage(this, 'death');
    this._lstns.forEach(function (listener) {
      return _this3.broadcastChannel.removeEventListener('internal', listener);
    });
    this._lstns = [];
    this._unl.forEach(function (uFn) {
      return uFn.remove();
    });
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