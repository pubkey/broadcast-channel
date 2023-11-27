(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OPEN_BROADCAST_CHANNELS = exports.BroadcastChannel = void 0;
exports.clearNodeFolder = clearNodeFolder;
exports.enforceOptions = enforceOptions;
var _util = require("./util.js");
var _methodChooser = require("./method-chooser.js");
var _options = require("./options.js");
/**
 * Contains all open channels,
 * used in tests to ensure everything is closed.
 */
var OPEN_BROADCAST_CHANNELS = exports.OPEN_BROADCAST_CHANNELS = new Set();
var lastId = 0;
var BroadcastChannel = exports.BroadcastChannel = function BroadcastChannel(name, options) {
  // identifier of the channel to debug stuff
  this.id = lastId++;
  OPEN_BROADCAST_CHANNELS.add(this);
  this.name = name;
  if (ENFORCED_OPTIONS) {
    options = ENFORCED_OPTIONS;
  }
  this.options = (0, _options.fillOptionsWithDefaults)(options);
  this.method = (0, _methodChooser.chooseMethod)(this.options);

  // isListening
  this._iL = false;

  /**
   * _onMessageListener
   * setting onmessage twice,
   * will overwrite the first listener
   */
  this._onML = null;

  /**
   * _addEventListeners
   */
  this._addEL = {
    message: [],
    internal: []
  };

  /**
   * Unsent message promises
   * where the sending is still in progress
   * @type {Set<Promise>}
   */
  this._uMP = new Set();

  /**
   * _beforeClose
   * array of promises that will be awaited
   * before the channel is closed
   */
  this._befC = [];

  /**
   * _preparePromise
   */
  this._prepP = null;
  _prepareChannel(this);
};

// STATICS

/**
 * used to identify if someone overwrites
 * window.BroadcastChannel with this
 * See methods/native.js
 */
BroadcastChannel._pubkey = true;

/**
 * clears the tmp-folder if is node
 * @return {Promise<boolean>} true if has run, false if not node
 */
function clearNodeFolder(options) {
  options = (0, _options.fillOptionsWithDefaults)(options);
  var method = (0, _methodChooser.chooseMethod)(options);
  if (method.type === 'node') {
    return method.clearNodeFolder().then(function () {
      return true;
    });
  } else {
    return _util.PROMISE_RESOLVED_FALSE;
  }
}

/**
 * if set, this method is enforced,
 * no mather what the options are
 */
var ENFORCED_OPTIONS;
function enforceOptions(options) {
  ENFORCED_OPTIONS = options;
}

// PROTOTYPE
BroadcastChannel.prototype = {
  postMessage: function postMessage(msg) {
    if (this.closed) {
      throw new Error('BroadcastChannel.postMessage(): ' + 'Cannot post message after channel has closed ' +
      /**
       * In the past when this error appeared, it was really hard to debug.
       * So now we log the msg together with the error so it at least
       * gives some clue about where in your application this happens.
       */
      JSON.stringify(msg));
    }
    return _post(this, 'message', msg);
  },
  postInternal: function postInternal(msg) {
    return _post(this, 'internal', msg);
  },
  set onmessage(fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };
    _removeListenerObject(this, 'message', this._onML);
    if (fn && typeof fn === 'function') {
      this._onML = listenObj;
      _addListenerObject(this, 'message', listenObj);
    } else {
      this._onML = null;
    }
  },
  addEventListener: function addEventListener(type, fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };
    _addListenerObject(this, type, listenObj);
  },
  removeEventListener: function removeEventListener(type, fn) {
    var obj = this._addEL[type].find(function (obj) {
      return obj.fn === fn;
    });
    _removeListenerObject(this, type, obj);
  },
  close: function close() {
    var _this = this;
    if (this.closed) {
      return;
    }
    OPEN_BROADCAST_CHANNELS["delete"](this);
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : _util.PROMISE_RESOLVED_VOID;
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare
    // wait until all current sending are processed
    .then(function () {
      return Promise.all(Array.from(_this._uMP));
    })
    // run before-close hooks
    .then(function () {
      return Promise.all(_this._befC.map(function (fn) {
        return fn();
      }));
    })
    // close the channel
    .then(function () {
      return _this.method.close(_this._state);
    });
  },
  get type() {
    return this.method.type;
  },
  get isClosed() {
    return this.closed;
  }
};

/**
 * Post a message over the channel
 * @returns {Promise} that resolved when the message sending is done
 */
