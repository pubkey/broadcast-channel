import { sleep, randomToken, PROMISE_RESOLVED_VOID, PROMISE_RESOLVED_TRUE } from './util.js';
import { add as unloadAdd } from 'unload';

var LeaderElection = function LeaderElection(broadcastChannel, options) {
  var _this = this;

  this.broadcastChannel = broadcastChannel;
  this._options = options;
  this.isLeader = false;
  this.hasLeader = false;
  this.isDead = false;
  this.token = randomToken();
  /**
   * Apply Queue,
   * used to ensure we do not run applyOnce()
   * in parallel.
   */

  this._aplQ = PROMISE_RESOLVED_VOID; // amount of unfinished applyOnce() calls

  this._aplQC = 0; // things to clean up

  this._unl = []; // _unloads

  this._lstns = []; // _listeners

  this._dpL = function () {}; // onduplicate listener


  this._dpLC = false; // true when onduplicate called

  /**
   * Even when the own instance is not applying,
   * we still listen to messages to ensure the hasLeader flag
   * is set correctly.
   */

  var hasLeaderListener = function hasLeaderListener(msg) {
    if (msg.context === 'leader') {
      if (msg.action === 'death') {
        _this.hasLeader = false;
      }

      if (msg.action === 'tell') {
        _this.hasLeader = true;
      }
    }
  };

  this.broadcastChannel.addEventListener('internal', hasLeaderListener);

  this._lstns.push(hasLeaderListener);
};

LeaderElection.prototype = {
  /**
   * Returns true if the instance is leader,
   * false if not.
   * @async
   */
  applyOnce: function applyOnce( // true if the applyOnce() call came from the fallbackInterval cycle
  isFromFallbackInterval) {
    var _this2 = this;

    if (this.isLeader) {
      return sleep(0, true);
    }

    if (this.isDead) {
      return sleep(0, false);
    }
    /**
     * Already applying more then once,
     * -> wait for the apply queue to be finished.
     */


    if (this._aplQC > 1) {
      return this._aplQ;
    }
    /**
     * Add a new apply-run
     */


    var applyRun = function applyRun() {
      /**
       * Optimization shortcuts.
       * Directly return if a previous run
       * has already elected a leader.
       */
      if (_this2.isLeader) {
        return PROMISE_RESOLVED_TRUE;
      }

      var stopCriteria = false;
      var stopCriteriaPromiseResolve;
      /**
       * Resolves when a stop criteria is reached.
       * Uses as a performance shortcut so we do not
       * have to await the responseTime when it is already clear
       * that the election failed.
       */

      var stopCriteriaPromise = new Promise(function (res) {
        stopCriteriaPromiseResolve = function stopCriteriaPromiseResolve() {
          stopCriteria = true;
          res();
        };
      });
      var recieved = [];

      var handleMessage = function handleMessage(msg) {
        if (msg.context === 'leader' && msg.token != _this2.token) {
          recieved.push(msg);

          if (msg.action === 'apply') {
            // other is applying
            if (msg.token > _this2.token) {
              /**
               * other has higher token
               * -> stop applying and let other become leader.
               */
              stopCriteriaPromiseResolve();
            }
          }

          if (msg.action === 'tell') {
            // other is already leader
            stopCriteriaPromiseResolve();
            _this2.hasLeader = true;
          }
        }
      };

      _this2.broadcastChannel.addEventListener('internal', handleMessage);
      /**
       * If the applyOnce() call came from the fallbackInterval,
       * we can assume that the election runs in the background and
       * not critical process is waiting for it.
       * When this is true, we give the other intances
       * more time to answer to messages in the election cycle.
       * This makes it less likely to elect duplicate leaders.
       * But also it takes longer which is not a problem because we anyway
       * run in the background.
       */


      var waitForAnswerTime = isFromFallbackInterval ? _this2._options.responseTime * 4 : _this2._options.responseTime;

      var applyPromise = _sendMessage(_this2, 'apply') // send out that this one is applying
      .then(function () {
        return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function () {
          return Promise.reject(new Error());
        })]);
      }) // send again in case another instance was just created
      .then(function () {
        return _sendMessage(_this2, 'apply');
      }) // let others time to respond
      .then(function () {
        return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function () {
          return Promise.reject(new Error());
        })]);
      })["catch"](function () {}).then(function () {
        _this2.broadcastChannel.removeEventListener('internal', handleMessage);

        if (!stopCriteria) {
          // no stop criteria -> own is leader
          return beLeader(_this2).then(function () {
            return true;
          });
        } else {
          // other is leader
          return false;
        }
      });

      return applyPromise;
    };

    this._aplQC = this._aplQC + 1;
    this._aplQ = this._aplQ.then(function () {
      return applyRun();
    }).then(function () {
      _this2._aplQC = _this2._aplQC - 1;
    });
    return this._aplQ.then(function () {
      return _this2.isLeader;
    });
  },
  awaitLeadership: function awaitLeadership() {
    if (
    /* _awaitLeadershipPromise */
    !this._aLP) {
      this._aLP = _awaitLeadershipOnce(this);
    }

    return this._aLP;
  },

  set onduplicate(fn) {
    this._dpL = fn;
  },

  die: function die() {
    var _this3 = this;

    this._lstns.forEach(function (listener) {
      return _this3.broadcastChannel.removeEventListener('internal', listener);
    });

    this._lstns = [];

    this._unl.forEach(function (uFn) {
      return uFn.remove();
    });

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

  return new Promise(function (res) {
    var resolved = false;

    function finish() {
      if (resolved) {
        return;
      }

      resolved = true;
      leaderElector.broadcastChannel.removeEventListener('internal', whenDeathListener);
      res(true);
    } // try once now


    leaderElector.applyOnce().then(function () {
      if (leaderElector.isLeader) {
        finish();
      }
    });
    /**
     * Try on fallbackInterval
     * @recursive
     */

    var tryOnFallBack = function tryOnFallBack() {
      return sleep(leaderElector._options.fallbackInterval).then(function () {
        if (leaderElector.isDead || resolved) {
          return;
        }

        if (leaderElector.isLeader) {
          finish();
        } else {
          return leaderElector.applyOnce(true).then(function () {
            if (leaderElector.isLeader) {
              finish();
            } else {
              tryOnFallBack();
            }
          });
        }
      });
    };

    tryOnFallBack(); // try when other leader dies

    var whenDeathListener = function whenDeathListener(msg) {
      if (msg.context === 'leader' && msg.action === 'death') {
        leaderElector.hasLeader = false;
        leaderElector.applyOnce().then(function () {
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
  var msgJson = {
    context: 'leader',
    action: action,
    token: leaderElector.token
  };
  return leaderElector.broadcastChannel.postInternal(msgJson);
}

export function beLeader(leaderElector) {
  leaderElector.isLeader = true;
  leaderElector.hasLeader = true;
  var unloadFn = unloadAdd(function () {
    return leaderElector.die();
  });

  leaderElector._unl.push(unloadFn);

  var isLeaderListener = function isLeaderListener(msg) {
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
  var elector = new LeaderElection(channel, options);

  channel._befC.push(function () {
    return elector.die();
  });

  channel._leaderElector = elector;
  return elector;
}