"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LeaderElectionWebLock = void 0;
var _util = require("./util.js");
var _leaderElectionUtil = require("./leader-election-util.js");
/**
 * A faster version of the leader elector that uses the WebLock API
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 */
var LeaderElectionWebLock = exports.LeaderElectionWebLock = function LeaderElectionWebLock(broadcastChannel, options) {
  var _this = this;
  this.broadcastChannel = broadcastChannel;
  broadcastChannel._befC.push(function () {
    return _this.die();
  });
  this._options = options;
  this.isLeader = false;
  this.isDead = false;
  this.token = (0, _util.randomToken)();
  this._lstns = [];
  this._unl = [];
  this._dpL = function () {}; // onduplicate listener
  this._dpLC = false; // true when onduplicate called

  this._wKMC = {}; // stuff for cleanup

  // lock name
  this.lN = 'pubkey-bc||' + broadcastChannel.method.type + '||' + broadcastChannel.name;
};
LeaderElectionWebLock.prototype = {
  hasLeader: function hasLeader() {
    var _this2 = this;
    return navigator.locks.query().then(function (locks) {
      var relevantLocks = locks.held ? locks.held.filter(function (lock) {
        return lock.name === _this2.lN;
      }) : [];
      if (relevantLocks && relevantLocks.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  },
  awaitLeadership: function awaitLeadership() {
    var _this3 = this;
    if (!this._wLMP) {
      this._wKMC.c = new AbortController();
      var returnPromise = new Promise(function (res, rej) {
        _this3._wKMC.res = res;
        _this3._wKMC.rej = rej;
      });
      this._wLMP = new Promise(function (res) {
        navigator.locks.request(_this3.lN, {
          signal: _this3._wKMC.c.signal
        }, function () {
          // if the lock resolved, we can drop the abort controller
          _this3._wKMC.c = undefined;
          (0, _leaderElectionUtil.beLeader)(_this3);
          res();
          return returnPromise;
        })["catch"](function () {});
      });
    }
    return this._wLMP;
  },
  set onduplicate(_fn) {
    // Do nothing because there are no duplicates in the WebLock version
  },
  die: function die() {
    var _this4 = this;
    this._lstns.forEach(function (listener) {
      return _this4.broadcastChannel.removeEventListener('internal', listener);
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
      this._wKMC.c.abort('LeaderElectionWebLock.die() called');
    }
    return (0, _leaderElectionUtil.sendLeaderMessage)(this, 'death');
  }
};