function _post(broadcastChannel, type, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time: time,
    type: type,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : _util.PROMISE_RESOLVED_VOID;
  return awaitPrepare.then(function () {
    var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);

    // add/remove to unsent messages list
    broadcastChannel._uMP.add(sendPromise);
    sendPromise["catch"]().then(function () {
      return broadcastChannel._uMP["delete"](sendPromise);
    });
    return sendPromise;
  });
}
function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);
  if ((0, _util.isPromise)(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function (s) {
      // used in tests to simulate slow runtime
      /*if (channel.options.prepareDelay) {
           await new Promise(res => setTimeout(res, this.options.prepareDelay));
      }*/
      channel._state = s;
    });
  } else {
    channel._state = maybePromise;
  }
}
function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}
function _addListenerObject(channel, type, obj) {
  channel._addEL[type].push(obj);
  _startListening(channel);
}
function _removeListenerObject(channel, type, obj) {
  channel._addEL[type] = channel._addEL[type].filter(function (o) {
    return o !== obj;
  });
  _stopListening(channel);
}
function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    // someone is listening, start subscribing

    var listenerFn = function listenerFn(msgObj) {
      channel._addEL[msgObj.type].forEach(function (listenerObject) {
        if (msgObj.time >= listenerObject.time) {
          listenerObject.fn(msgObj.data);
        }
      });
    };
    var time = channel.method.microSeconds();
    if (channel._prepP) {
      channel._prepP.then(function () {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}
function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    // no one is listening, stop subscribing
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}
},{"./method-chooser.js":8,"./options.js":13,"./util.js":14}],2:[function(require,module,exports){
"use strict";

var _module = require('./index.es5.js');
var BroadcastChannel = _module.BroadcastChannel;
var createLeaderElection = _module.createLeaderElection;
window['BroadcastChannel2'] = BroadcastChannel;
window['createLeaderElection'] = createLeaderElection;
},{"./index.es5.js":3}],3:[function(require,module,exports){
"use strict";

var _index = require("./index.js");
/**
 * because babel can only export on default-attribute,
 * we use this for the non-module-build
 * this ensures that users do not have to use
 * var BroadcastChannel = require('broadcast-channel').default;
 * but
 * var BroadcastChannel = require('broadcast-channel');
 */

module.exports = {
  BroadcastChannel: _index.BroadcastChannel,
  createLeaderElection: _index.createLeaderElection,
  clearNodeFolder: _index.clearNodeFolder,
  enforceOptions: _index.enforceOptions,
  beLeader: _index.beLeader
};
},{"./index.js":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BroadcastChannel", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.BroadcastChannel;
  }
});
Object.defineProperty(exports, "OPEN_BROADCAST_CHANNELS", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.OPEN_BROADCAST_CHANNELS;
  }
});
Object.defineProperty(exports, "beLeader", {
  enumerable: true,
  get: function get() {
    return _leaderElectionUtil.beLeader;
  }
});
Object.defineProperty(exports, "clearNodeFolder", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.clearNodeFolder;
  }
});
Object.defineProperty(exports, "createLeaderElection", {
  enumerable: true,
  get: function get() {
    return _leaderElection.createLeaderElection;
  }
});
Object.defineProperty(exports, "enforceOptions", {
  enumerable: true,
  get: function get() {
    return _broadcastChannel.enforceOptions;
  }
});
var _broadcastChannel = require("./broadcast-channel.js");
var _leaderElection = require("./leader-election.js");
var _leaderElectionUtil = require("./leader-election-util.js");
},{"./broadcast-channel.js":1,"./leader-election-util.js":5,"./leader-election.js":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beLeader = beLeader;
exports.sendLeaderMessage = sendLeaderMessage;
var _unload = require("unload");
/**
 * sends and internal message over the broadcast-channel
 */
function sendLeaderMessage(leaderElector, action) {
  var msgJson = {
    context: 'leader',
    action: action,
    token: leaderElector.token
  };
  return leaderElector.broadcastChannel.postInternal(msgJson);
}
function beLeader(leaderElector) {
  leaderElector.isLeader = true;
  leaderElector._hasLeader = true;
  var unloadFn = (0, _unload.add)(function () {
    return leaderElector.die();
  });
  leaderElector._unl.push(unloadFn);
  var isLeaderListener = function isLeaderListener(msg) {
    if (msg.context === 'leader' && msg.action === 'apply') {
      sendLeaderMessage(leaderElector, 'tell');
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
      sendLeaderMessage(leaderElector, 'tell'); // ensure other leader also knows the problem
    }
  };

  leaderElector.broadcastChannel.addEventListener('internal', isLeaderListener);
  leaderElector._lstns.push(isLeaderListener);
  return sendLeaderMessage(leaderElector, 'tell');
}
},{"unload":20}],6:[function(require,module,exports){
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
},{"./leader-election-util.js":5,"./util.js":14}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLeaderElection = createLeaderElection;
var _util = require("./util.js");
var _leaderElectionUtil = require("./leader-election-util.js");
var _leaderElectionWebLock = require("./leader-election-web-lock.js");
var LeaderElection = function LeaderElection(broadcastChannel, options) {
  var _this = this;
  this.broadcastChannel = broadcastChannel;
  this._options = options;
  this.isLeader = false;
  this._hasLeader = false;
  this.isDead = false;
  this.token = (0, _util.randomToken)();

  /**
   * Apply Queue,
   * used to ensure we do not run applyOnce()
   * in parallel.
   */
  this._aplQ = _util.PROMISE_RESOLVED_VOID;
  // amount of unfinished applyOnce() calls
  this._aplQC = 0;

  // things to clean up
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
        _this._hasLeader = false;
      }
      if (msg.action === 'tell') {
        _this._hasLeader = true;
      }
    }
  };
  this.broadcastChannel.addEventListener('internal', hasLeaderListener);
  this._lstns.push(hasLeaderListener);
};
LeaderElection.prototype = {
  hasLeader: function hasLeader() {
    return Promise.resolve(this._hasLeader);
  },
  /**
   * Returns true if the instance is leader,
   * false if not.
   * @async
   */
  applyOnce: function applyOnce(
  // true if the applyOnce() call came from the fallbackInterval cycle
  isFromFallbackInterval) {
    var _this2 = this;
    if (this.isLeader) {
      return (0, _util.sleep)(0, true);
    }
    if (this.isDead) {
      return (0, _util.sleep)(0, false);
    }

    /**
     * Already applying more than once,
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
        return _util.PROMISE_RESOLVED_TRUE;
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
      var handleMessage = function handleMessage(msg) {
        if (msg.context === 'leader' && msg.token != _this2.token) {
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
            _this2._hasLeader = true;
          }
        }
      };
      _this2.broadcastChannel.addEventListener('internal', handleMessage);

      /**
       * If the applyOnce() call came from the fallbackInterval,
       * we can assume that the election runs in the background and
       * not critical process is waiting for it.
       * When this is true, we give the other instances
       * more time to answer to messages in the election cycle.
       * This makes it less likely to elect duplicate leaders.
       * But also it takes longer which is not a problem because we anyway
       * run in the background.
       */
      var waitForAnswerTime = isFromFallbackInterval ? _this2._options.responseTime * 4 : _this2._options.responseTime;
      return (0, _leaderElectionUtil.sendLeaderMessage)(_this2, 'apply') // send out that this one is applying
      .then(function () {
        return Promise.race([(0, _util.sleep)(waitForAnswerTime), stopCriteriaPromise.then(function () {
          return Promise.reject(new Error());
        })]);
      })
      // send again in case another instance was just created
      .then(function () {
        return (0, _leaderElectionUtil.sendLeaderMessage)(_this2, 'apply');
      })
      // let others time to respond
      .then(function () {
        return Promise.race([(0, _util.sleep)(waitForAnswerTime), stopCriteriaPromise.then(function () {
          return Promise.reject(new Error());
        })]);
      })["catch"](function () {}).then(function () {
        _this2.broadcastChannel.removeEventListener('internal', handleMessage);
        if (!stopCriteria) {
          // no stop criteria -> own is leader
          return (0, _leaderElectionUtil.beLeader)(_this2).then(function () {
            return true;
          });
        } else {
          // other is leader
          return false;
        }
      });
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
    if ( /* _awaitLeadershipPromise */
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
      this._hasLeader = false;
      this.isLeader = false;
    }
    this.isDead = true;
    return (0, _leaderElectionUtil.sendLeaderMessage)(this, 'death');
  }
};

/**
 * @param leaderElector {LeaderElector}
 */
function _awaitLeadershipOnce(leaderElector) {
  if (leaderElector.isLeader) {
    return _util.PROMISE_RESOLVED_VOID;
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
    }

    // try once now
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
      return (0, _util.sleep)(leaderElector._options.fallbackInterval).then(function () {
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
    tryOnFallBack();

    // try when other leader dies
    var whenDeathListener = function whenDeathListener(msg) {
      if (msg.context === 'leader' && msg.action === 'death') {
        leaderElector._hasLeader = false;
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
function createLeaderElection(channel, options) {
  if (channel._leaderElector) {
    throw new Error('BroadcastChannel already has a leader-elector');
  }
  options = fillOptionsWithDefaults(options, channel);
  var elector = (0, _util.supportsWebLockAPI)() ? new _leaderElectionWebLock.LeaderElectionWebLock(channel, options) : new LeaderElection(channel, options);
  channel._befC.push(function () {
    return elector.die();
  });
  channel._leaderElector = elector;
  return elector;
}
},{"./leader-election-util.js":5,"./leader-election-web-lock.js":6,"./util.js":14}],8:[function(require,module,exports){
"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chooseMethod = chooseMethod;
var _native = require("./methods/native.js");
var _indexedDb = require("./methods/indexed-db.js");
var _localstorage = require("./methods/localstorage.js");
var _simulate = require("./methods/simulate.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// the line below will be removed from es5/browser builds

// order is important
var METHODS = [_native.NativeMethod,
// fastest
_indexedDb.IndexedDBMethod, _localstorage.LocalstorageMethod];
function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);

  // the line below will be removed from es5/browser builds

  // directly chosen
  if (options.type) {
    if (options.type === 'simulate') {
      // only use simulate-method if directly chosen
      return _simulate.SimulateMethod;
    }
    var ret = chooseMethods.find(function (m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
  }

  /**
   * if no webworker support is needed,
   * remove idb from the list so that localstorage will be chosen
   */
  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter(function (m) {
      return m.type !== 'idb';
    });
  }
  var useMethod = chooseMethods.find(function (method) {
    return method.canBeUsed();
  });
  if (!useMethod) {
    throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function (m) {
      return m.type;
    })));
  } else {
    return useMethod;
  }
}
},{"./methods/indexed-db.js":9,"./methods/localstorage.js":10,"./methods/native.js":11,"./methods/simulate.js":12,"@babel/runtime/helpers/typeof":15}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRANSACTION_SETTINGS = exports.IndexedDBMethod = void 0;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.cleanOldMessages = cleanOldMessages;
exports.close = close;
exports.commitIndexedDBTransaction = commitIndexedDBTransaction;
exports.create = create;
exports.createDatabase = createDatabase;
exports.getAllMessages = getAllMessages;
exports.getIdb = getIdb;
exports.getMessagesHigherThan = getMessagesHigherThan;
exports.getOldMessages = getOldMessages;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.removeMessagesById = removeMessagesById;
exports.type = void 0;
exports.writeMessage = writeMessage;
var _util = require("../util.js");
var _obliviousSet = require("oblivious-set");
var _options = require("../options.js");
/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 * 
 * When working on this, ensure to use these performance optimizations:
 * @link https://rxdb.info/slow-indexeddb.html
 */

var microSeconds = exports.microSeconds = _util.microSeconds;
var DB_PREFIX = 'pubkey.broadcast-channel-0-';
var OBJECT_STORE_ID = 'messages';

/**
 * Use relaxed durability for faster performance on all transactions.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
var TRANSACTION_SETTINGS = exports.TRANSACTION_SETTINGS = {
  durability: 'relaxed'
};
var type = exports.type = 'idb';
function getIdb() {
  if (typeof indexedDB !== 'undefined') return indexedDB;
  if (typeof window !== 'undefined') {
    if (typeof window.mozIndexedDB !== 'undefined') return window.mozIndexedDB;
    if (typeof window.webkitIndexedDB !== 'undefined') return window.webkitIndexedDB;
    if (typeof window.msIndexedDB !== 'undefined') return window.msIndexedDB;
  }
  return false;
}

/**
 * If possible, we should explicitly commit IndexedDB transactions
 * for better performance.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
function commitIndexedDBTransaction(tx) {
  if (tx.commit) {
    tx.commit();
  }
}
function createDatabase(channelName) {
  var IndexedDB = getIdb();

  // create table
  var dbName = DB_PREFIX + channelName;

  /**
   * All IndexedDB databases are opened without version
   * because it is a bit faster, especially on firefox
   * @link http://nparashuram.com/IndexedDB/perf/#Open%20Database%20with%20version
   */
  var openRequest = IndexedDB.open(dbName);
  openRequest.onupgradeneeded = function (ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: 'id',
      autoIncrement: true
    });
  };
  return new Promise(function (res, rej) {
    openRequest.onerror = function (ev) {
      return rej(ev);
    };
    openRequest.onsuccess = function () {
      res(openRequest.result);
    };
  });
}

/**
 * writes the new message to the database
 * so other readers can find it
 */
function writeMessage(db, readerUuid, messageJson) {
  var time = Date.now();
  var writeObject = {
    uuid: readerUuid,
    time: time,
    data: messageJson
  };
  var tx = db.transaction([OBJECT_STORE_ID], 'readwrite', TRANSACTION_SETTINGS);
  return new Promise(function (res, rej) {
    tx.oncomplete = function () {
      return res();
    };
    tx.onerror = function (ev) {
      return rej(ev);
    };
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
    commitIndexedDBTransaction(tx);
  });
}
function getAllMessages(db) {
  var tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;
      if (cursor) {
        ret.push(cursor.value);
        //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
        cursor["continue"]();
      } else {
        commitIndexedDBTransaction(tx);
        res(ret);
      }
    };
  });
}
function getMessagesHigherThan(db, lastCursorId) {
  var tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);

  /**
   * Optimization shortcut,
   * if getAll() can be used, do not use a cursor.
   * @link https://rxdb.info/slow-indexeddb.html
   */
  if (objectStore.getAll) {
    var getAllRequest = objectStore.getAll(keyRangeValue);
    return new Promise(function (res, rej) {
      getAllRequest.onerror = function (err) {
        return rej(err);
      };
      getAllRequest.onsuccess = function (e) {
        res(e.target.result);
      };
    });
  }
  function openCursor() {
    // Occasionally Safari will fail on IDBKeyRange.bound, this
    // catches that error, having it open the cursor to the first
    // item. When it gets data it will advance to the desired key.
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e) {
      return objectStore.openCursor();
    }
  }
  return new Promise(function (res, rej) {
    var openCursorRequest = openCursor();
    openCursorRequest.onerror = function (err) {
      return rej(err);
    };
    openCursorRequest.onsuccess = function (ev) {
      var cursor = ev.target.result;
      if (cursor) {
        if (cursor.value.id < lastCursorId + 1) {
          cursor["continue"](lastCursorId + 1);
        } else {
          ret.push(cursor.value);
          cursor["continue"]();
        }
      } else {
        commitIndexedDBTransaction(tx);
        res(ret);
      }
    };
  });
}
function removeMessagesById(channelState, ids) {
  if (channelState.closed) {
    return Promise.resolve([]);
  }
  var tx = channelState.db.transaction(OBJECT_STORE_ID, 'readwrite', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  return Promise.all(ids.map(function (id) {
    var deleteRequest = objectStore["delete"](id);
    return new Promise(function (res) {
      deleteRequest.onsuccess = function () {
        return res();
      };
    });
  }));
}
function getOldMessages(db, ttl) {
  var olderThen = Date.now() - ttl;
  var tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;
      if (cursor) {
        var msgObk = cursor.value;
        if (msgObk.time < olderThen) {
          ret.push(msgObk);
          //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
          cursor["continue"]();
        } else {
          // no more old messages,
          commitIndexedDBTransaction(tx);
          res(ret);
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(channelState) {
  return getOldMessages(channelState.db, channelState.options.idb.ttl).then(function (tooOld) {
    return removeMessagesById(channelState, tooOld.map(function (msg) {
      return msg.id;
    }));
  });
}
function create(channelName, options) {
  options = (0, _options.fillOptionsWithDefaults)(options);
  return createDatabase(channelName).then(function (db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName: channelName,
      options: options,
      uuid: (0, _util.randomToken)(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new _obliviousSet.ObliviousSet(options.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: _util.PROMISE_RESOLVED_VOID,
      messagesCallback: null,
      readQueuePromises: [],
      db: db
    };

    /**
     * Handle abrupt closes that do not originate from db.close().
     * This could happen, for example, if the underlying storage is
     * removed or if the user clears the database in the browser's
     * history preferences.
     */
    db.onclose = function () {
      state.closed = true;
      if (options.idb.onclose) options.idb.onclose();
    };

    /**
     * if service-workers are used,
     * we have no 'storage'-event if they post a message,
     * therefore we also have to set an interval
     */
    _readLoop(state);
    return state;
  });
}
function _readLoop(state) {
  if (state.closed) return;
  readNewMessages(state).then(function () {
    return (0, _util.sleep)(state.options.idb.fallbackInterval);
  }).then(function () {
    return _readLoop(state);
  });
}
function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid) return false; // send by own
  if (state.eMIs.has(msgObj.id)) return false; // already emitted
  if (msgObj.data.time < state.messagesCallbackTime) return false; // older then onMessageCallback
  return true;
}

/**
 * reads all new messages from the database and emits them
 */
function readNewMessages(state) {
  // channel already closed
  if (state.closed) return _util.PROMISE_RESOLVED_VOID;

  // if no one is listening, we do not need to scan for new messages
  if (!state.messagesCallback) return _util.PROMISE_RESOLVED_VOID;
  return getMessagesHigherThan(state.db, state.lastCursorId).then(function (newerMessages) {
    var useMessages = newerMessages
    /**
     * there is a bug in iOS where the msgObj can be undefined sometimes
     * so we filter them out
     * @link https://github.com/pubkey/broadcast-channel/issues/19
     */.filter(function (msgObj) {
      return !!msgObj;
    }).map(function (msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }
      return msgObj;
    }).filter(function (msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function (msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    }); // sort by time
    useMessages.forEach(function (msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return _util.PROMISE_RESOLVED_VOID;
  });
}
function close(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function postMessage(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function () {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function () {
    if ((0, _util.randomInt)(0, 10) === 0) {
      /* await (do not await) */
      cleanOldMessages(channelState);
    }
  });
  return channelState.writeBlockPromise;
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function canBeUsed() {
  return !!getIdb();
}
function averageResponseTime(options) {
  return options.idb.fallbackInterval * 2;
}
var IndexedDBMethod = exports.IndexedDBMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};
},{"../options.js":13,"../util.js":14,"oblivious-set":16}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalstorageMethod = void 0;
exports.addStorageEventListener = addStorageEventListener;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports.getLocalStorage = getLocalStorage;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.removeStorageEventListener = removeStorageEventListener;
exports.storageKey = storageKey;
exports.type = void 0;
var _obliviousSet = require("oblivious-set");
var _options = require("../options.js");
var _util = require("../util.js");
/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside webworkers because they have no access to localstorage
 * This is basically implemented to support IE9 or your grandmother's toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */

var microSeconds = exports.microSeconds = _util.microSeconds;
var KEY_PREFIX = 'pubkey.broadcastChannel-';
var type = exports.type = 'localstorage';

/**
 * copied from crosstab
 * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
 */
function getLocalStorage() {
  var localStorage;
  if (typeof window === 'undefined') return null;
  try {
    localStorage = window.localStorage;
    localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
  } catch (e) {
    // New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }
  return localStorage;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}

/**
* writes the new message to the storage
* and fires the storage-event so other readers can find it
*/
function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    (0, _util.sleep)().then(function () {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: (0, _util.randomToken)(),
        time: Date.now(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      getLocalStorage().setItem(key, value);

      /**
       * StorageEvent does not fire the 'storage' event
       * in the window that changes the state of the local storage.
       * So we fire it manually
       */
      var ev = document.createEvent('Event');
      ev.initEvent('storage', true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var listener = function listener(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };
  window.addEventListener('storage', listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener('storage', listener);
}
function create(channelName, options) {
  options = (0, _options.fillOptionsWithDefaults)(options);
  if (!canBeUsed()) {
    throw new Error('BroadcastChannel: localstorage cannot be used');
  }
  var uuid = (0, _util.randomToken)();

  /**
   * eMIs
   * contains all messages that have been emitted before
   * @type {ObliviousSet}
   */
  var eMIs = new _obliviousSet.ObliviousSet(options.localstorage.removeTimeout);
  var state = {
    channelName: channelName,
    uuid: uuid,
    eMIs: eMIs // emittedMessagesIds
  };

  state.listener = addStorageEventListener(channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener
    if (msgObj.uuid === uuid) return; // own message
    if (!msgObj.token || eMIs.has(msgObj.token)) return; // already emitted
    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function close(channelState) {
  removeStorageEventListener(channelState.listener);
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  var ls = getLocalStorage();
  if (!ls) return false;
  try {
    var key = '__broadcastchannel_check';
    ls.setItem(key, 'works');
    ls.removeItem(key);
  } catch (e) {
    // Safari 10 in private mode will not allow write access to local
    // storage and fail with a QuotaExceededError. See
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API#Private_Browsing_Incognito_modes
    return false;
  }
  return true;
}
function averageResponseTime() {
  var defaultTime = 120;
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    // safari is much slower so this time is higher
    return defaultTime * 2;
  }
  return defaultTime;
}
var LocalstorageMethod = exports.LocalstorageMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};
},{"../options.js":13,"../util.js":14,"oblivious-set":16}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeMethod = void 0;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.type = void 0;
var _util = require("../util.js");
var microSeconds = exports.microSeconds = _util.microSeconds;
var type = exports.type = 'native';
function create(channelName) {
  var state = {
    time: (0, _util.microSeconds)(),
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: [] // subscriberFunctions
  };

  state.bc.onmessage = function (msgEvent) {
    if (state.messagesCallback) {
      state.messagesCallback(msgEvent.data);
    }
  };
  return state;
}
function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  try {
    channelState.bc.postMessage(messageJson, false);
    return _util.PROMISE_RESOLVED_VOID;
  } catch (err) {
    return Promise.reject(err);
  }
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  // Deno runtime
  // eslint-disable-next-line
  if (typeof globalThis !== 'undefined' && globalThis.Deno && globalThis.Deno.args) {
    return true;
  }

  // Browser runtime
  if ((typeof window !== 'undefined' || typeof self !== 'undefined') && typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }
    return true;
  } else {
    return false;
  }
}
function averageResponseTime() {
  return 150;
}
var NativeMethod = exports.NativeMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};
},{"../util.js":14}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimulateMethod = exports.SIMULATE_DELAY_TIME = void 0;
exports.averageResponseTime = averageResponseTime;
exports.canBeUsed = canBeUsed;
exports.close = close;
exports.create = create;
exports.microSeconds = void 0;
exports.onMessage = onMessage;
exports.postMessage = postMessage;
exports.type = void 0;
var _util = require("../util.js");
var microSeconds = exports.microSeconds = _util.microSeconds;
var type = exports.type = 'simulate';
var SIMULATE_CHANNELS = new Set();
function create(channelName) {
  var state = {
    time: microSeconds(),
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
var SIMULATE_DELAY_TIME = exports.SIMULATE_DELAY_TIME = 5;
function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    return setTimeout(function () {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.forEach(function (channel) {
        if (channel.name === channelState.name &&
        // has same name
        channel !== channelState &&
        // not own channel
        !!channel.messagesCallback &&
        // has subscribers
        channel.time < messageJson.time // channel not created after postMessage() call
        ) {
          channel.messagesCallback(messageJson);
        }
      });
      res();
    }, SIMULATE_DELAY_TIME);
  });
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  return true;
}
function averageResponseTime() {
  return SIMULATE_DELAY_TIME;
}
var SimulateMethod = exports.SimulateMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};
},{"../util.js":14}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillOptionsWithDefaults = fillOptionsWithDefaults;
function fillOptionsWithDefaults() {
  var originalOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = JSON.parse(JSON.stringify(originalOptions));

  // main
  if (typeof options.webWorkerSupport === 'undefined') options.webWorkerSupport = true;

  // indexed-db
  if (!options.idb) options.idb = {};
  //  after this time the messages get deleted
  if (!options.idb.ttl) options.idb.ttl = 1000 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
  //  handles abrupt db onclose events.
  if (originalOptions.idb && typeof originalOptions.idb.onclose === 'function') options.idb.onclose = originalOptions.idb.onclose;

  // localstorage
  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1000 * 60;

  // custom methods
  if (originalOptions.methods) options.methods = originalOptions.methods;

  // node
  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1000 * 60 * 2; // 2 minutes;
  /**
   * On linux use 'ulimit -Hn' to get the limit of open files.
   * On ubuntu this was 4096 for me, so we use half of that as maxParallelWrites default.
   */
  if (!options.node.maxParallelWrites) options.node.maxParallelWrites = 2048;
  if (typeof options.node.useFastPath === 'undefined') options.node.useFastPath = true;
  return options;
}
},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROMISE_RESOLVED_VOID = exports.PROMISE_RESOLVED_TRUE = exports.PROMISE_RESOLVED_FALSE = void 0;
exports.isPromise = isPromise;
exports.microSeconds = microSeconds;
exports.randomInt = randomInt;
exports.randomToken = randomToken;
exports.sleep = sleep;
exports.supportsWebLockAPI = supportsWebLockAPI;
/**
 * returns true if the given object is a promise
 */
function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}
var PROMISE_RESOLVED_FALSE = exports.PROMISE_RESOLVED_FALSE = Promise.resolve(false);
var PROMISE_RESOLVED_TRUE = exports.PROMISE_RESOLVED_TRUE = Promise.resolve(true);
var PROMISE_RESOLVED_VOID = exports.PROMISE_RESOLVED_VOID = Promise.resolve();
function sleep(time, resolveWith) {
  if (!time) time = 0;
  return new Promise(function (res) {
    return setTimeout(function () {
      return res(resolveWith);
    }, time);
  });
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * https://stackoverflow.com/a/8084248
 */
function randomToken() {
  return Math.random().toString(36).substring(2);
}
var lastMs = 0;

/**
 * Returns the current unix time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */
function microSeconds() {
  var ret = Date.now() * 1000; // milliseconds to microseconds
  if (ret <= lastMs) {
    ret = lastMs + 1;
  }
  lastMs = ret;
  return ret;
}

/**
 * Check if WebLock API is supported.
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 */
function supportsWebLockAPI() {
  if (typeof navigator !== 'undefined' && typeof navigator.locks !== 'undefined' && typeof navigator.locks.request === 'function') {
    return true;
  } else {
    return false;
  }
}
},{}],15:[function(require,module,exports){
function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],16:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = __importStar(require("./index.js"));
module.exports = pkg;

},{"./index.js":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = exports.removeTooOldValues = exports.ObliviousSet = void 0;
/**
 * this is a set which automatically forgets
 * a given entry when a new entry is set and the ttl
 * of the old one is over
 */
class ObliviousSet {
    ttl;
    map = new Map();
    /**
     * Creating calls to setTimeout() is expensive,
     * so we only do that if there is not timeout already open.
     */
    _to = false;
    constructor(ttl) {
        this.ttl = ttl;
    }
    has(value) {
        return this.map.has(value);
    }
    add(value) {
        this.map.set(value, now());
        /**
         * When a new value is added,
         * start the cleanup at the next tick
         * to not block the cpu for more important stuff
         * that might happen.
         */
        if (!this._to) {
            this._to = true;
            setTimeout(() => {
                this._to = false;
                removeTooOldValues(this);
            }, 0);
        }
    }
    clear() {
        this.map.clear();
    }
}
exports.ObliviousSet = ObliviousSet;
/**
 * Removes all entries from the set
 * where the TTL has expired
 */
function removeTooOldValues(obliviousSet) {
    const olderThen = now() - obliviousSet.ttl;
    const iterator = obliviousSet.map[Symbol.iterator]();
    /**
     * Because we can assume the new values are added at the bottom,
     * we start from the top and stop as soon as we reach a non-too-old value.
     */
    while (true) {
        const next = iterator.next().value;
        if (!next) {
            return; // no more elements
        }
        const value = next[0];
        const time = next[1];
        if (time < olderThen) {
            obliviousSet.map.delete(value);
        }
        else {
            // We reached a value that is not old enough
            return;
        }
    }
}
exports.removeTooOldValues = removeTooOldValues;
function now() {
    return Date.now();
}
exports.now = now;

},{}],18:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addBrowser = addBrowser;
/* global WorkerGlobalScope */

function addBrowser(fn) {
  if (typeof WorkerGlobalScope === 'function' && self instanceof WorkerGlobalScope) {
    /**
     * Because killing a worker does directly stop the excution
     * of the code, our only chance is to overwrite the close function
     * which could work some times.
     * @link https://stackoverflow.com/q/72903255/3443137
     */
    var oldClose = self.close.bind(self);
    self.close = function () {
      fn();
      return oldClose();
    };
  } else {
    /**
     * if we are on react-native, there is no window.addEventListener
     * @link https://github.com/pubkey/unload/issues/6
     */
    if (typeof window.addEventListener !== 'function') {
      return;
    }

    /**
     * for normal browser-windows, we use the beforeunload-event
     */
    window.addEventListener('beforeunload', function () {
      fn();
    }, true);

    /**
     * for iframes, we have to use the unload-event
     * @link https://stackoverflow.com/q/47533670/3443137
     */
    window.addEventListener('unload', function () {
      fn();
    }, true);
  }

  /**
   * TODO add fallback for safari-mobile
   * @link https://stackoverflow.com/a/26193516/3443137
   */
}
},{}],20:[function(require,module,exports){
(function (process){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.getSize = getSize;
exports.removeAll = removeAll;
exports.runAll = runAll;
var _browser = require("./browser.js");
var _node = require("./node.js");
/**
 * Use the code directly to prevent import problems
 * with the detect-node package.
 * @link https://github.com/iliakan/detect-node/blob/master/index.js
 */
var isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
var USE_METHOD = isNode ? _node.addNode : _browser.addBrowser;
var LISTENERS = new Set();
var startedListening = false;
function startListening() {
  if (startedListening) {
    return;
  }
  startedListening = true;
  USE_METHOD(runAll);
}
function add(fn) {
  startListening();
  if (typeof fn !== 'function') {
    throw new Error('Listener is no function');
  }
  LISTENERS.add(fn);
  var addReturn = {
    remove: function remove() {
      return LISTENERS["delete"](fn);
    },
    run: function run() {
      LISTENERS["delete"](fn);
      return fn();
    }
  };
  return addReturn;
}
function runAll() {
  var promises = [];
  LISTENERS.forEach(function (fn) {
    promises.push(fn());
    LISTENERS["delete"](fn);
  });
  return Promise.all(promises);
}
function removeAll() {
  LISTENERS.clear();
}
function getSize() {
  return LISTENERS.size;
}
}).call(this)}).call(this,require('_process'))
},{"./browser.js":19,"./node.js":21,"_process":18}],21:[function(require,module,exports){
(function (process){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNode = addNode;
function addNode(fn) {
  process.on('exit', function () {
    return fn();
  });

  /**
   * on the following events,
   * the process will not end if there are
   * event-handlers attached,
   * therefore we have to call process.exit()
   */
  process.on('beforeExit', function () {
    return fn().then(function () {
      return process.exit();
    });
  });
  // catches ctrl+c event
  process.on('SIGINT', function () {
    return fn().then(function () {
      return process.exit();
    });
  });
  // catches uncaught exceptions
  process.on('uncaughtException', function (err) {
    return fn().then(function () {
      console.trace(err);
      process.exit(101);
    });
  });
}
}).call(this)}).call(this,require('_process'))
},{"_process":18}]},{},[2]);
