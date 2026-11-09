"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod2) => function __require() {
    try {
      return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
    } catch (e) {
      throw mod2 = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

  // node_modules/loglevel/lib/loglevel.js
  var require_loglevel = __commonJS({
    "node_modules/loglevel/lib/loglevel.js"(exports, module) {
      (function(root, definition) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define(definition);
        } else if (typeof module === "object" && module.exports) {
          module.exports = definition();
        } else {
          root.log = definition();
        }
      })(exports, function() {
        "use strict";
        var noop = function() {
        };
        var undefinedType = "undefined";
        var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
        var logMethods = [
          "trace",
          "debug",
          "info",
          "warn",
          "error"
        ];
        var _loggersByName = {};
        var defaultLogger = null;
        function bindMethod(obj, methodName) {
          var method = obj[methodName];
          if (typeof method.bind === "function") {
            return method.bind(obj);
          } else {
            try {
              return Function.prototype.bind.call(method, obj);
            } catch (e) {
              return function() {
                return Function.prototype.apply.apply(method, [obj, arguments]);
              };
            }
          }
        }
        function traceForIE() {
          if (console.log) {
            if (console.log.apply) {
              console.log.apply(console, arguments);
            } else {
              Function.prototype.apply.apply(console.log, [console, arguments]);
            }
          }
          if (console.trace) console.trace();
        }
        function realMethod(methodName) {
          if (methodName === "debug") {
            methodName = "log";
          }
          if (typeof console === undefinedType) {
            return false;
          } else if (methodName === "trace" && isIE) {
            return traceForIE;
          } else if (console[methodName] !== void 0) {
            return bindMethod(console, methodName);
          } else if (console.log !== void 0) {
            return bindMethod(console, "log");
          } else {
            return noop;
          }
        }
        function replaceLoggingMethods() {
          var level = this.getLevel();
          for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = i < level ? noop : this.methodFactory(methodName, level, this.name);
          }
          this.log = this.debug;
          if (typeof console === undefinedType && level < this.levels.SILENT) {
            return "No console available for logging";
          }
        }
        function enableLoggingWhenConsoleArrives(methodName) {
          return function() {
            if (typeof console !== undefinedType) {
              replaceLoggingMethods.call(this);
              this[methodName].apply(this, arguments);
            }
          };
        }
        function defaultMethodFactory(methodName, _level, _loggerName) {
          return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
        }
        function Logger(name, factory) {
          var self2 = this;
          var inheritedLevel;
          var defaultLevel;
          var userLevel;
          var storageKey = "loglevel";
          if (typeof name === "string") {
            storageKey += ":" + name;
          } else if (typeof name === "symbol") {
            storageKey = void 0;
          }
          function persistLevelIfPossible(levelNum) {
            var levelName = (logMethods[levelNum] || "silent").toUpperCase();
            if (typeof window === undefinedType || !storageKey) return;
            try {
              window.localStorage[storageKey] = levelName;
              return;
            } catch (ignore) {
            }
            try {
              window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
            } catch (ignore) {
            }
          }
          function getPersistedLevel() {
            var storedLevel;
            if (typeof window === undefinedType || !storageKey) return;
            try {
              storedLevel = window.localStorage[storageKey];
            } catch (ignore) {
            }
            if (typeof storedLevel === undefinedType) {
              try {
                var cookie = window.document.cookie;
                var cookieName = encodeURIComponent(storageKey);
                var location2 = cookie.indexOf(cookieName + "=");
                if (location2 !== -1) {
                  storedLevel = /^([^;]+)/.exec(
                    cookie.slice(location2 + cookieName.length + 1)
                  )[1];
                }
              } catch (ignore) {
              }
            }
            if (self2.levels[storedLevel] === void 0) {
              storedLevel = void 0;
            }
            return storedLevel;
          }
          function clearPersistedLevel() {
            if (typeof window === undefinedType || !storageKey) return;
            try {
              window.localStorage.removeItem(storageKey);
            } catch (ignore) {
            }
            try {
              window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            } catch (ignore) {
            }
          }
          function normalizeLevel(input) {
            var level = input;
            if (typeof level === "string" && self2.levels[level.toUpperCase()] !== void 0) {
              level = self2.levels[level.toUpperCase()];
            }
            if (typeof level === "number" && level >= 0 && level <= self2.levels.SILENT) {
              return level;
            } else {
              throw new TypeError("log.setLevel() called with invalid level: " + input);
            }
          }
          self2.name = name;
          self2.levels = {
            "TRACE": 0,
            "DEBUG": 1,
            "INFO": 2,
            "WARN": 3,
            "ERROR": 4,
            "SILENT": 5
          };
          self2.methodFactory = factory || defaultMethodFactory;
          self2.getLevel = function() {
            if (userLevel != null) {
              return userLevel;
            } else if (defaultLevel != null) {
              return defaultLevel;
            } else {
              return inheritedLevel;
            }
          };
          self2.setLevel = function(level, persist) {
            userLevel = normalizeLevel(level);
            if (persist !== false) {
              persistLevelIfPossible(userLevel);
            }
            return replaceLoggingMethods.call(self2);
          };
          self2.setDefaultLevel = function(level) {
            defaultLevel = normalizeLevel(level);
            if (!getPersistedLevel()) {
              self2.setLevel(level, false);
            }
          };
          self2.resetLevel = function() {
            userLevel = null;
            clearPersistedLevel();
            replaceLoggingMethods.call(self2);
          };
          self2.enableAll = function(persist) {
            self2.setLevel(self2.levels.TRACE, persist);
          };
          self2.disableAll = function(persist) {
            self2.setLevel(self2.levels.SILENT, persist);
          };
          self2.rebuild = function() {
            if (defaultLogger !== self2) {
              inheritedLevel = normalizeLevel(defaultLogger.getLevel());
            }
            replaceLoggingMethods.call(self2);
            if (defaultLogger === self2) {
              for (var childName in _loggersByName) {
                _loggersByName[childName].rebuild();
              }
            }
          };
          inheritedLevel = normalizeLevel(
            defaultLogger ? defaultLogger.getLevel() : "WARN"
          );
          var initialLevel = getPersistedLevel();
          if (initialLevel != null) {
            userLevel = normalizeLevel(initialLevel);
          }
          replaceLoggingMethods.call(self2);
        }
        defaultLogger = new Logger();
        defaultLogger.getLogger = function getLogger(name) {
          if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
            throw new TypeError("You must supply a name when creating a logger.");
          }
          var logger = _loggersByName[name];
          if (!logger) {
            logger = _loggersByName[name] = new Logger(
              name,
              defaultLogger.methodFactory
            );
          }
          return logger;
        };
        var _log = typeof window !== undefinedType ? window.log : void 0;
        defaultLogger.noConflict = function() {
          if (typeof window !== undefinedType && window.log === defaultLogger) {
            window.log = _log;
          }
          return defaultLogger;
        };
        defaultLogger.getLoggers = function getLoggers() {
          return _loggersByName;
        };
        defaultLogger["default"] = defaultLogger;
        return defaultLogger;
      });
    }
  });

  // node_modules/oblivious-set/dist/cjs/src/index.js
  var require_src = __commonJS({
    "node_modules/oblivious-set/dist/cjs/src/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.now = exports.removeTooOldValues = exports.ObliviousSet = void 0;
      var ObliviousSet = class {
        ttl;
        map = /* @__PURE__ */ new Map();
        /**
         * Creating calls to setTimeout() is expensive,
         * so we only do that if there is not timeout already open.
         */
        _to = false;
        constructor(ttl) {
          this.ttl = ttl;
        }
        has(value) {
          const valueTime = this.map.get(value);
          if (typeof valueTime === "undefined") {
            return false;
          }
          if (valueTime < now() - this.ttl) {
            this.map.delete(value);
            return false;
          }
          return true;
        }
        add(value) {
          this.map.delete(value);
          this.map.set(value, now());
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
      };
      exports.ObliviousSet = ObliviousSet;
      function removeTooOldValues(obliviousSet) {
        const olderThen = now() - obliviousSet.ttl;
        const iterator = obliviousSet.map[Symbol.iterator]();
        while (true) {
          const next = iterator.next().value;
          if (!next) {
            break;
          }
          const value = next[0];
          const time = next[1];
          if (time < olderThen) {
            obliviousSet.map.delete(value);
          } else {
            break;
          }
        }
      }
      exports.removeTooOldValues = removeTooOldValues;
      function now() {
        return Date.now();
      }
      exports.now = now;
    }
  });

  // node_modules/oblivious-set/dist/cjs/src/index.es5.js
  var require_index_es5 = __commonJS({
    "node_modules/oblivious-set/dist/cjs/src/index.es5.js"(exports, module) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }) : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod2) {
        if (mod2 && mod2.__esModule) return mod2;
        var result = {};
        if (mod2 != null) {
          for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding(result, mod2, k);
        }
        __setModuleDefault(result, mod2);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var pkg = __importStar(require_src());
      module.exports = pkg;
    }
  });

  // node_modules/@toruslabs/constants/dist/lib.cjs/index.js
  var require_lib = __commonJS({
    "node_modules/@toruslabs/constants/dist/lib.cjs/index.js"(exports) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      var TORUS_LEGACY_NETWORK = {
        MAINNET: "mainnet",
        TESTNET: "testnet",
        CYAN: "cyan",
        AQUA: "aqua",
        CELESTE: "celeste"
      };
      var TORUS_SAPPHIRE_NETWORK = {
        SAPPHIRE_DEVNET: "sapphire_devnet",
        SAPPHIRE_MAINNET: "sapphire_mainnet"
      };
      var BUILD_ENV = {
        PRODUCTION: "production",
        DEVELOPMENT: "development",
        STAGING: "staging",
        TESTING: "testing"
      };
      var LEGACY_NETWORKS_ROUTE_MAP = {
        [TORUS_LEGACY_NETWORK.AQUA]: {
          networkIdentifier: "aqua",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.CELESTE]: {
          networkIdentifier: "celeste",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.CYAN]: {
          networkIdentifier: "cyan",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.MAINNET]: {
          networkIdentifier: "mainnet",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.TESTNET]: {
          networkIdentifier: "teal",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET
        }
      };
      var CITADEL_SERVER_MAP = {
        [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/citadel-service",
        [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/citadel-service",
        [BUILD_ENV.STAGING]: "https://api.web3auth.io/citadel-service",
        [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/citadel-service"
      };
      var DASHBOARD_PUBLIC_API_MAP = {
        [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/signer-service",
        [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/signer-service",
        [BUILD_ENV.STAGING]: "https://api.web3auth.io/signer-service",
        [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/signer-service"
      };
      var LEGACY_METADATA_MAP = {
        [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/metadata-service",
        [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/metadata-service",
        [BUILD_ENV.STAGING]: "https://api.web3auth.io/metadata-service",
        [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/metadata-service"
      };
      var FND_SERVER_MAP = {
        [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/fnd-service",
        [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/fnd-service",
        [BUILD_ENV.STAGING]: "https://api.web3auth.io/fnd-service",
        [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/fnd-service"
      };
      var STORAGE_SERVER_MAP = {
        [BUILD_ENV.PRODUCTION]: "https://api.web3auth.io/session-service",
        [BUILD_ENV.DEVELOPMENT]: "https://api-develop.web3auth.io/session-service",
        [BUILD_ENV.STAGING]: "https://api.web3auth.io/session-service",
        [BUILD_ENV.TESTING]: "https://api-develop.web3auth.io/session-service"
      };
      var STORAGE_SERVER_SOCKET_URL_MAP = {
        [BUILD_ENV.PRODUCTION]: "https://session.web3auth.io",
        [BUILD_ENV.DEVELOPMENT]: "https://develop-session.web3auth.io",
        [BUILD_ENV.STAGING]: "https://session.web3auth.io",
        [BUILD_ENV.TESTING]: "https://develop-session.web3auth.io"
      };
      var KEY_TYPE = {
        SECP256K1: "secp256k1",
        ED25519: "ed25519"
      };
      var SIG_TYPE = {
        ECDSA_SECP256K1: "ecdsa-secp256k1",
        ED25519: "ed25519",
        BIP340: "bip340"
      };
      var abi = [{
        inputs: [{
          internalType: "string",
          name: "_verifier",
          type: "string"
        }, {
          internalType: "bytes32",
          name: "hashedVerifierId",
          type: "bytes32"
        }],
        name: "getNodeSet",
        outputs: [
          {
            internalType: "uint256",
            name: "currentEpoch",
            type: "uint256"
          },
          {
            internalType: "string[]",
            name: "torusNodeEndpoints",
            type: "string[]"
          },
          {
            internalType: "uint256[]",
            name: "torusNodePubX",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "torusNodePubY",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "torusIndexes",
            type: "uint256[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      }];
      exports.BUILD_ENV = BUILD_ENV;
      exports.CITADEL_SERVER_MAP = CITADEL_SERVER_MAP;
      exports.DASHBOARD_PUBLIC_API_MAP = DASHBOARD_PUBLIC_API_MAP;
      exports.FND_SERVER_MAP = FND_SERVER_MAP;
      exports.KEY_TYPE = KEY_TYPE;
      exports.LEGACY_METADATA_MAP = LEGACY_METADATA_MAP;
      exports.LEGACY_NETWORKS_ROUTE_MAP = LEGACY_NETWORKS_ROUTE_MAP;
      exports.SIG_TYPE = SIG_TYPE;
      exports.STORAGE_SERVER_MAP = STORAGE_SERVER_MAP;
      exports.STORAGE_SERVER_SOCKET_URL_MAP = STORAGE_SERVER_SOCKET_URL_MAP;
      exports.TORUS_LEGACY_NETWORK = TORUS_LEGACY_NETWORK;
      exports.TORUS_SAPPHIRE_NETWORK = TORUS_SAPPHIRE_NETWORK;
      exports.abi = abi;
    }
  });

  // node_modules/@noble/hashes/_u64.js
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  function setU64FromNum(view, byteOffset, n, isLE2) {
    const h = fromNumH(n);
    const l = fromNumL(n);
    view.setUint32(byteOffset, isLE2 ? l : h, isLE2);
    view.setUint32(byteOffset + 4, isLE2 ? h : l, isLE2);
  }
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  var U32_MASK64, _32n, fromNumH, fromNumL, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, add3L, add3H, add4L, add4H, add5L, add5H;
  var init_u64 = __esm({
    "node_modules/@noble/hashes/_u64.js"() {
      U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
      _32n = /* @__PURE__ */ BigInt(32);
      fromNumH = (n) => n / 2 ** 32 | 0;
      fromNumL = (n) => n >>> 0;
      shrSH = (h, _l, s) => h >>> s;
      shrSL = (h, l, s) => h << 32 - s | l >>> s;
      rotrSH = (h, l, s) => h >>> s | l << 32 - s;
      rotrSL = (h, l, s) => h << 32 - s | l >>> s;
      rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
      rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
      add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
      add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
      add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
      add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
      add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
      add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    }
  });

  // node_modules/@noble/hashes/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
  }
  function anumber(n, title = "") {
    if (typeof n !== "number")
      throw new TypeError(atitle(title) + "expected number, got " + typeof n);
    if (!Number.isSafeInteger(n) || n < 0)
      throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
    return n;
  }
  function abool(value, title = "") {
    if (typeof value !== "boolean")
      throw new TypeError(atitle(title) + "expected boolean, got type=" + typeof value);
    return value;
  }
  function abytes(value, length, title = "") {
    if (isBytes(value) && (length === void 0 || value.length === length))
      return value;
    if (length !== void 0)
      anumber(length, "length");
    const bytes = isBytes(value);
    const ofLen = length !== void 0 ? ` of length ${length}` : "";
    const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
    const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new TypeError("expected hash wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
    if (h.outputLen < 1 || h.blockLen < 1)
      throw new Error("hash blockLen / outputLen must be >= 1");
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("hash was destroyed");
    if (checkFinished && instance.finished)
      throw new Error("digest() was already called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "output");
    const min = instance.outputLen;
    if (!(out.length >= min)) {
      throw new RangeError('"output" expected length >= ' + min);
    }
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function byteSwap(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap(arr[i]);
    }
    return arr;
  }
  function bytesToHex(bytes) {
    abytes(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex2 = "";
    for (let i = 0; i < bytes.length; i++) {
      hex2 += hexes[bytes[i]];
    }
    return hex2;
  }
  function asciiToBase16(ch) {
    return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - (65 - 10) : ch >= 97 && ch <= 102 ? ch - (97 - 10) : void 0;
  }
  function hexToBytes(hex2) {
    if (typeof hex2 !== "string")
      throw new TypeError("hex string expected, got " + typeof hex2);
    if (hasHexBuiltin) {
      try {
        return Uint8Array.fromHex(hex2);
      } catch (error) {
        if (error instanceof SyntaxError)
          throw new RangeError(error.message);
        throw error;
      }
    }
    const hl = hex2.length;
    const al = hl / 2;
    if (hl % 2)
      throw new RangeError("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex2.charCodeAt(hi));
      const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex2[hi] + hex2[hi + 1];
        throw new RangeError('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new TypeError("string expected");
    const encoded = new TextEncoder().encode(str);
    try {
      return new Uint8Array(encoded);
    } finally {
      clean(encoded);
    }
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  function checkOpts(defaults, opts, title = "opts") {
    aopts(defaults, "defaults");
    if (opts !== void 0)
      aopts(opts, title);
    const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
    return merged;
  }
  function createHasher(hashCons, info = {}) {
    if (typeof hashCons !== "function")
      throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
    info = checkOpts({}, info, "info");
    const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.canXOF = tmp.canXOF;
    hashC.create = (opts) => hashCons(opts);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  function randomBytes(bytesLength = 32) {
    anumber(bytesLength, "bytesLength");
    const cr = typeof globalThis === "object" ? globalThis.crypto : null;
    if (typeof cr?.getRandomValues !== "function")
      throw new Error("crypto.getRandomValues must be defined");
    if (bytesLength > 65536)
      throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
    return cr.getRandomValues(new Uint8Array(bytesLength));
  }
  var atitle, aobject, aopts, isLE, swap32IfBE, hasHexBuiltin, hexes, oidNist;
  var init_utils = __esm({
    "node_modules/@noble/hashes/utils.js"() {
      atitle = (title) => title ? `"${title}" ` : "";
      aobject = (value, label) => {
        if (value === null || typeof value !== "object" || Array.isArray(value))
          throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
      };
      aopts = (value, label) => {
        aobject(value, label);
        const proto = Object.getPrototypeOf(value);
        if (proto !== Object.prototype && proto !== null)
          throw new TypeError(`"${label}" expected plain object`);
        if (Object.hasOwn(value, "__proto__"))
          throw new TypeError(`"${label}.__proto__" is not allowed`);
      };
      isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      swap32IfBE = isLE ? (u) => u : byteSwap32;
      hasHexBuiltin = /* @__PURE__ */ (() => (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      oidNist = (suffix) => ({
        // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
        // Larger suffix values would need base-128 OID encoding and a different length byte.
        oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
      });
    }
  });

  // node_modules/@noble/hashes/_md.js
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD, SHA256_IV, SHA224_IV, SHA384_IV, SHA512_IV;
  var init_md = __esm({
    "node_modules/@noble/hashes/_md.js"() {
      init_u64();
      init_utils();
      HashMD = class {
        blockLen;
        outputLen;
        canXOF = false;
        padOffset;
        isLE;
        // For partial updates less than block size
        buffer;
        view;
        finished = false;
        length = 0;
        pos = 0;
        destroyed = false;
        constructor(blockLen, outputLen, padOffset, isLE2) {
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE2;
          this.buffer = new Uint8Array(blockLen);
          this.view = createView(this.buffer);
        }
        update(data) {
          aexists(this);
          abytes(data);
          const { view, buffer, blockLen } = this;
          const len = data.length;
          let processed = false;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = createView(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              processed = true;
              continue;
            }
            buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
              processed = true;
            }
          }
          this.length += data.length;
          if (processed)
            this.roundClean();
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE: isLE2 } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          buffer.fill(0, pos);
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            buffer.fill(0);
          }
          setU64FromNum(view, blockLen - 8, this.length * 8, isLE2);
          this.process(view, 0);
          this.roundClean();
          const oview = out === buffer ? view : createView(out);
          const len = this.outputLen;
          const outLen = len / 4;
          const state = this.get();
          if (len % 4 || outLen > state.length)
            throw new Error("invalid outputLen");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE2);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneIntoMeta(to) {
          const { buffer, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (pos)
            to.buffer.set(buffer);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      SHA256_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
      SHA224_IV = /* @__PURE__ */ Uint32Array.from([
        3238371032,
        914150663,
        812702999,
        4144912697,
        4290775857,
        1750603025,
        1694076839,
        3204075428
      ]);
      SHA384_IV = /* @__PURE__ */ Uint32Array.from([
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
      ]);
      SHA512_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
      ]);
    }
  });

  // node_modules/@noble/hashes/sha2.js
  var sha2_exports = {};
  __export(sha2_exports, {
    _SHA224: () => _SHA224,
    _SHA256: () => _SHA256,
    _SHA384: () => _SHA384,
    _SHA512: () => _SHA512,
    _SHA512_224: () => _SHA512_224,
    _SHA512_256: () => _SHA512_256,
    sha224: () => sha224,
    sha256: () => sha256,
    sha384: () => sha384,
    sha512: () => sha512,
    sha512_224: () => sha512_224,
    sha512_256: () => sha512_256
  });
  var SHA256_K, SHA256_W, SHA2_32B, _SHA256, _SHA224, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA2_64B, _SHA512, _SHA384, T224_IV, T256_IV, _SHA512_224, _SHA512_256, sha256, sha224, sha512, sha384, sha512_256, sha512_224;
  var init_sha2 = __esm({
    "node_modules/@noble/hashes/sha2.js"() {
      init_md();
      init_u64();
      init_utils();
      SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      SHA2_32B = class extends HashMD {
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        // Numeric initializers matter: starting the fields as `undefined` changes
        // V8's field representation and makes sha256 3x slower (measured).
        A = 0;
        B = 0;
        C = 0;
        D = 0;
        E = 0;
        F = 0;
        G = 0;
        H = 0;
        constructor(outputLen, IV) {
          super(64, outputLen, 8, false);
          this.A = IV[0] | 0;
          this.B = IV[1] | 0;
          this.C = IV[2] | 0;
          this.D = IV[3] | 0;
          this.E = IV[4] | 0;
          this.F = IV[5] | 0;
          this.G = IV[6] | 0;
          this.H = IV[7] | 0;
        }
        get() {
          const { A, B: B2, C, D, E, F, G, H } = this;
          return [A, B2, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B2, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B2 | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        _cloneInto(to) {
          (to ||= new this.constructor()).set(...this.get());
          return this._cloneIntoMeta(to);
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A, B: B2, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = sigma0 + Maj(A, B2, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B2;
            B2 = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B2 = B2 + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B2, C, D, E, F, G, H);
        }
        roundClean() {
          clean(SHA256_W);
        }
        destroy() {
          this.destroyed = true;
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          clean(this.buffer);
        }
      };
      _SHA256 = class extends SHA2_32B {
        constructor() {
          super(32, SHA256_IV);
        }
      };
      _SHA224 = class extends SHA2_32B {
        constructor() {
          super(28, SHA224_IV);
        }
      };
      K512 = /* @__PURE__ */ (() => split([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
      ].map((n) => BigInt(n))))();
      SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
      SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
      SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
      SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
      SHA2_64B = class extends HashMD {
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        // h -- high 32 bits, l -- low 32 bits
        // Numeric initializers matter: starting the fields as `undefined` changes
        // V8's field representation and slows hashing down (measured on sha256).
        Ah = 0;
        Al = 0;
        Bh = 0;
        Bl = 0;
        Ch = 0;
        Cl = 0;
        Dh = 0;
        Dl = 0;
        Eh = 0;
        El = 0;
        Fh = 0;
        Fl = 0;
        Gh = 0;
        Gl = 0;
        Hh = 0;
        Hl = 0;
        constructor(outputLen, IV) {
          super(128, outputLen, 16, false);
          this.Ah = IV[0] | 0;
          this.Al = IV[1] | 0;
          this.Bh = IV[2] | 0;
          this.Bl = IV[3] | 0;
          this.Ch = IV[4] | 0;
          this.Cl = IV[5] | 0;
          this.Dh = IV[6] | 0;
          this.Dl = IV[7] | 0;
          this.Eh = IV[8] | 0;
          this.El = IV[9] | 0;
          this.Fh = IV[10] | 0;
          this.Fl = IV[11] | 0;
          this.Gh = IV[12] | 0;
          this.Gl = IV[13] | 0;
          this.Hh = IV[14] | 0;
          this.Hl = IV[15] | 0;
        }
        // prettier-ignore
        get() {
          const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
        }
        // prettier-ignore
        set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
          this.Ah = Ah | 0;
          this.Al = Al | 0;
          this.Bh = Bh | 0;
          this.Bl = Bl | 0;
          this.Ch = Ch | 0;
          this.Cl = Cl | 0;
          this.Dh = Dh | 0;
          this.Dl = Dl | 0;
          this.Eh = Eh | 0;
          this.El = El | 0;
          this.Fh = Fh | 0;
          this.Fl = Fl | 0;
          this.Gh = Gh | 0;
          this.Gl = Gl | 0;
          this.Hh = Hh | 0;
          this.Hl = Hl | 0;
        }
        _cloneInto(to) {
          (to ||= new this.constructor()).set(...this.get());
          return this._cloneIntoMeta(to);
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32(offset += 4);
          }
          for (let i = 16; i < 80; i++) {
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
            const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
            const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
            const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
          }
          let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          for (let i = 0; i < 80; i++) {
            const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
            const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
            const CHIh = Eh & Fh ^ ~Eh & Gh;
            const CHIl = El & Fl ^ ~El & Gl;
            const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
            const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
            const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
            const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = add3L(T1l, sigma0l, MAJl);
            Ah = add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
          }
          ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
          ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
          ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
          ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
          ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
          ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
          ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
          ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
          this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
        }
        roundClean() {
          clean(SHA512_W_H, SHA512_W_L);
        }
        destroy() {
          this.destroyed = true;
          clean(this.buffer);
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
      };
      _SHA512 = class extends SHA2_64B {
        constructor() {
          super(64, SHA512_IV);
        }
      };
      _SHA384 = class extends SHA2_64B {
        constructor() {
          super(48, SHA384_IV);
        }
      };
      T224_IV = /* @__PURE__ */ Uint32Array.from([
        2352822216,
        424955298,
        1944164710,
        2312950998,
        502970286,
        855612546,
        1738396948,
        1479516111,
        258812777,
        2077511080,
        2011393907,
        79989058,
        1067287976,
        1780299464,
        286451373,
        2446758561
      ]);
      T256_IV = /* @__PURE__ */ Uint32Array.from([
        573645204,
        4230739756,
        2673172387,
        3360449730,
        596883563,
        1867755857,
        2520282905,
        1497426621,
        2519219938,
        2827943907,
        3193839141,
        1401305490,
        721525244,
        746961066,
        246885852,
        2177182882
      ]);
      _SHA512_224 = class extends SHA2_64B {
        constructor() {
          super(28, T224_IV);
        }
      };
      _SHA512_256 = class extends SHA2_64B {
        constructor() {
          super(32, T256_IV);
        }
      };
      sha256 = /* @__PURE__ */ createHasher(
        () => new _SHA256(),
        /* @__PURE__ */ oidNist(1)
      );
      sha224 = /* @__PURE__ */ createHasher(
        () => new _SHA224(),
        /* @__PURE__ */ oidNist(4)
      );
      sha512 = /* @__PURE__ */ createHasher(
        () => new _SHA512(),
        /* @__PURE__ */ oidNist(3)
      );
      sha384 = /* @__PURE__ */ createHasher(
        () => new _SHA384(),
        /* @__PURE__ */ oidNist(2)
      );
      sha512_256 = /* @__PURE__ */ createHasher(
        () => new _SHA512_256(),
        /* @__PURE__ */ oidNist(6)
      );
      sha512_224 = /* @__PURE__ */ createHasher(
        () => new _SHA512_224(),
        /* @__PURE__ */ oidNist(5)
      );
    }
  });

  // node_modules/@noble/curves/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    aInRange: () => aInRange,
    aarray: () => aarray,
    abignumber: () => abignumber,
    abool: () => abool2,
    abytes: () => abytes2,
    afunction: () => afunction,
    anumber: () => anumber2,
    aobject: () => aobject2,
    asafenumber: () => asafenumber,
    asciiToBytes: () => asciiToBytes,
    astring: () => astring,
    bitGet: () => bitGet,
    bitLen: () => bitLen,
    bitMask: () => bitMask,
    bitSet: () => bitSet,
    bytesToHex: () => bytesToHex2,
    bytesToNumberBE: () => bytesToNumberBE,
    bytesToNumberLE: () => bytesToNumberLE,
    concatBytes: () => concatBytes2,
    copyBytes: () => copyBytes,
    createHmacDrbg: () => createHmacDrbg,
    equalBytes: () => equalBytes,
    hexToBytes: () => hexToBytes2,
    hexToNumber: () => hexToNumber,
    inRange: () => inRange,
    isBytes: () => isBytes2,
    isPosBig: () => isPosBig,
    notImplemented: () => notImplemented,
    numberToBytesBE: () => numberToBytesBE,
    numberToBytesLE: () => numberToBytesLE,
    numberToHexUnpadded: () => numberToHexUnpadded,
    numberToVarBytesBE: () => numberToVarBytesBE,
    randomBytes: () => randomBytes2,
    validateObject: () => validateObject
  });
  function aarray(item, title, inner = () => {
  }) {
    if (!Array.isArray(item))
      throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
    for (let i = 0; i < item.length; i++)
      inner(item[i], `${title}[${i}]`);
    return item;
  }
  function astring(value, title = "") {
    if (typeof value !== "string") {
      const prefix = title && `"${title}" `;
      throw new TypeError(prefix + "expected string, got type=" + typeof value);
    }
    return value;
  }
  function aobject2(value, title = "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value))
      throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value}`);
    return value;
  }
  function afunction(value, title) {
    if (typeof value !== "function")
      throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value}`);
    return value;
  }
  function abool2(value, title = "") {
    if (typeof value !== "boolean")
      throw new TypeError(atitle2(title) + "expected boolean, got type=" + typeof value);
    return value;
  }
  function abignumber(n) {
    if (typeof n === "bigint") {
      if (!isPosBig(n))
        throw new RangeError("positive bigint expected, got " + n);
    } else
      anumber2(n);
    return n;
  }
  function asafenumber(value, title = "") {
    if (typeof value !== "number") {
      const prefix = title && `"${title}" `;
      throw new TypeError(prefix + "expected number, got type=" + typeof value);
    }
    if (!Number.isSafeInteger(value)) {
      const prefix = title && `"${title}" `;
      throw new RangeError(prefix + "expected safe integer, got " + value);
    }
  }
  function numberToHexUnpadded(num2) {
    const hex2 = abignumber(num2).toString(16);
    return hex2.length & 1 ? "0" + hex2 : hex2;
  }
  function hexToNumber(hex2) {
    if (typeof hex2 !== "string")
      throw new TypeError("hex string expected, got " + typeof hex2);
    return hex2 === "" ? _0n : BigInt("0x" + hex2);
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
  }
  function bytesToNumberLE(bytes) {
    return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
  }
  function numberToBytesBE(n, len) {
    anumber(len);
    if (len === 0)
      throw new Error("zero output length is invalid");
    n = abignumber(n);
    const expectedLen = len * 2;
    const hex2 = n.toString(16);
    if (hex2.length > expectedLen)
      throw new RangeError("number is too large");
    return hexToBytes(hex2.padStart(expectedLen, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(abignumber(n)));
  }
  function equalBytes(a, b) {
    a = abytes2(a);
    b = abytes2(b);
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  function copyBytes(bytes) {
    return Uint8Array.from(abytes2(bytes));
  }
  function asciiToBytes(ascii2) {
    if (typeof ascii2 !== "string")
      throw new TypeError("ascii string expected, got " + typeof ascii2);
    return Uint8Array.from(ascii2, (c, i) => {
      const charCode = c.charCodeAt(0);
      if (c.length !== 1 || charCode > 127) {
        throw new RangeError(`string contains non-ASCII character "${ascii2[i]}" with code ${charCode} at position ${i}`);
      }
      return charCode;
    });
  }
  function isPosBig(n) {
    return typeof n === "bigint" && _0n <= n;
  }
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    if (n < _0n)
      throw new Error("expected non-negative bigint, got " + n);
    return n === _0n ? 0 : n.toString(2).length;
  }
  function bitGet(n, pos) {
    if (typeof n !== "bigint")
      throw new TypeError('"n" expected bigint, got type=' + typeof n);
    asafenumber(pos, "pos");
    return n >> BigInt(pos) & _1n;
  }
  function bitSet(n, pos, value) {
    if (typeof n !== "bigint")
      throw new TypeError('"n" expected bigint, got type=' + typeof n);
    asafenumber(pos, "pos");
    abool2(value, "value");
    const mask = _1n << BigInt(pos);
    return value ? n | mask : n & ~mask;
  }
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    anumber(hashLen, "hashLen");
    anumber(qByteLen, "qByteLen");
    if (typeof hmacFn !== "function")
      throw new TypeError("hmacFn must be a function");
    const u8n = (len) => new Uint8Array(len);
    const NULL = Uint8Array.of();
    const byte0 = Uint8Array.of(0);
    const byte1 = Uint8Array.of(1);
    const _maxDrbgIters = 1e3;
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h = (...msgs) => hmacFn(k, concatBytes2(v, ...msgs));
    const reseed = (seed = NULL) => {
      k = h(byte0, seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(byte1, seed);
      v = h();
    };
    const gen = () => {
      if (i++ >= _maxDrbgIters)
        throw new Error("drbg: tried max amount of iterations");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes2(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while ((res = pred(gen())) === void 0)
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  function validateObject(object, fields = {}, optFields = {}, title = "object") {
    aobject2(object, title);
    aobject2(fields, "fields");
    aobject2(optFields, "optFields");
    function checkField(fieldName, expectedType, isOpt) {
      const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
      const val = object[fieldName];
      if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) {
        throw new TypeError(`${label} is invalid: expected own property`);
      }
      if (isOpt && val === void 0)
        return;
      const current = typeof val;
      if (current !== expectedType || val === null)
        throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
    }
    const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
    iter(fields, false);
    iter(optFields, true);
  }
  var abytes2, anumber2, bytesToHex2, concatBytes2, hexToBytes2, isBytes2, randomBytes2, _0n, _1n, atitle2, bitMask, notImplemented;
  var init_utils2 = __esm({
    "node_modules/@noble/curves/utils.js"() {
      init_utils();
      abytes2 = (value, length, title) => abytes(value, length, title);
      anumber2 = anumber;
      bytesToHex2 = bytesToHex;
      concatBytes2 = (...arrays) => concatBytes(...arrays);
      hexToBytes2 = (hex2) => hexToBytes(hex2);
      isBytes2 = isBytes;
      randomBytes2 = (bytesLength) => randomBytes(bytesLength);
      _0n = /* @__PURE__ */ BigInt(0);
      _1n = /* @__PURE__ */ BigInt(1);
      atitle2 = (title) => title ? `"${title}" ` : "";
      bitMask = (n) => {
        asafenumber(n, "n");
        return (_1n << BigInt(n)) - _1n;
      };
      notImplemented = () => {
        throw new Error("not implemented");
      };
    }
  });

  // node_modules/@noble/curves/abstract/modular.js
  var modular_exports = {};
  __export(modular_exports, {
    Field: () => Field,
    FpDiv: () => FpDiv,
    FpInvertBatch: () => FpInvertBatch,
    FpIsSquare: () => FpIsSquare,
    FpLegendre: () => FpLegendre,
    FpPow: () => FpPow,
    FpSqrt: () => FpSqrt,
    FpSqrtEven: () => FpSqrtEven,
    FpSqrtOdd: () => FpSqrtOdd,
    getFieldBytesLength: () => getFieldBytesLength,
    getMinHashLength: () => getMinHashLength,
    invert: () => invert,
    invertCt: () => invertCt,
    isNegativeLE: () => isNegativeLE,
    mapHashToField: () => mapHashToField,
    mod: () => mod,
    nLength: () => nLength,
    pow: () => pow,
    pow2: () => pow2,
    tonelliShanks: () => tonelliShanks,
    validateField: () => validateField
  });
  function mod(a, b) {
    if (b <= _0n2)
      throw new Error("mod: expected positive modulus, got " + b);
    const result = a % b;
    return result >= _0n2 ? result : b + result;
  }
  function pow(num2, power, modulo) {
    if (modulo <= _1n2)
      throw new Error("pow: expected modulus > 1, got " + modulo);
    if (typeof power !== "bigint")
      throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
    if (power < _0n2)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n2)
      return _1n2;
    if (power === _1n2)
      return num2;
    let d = num2 % modulo;
    if (d < _0n2)
      d += modulo;
    if (power < POW_WINDOWED_MIN) {
      let p2 = _1n2;
      while (power > _0n2) {
        if (power & _1n2)
          p2 = p2 * d % modulo;
        d = d * d % modulo;
        power >>= _1n2;
      }
      return p2;
    }
    const digits = [];
    while (power > _0n2) {
      digits.push(Number(power & _15n));
      power >>= _4n;
    }
    const table = new Array(16);
    table[0] = _1n2;
    table[1] = d;
    for (let i = 2; i < 16; i++)
      table[i] = table[i - 1] * d % modulo;
    let p = table[digits[digits.length - 1]];
    for (let w = digits.length - 2; w >= 0; w--) {
      p = p * p % modulo;
      p = p * p % modulo;
      p = p * p % modulo;
      p = p * p % modulo;
      const digit = digits[w];
      if (digit !== 0)
        p = p * table[digit] % modulo;
    }
    return p;
  }
  function pow2(x, power, modulo) {
    if (modulo <= _1n2)
      throw new Error("pow2: expected modulus > 1, got " + modulo);
    if (power < _0n2)
      throw new Error("pow2: expected non-negative exponent, got " + power);
    let res = x;
    while (power-- > _0n2) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number, modulo) {
    if (number === _0n2)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _1n2)
      throw new Error("invert: expected modulus > 1, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n2, u = _1n2;
    while (a !== _0n2) {
      const q = b / a;
      const r = b - a * q;
      const m = x - u * q;
      b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n2)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function invertCt(a, prime) {
    if (prime <= _1n2)
      throw new Error("invertCt: expected prime modulus > 1, got " + prime);
    const an = mod(a, prime);
    if (an === _0n2)
      throw new Error("invertCt: expected non-zero number");
    const inverse = pow(an, prime - _2n, prime);
    if (mod(an * inverse, prime) !== _1n2)
      throw new Error("invertCt: does not exist");
    return inverse;
  }
  function assertIsSquare(Fp2, root, n) {
    const F = Fp2;
    if (!F.eql(F.sqr(root), n))
      throw new Error("Cannot find square root");
  }
  function aoddModulus(order, fnName) {
    if ((order & _1n2) === _0n2)
      throw new Error(fnName + ": expected odd modulus, got " + order);
  }
  function sqrt3mod4(Fp2, n) {
    const F = Fp2;
    const p1div4 = (F.ORDER + _1n2) / _4n;
    const root = F.pow(n, p1div4);
    assertIsSquare(F, root, n);
    return root;
  }
  function sqrt5mod8(Fp2, n) {
    const F = Fp2;
    const p5div8 = (F.ORDER - _5n) / _8n;
    const n2 = F.mul(n, _2n);
    const v = F.pow(n2, p5div8);
    const nv = F.mul(n, v);
    const i = F.mul(F.mul(nv, _2n), v);
    const root = F.mul(nv, F.sub(i, F.ONE));
    assertIsSquare(F, root, n);
    return root;
  }
  function sqrt9mod16(P) {
    const Fp_ = Field(P);
    const tn = tonelliShanks(P);
    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
    const c2 = tn(Fp_, c1);
    const c3 = tn(Fp_, Fp_.neg(c1));
    const c4 = (P + _7n) / _16n;
    return ((Fp2, n) => {
      const F = Fp2;
      let tv1 = F.pow(n, c4);
      let tv2 = F.mul(tv1, c1);
      const tv3 = F.mul(tv1, c2);
      const tv4 = F.mul(tv1, c3);
      const e1 = F.eql(F.sqr(tv2), n);
      const e2 = F.eql(F.sqr(tv3), n);
      tv1 = F.cmov(tv1, tv2, e1);
      tv2 = F.cmov(tv4, tv3, e2);
      const e3 = F.eql(F.sqr(tv2), n);
      const root = F.cmov(tv1, tv2, e3);
      assertIsSquare(F, root, n);
      return root;
    });
  }
  function tonelliShanks(P) {
    if (P < _3n)
      throw new Error("sqrt is not defined for small field");
    aoddModulus(P, "tonelliShanks");
    let Q = P - _1n2;
    let S = 0;
    while (Q % _2n === _0n2) {
      Q /= _2n;
      S++;
    }
    let Z = _2n;
    const _Fp = Field(P);
    while (FpLegendre(_Fp, Z) === 1) {
      if (Z++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z, Q);
    const Q1div2 = (Q + _1n2) / _2n;
    return function tonelliSlow(Fp2, n) {
      const F = Fp2;
      if (F.is0(n))
        return n;
      if (FpLegendre(F, n) !== 1)
        throw new Error("Cannot find square root");
      let M = S;
      let c = F.mul(F.ONE, cc);
      let t = F.pow(n, Q);
      let R = F.pow(n, Q1div2);
      while (!F.eql(t, F.ONE)) {
        if (F.is0(t))
          throw new Error("Cannot find square root: probably non-prime P");
        let i = 1;
        let t_tmp = F.sqr(t);
        while (!F.eql(t_tmp, F.ONE)) {
          i++;
          t_tmp = F.sqr(t_tmp);
          if (i === M)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n2 << BigInt(M - i - 1);
        const b = F.pow(c, exponent);
        M = i;
        c = F.sqr(b);
        t = F.mul(t, c);
        R = F.mul(R, b);
      }
      return R;
    };
  }
  function FpSqrt(P) {
    aoddModulus(P, "Fp.sqrt");
    if (P % _4n === _3n)
      return sqrt3mod4;
    if (P % _8n === _5n)
      return sqrt5mod8;
    if (P % _16n === _9n)
      return sqrt9mod16(P);
    return tonelliShanks(P);
  }
  function validateField(field) {
    aobject2(field, "field");
    if (typeof field.ORDER !== "bigint")
      throw new TypeError('param "ORDER" is invalid: expected bigint, got ' + typeof field.ORDER);
    asafenumber(field.BYTES, "BYTES");
    asafenumber(field.BITS, "BITS");
    for (const name of FIELD_FIELDS)
      afunction(field[name], "field." + name);
    if (field.BYTES < 1 || field.BITS < 1)
      throw new Error("invalid field: expected BYTES/BITS > 0");
    if (field.ORDER <= _1n2)
      throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
    return field;
  }
  function FpPow(Fp2, num2, power) {
    validateField(Fp2);
    const F = Fp2;
    if (typeof power !== "bigint")
      throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
    if (power < _0n2)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n2)
      return F.ONE;
    if (power === _1n2)
      return num2;
    if (power < POW_WINDOWED_MIN) {
      let p2 = F.ONE;
      let d = num2;
      while (power > _0n2) {
        if (power & _1n2)
          p2 = F.mul(p2, d);
        d = F.sqr(d);
        power >>= _1n2;
      }
      return p2;
    }
    const digits = [];
    while (power > _0n2) {
      digits.push(Number(power & _15n));
      power >>= _4n;
    }
    const table = new Array(16);
    table[0] = F.ONE;
    table[1] = num2;
    for (let i = 2; i < 16; i++)
      table[i] = F.mul(table[i - 1], num2);
    let p = table[digits[digits.length - 1]];
    for (let w = digits.length - 2; w >= 0; w--) {
      p = F.sqr(F.sqr(F.sqr(F.sqr(p))));
      const digit = digits[w];
      if (digit !== 0)
        p = F.mul(p, table[digit]);
    }
    return p;
  }
  function FpInvertBatch(Fp2, nums, passZero = false) {
    validateField(Fp2);
    aarray(nums, "nums");
    abool2(passZero, "passZero");
    const F = Fp2;
    const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num2, i) => {
      if (F.is0(num2))
        return acc;
      inverted[i] = acc;
      return F.mul(acc, num2);
    }, F.ONE);
    const invertedAcc = F.inv(multipliedAcc);
    nums.reduceRight((acc, num2, i) => {
      if (F.is0(num2))
        return acc;
      inverted[i] = F.mul(acc, inverted[i]);
      return F.mul(acc, num2);
    }, invertedAcc);
    return inverted;
  }
  function FpDiv(Fp2, lhs, rhs) {
    validateField(Fp2);
    const F = Fp2;
    return F.mul(lhs, typeof rhs === "bigint" ? invert(rhs, F.ORDER) : F.inv(rhs));
  }
  function FpLegendre(Fp2, n) {
    validateField(Fp2);
    const F = Fp2;
    aoddModulus(F.ORDER, "FpLegendre");
    const p1mod2 = (F.ORDER - _1n2) / _2n;
    const powered = F.pow(n, p1mod2);
    const yes = F.eql(powered, F.ONE);
    const zero = F.eql(powered, F.ZERO);
    const no = F.eql(powered, F.neg(F.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function FpIsSquare(Fp2, n) {
    const l = FpLegendre(Fp2, n);
    return l !== -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber2(nBitLength);
    if (n <= _0n2)
      throw new Error("invalid n length: expected positive n, got " + n);
    if (nBitLength !== void 0 && nBitLength < 1)
      throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
    const bits = bitLen(n);
    if (nBitLength !== void 0 && nBitLength < bits)
      throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, opts = {}) {
    Object.freeze(_Field.prototype);
    return new _Field(ORDER, opts);
  }
  function FpSqrtOdd(Fp2, elm) {
    validateField(Fp2);
    const F = Fp2;
    if (!F.isOdd)
      throw new Error("Field doesn't have isOdd");
    const root = F.sqrt(elm);
    return F.isOdd(root) ? root : F.neg(root);
  }
  function FpSqrtEven(Fp2, elm) {
    validateField(Fp2);
    const F = Fp2;
    if (!F.isOdd)
      throw new Error("Field doesn't have isOdd");
    const root = F.sqrt(elm);
    return F.isOdd(root) ? F.neg(root) : root;
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    if (fieldOrder <= _1n2)
      throw new Error("field order must be greater than 1");
    const bitLength = bitLen(fieldOrder - _1n2);
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE2 = false) {
    abytes2(key);
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = Math.max(getMinHashLength(fieldOrder), 16);
    if (len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num2 = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num2, fieldOrder - _1n2) + _1n2;
    return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }
  var _0n2, _1n2, _2n, _3n, _4n, _5n, _7n, _8n, _9n, _15n, _16n, POW_WINDOWED_MIN, isNegativeLE, FIELD_FIELDS, FIELD_SQRT, _Field;
  var init_modular = __esm({
    "node_modules/@noble/curves/abstract/modular.js"() {
      init_utils2();
      _0n2 = /* @__PURE__ */ BigInt(0);
      _1n2 = /* @__PURE__ */ BigInt(1);
      _2n = /* @__PURE__ */ BigInt(2);
      _3n = /* @__PURE__ */ BigInt(3);
      _4n = /* @__PURE__ */ BigInt(4);
      _5n = /* @__PURE__ */ BigInt(5);
      _7n = /* @__PURE__ */ BigInt(7);
      _8n = /* @__PURE__ */ BigInt(8);
      _9n = /* @__PURE__ */ BigInt(9);
      _15n = /* @__PURE__ */ BigInt(15);
      _16n = /* @__PURE__ */ BigInt(16);
      POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
      isNegativeLE = (num2, modulo) => (mod(num2, modulo) & _1n2) === _1n2;
      FIELD_FIELDS = [
        "create",
        "isValid",
        "is0",
        "neg",
        "inv",
        "sqrt",
        "sqr",
        "eql",
        "add",
        "sub",
        "mul",
        "pow",
        "div",
        "addN",
        "subN",
        "mulN",
        "sqrN"
      ];
      FIELD_SQRT = /* @__PURE__ */ new WeakMap();
      _Field = class {
        ORDER;
        BITS;
        BYTES;
        isLE;
        ZERO = _0n2;
        ONE = _1n2;
        _lengths;
        _mod;
        constructor(ORDER, opts = {}) {
          if (ORDER <= _1n2)
            throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
          let _nbitLength = void 0;
          this.isLE = false;
          if (opts != null && typeof opts === "object") {
            if (typeof opts.BITS === "number")
              _nbitLength = opts.BITS;
            if (typeof opts.sqrt === "function")
              Object.defineProperty(this, "sqrt", { value: opts.sqrt, enumerable: true });
            if (typeof opts.isLE === "boolean")
              this.isLE = opts.isLE;
            if (opts.allowedLengths)
              this._lengths = Object.freeze(opts.allowedLengths.slice());
            if (typeof opts.modFromBytes === "boolean")
              this._mod = opts.modFromBytes;
          }
          const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
          if (nByteLength > 2048)
            throw new Error("invalid field: expected ORDER of <= 2048 bytes");
          this.ORDER = ORDER;
          this.BITS = nBitLength;
          this.BYTES = nByteLength;
          Object.freeze(this);
        }
        create(num2) {
          return mod(num2, this.ORDER);
        }
        isValid(num2) {
          if (typeof num2 !== "bigint")
            throw new TypeError("invalid field element: expected bigint, got " + typeof num2);
          return _0n2 <= num2 && num2 < this.ORDER;
        }
        is0(num2) {
          return num2 === _0n2;
        }
        // is valid and invertible
        isValidNot0(num2) {
          return !this.is0(num2) && this.isValid(num2);
        }
        isOdd(num2) {
          return (num2 & _1n2) === _1n2;
        }
        neg(num2) {
          return mod(-num2, this.ORDER);
        }
        eql(lhs, rhs) {
          return lhs === rhs;
        }
        sqr(num2) {
          return mod(num2 * num2, this.ORDER);
        }
        add(lhs, rhs) {
          return mod(lhs + rhs, this.ORDER);
        }
        sub(lhs, rhs) {
          return mod(lhs - rhs, this.ORDER);
        }
        mul(lhs, rhs) {
          return mod(lhs * rhs, this.ORDER);
        }
        pow(num2, power) {
          return pow(num2, power, this.ORDER);
        }
        div(lhs, rhs) {
          return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
        }
        // Same as above, but doesn't normalize
        sqrN(num2) {
          return num2 * num2;
        }
        addN(lhs, rhs) {
          return lhs + rhs;
        }
        subN(lhs, rhs) {
          return lhs - rhs;
        }
        mulN(lhs, rhs) {
          return lhs * rhs;
        }
        inv(num2) {
          return invert(num2, this.ORDER);
        }
        sqrt(num2) {
          let sqrt = FIELD_SQRT.get(this);
          if (!sqrt)
            FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
          return sqrt(this, num2);
        }
        toBytes(num2) {
          return this.isLE ? numberToBytesLE(num2, this.BYTES) : numberToBytesBE(num2, this.BYTES);
        }
        fromBytes(bytes, skipValidation = false) {
          abytes2(bytes);
          const { _lengths: allowedLengths, BYTES, isLE: isLE2, ORDER, _mod: modFromBytes } = this;
          if (allowedLengths) {
            if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
              throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
            }
            const padded = new Uint8Array(BYTES);
            padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
            bytes = padded;
          }
          if (bytes.length !== BYTES)
            throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
          let scalar = isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
          if (modFromBytes)
            scalar = mod(scalar, ORDER);
          if (!skipValidation) {
            if (!this.isValid(scalar))
              throw new Error("invalid field element: outside of range 0..ORDER");
          }
          return scalar;
        }
        // TODO: we don't need it here, move out to separate fn
        invertBatch(lst) {
          return FpInvertBatch(this, lst, true);
        }
        // We can't move this out because Fp6, Fp12 implement it
        // and it's unclear what to return in there.
        cmov(a, b, condition) {
          abool2(condition, "condition");
          return condition ? b : a;
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/curve.js
  function validatePointCons(Point) {
    const pc = Point;
    if (typeof pc !== "function")
      throw new TypeError('"Point" expected constructor, got type=' + typeof Point);
    afunction(pc.fromAffine, "Point.fromAffine");
    afunction(pc.fromBytes, "Point.fromBytes");
    afunction(pc.fromHex, "Point.fromHex");
    aobject2(pc.BASE, "Point.BASE");
    aobject2(pc.ZERO, "Point.ZERO");
    validateField(pc.Fp);
    validateField(pc.Fn);
  }
  function normalizeZ(c, points) {
    validatePointCons(c);
    validateMSMPoints(points, c);
    const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
    return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
  }
  function validateW(W, bits, min = 1) {
    if (!Number.isSafeInteger(W) || W < min || W > bits)
      throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
  }
  function validateTableBytes(numPoints, fpBytes) {
    const bytes = numPoints * (4 * fpBytes + 128);
    if (bytes > TABLE_BYTES_MAX)
      throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
  }
  function probeRandomBytes(randomBytes3, length) {
    if (randomBytes3 === void 0)
      return void 0;
    afunction(randomBytes3, "randomBytes");
    try {
      const probe = randomBytes3(length);
      if (!isBytes2(probe) || probe.length !== length)
        return void 0;
    } catch {
      return void 0;
    }
    return randomBytes3;
  }
  function validateMSMPoints(points, c) {
    aarray(points, "points");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field, maxScalar) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      const ok = maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar;
      if (!ok)
        throw new Error("invalid scalar at index " + i);
    });
  }
  function getWindowSize(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function oddMultiples(p, size) {
    const dbl = p.double();
    const t = [p];
    for (let j = 1; j < size; j++)
      t.push(t[j - 1].add(dbl));
    return t;
  }
  function wnafDigits(n, W) {
    const size = 2 ** W;
    const half = size / 2;
    const mask = BigInt(size - 1);
    const d = [];
    while (n > _0n3) {
      let w = 0;
      if (n & _1n3) {
        w = Number(n & mask);
        if (w >= half)
          w -= size;
        n -= BigInt(w);
      }
      d.push(w);
      n >>= _1n3;
    }
    return d;
  }
  function signedWindowDigits(n, W, windows) {
    const size = 2 ** W;
    const half = size / 2;
    const mask = BigInt(size - 1);
    const shiftBy = BigInt(W);
    const d = [];
    for (let w = 0; w < windows; w++) {
      let v = Number(n & mask);
      n >>= shiftBy;
      if (v > half) {
        v -= size;
        n += _1n3;
      }
      d.push(v);
    }
    if (n !== _0n3)
      throw new Error("invalid wnaf");
    return d;
  }
  function wnafWalk(zero, tables, digits) {
    let max = 0;
    for (const d of digits)
      max = Math.max(max, d.length);
    let acc = zero;
    for (let bit = max - 1; bit >= 0; bit--) {
      if (bit !== max - 1)
        acc = acc.double();
      for (let i = 0; i < digits.length; i++) {
        const w = digits[i][bit];
        if (w) {
          const item = tables[i][Math.abs(w) - 1 >> 1];
          acc = acc.add(w < 0 ? item.negate() : item);
        }
      }
    }
    return acc;
  }
  function mulAddUnsafe(c, points, scalars, allowOversized = false) {
    validatePointCons(c);
    validateMSMPoints(points, c);
    abool2(allowOversized, "allowOversized");
    validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n2 : void 0);
    if (points.length !== scalars.length)
      throw new Error("arrays of points and scalars must have equal length");
    const tables = points.map((p) => oddMultiples(p, 4));
    const digits = scalars.map((n) => wnafDigits(n, 4));
    return wnafWalk(c.ZERO, tables, digits);
  }
  function createField(order, field, isLE2) {
    if (field) {
      if (field.ORDER !== order)
        throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      validateField(field);
      return field;
    } else {
      return Field(order, { isLE: isLE2 });
    }
  }
  function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
    if (type !== "weierstrass" && type !== "edwards")
      throw new Error('expected curve type "weierstrass" or "edwards"');
    if (FpFnLE === void 0)
      FpFnLE = type === "edwards";
    if (!CURVE || typeof CURVE !== "object")
      throw new Error(`expected valid ${type} CURVE object`);
    validateObject(curveOpts);
    for (const p of ["p", "n", "h"]) {
      const val = CURVE[p];
      if (!(isPosBig(val) && val !== _0n3))
        throw new Error(`CURVE.${p} must be positive bigint`);
    }
    const Fp2 = createField(CURVE.p, curveOpts.Fp, FpFnLE);
    const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
    const _b = type === "weierstrass" ? "b" : "d";
    const params = ["Gx", "Gy", "a", _b];
    for (const p of params) {
      if (!Fp2.isValid(CURVE[p]))
        throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
    }
    CURVE = Object.freeze(Object.assign({}, CURVE));
    return { CURVE, Fp: Fp2, Fn: Fn2 };
  }
  function createKeygen(randomSecretKey, getPublicKey) {
    return function keygen(seed) {
      const secretKey = randomSecretKey(seed);
      return { secretKey, publicKey: getPublicKey(secretKey) };
    };
  }
  var _0n3, _1n3, _4n2, BLIND_BYTES, BLIND_BITS, FW_WINDOW, TABLE_BYTES_MAX, pointWindowSizes, ScalarMultiplier;
  var init_curve = __esm({
    "node_modules/@noble/curves/abstract/curve.js"() {
      init_utils2();
      init_modular();
      _0n3 = /* @__PURE__ */ BigInt(0);
      _1n3 = /* @__PURE__ */ BigInt(1);
      _4n2 = /* @__PURE__ */ BigInt(4);
      BLIND_BYTES = 16;
      BLIND_BITS = 128;
      FW_WINDOW = 5;
      TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
      pointWindowSizes = /* @__PURE__ */ new WeakMap();
      ScalarMultiplier = class {
        Point;
        BASE;
        ZERO;
        randomBytes;
        wnafPrecomputes = /* @__PURE__ */ new WeakMap();
        baseCanBeBlinded;
        bits;
        // Parametrized with a given Point class (not individual point)
        constructor(Point, randomBytes3) {
          validatePointCons(Point);
          this.randomBytes = probeRandomBytes(randomBytes3, BLIND_BYTES);
          this.Point = Point;
          this.BASE = Point.BASE;
          this.ZERO = Point.ZERO;
          this.bits = Point.Fn.BITS;
        }
        /**
         * Creates a signed fixed-window wNAF precomputation table: for every window w, the
         * multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
         * so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
         * window absorbs the final carry of signed-digit recoding.
         * For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
         * @param point - Point instance
         * @param W - window size
         * @param bits - scalar bitlength the table must cover
         */
        buildWnafTable(point, W, bits) {
          const windows = Math.ceil(bits / W) + 1;
          const half = 2 ** (W - 1);
          const comp = [];
          let base = point;
          for (let w = 0; w < windows; w++) {
            let acc = base;
            for (let i = 0; i < half; i++) {
              comp.push(acc);
              acc = acc.add(base);
            }
            base = comp[comp.length - 1].double();
          }
          return { W, bits, windows, comp };
        }
        /**
         * Implements ec multiplication using precomputed signed fixed-window wNAF tables.
         * Constant-time: fixed window count with one table addition per window — zero digits feed
         * the fake accumulator — and no doublings; the lookup scans the whole window slice.
         * Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
         * {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
         * signedWindowDigits throws if `n` exceeds the table.
         * @returns real and fake (for const-time) points
         */
        wnafCachedCT(precomputes, n) {
          const { W, windows, comp } = precomputes;
          const half = 2 ** (W - 1);
          const digits = signedWindowDigits(n, W, windows);
          let p = this.ZERO;
          let f = this.BASE;
          for (let w = 0; w < windows; w++) {
            const digit = digits[w];
            const start = w * half;
            const idx = Math.abs(digit) - 1;
            let sel = comp[start];
            for (let i = 1; i < half; i++)
              sel = i === idx ? comp[start + i] : sel;
            const neg = sel.negate();
            if (digit === 0)
              f = f.add(comp[start]);
            else
              p = p.add(digit < 0 ? neg : sel);
          }
          return { p, f };
        }
        // Cache key is point identity plus (W, bits); at most two entries exist per point (public-width
        // `Fn.BITS` and blinded `Fn.BITS + BLIND_BITS`). Callers must not reuse the same point with
        // incompatible `transform(...)` layouts and expect a separate cache entry.
        getWnafPrecomputes(W, point, bits, transform) {
          let entries = this.wnafPrecomputes.get(point);
          let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
          if (!comp) {
            comp = this.buildWnafTable(point, W, bits);
            if (typeof transform === "function")
              comp = { ...comp, comp: transform(comp.comp) };
            if (!entries) {
              entries = [];
              this.wnafPrecomputes.set(point, entries);
            }
            entries.push(comp);
          }
          return comp;
        }
        assertPoint(point) {
          if (!(point instanceof this.Point))
            throw new TypeError('"point" expected Point instance, got type=' + typeof point);
        }
        // Shared prologue of the constant-time entry points. Rejects scalar 0: in key/signature-style
        // callers a zero scalar means broken upstream plumbing, and concrete Points already reject it.
        // Uses inRange instead of Fn.isValidNot0: validateField() only certifies the arithmetic subset.
        validateMulInput(point, scalar) {
          this.assertPoint(point);
          if (!inRange(scalar, _1n3, this.Point.Fn.ORDER))
            throw new Error("invalid scalar");
        }
        // Constant-time dispatch shared by mulCT / mulCTBlinded. Un-precomputed points (W===1, e.g.
        // ECDH peer keys) skip building a throwaway cached table in favor of a small fixed-window
        // multiply. `n` must be < 2^bits.
        runCT(point, n, bits, transform) {
          const W = getWindowSize(point);
          if (W === 1)
            return this.fixedWindowCT(point, n, bits);
          return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
        }
        mulCT(point, scalar, transform) {
          this.validateMulInput(point, scalar);
          return this.runCT(point, scalar, this.bits, transform);
        }
        mulCTBlinded(point, scalar, transform) {
          this.validateMulInput(point, scalar);
          if (this.randomBytes === void 0)
            throw new Error("randomBytes is required for scalar blinding");
          const bits = this.Point.Fn.BITS + BLIND_BITS;
          const blind = this.randomBytes(BLIND_BYTES);
          if (!isBytes2(blind) || blind.length !== BLIND_BYTES)
            throw new Error("randomBytes returned invalid byte array");
          blind[0] = blind[0] & 63 | 128;
          const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
          return this.runCT(point, n, bits, transform);
        }
        /**
         * Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
         * A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
         * far cheaper to build for a single use. The point-operation sequence is independent of `n`:
         * build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
         * every table entry, and one addition (adds the identity when the window digit is 0 — never
         * skipped).
         *
         * `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
         * add), which holds for the Weierstrass/Edwards point types used here. The table is left in
         * projective form (no normalizeZ): normalizing this small a table costs more than the
         * mixed-add savings it would buy for a single multiply.
         * @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
         * (this path needs no fake accumulator — its op-count is already scalar-independent).
         */
        fixedWindowCT(point, n, bits) {
          const W = FW_WINDOW;
          const size = 1 << W;
          const mask = bitMask(W);
          const table = new Array(size);
          table[0] = this.ZERO;
          for (let i = 1; i < size; i++)
            table[i] = table[i - 1].add(point);
          const windows = Math.ceil(bits / W);
          let acc = this.ZERO;
          for (let window2 = windows - 1; window2 >= 0; window2--) {
            if (window2 !== windows - 1)
              for (let d = 0; d < W; d++)
                acc = acc.double();
            const digit = Number(n >> BigInt(window2 * W) & mask);
            let sel = table[0];
            for (let i = 1; i < size; i++)
              sel = i === digit ? table[i] : sel;
            acc = acc.add(sel);
          }
          return { p: acc, f: acc };
        }
        shouldBlind(point, cofactor) {
          if (this.randomBytes === void 0)
            return false;
          if (cofactor === _1n3)
            return true;
          if (point !== this.BASE)
            return false;
          if (this.baseCanBeBlinded === void 0)
            this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
          return this.baseCanBeBlinded;
        }
        mulSecret(point, scalar, cofactor, transform) {
          return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
        }
        mulUnsafe(point, scalar, transform) {
          this.assertPoint(point);
          if (!isPosBig(scalar))
            throw new Error("invalid scalar");
          const W = getWindowSize(point);
          if (W === 1 || scalar >= this.Point.Fn.ORDER)
            return mulAddUnsafe(this.Point, [point], [scalar], true);
          const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
          return this.wnafCachedCT(precomputes, scalar).p;
        }
        // Remembers the window size used for precomputed wNAF multiplication of the given point
        // and drops any previously built tables. Usually only the base point is precomputed.
        // W=1 resets the point to the un-precomputed (table-less) paths.
        // W is additionally capped so tables stay under ~2 GiB ({@link TABLE_BYTES_MAX}).
        setWindowSize(point, W) {
          this.assertPoint(point);
          validateW(W, this.bits);
          const windows = Math.ceil((this.bits + BLIND_BITS) / W) + 1;
          validateTableBytes(windows * 2 ** (W - 1), this.Point.Fp.BYTES);
          pointWindowSizes.set(point, W);
          this.wnafPrecomputes.delete(point);
        }
        // True when a window size is set: tables themselves are built lazily on first multiply.
        hasWindowSize(point) {
          return getWindowSize(point) !== 1;
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/fft.js
  function checkU32(n, title = "n") {
    if (typeof n !== "number")
      throw new TypeError(`wrong u32 integer "${title}": expected number, got type=${typeof n}`);
    if (!Number.isSafeInteger(n) || n < 0 || n > 4294967295)
      throw new RangeError(`wrong u32 integer "${title}": expected 0..4294967295, got ${n}`);
    return n;
  }
  function isPowerOfTwo(x) {
    checkU32(x, "x");
    return (x & x - 1) === 0 && x !== 0;
  }
  function nextPowerOfTwo(n) {
    checkU32(n);
    if (n <= 1)
      return 1;
    if (n > 2147483648)
      throw new Error("nextPowerOfTwo overflow: result does not fit u32");
    return 1 << log2(n - 1) + 1 >>> 0;
  }
  function log2(n) {
    checkU32(n);
    return 31 - Math.clz32(n);
  }
  function poly(field, roots, create, fft, length) {
    validateField(field);
    const F = field;
    const _create = create || ((len, elm) => new Array(len).fill(elm ?? F.ZERO));
    const isPoly = (x) => {
      if (Array.isArray(x))
        return true;
      if (!ArrayBuffer.isView(x))
        return false;
      const v = x;
      return typeof v.length === "number" && typeof v.slice === "function" && typeof v[Symbol.iterator] === "function";
    };
    const checkPoly = (title, value) => {
      if (!isPoly(value))
        throw new TypeError(`"${title}" expected polynomial, got type=${typeof value}`);
    };
    const checkLength = (a, b) => {
      checkPoly("a", a);
      const L = a.length;
      if (b !== void 0) {
        checkPoly("b", b);
        if (b.length !== L)
          throw new Error(`poly: mismatched lengths ${L} vs ${b.length}`);
      }
      if (length !== void 0 && L !== length)
        throw new Error(`poly: expected fixed length ${length}, got ${L}`);
      return L;
    };
    function findOmegaIndex(x, n, brp = false, weights) {
      if (!isPowerOfTwo(n))
        throw new Error("poly.lagrange: expected power of two length, got " + n);
      const omega = weights || (brp ? roots.brp(log2(n)) : roots.roots(log2(n)));
      for (let i = 0; i < n; i++)
        if (F.eql(x, omega[i]))
          return i;
      return -1;
    }
    return {
      roots,
      create: _create,
      length,
      extend: (a, len) => {
        checkLength(a);
        const out = _create(len, F.ZERO);
        for (let i = 0; i < Math.min(a.length, len); i++)
          out[i] = a[i];
        return out;
      },
      degree: (a) => {
        checkLength(a);
        for (let i = a.length - 1; i >= 0; i--)
          if (!F.is0(a[i]))
            return i;
        return -1;
      },
      add: (a, b) => {
        const len = checkLength(a, b);
        const out = _create(len);
        for (let i = 0; i < len; i++)
          out[i] = F.add(a[i], b[i]);
        return out;
      },
      sub: (a, b) => {
        const len = checkLength(a, b);
        const out = _create(len);
        for (let i = 0; i < len; i++)
          out[i] = F.sub(a[i], b[i]);
        return out;
      },
      dot: (a, b) => {
        const len = checkLength(a, b);
        const out = _create(len);
        for (let i = 0; i < len; i++)
          out[i] = F.mul(a[i], b[i]);
        return out;
      },
      mul: (a, b) => {
        if (isPoly(b)) {
          const len = checkLength(a, b);
          if (fft) {
            const A = fft.direct(a, false, true);
            const B2 = fft.direct(b, false, true);
            for (let i = 0; i < A.length; i++)
              A[i] = F.mul(A[i], B2[i]);
            return fft.inverse(A, true, false);
          } else {
            const res = _create(len);
            for (let i = 0; i < len; i++) {
              for (let j = 0; j < len; j++) {
                const k = (i + j) % len;
                res[k] = F.add(res[k], F.mul(a[i], b[j]));
              }
            }
            return res;
          }
        } else {
          const out = _create(checkLength(a));
          for (let i = 0; i < out.length; i++)
            out[i] = F.mul(a[i], b);
          return out;
        }
      },
      convolve(a, b) {
        checkPoly("a", a);
        checkPoly("b", b);
        const len = nextPowerOfTwo(a.length + b.length - 1);
        return this.mul(this.extend(a, len), this.extend(b, len));
      },
      shift(p, factor) {
        checkPoly("p", p);
        const out = _create(p.length);
        if (length !== void 0 && p.length !== length)
          throw new Error(`poly: expected fixed length ${length}, got ${p.length}`);
        if (!p.length)
          return out;
        out[0] = p[0];
        for (let i = 1, power = F.ONE; i < p.length; i++) {
          power = F.mul(power, factor);
          out[i] = F.mul(p[i], power);
        }
        return out;
      },
      clone: (a) => {
        checkLength(a);
        const out = _create(a.length);
        for (let i = 0; i < a.length; i++)
          out[i] = a[i];
        return out;
      },
      eval: (a, basis) => {
        checkLength(a, basis);
        let acc = F.ZERO;
        for (let i = 0; i < a.length; i++)
          acc = F.add(acc, F.mul(a[i], basis[i]));
        return acc;
      },
      monomial: {
        basis: (x, n) => {
          const out = _create(n);
          let pow3 = F.ONE;
          for (let i = 0; i < n; i++) {
            out[i] = pow3;
            pow3 = F.mul(pow3, x);
          }
          return out;
        },
        eval: (a, x) => {
          checkLength(a);
          let acc = F.ZERO;
          for (let i = a.length - 1; i >= 0; i--)
            acc = F.add(F.mul(acc, x), a[i]);
          return acc;
        }
      },
      lagrange: {
        basis: (x, n, brp = false, weights) => {
          if (!isPowerOfTwo(n))
            throw new Error("poly.lagrange: expected power of two length, got " + n);
          const bits = log2(n);
          const cache = weights || (brp ? roots.brp(bits) : roots.roots(bits));
          const out = _create(n);
          const idx = findOmegaIndex(x, n, brp, weights);
          if (idx !== -1) {
            out[idx] = F.ONE;
            return out;
          }
          const tm = F.pow(x, BigInt(n));
          const c = F.mul(F.sub(tm, F.ONE), F.inv(BigInt(n)));
          const denom = _create(n);
          for (let i = 0; i < n; i++)
            denom[i] = F.sub(x, cache[i]);
          const inv = F.invertBatch(denom);
          for (let i = 0; i < n; i++)
            out[i] = F.mul(c, F.mul(cache[i], inv[i]));
          return out;
        },
        eval(a, x, brp = false) {
          checkLength(a);
          const idx = findOmegaIndex(x, a.length, brp);
          if (idx !== -1)
            return a[idx];
          const L = this.basis(x, a.length, brp);
          let acc = F.ZERO;
          for (let i = 0; i < a.length; i++)
            if (!F.is0(a[i]))
              acc = F.add(acc, F.mul(a[i], L[i]));
          return acc;
        }
      },
      vanishing(roots2) {
        checkPoly("roots", roots2);
        if (length !== void 0 && roots2.length !== length)
          throw new Error(`poly: expected fixed length ${length}, got ${roots2.length}`);
        const out = _create(roots2.length + 1, F.ZERO);
        out[0] = F.ONE;
        for (const r of roots2) {
          const neg = F.neg(r);
          for (let j = out.length - 1; j > 0; j--)
            out[j] = F.add(F.mul(out[j], neg), out[j - 1]);
          out[0] = F.mul(out[0], neg);
        }
        return out;
      }
    };
  }
  var init_fft = __esm({
    "node_modules/@noble/curves/abstract/fft.js"() {
      init_modular();
    }
  });

  // node_modules/@noble/curves/abstract/hash-to-curve.js
  function i2osp(value, length) {
    asafenumber(value);
    asafenumber(length);
    if (length < 0 || length > 4)
      throw new Error("invalid I2OSP length: " + length);
    if (value < 0 || value > 2 ** (8 * length) - 1)
      throw new Error("invalid I2OSP input: " + value);
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  }
  function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      arr[i] = a[i] ^ b[i];
    }
    return arr;
  }
  function normDST(DST) {
    if (!isBytes2(DST) && typeof DST !== "string")
      throw new Error("DST must be Uint8Array or ascii string");
    const dst = typeof DST === "string" ? asciiToBytes(DST) : DST;
    if (dst.length === 0)
      throw new Error("DST must be non-empty");
    return dst;
  }
  function expand_message_xmd(msg, DST, lenInBytes, H) {
    abytes2(msg);
    asafenumber(lenInBytes);
    if (typeof H !== "function")
      throw new Error("expand_message_xmd: expected hash function");
    asafenumber(H.outputLen, "hash.outputLen");
    asafenumber(H.blockLen, "hash.blockLen");
    DST = normDST(DST);
    if (DST.length > 255)
      DST = H(concatBytes2(asciiToBytes("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = concatBytes2(DST, i2osp(DST.length, 1));
    const Z_pad = new Uint8Array(r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b = new Array(ell);
    const b_0 = H(concatBytes2(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H(concatBytes2(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i < ell; i++) {
      const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
      b[i] = H(concatBytes2(...args));
    }
    const pseudo_random_bytes = concatBytes2(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k, H) {
    abytes2(msg);
    asafenumber(lenInBytes);
    asafenumber(k, "k");
    if (k < 0)
      throw new Error("expand_message_xof: invalid k");
    if (typeof H !== "function")
      throw new Error("expand_message_xof: expected XOF function");
    if (typeof H.create !== "function")
      throw new Error("expand_message_xof: expected XOF create");
    DST = normDST(DST);
    if (lenInBytes < 0 || lenInBytes > 65535)
      throw new Error("expand_message_xof: invalid lenInBytes");
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k / 8);
      DST = H.create({ dkLen }).update(asciiToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (DST.length > 255)
      throw new Error("expand_message_xof: invalid DST");
    return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
  }
  function hash_to_field(msg, count, options) {
    validateObject(options, {
      p: "bigint",
      m: "number",
      k: "number",
      hash: "function"
    });
    const { p, k, m, hash, expand, DST } = options;
    asafenumber(hash.outputLen, "valid hash");
    abytes2(msg);
    asafenumber(count);
    asafenumber(m, "m");
    asafenumber(k, "k");
    if (p <= BigInt(1))
      throw new Error("hash_to_field: expected valid field characteristic");
    if (count < 1)
      throw new Error("hash_to_field: expected count >= 1");
    if (m < 1)
      throw new Error("hash_to_field: expected m >= 1");
    if (k < 0)
      throw new Error("hash_to_field: invalid k");
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8);
    const len_in_bytes = count * m * L;
    let prb;
    if (expand === "xmd") {
      prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
    } else if (expand === "xof") {
      prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
    } else if (expand === "_internal_pass") {
      prb = msg;
    } else {
      throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for (let i = 0; i < count; i++) {
      const e = new Array(m);
      for (let j = 0; j < m; j++) {
        const elm_offset = L * (j + i * m);
        const tv = prb.subarray(elm_offset, elm_offset + L);
        e[j] = mod(os2ip(tv), p);
      }
      u[i] = e;
    }
    return u;
  }
  function isogenyMap(field, map) {
    validateField(field);
    aarray(map, "map");
    const coeff = map.map((i, row) => {
      aarray(i, "map[" + row + "]");
      if (i.length < 1)
        throw new Error("isogenyMap: expected non-empty coefficients");
      return Array.from(i).reverse();
    });
    return (x, y) => {
      const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
      const isZero = field.is0(xd) || field.is0(yd);
      const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
      x = field.mul(xn, xd_inv);
      y = field.mul(y, field.mul(yn, yd_inv));
      return isZero ? { x: field.ZERO, y: field.ZERO } : { x, y };
    };
  }
  function createHasher2(Point, mapToCurve, defaults) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
    validateObject(defaults);
    const snapshot = (src) => Object.freeze({
      ...src,
      DST: isBytes2(src.DST) ? copyBytes(src.DST) : src.DST,
      ...src.encodeDST === void 0 ? {} : { encodeDST: isBytes2(src.encodeDST) ? copyBytes(src.encodeDST) : src.encodeDST }
    });
    const safeDefaults = snapshot(defaults);
    const dstOverride = (options) => options && options.DST !== void 0 ? { DST: options.DST } : void 0;
    function map(num2) {
      return Point.fromAffine(mapToCurve(num2));
    }
    function clear(initial) {
      const P = initial.clearCofactor();
      if (P.equals(Point.ZERO))
        return Point.ZERO;
      P.assertValidity();
      return P;
    }
    return Object.freeze({
      get defaults() {
        return snapshot(safeDefaults);
      },
      Point,
      hashToCurve(msg, options) {
        const opts = Object.assign({}, safeDefaults, dstOverride(options));
        const u = hash_to_field(msg, 2, opts);
        const u0 = map(u[0]);
        const u1 = map(u[1]);
        return clear(u0.add(u1));
      },
      encodeToCurve(msg, options) {
        const optsDst = safeDefaults.encodeDST === void 0 ? {} : { DST: safeDefaults.encodeDST };
        const opts = Object.assign({}, safeDefaults, optsDst, dstOverride(options));
        const u = hash_to_field(msg, 1, opts);
        const u0 = map(u[0]);
        return clear(u0);
      },
      /** See {@link H2CHasher} */
      mapToCurve(scalars) {
        if (safeDefaults.m === 1) {
          if (typeof scalars !== "bigint")
            throw new Error("expected bigint (m=1)");
          return clear(map([scalars]));
        }
        if (!Array.isArray(scalars))
          throw new Error("expected array of bigints");
        if (scalars.length !== safeDefaults.m)
          throw new Error(`expected array of ${safeDefaults.m} bigints`);
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error("expected array of bigints");
        return clear(map(scalars));
      },
      // hash_to_scalar can produce 0: https://www.rfc-editor.org/errata/eid8393
      // RFC 9380, draft-irtf-cfrg-bbs-signatures-08. Default scalar DST is the shared generic
      // `HashToScalar-` prefix above unless the caller overrides it per invocation.
      hashToScalar(msg, options) {
        const N = Point.Fn.ORDER;
        const opts = Object.assign({}, safeDefaults, { DST: _DST_scalar }, dstOverride(options), {
          p: N,
          m: 1
        });
        return hash_to_field(msg, 1, opts)[0][0];
      }
    });
  }
  function SWUFpSqrtRatio(Fp2, Z) {
    const F = validateField(Fp2);
    const q = F.ORDER;
    let l = _0n4;
    for (let o = q - _1n4; o % _2n2 === _0n4; o /= _2n2)
      l += _1n4;
    const c1 = l;
    const _2n_pow_c1_1 = _2n2 << c1 - _1n4 - _1n4;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n2;
    const c2 = (q - _1n4) / _2n_pow_c1;
    const c3 = (c2 - _1n4) / _2n2;
    const c4 = _2n_pow_c1 - _1n4;
    const c5 = _2n_pow_c1_1;
    const c6 = F.pow(Z, c2);
    const c7 = F.pow(Z, (c2 + _1n4) / _2n2);
    let sqrtRatio = (u, v) => {
      let tv1 = c6;
      let tv2 = F.pow(v, c4);
      let tv3 = F.sqr(tv2);
      tv3 = F.mul(tv3, v);
      let tv5 = F.mul(u, tv3);
      tv5 = F.pow(tv5, c3);
      tv5 = F.mul(tv5, tv2);
      tv2 = F.mul(tv5, v);
      tv3 = F.mul(tv5, u);
      let tv4 = F.mul(tv3, tv2);
      tv5 = F.pow(tv4, c5);
      let isQR = F.eql(tv5, F.ONE);
      tv2 = F.mul(tv3, c7);
      tv5 = F.mul(tv4, tv1);
      tv3 = F.cmov(tv2, tv3, isQR);
      tv4 = F.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n4; i--) {
        let tv52 = i - _2n2;
        tv52 = _2n2 << tv52 - _1n4;
        let tvv5 = F.pow(tv4, tv52);
        const e1 = F.eql(tvv5, F.ONE);
        tv2 = F.mul(tv3, tv1);
        tv1 = F.mul(tv1, tv1);
        tvv5 = F.mul(tv4, tv1);
        tv3 = F.cmov(tv2, tv3, e1);
        tv4 = F.cmov(tvv5, tv4, e1);
      }
      return { isValid: !F.is0(v) && (isQR || F.is0(u)), value: tv3 };
    };
    if (F.ORDER % _4n3 === _3n2) {
      const c12 = (F.ORDER - _3n2) / _4n3;
      const c22 = F.sqrt(F.neg(Z));
      sqrtRatio = (u, v) => {
        let tv1 = F.sqr(v);
        const tv2 = F.mul(u, v);
        tv1 = F.mul(tv1, tv2);
        let y1 = F.pow(tv1, c12);
        y1 = F.mul(y1, tv2);
        const y2 = F.mul(y1, c22);
        const tv3 = F.mul(F.sqr(y1), v);
        const isQR = F.eql(tv3, u);
        let y = F.cmov(y2, y1, isQR);
        return { isValid: !F.is0(v) && isQR, value: y };
      };
    }
    return sqrtRatio;
  }
  function mapToCurveSimpleSWU(Fp2, opts) {
    const F = validateField(Fp2);
    validateObject(opts, {}, {}, "opts");
    const { A, B: B2, Z } = opts;
    if (!F.isValidNot0(A) || !F.isValidNot0(B2) || !F.isValid(Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    if (F.eql(Z, F.neg(F.ONE)) || FpIsSquare(F, Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const x = F.mul(B2, F.inv(F.mul(Z, A)));
    const gx = F.add(F.add(F.mul(F.sqr(x), x), F.mul(A, x)), B2);
    if (!FpIsSquare(F, gx))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(F, Z);
    if (!F.isOdd)
      throw new Error("Field does not have .isOdd()");
    return (u) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x2, y;
      tv1 = F.sqr(u);
      tv1 = F.mul(tv1, Z);
      tv2 = F.sqr(tv1);
      tv2 = F.add(tv2, tv1);
      tv3 = F.add(tv2, F.ONE);
      tv3 = F.mul(tv3, B2);
      tv4 = F.cmov(Z, F.neg(tv2), !F.eql(tv2, F.ZERO));
      tv4 = F.mul(tv4, A);
      tv2 = F.sqr(tv3);
      tv6 = F.sqr(tv4);
      tv5 = F.mul(tv6, A);
      tv2 = F.add(tv2, tv5);
      tv2 = F.mul(tv2, tv3);
      tv6 = F.mul(tv6, tv4);
      tv5 = F.mul(tv6, B2);
      tv2 = F.add(tv2, tv5);
      x2 = F.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y = F.mul(tv1, u);
      y = F.mul(y, value);
      x2 = F.cmov(x2, tv3, isValid);
      y = F.cmov(y, value, isValid);
      const e1 = F.isOdd(u) === F.isOdd(y);
      y = F.cmov(F.neg(y), y, e1);
      const tv4_inv = FpInvertBatch(F, [tv4], true)[0];
      x2 = F.mul(x2, tv4_inv);
      return { x: x2, y };
    };
  }
  var _0n4, _1n4, _2n2, _3n2, _4n3, os2ip, _DST_scalar;
  var init_hash_to_curve = __esm({
    "node_modules/@noble/curves/abstract/hash-to-curve.js"() {
      init_utils2();
      init_modular();
      _0n4 = /* @__PURE__ */ BigInt(0);
      _1n4 = /* @__PURE__ */ BigInt(1);
      _2n2 = /* @__PURE__ */ BigInt(2);
      _3n2 = /* @__PURE__ */ BigInt(3);
      _4n3 = /* @__PURE__ */ BigInt(4);
      os2ip = bytesToNumberBE;
      _DST_scalar = "HashToScalar-";
    }
  });

  // node_modules/@noble/curves/abstract/frost.js
  function createFROST(opts) {
    validateObject(opts, {
      name: "string",
      hash: "function"
    }, {
      hashToScalar: "function",
      validatePoint: "function",
      parsePublicKey: "function",
      adjustScalar: "function",
      adjustPoint: "function",
      challenge: "function",
      adjustNonces: "function",
      adjustSecret: "function",
      adjustPublic: "function",
      adjustGroupCommitmentShare: "function",
      adjustTx: "object",
      adjustDKG: "function"
    });
    validatePointCons(opts.Point);
    const { Point, validatePoint, parsePublicKey, adjustScalar, adjustPoint: adjustPointHook, challenge: challenge2, adjustNonces, adjustSecret, adjustPublic, adjustGroupCommitmentShare, adjustDKG } = opts;
    const Fn2 = opts.Fn === void 0 ? Point.Fn : opts.Fn;
    const adjustTx = opts.adjustTx === void 0 ? void 0 : { encode: opts.adjustTx.encode, decode: opts.adjustTx.decode };
    if (adjustTx)
      validateObject(adjustTx, { encode: "function", decode: "function" });
    const hashBytes = opts.hash;
    const hashToScalar = opts.hashToScalar === void 0 ? (msg, opts2 = { DST: new Uint8Array() }) => {
      const t = hashBytes(concatBytes2(opts2.DST, msg));
      return Fn2.create(Fn2.isLE ? bytesToNumberLE(t) : bytesToNumberBE(t));
    } : opts.hashToScalar;
    const H1Prefix = utf8ToBytes(opts.H1 !== void 0 ? opts.H1 : opts.name + "rho");
    const H2Prefix = utf8ToBytes(opts.H2 !== void 0 ? opts.H2 : opts.name + "chal");
    const H3Prefix = utf8ToBytes(opts.H3 !== void 0 ? opts.H3 : opts.name + "nonce");
    const H4Prefix = utf8ToBytes(opts.H4 !== void 0 ? opts.H4 : opts.name + "msg");
    const H5Prefix = utf8ToBytes(opts.H5 !== void 0 ? opts.H5 : opts.name + "com");
    const HDKGPrefix = utf8ToBytes(opts.HDKG !== void 0 ? opts.HDKG : opts.name + "dkg");
    const HIDPrefix = utf8ToBytes(opts.HID !== void 0 ? opts.HID : opts.name + "id");
    const H1 = (msg) => hashToScalar(msg, { DST: H1Prefix });
    const H2 = (msg) => hashToScalar(msg, { DST: H2Prefix });
    const H3 = (msg) => hashToScalar(msg, { DST: H3Prefix });
    const H4 = (msg) => hashBytes(concatBytes2(H4Prefix, msg));
    const H5 = (msg) => hashBytes(concatBytes2(H5Prefix, msg));
    const HDKG = (msg) => hashToScalar(msg, { DST: HDKGPrefix });
    const HID = (msg) => hashToScalar(msg, { DST: HIDPrefix });
    const randomScalar = (rng = randomBytes2) => {
      if (typeof rng !== "function")
        throw new TypeError('"rng" expected function, got type=' + typeof rng);
      const t = mapHashToField(rng(getMinHashLength(Fn2.ORDER)), Fn2.ORDER, Fn2.isLE);
      return Fn2.isLE ? bytesToNumberLE(t) : bytesToNumberBE(t);
    };
    const serializePoint = (p) => p.toBytes();
    const validatePublicPoint = (p) => {
      p.assertValidity();
      if (p.is0())
        throw new Error("invalid point: identity");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      if (validatePoint)
        validatePoint(p);
      return p;
    };
    const parsePoint = (bytes) => validatePublicPoint(Point.fromBytes(bytes));
    const nonceCommitments = (identifier, nonces) => ({
      identifier,
      hiding: serializePoint(Point.BASE.multiply(Fn2.fromBytes(nonces.hiding))),
      binding: serializePoint(Point.BASE.multiply(Fn2.fromBytes(nonces.binding)))
    });
    const adjustPoint = adjustPointHook === void 0 ? (n) => n : adjustPointHook;
    const validateIdentifier = (n) => {
      if (!Fn2.isValid(n) || Fn2.is0(n))
        throw new Error("Invalid identifier " + n);
      return n;
    };
    const serializeIdentifier = (id) => bytesToHex2(Fn2.toBytes(validateIdentifier(id)));
    const parseIdentifier = (id, title = "identifier") => {
      astring(id, title);
      const n = validateIdentifier(Fn2.fromBytes(hexToBytes2(id)));
      if (serializeIdentifier(n) !== id)
        throw new Error("expected canonical identifier hex");
      return n;
    };
    const copyRound1Package = (p) => ({
      identifier: serializeIdentifier(parseIdentifier(p.identifier)),
      commitment: p.commitment.map((c) => copyBytes(c)),
      proofOfKnowledge: copyBytes(p.proofOfKnowledge)
    });
    const canonicalRound1Packages = (packages) => {
      const snapshot = packages.map(copyRound1Package);
      snapshot.sort((a, b) => {
        const ai = parseIdentifier(a.identifier);
        const bi = parseIdentifier(b.identifier);
        return ai < bi ? -1 : ai > bi ? 1 : 0;
      });
      return snapshot;
    };
    const equalRound1Transcripts = (a, b) => {
      if (a.length !== b.length)
        return false;
      for (let i = 0; i < a.length; i++) {
        const p = a[i];
        const q = b[i];
        if (p.identifier !== q.identifier || p.commitment.length !== q.commitment.length)
          return false;
        for (let j = 0; j < p.commitment.length; j++) {
          if (!equalBytes(p.commitment[j], q.commitment[j]))
            return false;
        }
        if (!equalBytes(p.proofOfKnowledge, q.proofOfKnowledge))
          return false;
      }
      return true;
    };
    const Signature = {
      // RFC 9591 Appendix A encodes signatures canonically as
      // SerializeElement(R) || SerializeScalar(z).
      encode: (R, z) => {
        let res = concatBytes2(serializePoint(R), Fn2.toBytes(z));
        if (adjustTx)
          res = adjustTx.encode(res);
        return res;
      },
      decode: (sig) => {
        if (adjustTx)
          sig = adjustTx.decode(sig);
        const Rbytes = sig.subarray(0, -Fn2.BYTES);
        const R = parsePoint(Rbytes);
        if (serializePoint(R).length !== Rbytes.length)
          throw new Error("invalid signature encoding");
        const z = Fn2.fromBytes(sig.subarray(-Fn2.BYTES));
        return { R, z };
      }
    };
    const genPointScalarPair = (rng = randomBytes2) => {
      let n = randomScalar(rng);
      if (adjustScalar)
        n = adjustScalar(n);
      let p = Point.BASE.multiply(n);
      return { scalar: n, point: p };
    };
    const nrErr = "roots are unavailable in FROST polynomial mode";
    const noRoots = {
      info: { G: Fn2.ZERO, oddFactor: Fn2.ZERO, powerOfTwo: 0 },
      roots() {
        throw new Error(nrErr);
      },
      brp() {
        throw new Error(nrErr);
      },
      inverse() {
        throw new Error(nrErr);
      },
      omega() {
        throw new Error(nrErr);
      },
      clear() {
      }
    };
    const Poly = poly(Fn2, noRoots);
    const msm = (points, scalars) => mulAddUnsafe(Point, points, scalars);
    const polynomialEvaluate = (x, coeffs) => {
      if (!coeffs.length)
        throw new Error("empty coefficients");
      return Poly.monomial.eval(coeffs, x);
    };
    const deriveInterpolatingValue = (L, xi) => {
      const err = "invalid parameters";
      if (!L.some((x) => Fn2.eql(x, xi)))
        throw new Error(err);
      const Lset = new Set(L);
      if (Lset.size !== L.length)
        throw new Error(err);
      if (!Lset.has(xi))
        throw new Error(err);
      let num2 = Fn2.ONE;
      let den = Fn2.ONE;
      for (const x of L) {
        if (Fn2.eql(x, xi))
          continue;
        num2 = Fn2.mul(num2, x);
        den = Fn2.mul(den, Fn2.sub(x, xi));
      }
      return Fn2.div(num2, den);
    };
    const evalutateVSS = (identifier, commitment) => {
      const monomial = Poly.monomial.basis(identifier, commitment.length);
      return msm(commitment, monomial);
    };
    const generateSecretPolynomial = (signers, secret, coeffs, rng = randomBytes2) => {
      validateSigners(signers);
      if (secret !== void 0)
        abytes2(secret, Fn2.BYTES, "secret");
      if (coeffs !== void 0)
        aarray(coeffs, "coeffs");
      if (typeof rng !== "function")
        throw new TypeError('"rng" expected function, got type=' + typeof rng);
      const secretScalar = secret === void 0 ? randomScalar(rng) : Fn2.fromBytes(secret);
      if (!coeffs) {
        coeffs = [];
        for (let i = 0; i < signers.min - 1; i++)
          coeffs.push(randomScalar(rng));
      }
      if (coeffs.length !== signers.min - 1)
        throw new Error("wrong coefficients length");
      const coefficients = [secretScalar, ...coeffs];
      const commitment = coefficients.map((i) => Point.BASE.multiply(i));
      return { coefficients, commitment, secret: secretScalar };
    };
    const ProofOfKnowledge = {
      challenge: (id, verKey, R) => HDKG(concatBytes2(Fn2.toBytes(id), serializePoint(verKey), serializePoint(R))),
      compute(id, coefficents, commitments, rng = randomBytes2) {
        if (coefficents.length < 1)
          throw new Error("coefficients should have at least one element");
        const { point: R, scalar: k } = genPointScalarPair(rng);
        const verKey = commitments[0];
        const c = this.challenge(id, verKey, R);
        const mu = Fn2.add(k, Fn2.mul(coefficents[0], c));
        return Signature.encode(R, mu);
      },
      validate(id, commitment, proof) {
        if (commitment.length < 1)
          throw new Error("commitment should have at least one element");
        const { R, z } = Signature.decode(proof);
        const phi = parsePoint(commitment[0]);
        const c = this.challenge(id, phi, R);
        if (!R.equals(Point.BASE.multiplyUnsafe(z).subtract(phi.multiplyUnsafe(c))))
          throw new Error("invalid proof of knowledge");
      }
    };
    const Basic = {
      challenge: (R, PK, msg) => {
        if (challenge2)
          return challenge2(R, PK, msg);
        return H2(concatBytes2(serializePoint(R), serializePoint(PK), msg));
      },
      sign(msg, sk, rng = randomBytes2) {
        const { point: R, scalar: r } = genPointScalarPair(rng);
        const PK = Point.BASE.multiply(sk);
        const c = this.challenge(R, PK, msg);
        const z = Fn2.add(r, Fn2.mul(c, sk));
        return [R, z];
      },
      verify(msg, R, z, PK) {
        if (adjustPointHook)
          PK = adjustPointHook(PK);
        if (adjustPointHook)
          R = adjustPointHook(R);
        const c = this.challenge(R, PK, msg);
        const zB = Point.BASE.multiplyUnsafe(z);
        const cA = PK.multiplyUnsafe(c);
        let check = zB.subtract(cA).subtract(R);
        if (check.clearCofactor)
          check = check.clearCofactor();
        return Point.ZERO.equals(check);
      }
    };
    const validateSecretShare = (identifier, commitment, signingShare) => {
      if (!Point.BASE.multiply(signingShare).equals(evalutateVSS(identifier, commitment)))
        throw new Error("invalid secret share");
    };
    const Identifier = {
      fromNumber(n) {
        if (!Number.isSafeInteger(n))
          throw new Error("expected safe interger");
        return serializeIdentifier(BigInt(n));
      },
      // Not in spec, but in FROST implementation,
      // seems useful and nice, no need to sync identifiers (would require more interactions)
      derive(s) {
        astring(s, "s");
        return serializeIdentifier(HID(utf8ToBytes(s)));
      }
    };
    const generateNonce = (secret, rng = randomBytes2) => H3(concatBytes2(rng(32), Fn2.toBytes(secret)));
    const getGroupCommitment = (GPK, commitmentList, msg) => {
      const CL = commitmentList.map((i) => [
        i.identifier,
        parseIdentifier(i.identifier),
        parsePoint(i.hiding),
        parsePoint(i.binding)
      ]);
      CL.sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0);
      const Cbytes = [];
      for (const [_, id, hC, bC] of CL)
        Cbytes.push(Fn2.toBytes(id), serializePoint(hC), serializePoint(bC));
      const encodedCommitmentHash = H5(concatBytes2(...Cbytes));
      const rhoPrefix = concatBytes2(serializePoint(GPK), H4(msg), encodedCommitmentHash);
      const bindingFactors = {};
      for (const [i, id] of CL) {
        bindingFactors[i] = H1(concatBytes2(rhoPrefix, Fn2.toBytes(id)));
      }
      let hidingSum = Point.ZERO;
      const points = [];
      const scalars = [];
      for (const [i, _, hC, bC] of CL) {
        if (Point.ZERO.equals(hC) || Point.ZERO.equals(bC))
          throw new Error("infinity commitment");
        hidingSum = hidingSum.add(hC);
        points.push(bC);
        scalars.push(bindingFactors[i]);
      }
      const groupCommitment = hidingSum.add(msm(points, scalars));
      const identifiers = CL.map((i) => i[1]);
      return { identifiers, groupCommitment, bindingFactors };
    };
    const prepareShare = (PK, commitmentList, msg, identifier) => {
      const GPK = adjustPoint(parsePoint(PK));
      const id = parseIdentifier(identifier);
      const { identifiers, groupCommitment, bindingFactors } = getGroupCommitment(GPK, commitmentList, msg);
      const bindingFactor = bindingFactors[identifier];
      const lambda = deriveInterpolatingValue(identifiers, id);
      const challenge3 = Basic.challenge(groupCommitment, GPK, msg);
      return { lambda, challenge: challenge3, bindingFactor, groupCommitment };
    };
    Object.freeze(Identifier);
    const frost = {
      Identifier,
      // DKG is Distributed Key Generation, not Trusted Dealer Key Generation.
      DKG: Object.freeze({
        // NOTE: we allow to pass secret scalar from user side,
        // this way it can be derived, instead of random generation
        round1: (id, signers, secret, rng = randomBytes2) => {
          const idNum = parseIdentifier(id, "id");
          validateSigners(signers);
          const { coefficients, commitment } = generateSecretPolynomial(signers, secret, void 0, rng);
          const proofOfKnowledge = ProofOfKnowledge.compute(idNum, coefficients, commitment, rng);
          const commitmentBytes = commitment.map(serializePoint);
          const round1Public = {
            identifier: serializeIdentifier(idNum),
            commitment: commitmentBytes,
            proofOfKnowledge
          };
          const round1Secret = {
            identifier: idNum,
            coefficients,
            commitment: commitment.map(serializePoint),
            // Copy threshold metadata instead of retaining the caller-owned object by reference.
            signers: { min: signers.min, max: signers.max },
            step: 1
          };
          return { public: round1Public, secret: round1Secret };
        },
        round2: (secret, others) => {
          validateObject(secret, { identifier: "bigint", commitment: "object", signers: "object" }, { coefficients: "object", round1Cache: "object", round2Cache: "object", step: "number" }, "secret");
          validateSigners(secret.signers, "secret.signers");
          aarray(others, "others");
          if (others.length !== secret.signers.max - 1)
            throw new Error("wrong number of round1 packages");
          if (!secret.coefficients || secret.step === 3)
            throw new Error("round3 package used in round2");
          const authenticatedRound1 = canonicalRound1Packages(others);
          if (secret.round2Cache !== void 0) {
            if (secret.round1Cache === void 0 || !equalRound1Transcripts(secret.round1Cache, authenticatedRound1))
              throw new Error("round1 packages do not match authenticated transcript");
            return secret.round2Cache;
          }
          const res = {};
          for (const p of authenticatedRound1) {
            if (p.commitment.length !== secret.signers.min)
              throw new Error("wrong number of commitments");
            const id = parseIdentifier(p.identifier);
            if (id === secret.identifier)
              throw new Error("duplicate id=" + serializeIdentifier(id));
            ProofOfKnowledge.validate(id, p.commitment, p.proofOfKnowledge);
            for (const c of p.commitment)
              parsePoint(c);
            if (res[p.identifier])
              throw new Error("Duplicate id=" + id);
            const signingShare = Fn2.toBytes(polynomialEvaluate(id, secret.coefficients));
            res[p.identifier] = {
              identifier: serializeIdentifier(secret.identifier),
              signingShare
            };
          }
          secret.round1Cache = authenticatedRound1;
          secret.round2Cache = res;
          secret.step = 2;
          return res;
        },
        round3: (secret, round1, round2) => {
          validateObject(secret, { identifier: "bigint", commitment: "object", signers: "object" }, { coefficients: "object", round1Cache: "object", round2Cache: "object", step: "number" }, "secret");
          validateSigners(secret.signers, "secret.signers");
          aarray(round1, "round1");
          aarray(round2, "round2");
          if (round1.length !== secret.signers.max - 1)
            throw new Error("wrong length of round1 packages");
          if (!secret.coefficients || secret.step !== 2 || !secret.round1Cache)
            throw new Error("round2 package used in round3");
          const suppliedRound1 = canonicalRound1Packages(round1);
          const authenticatedRound1 = secret.round1Cache;
          if (!equalRound1Transcripts(authenticatedRound1, suppliedRound1))
            throw new Error("round1 packages do not match authenticated transcript");
          if (round2.length !== authenticatedRound1.length)
            throw new Error("wrong length of round2 packages");
          const merged = {};
          for (const r1 of authenticatedRound1) {
            if (!r1.identifier || !r1.commitment)
              throw new Error("wrong round1 share");
            merged[r1.identifier] = { ...r1 };
          }
          for (const r2 of round2) {
            if (!r2.identifier || !r2.signingShare)
              throw new Error("wrong round2 share");
            if (!merged[r2.identifier])
              throw new Error("round1 share for " + r2.identifier + " is missing");
            merged[r2.identifier].signingShare = r2.signingShare;
          }
          if (Object.keys(merged).length !== authenticatedRound1.length)
            throw new Error("mismatch identifiers between rounds");
          let signingShare = Fn2.ZERO;
          if (secret.commitment.length !== secret.signers.min)
            throw new Error("wrong commitments length");
          const localCommitment = secret.commitment.map(parsePoint);
          const localShare = polynomialEvaluate(secret.identifier, secret.coefficients);
          validateSecretShare(secret.identifier, localCommitment, localShare);
          const localCommitmentBytes = localCommitment.map(serializePoint);
          const commitments = {
            [serializeIdentifier(secret.identifier)]: localCommitmentBytes
          };
          for (const k in merged) {
            const v = merged[k];
            if (!v.signingShare || !v.commitment)
              throw new Error("mismatch identifiers");
            const id = parseIdentifier(k);
            const signingSharePart = Fn2.fromBytes(v.signingShare);
            const commitment = v.commitment.map(parsePoint);
            validateSecretShare(secret.identifier, commitment, signingSharePart);
            signingShare = Fn2.add(signingShare, signingSharePart);
            const idSer = serializeIdentifier(id);
            if (commitments[idSer])
              throw new Error("duplicated id=" + idSer);
            commitments[idSer] = v.commitment;
          }
          signingShare = Fn2.add(signingShare, localShare);
          const mergedCommitment = new Array(secret.signers.min).fill(Point.ZERO);
          for (const k in commitments) {
            const v = commitments[k];
            if (v.length !== secret.signers.min)
              throw new Error("wrong commitments length");
            for (let i = 0; i < v.length; i++)
              mergedCommitment[i] = mergedCommitment[i].add(parsePoint(v[i]));
          }
          const mergedCommitmentBytes = mergedCommitment.map(serializePoint);
          const verifyingShares = {};
          for (const k in commitments)
            verifyingShares[k] = serializePoint(evalutateVSS(parseIdentifier(k), mergedCommitment));
          let res = {
            public: {
              signers: { min: secret.signers.min, max: secret.signers.max },
              commitments: mergedCommitmentBytes,
              verifyingShares: Object.fromEntries(Object.entries(verifyingShares).map(([k, v]) => [k, v.slice()]))
            },
            secret: {
              identifier: serializeIdentifier(secret.identifier),
              signingShare: Fn2.toBytes(signingShare)
            }
          };
          if (adjustDKG)
            res = adjustDKG(res);
          for (let i = 0; i < secret.coefficients.length; i++)
            secret.coefficients[i] -= secret.coefficients[i];
          delete secret.coefficients;
          delete secret.round1Cache;
          delete secret.round2Cache;
          secret.step = 3;
          return res;
        },
        clean(secret) {
          validateObject(secret, { identifier: "bigint", commitment: "object", signers: "object" }, { coefficients: "object", round1Cache: "object", round2Cache: "object", step: "number" }, "secret");
          secret.identifier -= secret.identifier;
          if (secret.coefficients) {
            for (let i = 0; i < secret.coefficients.length; i++)
              secret.coefficients[i] -= secret.coefficients[i];
          }
          delete secret.round1Cache;
          delete secret.round2Cache;
          secret.step = 3;
        }
      }),
      // Trusted dealer setup
      // Generates keys for all participants
      trustedDealer(signers, identifiers, secret, rng = randomBytes2) {
        validateSigners(signers);
        if (identifiers === void 0) {
          identifiers = [];
          for (let i = 1; i <= signers.max; i++)
            identifiers.push(Identifier.fromNumber(i));
        } else {
          aarray(identifiers, "identifiers");
          if (identifiers.length !== signers.max)
            throw new Error("identifiers should be array of " + signers.max);
        }
        const identifierNums = {};
        for (const id of identifiers) {
          const idNum = parseIdentifier(id);
          if (id in identifierNums)
            throw new Error("duplicated id=" + id);
          identifierNums[id] = idNum;
        }
        const sp = generateSecretPolynomial(signers, secret, void 0, rng);
        const commitmentBytes = sp.commitment.map(serializePoint);
        const secretShares = {};
        const verifyingShares = {};
        for (const id of identifiers) {
          const signingShare = polynomialEvaluate(identifierNums[id], sp.coefficients);
          verifyingShares[id] = serializePoint(Point.BASE.multiply(signingShare));
          secretShares[id] = {
            identifier: id,
            signingShare: Fn2.toBytes(signingShare)
          };
        }
        return {
          public: {
            signers: { min: signers.min, max: signers.max },
            commitments: commitmentBytes,
            verifyingShares
          },
          secretShares
        };
      },
      // Validate secret (from trusted dealer or DKG)
      validateSecret(secret, pub) {
        validateObject(secret, { identifier: "string", signingShare: "object" }, {}, "secret");
        abytes2(secret.signingShare, Fn2.BYTES, "secret.signingShare");
        validateObject(pub, {
          signers: "object",
          commitments: "object",
          verifyingShares: "object"
        }, {}, "pub");
        validateSigners(pub.signers, "pub.signers");
        aarray(pub.commitments, "pub.commitments");
        const id = parseIdentifier(secret.identifier);
        const commitment = pub.commitments.map(parsePoint);
        const signingShare = Fn2.fromBytes(secret.signingShare);
        validateSecretShare(id, commitment, signingShare);
      },
      // Actual signing
      // Round 1: each participant commit to nonces
      // Nonces kept private, commitments sent to coordinator (or every other participant)
      // NOTE: we don't need the message at this point, which lets a coordinator
      // keep multiple nonce commitments per participant in advance and skip
      // round1 for signing.
      // But then each participant needs to remember generated shares
      commit(secret, rng = randomBytes2) {
        validateObject(secret, { identifier: "string", signingShare: "object" }, {}, "secret");
        abytes2(secret.signingShare, Fn2.BYTES, "secret.signingShare");
        if (typeof rng !== "function")
          throw new TypeError('"rng" expected function, got type=' + typeof rng);
        const secretScalar = Fn2.fromBytes(secret.signingShare);
        const hiding = generateNonce(secretScalar, rng);
        const binding = generateNonce(secretScalar, rng);
        const nonces = { hiding: Fn2.toBytes(hiding), binding: Fn2.toBytes(binding) };
        return { nonces, commitments: nonceCommitments(secret.identifier, nonces) };
      },
      // Round2: sign. Each participant creates a signature share from the secret
      // and the selected nonce commitments.
      signShare(secret, pub, nonces, commitmentList, msg) {
        validateObject(secret, { identifier: "string", signingShare: "object" }, {}, "secret");
        abytes2(secret.signingShare, Fn2.BYTES, "secret.signingShare");
        validateObject(pub, {
          signers: "object",
          commitments: "object",
          verifyingShares: "object"
        }, {}, "pub");
        validateSigners(pub.signers, "pub.signers");
        aarray(pub.commitments, "pub.commitments");
        validateObject(nonces, { hiding: "object", binding: "object" }, {}, "nonces");
        abytes2(nonces.hiding, Fn2.BYTES, "nonces.hiding");
        abytes2(nonces.binding, Fn2.BYTES, "nonces.binding");
        aarray(commitmentList, "commitmentList");
        abytes2(msg, void 0, "msg");
        validateCommitmentsNum(pub.signers, commitmentList.length);
        const hidingNonce0 = Fn2.fromBytes(nonces.hiding);
        const bindingNonce0 = Fn2.fromBytes(nonces.binding);
        if (Fn2.is0(hidingNonce0) || Fn2.is0(bindingNonce0))
          throw new Error("signing nonces already used");
        const expectedCommitment = {
          identifier: secret.identifier,
          hiding: serializePoint(Point.BASE.multiply(hidingNonce0)),
          binding: serializePoint(Point.BASE.multiply(bindingNonce0))
        };
        const commitment = commitmentList.find((i) => i.identifier === secret.identifier);
        if (!commitment)
          throw new Error("missing signer commitment");
        if (bytesToHex2(commitment.hiding) !== bytesToHex2(expectedCommitment.hiding) || bytesToHex2(commitment.binding) !== bytesToHex2(expectedCommitment.binding))
          throw new Error("incorrect signer commitment");
        if (adjustSecret)
          secret = adjustSecret(secret, pub);
        if (adjustPublic)
          pub = adjustPublic(pub);
        const SK = Fn2.fromBytes(secret.signingShare);
        const { lambda, challenge: challenge3, bindingFactor, groupCommitment } = prepareShare(pub.commitments[0], commitmentList, msg, secret.identifier);
        const N = adjustNonces ? adjustNonces(groupCommitment, nonces) : nonces;
        const hidingNonce = adjustNonces ? Fn2.fromBytes(N.hiding) : hidingNonce0;
        const bindingNonce = adjustNonces ? Fn2.fromBytes(N.binding) : bindingNonce0;
        const t = Fn2.mul(Fn2.mul(lambda, SK), challenge3);
        const t2 = Fn2.mul(bindingNonce, bindingFactor);
        const r = Fn2.toBytes(Fn2.add(Fn2.add(hidingNonce, t2), t));
        nonces.hiding.fill(0);
        nonces.binding.fill(0);
        return r;
      },
      // Each participant (or coordinator) can verify signatures from other participants
      verifyShare(pub, commitmentList, msg, identifier, sigShare) {
        validateObject(pub, {
          signers: "object",
          commitments: "object",
          verifyingShares: "object"
        }, {}, "pub");
        validateSigners(pub.signers, "pub.signers");
        aarray(pub.commitments, "pub.commitments");
        aarray(commitmentList, "commitmentList");
        abytes2(msg, void 0, "msg");
        parseIdentifier(identifier);
        abytes2(sigShare, Fn2.BYTES, "sigShare");
        if (adjustPublic)
          pub = adjustPublic(pub);
        const comm = commitmentList.find((i) => i.identifier === identifier);
        if (!comm)
          throw new Error("cannot find identifier commitment");
        const PK = parsePoint(pub.verifyingShares[identifier]);
        const hidingNonceCommitment = parsePoint(comm.hiding);
        const bindingNonceCommitment = parsePoint(comm.binding);
        const { lambda, challenge: challenge3, bindingFactor, groupCommitment } = prepareShare(pub.commitments[0], commitmentList, msg, identifier);
        let commShare = hidingNonceCommitment.add(bindingNonceCommitment.multiplyUnsafe(bindingFactor));
        if (adjustGroupCommitmentShare)
          commShare = adjustGroupCommitmentShare(groupCommitment, commShare);
        const l = Point.BASE.multiplyUnsafe(Fn2.fromBytes(sigShare));
        const r = commShare.add(PK.multiplyUnsafe(Fn2.mul(challenge3, lambda)));
        return l.equals(r);
      },
      // Aggregate multiple signature shares into groupSignature
      aggregate(pub, commitmentList, msg, sigShares) {
        validateObject(pub, {
          signers: "object",
          commitments: "object",
          verifyingShares: "object"
        }, {}, "pub");
        validateSigners(pub.signers, "pub.signers");
        aarray(pub.commitments, "pub.commitments");
        aarray(commitmentList, "commitmentList");
        abytes2(msg, void 0, "msg");
        validateObject(sigShares, {}, {}, "sigShares");
        const rawPub = pub;
        if (adjustPublic)
          pub = adjustPublic(pub);
        try {
          validateCommitmentsNum(pub.signers, commitmentList.length);
        } catch {
          throw new AggErr("aggregation failed", []);
        }
        const ids = commitmentList.map((i) => i.identifier);
        const seen = /* @__PURE__ */ new Set();
        for (const id of ids) {
          if (seen.has(id))
            throw new AggErr("aggregation failed", []);
          seen.add(id);
        }
        if (ids.length !== Object.keys(sigShares).length)
          throw new AggErr("aggregation failed", []);
        for (const id of ids) {
          if (!(id in sigShares) || !(id in pub.verifyingShares))
            throw new AggErr("aggregation failed", []);
        }
        const GPK = parsePoint(pub.commitments[0]);
        const { groupCommitment } = getGroupCommitment(GPK, commitmentList, msg);
        let z = Fn2.ZERO;
        for (const id of ids)
          z = Fn2.add(z, Fn2.fromBytes(sigShares[id]));
        if (!Basic.verify(msg, groupCommitment, z, GPK)) {
          const cheaters = [];
          for (const id of ids) {
            if (!this.verifyShare(rawPub, commitmentList, msg, id, sigShares[id]))
              cheaters.push(id);
          }
          throw new AggErr("aggregation failed", cheaters);
        }
        return Signature.encode(groupCommitment, z);
      },
      // Basic sign/verify using single key
      sign(msg, secretKey) {
        let sk = Fn2.fromBytes(secretKey);
        if (adjustScalar)
          sk = adjustScalar(sk);
        const [R, z] = Basic.sign(msg, sk);
        return Signature.encode(R, z);
      },
      verify(sig, msg, publicKey) {
        const PK = parsePublicKey ? validatePublicPoint(parsePublicKey(publicKey)) : parsePoint(publicKey);
        const { R, z } = Signature.decode(sig);
        return Basic.verify(msg, R, z, PK);
      },
      // Combine multiple secret shares to restore secret
      combineSecret(shares, signers) {
        aarray(shares, "shares");
        validateSigners(signers);
        if (shares.length < signers.min || shares.length > signers.max)
          throw new Error("wrong secret shares array");
        const points = [];
        const seen = {};
        for (const s of shares) {
          const idNum = parseIdentifier(s.identifier);
          const id = serializeIdentifier(idNum);
          if (seen[id])
            throw new Error("duplicated id=" + id);
          seen[id] = true;
          points.push([idNum, Fn2.fromBytes(s.signingShare)]);
        }
        const xCoords = points.map(([x]) => x);
        let res = Fn2.ZERO;
        for (const [x, y] of points)
          res = Fn2.add(res, Fn2.mul(y, deriveInterpolatingValue(xCoords, x)));
        return Fn2.toBytes(res);
      },
      // Utils
      utils: Object.freeze({
        Fn: Fn2,
        // NOTE: we re-export it here because it may be different from Point.Fn (ed448 is fun!)
        // Test RNG overrides still go through noble's non-zero scalar derivation; this is not a raw
        // "bytes become scalar" escape hatch.
        randomScalar: (rng = randomBytes2) => Fn2.toBytes(genPointScalarPair(rng).scalar),
        generateSecretPolynomial: (signers, secret, coeffs, rng) => {
          const res = generateSecretPolynomial(signers, secret, coeffs, rng);
          return { ...res, commitment: res.commitment.map(serializePoint) };
        }
      })
    };
    return Object.freeze(frost);
  }
  var validateSigners, validateCommitmentsNum, AggErr;
  var init_frost = __esm({
    "node_modules/@noble/curves/abstract/frost.js"() {
      init_utils();
      init_utils2();
      init_curve();
      init_fft();
      init_modular();
      validateSigners = (signers, title = "signers") => {
        validateObject(signers, { min: "number", max: "number" }, {}, title);
        asafenumber(signers.min, title + ".min");
        asafenumber(signers.max, title + ".max");
        if (signers.min < 2 || signers.max < 2 || signers.min > signers.max)
          throw new Error("Wrong signers info: min=" + signers.min + " max=" + signers.max);
      };
      validateCommitmentsNum = (signers, len) => {
        if (len < signers.min || len > signers.max)
          throw new Error("Wrong number of commitments=" + len);
      };
      AggErr = class extends Error {
        // Empty means aggregation failed before per-share verification could attribute a signer.
        cheaters;
        constructor(msg, cheaters) {
          super(msg);
          this.cheaters = cheaters;
        }
      };
    }
  });

  // node_modules/@noble/hashes/hmac.js
  var _HMAC, hmac;
  var init_hmac = __esm({
    "node_modules/@noble/hashes/hmac.js"() {
      init_utils();
      _HMAC = class {
        oHash;
        iHash;
        blockLen;
        outputLen;
        canXOF = false;
        finished = false;
        destroyed = false;
        constructor(hash, key) {
          ahash(hash);
          abytes(key, void 0, "key");
          this.iHash = hash.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("expected Hash instance");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad = new Uint8Array(blockLen);
          pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54;
          this.iHash.update(pad);
          this.oHash = hash.create();
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54 ^ 92;
          this.oHash.update(pad);
          clean(pad);
        }
        update(buf) {
          aexists(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const buf = out.subarray(0, this.outputLen);
          this.iHash.digestInto(buf);
          this.oHash.update(buf);
          this.oHash.digestInto(buf);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to ||= Object.create(Object.getPrototypeOf(this), {});
          const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.canXOF = canXOF;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      hmac = /* @__PURE__ */ (() => {
        const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
        hmac_.create = (hash, key) => new _HMAC(hash, key);
        return hmac_;
      })();
    }
  });

  // node_modules/@noble/curves/abstract/der.js
  var _0n5, DERErr, _DER, DER;
  var init_der = __esm({
    "node_modules/@noble/curves/abstract/der.js"() {
      init_utils2();
      _0n5 = /* @__PURE__ */ BigInt(0);
      DERErr = class extends Error {
        constructor(m = "") {
          super(m);
        }
      };
      _DER = {
        // asn.1 DER encoding utils
        Err: DERErr,
        // Basic building block is TLV (Tag-Length-Value)
        _tlv: {
          encode: (tag, data) => {
            const { Err: E } = _DER;
            asafenumber(tag, "tag");
            if (tag < 0 || tag > 255)
              throw new E("tlv.encode: wrong tag");
            astring(data, "data");
            if (data.length & 1)
              throw new E("tlv.encode: unpadded data");
            const dataLen = data.length / 2;
            const len = numberToHexUnpadded(dataLen);
            if (len.length / 2 & 128)
              throw new E("tlv.encode: long form length too big");
            const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
            const t = numberToHexUnpadded(tag);
            return t + lenLen + len + data;
          },
          // v - value, l - left bytes (unparsed)
          decode(tag, data) {
            const { Err: E } = _DER;
            data = abytes2(data, void 0, "DER data");
            let pos = 0;
            if (tag < 0 || tag > 255)
              throw new E("tlv.decode: wrong tag");
            if (data.length < 2 || data[pos++] !== tag)
              throw new E("tlv.decode: wrong tlv");
            const first = data[pos++];
            const isLong = !!(first & 128);
            let length = 0;
            if (!isLong)
              length = first;
            else {
              const lenLen = first & 127;
              if (!lenLen)
                throw new E("tlv.decode(long): indefinite length not supported");
              if (lenLen > 4)
                throw new E("tlv.decode(long): byte length is too big");
              const lengthBytes = data.subarray(pos, pos + lenLen);
              if (lengthBytes.length !== lenLen)
                throw new E("tlv.decode: length bytes not complete");
              if (lengthBytes[0] === 0)
                throw new E("tlv.decode(long): zero leftmost byte");
              for (const b of lengthBytes)
                length = length << 8 | b;
              pos += lenLen;
              if (length < 128)
                throw new E("tlv.decode(long): not minimal encoding");
            }
            const v = data.subarray(pos, pos + length);
            if (v.length !== length)
              throw new E("tlv.decode: wrong value length");
            return { v, l: data.subarray(pos + length) };
          }
        },
        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
        // since we always use positive integers here. It must always be empty:
        // - add zero byte if exists
        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
        _int: {
          encode(num2) {
            const { Err: E } = _DER;
            abignumber(num2);
            if (num2 < _0n5)
              throw new E("integer: negative integers are not allowed");
            let hex2 = numberToHexUnpadded(num2);
            if (Number.parseInt(hex2[0], 16) & 8)
              hex2 = "00" + hex2;
            if (hex2.length & 1)
              throw new E("unexpected DER parsing assertion: unpadded hex");
            return hex2;
          },
          decode(data) {
            const { Err: E } = _DER;
            if (data.length < 1)
              throw new E("invalid signature integer: empty");
            if (data[0] & 128)
              throw new E("invalid signature integer: negative");
            if (data.length > 1 && data[0] === 0 && !(data[1] & 128))
              throw new E("invalid signature integer: unnecessary leading zero");
            return bytesToNumberBE(data);
          }
        },
        toSig(bytes, maxScalarBytes) {
          const { Err: E, _int: int, _tlv: tlv } = _DER;
          if (maxScalarBytes !== void 0) {
            asafenumber(maxScalarBytes, "maxScalarBytes");
            if (maxScalarBytes < 1)
              throw new E("invalid signature: maxScalarBytes must be positive");
          }
          const data = abytes2(bytes, void 0, "signature");
          const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
          if (seqLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
          const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
          if (sLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          if (maxScalarBytes !== void 0 && (rBytes.length > maxScalarBytes || sBytes.length > maxScalarBytes))
            throw new E("invalid signature: integer too large");
          return { r: int.decode(rBytes), s: int.decode(sBytes) };
        },
        hexFromSig(sig) {
          const { _tlv: tlv, _int: int } = _DER;
          validateObject(sig, { r: "bigint", s: "bigint" }, {}, "sig");
          const rs = tlv.encode(2, int.encode(sig.r));
          const ss = tlv.encode(2, int.encode(sig.s));
          const seq = rs + ss;
          return tlv.encode(48, seq);
        }
      };
      DER = /* @__PURE__ */ (() => {
        Object.freeze(_DER._tlv);
        Object.freeze(_DER._int);
        return Object.freeze(_DER);
      })();
    }
  });

  // node_modules/@noble/curves/abstract/weierstrass.js
  function _splitEndoScalar(k, basis, n) {
    aInRange("scalar", k, _0n6, n);
    const [[a1, b1], [a2, b2]] = basis;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = k - c1 * a1 - c2 * a2;
    let k2 = -c1 * b1 - c2 * b2;
    const k1neg = k1 < _0n6;
    const k2neg = k2 < _0n6;
    if (k1neg)
      k1 = -k1;
    if (k2neg)
      k2 = -k2;
    const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n5;
    if (k1 < _0n6 || k1 >= MAX_NUM || k2 < _0n6 || k2 >= MAX_NUM) {
      throw new Error("splitScalar (endomorphism): failed for k");
    }
    return { k1neg, k1, k2neg, k2 };
  }
  function validateSigFormat(format) {
    if (!["compact", "recovered", "der"].includes(format))
      throw new Error('Signature format must be "compact", "recovered", or "der"');
    return format;
  }
  function validateSigOpts(opts, def) {
    validateObject(opts);
    const optsn = {};
    for (let optName of Object.keys(def)) {
      optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
    }
    abool2(optsn.lowS, "lowS");
    abool2(optsn.prehash, "prehash");
    if (optsn.format !== void 0)
      validateSigFormat(optsn.format);
    return optsn;
  }
  function weierstrass(params, extraOpts = {}) {
    const validated = createCurveFields("weierstrass", params, extraOpts);
    const Fp2 = validated.Fp;
    const Fn2 = validated.Fn;
    let CURVE = validated.CURVE;
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    validateObject(extraOpts, {}, {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object",
      randomBytes: "function"
    });
    const { endo: endoOpts, allowInfinityPoint, clearCofactor, isTorsionFree, fromBytes, toBytes } = extraOpts;
    const randomBytes3 = extraOpts.randomBytes === void 0 ? randomBytes2 : extraOpts.randomBytes;
    if (endoOpts) {
      if (!Fp2.is0(CURVE.a) || typeof endoOpts.beta !== "bigint" || !Array.isArray(endoOpts.basises)) {
        throw new Error('invalid endo: expected "beta": bigint and "basises": array');
      }
    }
    const endo = endoOpts ? {
      beta: endoOpts.beta,
      basises: endoOpts.basises.map((basis) => [...basis])
    } : void 0;
    const lengths = getWLengths(Fp2, Fn2);
    function assertCompressionIsSupported() {
      if (!Fp2.isOdd)
        throw new Error("compression is not supported: Field does not have .isOdd()");
    }
    function pointToBytes2(_c, point, isCompressed) {
      if (point.is0()) {
        if (!allowInfinityPoint)
          throw new Error("bad point: ZERO");
        return Uint8Array.of(0);
      }
      const { x, y } = point.toAffine();
      const bx = Fp2.toBytes(x);
      abool2(isCompressed, "isCompressed");
      if (isCompressed) {
        assertCompressionIsSupported();
        const hasEvenY = !Fp2.isOdd(y);
        return concatBytes2(pprefix(hasEvenY), bx);
      } else {
        return concatBytes2(Uint8Array.of(4), bx, Fp2.toBytes(y));
      }
    }
    function pointFromBytes(bytes) {
      abytes2(bytes, void 0, "Point");
      const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
      const length = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (allowInfinityPoint && length === 1 && head === 0)
        return { x: Fp2.ZERO, y: Fp2.ZERO };
      if (length === comp && (head === 2 || head === 3)) {
        const x = Fp2.fromBytes(tail);
        if (!Fp2.isValid(x))
          throw new Error("bad point: is not on curve, wrong x");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp2.sqrt(y2);
        } catch (sqrtError) {
          const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("bad point: is not on curve, sqrt error" + err);
        }
        assertCompressionIsSupported();
        const evenY = Fp2.isOdd(y);
        const evenH = (head & 1) === 1;
        if (evenH !== evenY)
          y = Fp2.neg(y);
        return { x, y };
      } else if (length === uncomp && head === 4) {
        const L = Fp2.BYTES;
        const x = Fp2.fromBytes(tail.subarray(0, L));
        const y = Fp2.fromBytes(tail.subarray(L, L * 2));
        if (!isValidXY(x, y))
          throw new Error("bad point: is not on curve");
        return { x, y };
      } else {
        throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
      }
    }
    const encodePoint = toBytes === void 0 ? pointToBytes2 : toBytes;
    const decodePoint = fromBytes === void 0 ? pointFromBytes : fromBytes;
    const b3 = Fp2.mul(CURVE.b, _3n3);
    const mulA = Fp2.is0(CURVE.a) ? (_) => Fp2.ZERO : (x) => Fp2.mul(CURVE.a, x);
    function weierstrassEquation(x) {
      const x2 = Fp2.sqr(x);
      const x3 = Fp2.mul(x2, x);
      return Fp2.add(Fp2.add(x3, Fp2.mul(x, CURVE.a)), CURVE.b);
    }
    function isValidXY(x, y) {
      const left = Fp2.sqr(y);
      const right = weierstrassEquation(x);
      return Fp2.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp2.mul(Fp2.pow(CURVE.a, _3n3), _4n4);
    const _27b2 = Fp2.mul(Fp2.sqr(CURVE.b), BigInt(27));
    if (Fp2.is0(Fp2.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function acoord(title, n, banZero = false) {
      if (!Fp2.isValid(n) || banZero && Fp2.is0(n))
        throw new Error(`bad point coordinate ${title}`);
      return typeof n === "object" && n !== null ? Fp2.create(n) : n;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point))
        throw new Error("Weierstrass Point expected");
    }
    function splitEndoScalarN(k) {
      if (!endo || !endo.basises)
        throw new Error("no endo");
      return _splitEndoScalar(k, endo.basises, Fn2.ORDER);
    }
    function pushWnafPair(points, scalars, p, k) {
      if (!Fn2.isValid(k))
        throw new RangeError("invalid scalar: out of range");
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(k);
        const psi = new Point(Fp2.mul(p.X, endo.beta), p.Y, p.Z);
        points.push(k1neg ? p.negate() : p, k2neg ? psi.negate() : psi);
        scalars.push(k1, k2);
      } else {
        points.push(p);
        scalars.push(k);
      }
    }
    const validityCache = /* @__PURE__ */ new WeakSet();
    class Point {
      static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp2.ONE);
      static ZERO = new Point(Fp2.ZERO, Fp2.ONE, Fp2.ZERO);
      static Fp = Fp2;
      static Fn = Fn2;
      X;
      Y;
      Z;
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      constructor(X, Y, Z) {
        this.X = acoord("x", X);
        this.Y = acoord("y", Y, true);
        this.Z = acoord("z", Z);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp2.isValid(x) || !Fp2.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point)
          throw new Error("projective point not allowed");
        if (Fp2.is0(x) && Fp2.is0(y))
          return Point.ZERO;
        return new Point(x, y, Fp2.ONE);
      }
      static fromBytes(bytes) {
        const P = Point.fromAffine(decodePoint(abytes2(bytes, void 0, "point")));
        P.assertValidity();
        return P;
      }
      static fromHex(hex2) {
        return Point.fromBytes(hexToBytes2(hex2));
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       * @param isLazy - true will defer table computation until the first multiplication
       */
      precompute(windowSize = 6, isLazy = true) {
        wnaf.setWindowSize(this, windowSize);
        if (!isLazy)
          this.multiply(_3n3);
        return this;
      }
      // TODO: return `this`
      /** A point on curve is valid if it conforms to equation. */
      assertValidity() {
        const p = this;
        if (p.is0()) {
          if (allowInfinityPoint && Fp2.is0(p.X) && Fp2.eql(p.Y, Fp2.ONE) && Fp2.is0(p.Z))
            return;
          throw new Error("bad point: ZERO");
        }
        if (validityCache.has(p))
          return;
        const { x, y } = p.toAffine();
        if (!Fp2.isValid(x) || !Fp2.isValid(y))
          throw new Error("bad point: x or y not field elements");
        if (!isValidXY(x, y))
          throw new Error("bad point: equation left != right");
        if (!p.isTorsionFree())
          throw new Error("bad point: not in prime-order subgroup");
        validityCache.add(p);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (!Fp2.isOdd)
          throw new Error("Field doesn't support isOdd");
        return !Fp2.isOdd(y);
      }
      /** Compare one point to another. */
      equals(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const U1 = Fp2.eql(Fp2.mul(X1, Z2), Fp2.mul(X2, Z1));
        const U2 = Fp2.eql(Fp2.mul(Y1, Z2), Fp2.mul(Y2, Z1));
        return U1 && U2;
      }
      /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
      negate() {
        return new Point(this.X, Fp2.neg(this.Y), this.Z);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { X: X1, Y: Y1, Z: Z1 } = this;
        let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
        let t0 = Fp2.mul(X1, X1);
        let t1 = Fp2.mul(Y1, Y1);
        let t2 = Fp2.mul(Z1, Z1);
        let t3 = Fp2.mul(X1, Y1);
        t3 = Fp2.add(t3, t3);
        Z3 = Fp2.mul(X1, Z1);
        Z3 = Fp2.add(Z3, Z3);
        X3 = mulA(Z3);
        Y3 = Fp2.mul(b3, t2);
        Y3 = Fp2.add(X3, Y3);
        X3 = Fp2.sub(t1, Y3);
        Y3 = Fp2.add(t1, Y3);
        Y3 = Fp2.mul(X3, Y3);
        X3 = Fp2.mul(t3, X3);
        Z3 = Fp2.mul(b3, Z3);
        t2 = mulA(t2);
        t3 = Fp2.sub(t0, t2);
        t3 = mulA(t3);
        t3 = Fp2.add(t3, Z3);
        Z3 = Fp2.add(t0, t0);
        t0 = Fp2.add(Z3, t0);
        t0 = Fp2.add(t0, t2);
        t0 = Fp2.mul(t0, t3);
        Y3 = Fp2.add(Y3, t0);
        t2 = Fp2.mul(Y1, Z1);
        t2 = Fp2.add(t2, t2);
        t0 = Fp2.mul(t2, t3);
        X3 = Fp2.sub(X3, t0);
        Z3 = Fp2.mul(t2, t1);
        Z3 = Fp2.add(Z3, Z3);
        Z3 = Fp2.add(Z3, Z3);
        return new Point(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
        let t0 = Fp2.mul(X1, X2);
        let t1 = Fp2.mul(Y1, Y2);
        let t2 = Fp2.mul(Z1, Z2);
        let t3 = Fp2.add(X1, Y1);
        let t4 = Fp2.add(X2, Y2);
        t3 = Fp2.mul(t3, t4);
        t4 = Fp2.add(t0, t1);
        t3 = Fp2.sub(t3, t4);
        t4 = Fp2.add(X1, Z1);
        let t5 = Fp2.add(X2, Z2);
        t4 = Fp2.mul(t4, t5);
        t5 = Fp2.add(t0, t2);
        t4 = Fp2.sub(t4, t5);
        t5 = Fp2.add(Y1, Z1);
        X3 = Fp2.add(Y2, Z2);
        t5 = Fp2.mul(t5, X3);
        X3 = Fp2.add(t1, t2);
        t5 = Fp2.sub(t5, X3);
        Z3 = mulA(t4);
        X3 = Fp2.mul(b3, t2);
        Z3 = Fp2.add(X3, Z3);
        X3 = Fp2.sub(t1, Z3);
        Z3 = Fp2.add(t1, Z3);
        Y3 = Fp2.mul(X3, Z3);
        t1 = Fp2.add(t0, t0);
        t1 = Fp2.add(t1, t0);
        t2 = mulA(t2);
        t4 = Fp2.mul(b3, t4);
        t1 = Fp2.add(t1, t2);
        t2 = Fp2.sub(t0, t2);
        t2 = mulA(t2);
        t4 = Fp2.add(t4, t2);
        t0 = Fp2.mul(t1, t4);
        Y3 = Fp2.add(Y3, t0);
        t0 = Fp2.mul(t5, t4);
        X3 = Fp2.mul(t3, X3);
        X3 = Fp2.sub(X3, t0);
        t0 = Fp2.mul(t3, t1);
        Z3 = Fp2.mul(t5, Z3);
        Z3 = Fp2.add(Z3, t0);
        return new Point(X3, Y3, Z3);
      }
      subtract(other) {
        aprjpoint(other);
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      /**
       * Constant time multiplication.
       * Uses precomputed tables (signed fixed-window wNAF) when available.
       * Uses scalar blinding and avoids endomorphism splitting in the secret-scalar path.
       * @param scalar - by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        if (!Fn2.isValidNot0(scalar))
          throw new RangeError("invalid scalar: out of range");
        const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize2);
        return normalize2([p, f])[0];
      }
      /**
       * Non-constant-time multiplication. Uses width-4 wNAF with GLV endomorphism splitting
       * when available (two half-width scalars sharing one halved doubling chain).
       * It's faster, but should only be used when you don't care about
       * an exposed secret key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(scalar) {
        const p = this;
        const sc = scalar;
        if (!Fn2.isValid(sc))
          throw new RangeError("invalid scalar: out of range");
        if (sc === _0n6 || p.is0())
          return Point.ZERO;
        if (sc === _1n5)
          return p;
        if (wnaf.hasWindowSize(this))
          return wnaf.mulUnsafe(p, sc, normalize2);
        const points = [];
        const scalars = [];
        pushWnafPair(points, scalars, p, sc);
        return mulAddUnsafe(Point, points, scalars);
      }
      /**
       * Non-constant-time double-scalar multiplication `a⋅this + b⋅other` (Strauss–Shamir).
       * Both walks share one doubling chain via {@link mulAddUnsafe}, and GLV endomorphism
       * (when available) halves the chain again by splitting each scalar into two half-width
       * parts. Used by ECDSA verification and public-key recovery for `R = u1⋅G + u2⋅P`.
       * Only for public scalars.
       */
      mulAddUnsafe(a, other, b) {
        aprjpoint(other);
        const points = [];
        const scalars = [];
        pushWnafPair(points, scalars, this, a);
        pushWnafPair(points, scalars, other, b);
        return mulAddUnsafe(Point, points, scalars);
      }
      /**
       * Converts Projective point to affine (x, y) coordinates.
       * (X, Y, Z) ∋ (x=X/Z, y=Y/Z).
       * @param invertedZ - Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
       */
      toAffine(invertedZ) {
        const p = this;
        let iz = invertedZ;
        if (iz != null && !Fp2.isValid(iz))
          throw new RangeError('"invertedZ" expected valid field element');
        const { X, Y, Z } = p;
        if (Fp2.eql(Z, Fp2.ONE))
          return { x: X, y: Y };
        const is0 = p.is0();
        if (iz == null)
          iz = is0 ? Fp2.ONE : Fp2.inv(Z);
        const x = Fp2.mul(X, iz);
        const y = Fp2.mul(Y, iz);
        const zz = Fp2.mul(Z, iz);
        if (is0)
          return { x: Fp2.ZERO, y: Fp2.ZERO };
        if (!Fp2.eql(zz, Fp2.ONE))
          throw new Error("invZ was invalid");
        return { x, y };
      }
      /**
       * Checks whether Point is free of torsion elements (is in prime subgroup).
       * Always torsion-free for cofactor=1 curves.
       */
      isTorsionFree() {
        if (cofactor === _1n5)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point, this);
        return wnaf.mulUnsafe(this, CURVE_ORDER).is0();
      }
      clearCofactor() {
        if (cofactor === _1n5)
          return this;
        if (clearCofactor)
          return clearCofactor(Point, this);
        return this.multiplyUnsafe(cofactor);
      }
      isSmallOrder() {
        if (cofactor === _1n5)
          return this.is0();
        return this.clearCofactor().is0();
      }
      toBytes(isCompressed = true) {
        abool2(isCompressed, "isCompressed");
        this.assertValidity();
        return encodePoint(Point, this, isCompressed);
      }
      toHex(isCompressed = true) {
        return bytesToHex2(this.toBytes(isCompressed));
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    }
    const normalize2 = (points) => normalizeZ(Point, points);
    const wnaf = new ScalarMultiplier(Point, randomBytes3);
    if (wnaf.bits >= 6)
      Point.BASE.precompute(6);
    Object.freeze(Point.prototype);
    Object.freeze(Point);
    return Point;
  }
  function pprefix(hasEvenY) {
    return Uint8Array.of(hasEvenY ? 2 : 3);
  }
  function getWLengths(Fp2, Fn2) {
    return {
      secretKey: Fn2.BYTES,
      publicKey: 1 + Fp2.BYTES,
      publicKeyUncompressed: 1 + 2 * Fp2.BYTES,
      publicKeyHasPrefix: true,
      // Raw compact `(r || s)` signature width; DER and recovered signatures use
      // different lengths outside this helper.
      signature: 2 * Fn2.BYTES
    };
  }
  function ecdh(Point, ecdhOpts = {}) {
    validatePointCons(Point);
    const { Fn: Fn2 } = Point;
    const randomBytes_ = ecdhOpts.randomBytes === void 0 ? randomBytes2 : ecdhOpts.randomBytes;
    const lengths = Object.assign(getWLengths(Point.Fp, Fn2), {
      seed: Math.max(getMinHashLength(Fn2.ORDER), 16)
    });
    function isValidSecretKey(secretKey) {
      try {
        const num2 = Fn2.fromBytes(secretKey);
        return Fn2.isValidNot0(num2);
      } catch (error) {
        return false;
      }
    }
    function isValidPublicKey(publicKey, isCompressed) {
      const { publicKey: comp, publicKeyUncompressed } = lengths;
      try {
        const l = publicKey.length;
        if (isCompressed === true && l !== comp)
          return false;
        if (isCompressed === false && l !== publicKeyUncompressed)
          return false;
        return !Point.fromBytes(publicKey).is0();
      } catch (error) {
        return false;
      }
    }
    function randomSecretKey(seed) {
      seed = seed === void 0 ? randomBytes_(lengths.seed) : seed;
      return mapHashToField(abytes2(seed, lengths.seed, "seed"), Fn2.ORDER);
    }
    function getPublicKey(secretKey, isCompressed = true) {
      return Point.BASE.multiply(Fn2.fromBytes(secretKey)).toBytes(isCompressed);
    }
    function isProbPub(item) {
      const { secretKey, publicKey, publicKeyUncompressed } = lengths;
      const allowedLengths = Fn2._lengths;
      if (!isBytes2(item))
        return void 0;
      const l = abytes2(item, void 0, "key").length;
      const isPub = l === publicKey || l === publicKeyUncompressed;
      const isSec = l === secretKey || !!allowedLengths?.includes(l);
      if (isPub && isSec)
        return void 0;
      return isPub;
    }
    function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
      if (isProbPub(secretKeyA) === true)
        throw new Error("first arg must be private key");
      if (isProbPub(publicKeyB) === false)
        throw new Error("second arg must be public key");
      const s = Fn2.fromBytes(secretKeyA);
      const b = Point.fromBytes(publicKeyB);
      if (b.is0())
        throw new Error("invalid public key: point at infinity");
      return b.multiply(s).toBytes(isCompressed);
    }
    const utils = {
      isValidSecretKey,
      isValidPublicKey,
      randomSecretKey
    };
    const keygen = createKeygen(randomSecretKey, getPublicKey);
    Object.freeze(utils);
    Object.freeze(lengths);
    return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
  }
  function ecdsa(Point, hash, ecdsaOpts = {}) {
    validatePointCons(Point);
    const hash_ = hash;
    ahash(hash_);
    validateObject(ecdsaOpts, {}, {
      hmac: "function",
      lowS: "boolean",
      randomBytes: "function",
      bits2int: "function",
      bits2int_modN: "function"
    });
    const opts = Object.assign({}, ecdsaOpts);
    const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
    const hmac2 = opts.hmac === void 0 ? (key, msg) => hmac(hash_, key, msg) : opts.hmac;
    const { Fp: Fp2, Fn: Fn2 } = Point;
    const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn2;
    const blindLength = getMinHashLength(CURVE_ORDER);
    const csprng = probeRandomBytes(randomBytes3, blindLength);
    const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, opts);
    const defaultSigOpts = {
      prehash: true,
      lowS: typeof opts.lowS === "boolean" ? opts.lowS : true,
      format: "compact",
      extraEntropy: false
    };
    const hasLargeRecoveryLifts = CURVE_ORDER * _2n3 + _1n5 < Fp2.ORDER;
    function isBiggerThanHalfOrder(number) {
      const HALF = CURVE_ORDER >> _1n5;
      return number > HALF;
    }
    function validateRS(title, num2) {
      if (!Fn2.isValidNot0(num2))
        throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
      return num2;
    }
    function assertFieldSignIsSupported() {
      if (!Fp2.isOdd)
        throw new Error("Field doesn't support isOdd");
    }
    function getRecoveryBit(x, y, r) {
      assertFieldSignIsSupported();
      return (x === r ? 0 : 2) | Number(Fp2.isOdd(y));
    }
    function assertRecoverableCurve() {
      if (hasLargeRecoveryLifts)
        throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
    }
    function validateSigLength(bytes, format) {
      validateSigFormat(format);
      const size = lengths.signature;
      const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
      return abytes2(bytes, sizer);
    }
    class Signature {
      r;
      s;
      recovery;
      constructor(r, s, recovery) {
        this.r = validateRS("r", r);
        this.s = validateRS("s", s);
        if (recovery != null) {
          assertRecoverableCurve();
          if (![0, 1, 2, 3].includes(recovery))
            throw new Error("invalid recovery id");
          this.recovery = recovery;
        }
        Object.freeze(this);
      }
      static fromBytes(bytes, format = defaultSigOpts.format) {
        validateSigLength(bytes, format);
        let recid;
        if (format === "der") {
          if (bytes.length > 2 * Fn2.BYTES + 16)
            throw new DER.Err("invalid signature: DER signature too long");
          const { r: r2, s: s2 } = DER.toSig(abytes2(bytes), Fn2.BYTES + 1);
          return new Signature(r2, s2);
        }
        if (format === "recovered") {
          recid = bytes[0];
          format = "compact";
          bytes = bytes.subarray(1);
        }
        const L = lengths.signature / 2;
        const r = bytes.subarray(0, L);
        const s = bytes.subarray(L, L * 2);
        return new Signature(Fn2.fromBytes(r), Fn2.fromBytes(s), recid);
      }
      static fromHex(hex2, format) {
        return this.fromBytes(hexToBytes2(hex2), format);
      }
      assertRecovery() {
        const { recovery } = this;
        if (recovery == null)
          throw new Error("invalid recovery id: must be present");
        return recovery;
      }
      addRecoveryBit(recovery) {
        return new Signature(this.r, this.s, recovery);
      }
      // Unlike the top-level helper below, this method expects a digest that has
      // already been hashed to the curve's message representative.
      recoverPublicKey(messageHash) {
        const { r, s } = this;
        const recovery = this.assertRecovery();
        const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
        if (!Fp2.isValid(radj))
          throw new Error("invalid recovery id: sig.r+curve.n != R.x");
        const x = Fp2.toBytes(radj);
        const R = Point.fromBytes(concatBytes2(pprefix((recovery & 1) === 0), x));
        const ir = Fn2.inv(radj);
        const h = bits2int_modN(abytes2(messageHash, void 0, "msgHash"));
        const u1 = Fn2.create(-h * ir);
        const u2 = Fn2.create(s * ir);
        const Q = Point.BASE.mulAddUnsafe(u1, R, u2);
        if (Q.is0())
          throw new Error("invalid recovery: point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      toBytes(format = defaultSigOpts.format) {
        validateSigFormat(format);
        if (format === "der")
          return hexToBytes2(DER.hexFromSig(this));
        const { r, s } = this;
        const rb = Fn2.toBytes(r);
        const sb = Fn2.toBytes(s);
        if (format === "recovered") {
          assertRecoverableCurve();
          return concatBytes2(Uint8Array.of(this.assertRecovery()), rb, sb);
        }
        return concatBytes2(rb, sb);
      }
      toHex(format) {
        return bytesToHex2(this.toBytes(format));
      }
    }
    Object.freeze(Signature.prototype);
    Object.freeze(Signature);
    const bits2int = opts.bits2int === void 0 ? function bits2int_def(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num2 = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - fnBits;
      return delta > 0 ? num2 >> BigInt(delta) : num2;
    } : opts.bits2int;
    const bits2int_modN = opts.bits2int_modN === void 0 ? function bits2int_modN_def(bytes) {
      return Fn2.create(bits2int(bytes));
    } : opts.bits2int_modN;
    const ORDER_MASK = bitMask(fnBits);
    function int2octets(num2) {
      aInRange("num < 2^" + fnBits, num2, _0n6, ORDER_MASK);
      return Fn2.toBytes(num2);
    }
    function validateMsgAndHash(message, prehash) {
      abytes2(message, void 0, "message");
      return prehash ? abytes2(hash_(message), void 0, "prehashed message") : message;
    }
    function prepSig(message, secretKey, opts2) {
      const { lowS, prehash, extraEntropy } = validateSigOpts(opts2, defaultSigOpts);
      message = validateMsgAndHash(message, prehash);
      const h1int = bits2int_modN(message);
      const d = Fn2.fromBytes(secretKey);
      if (!Fn2.isValidNot0(d))
        throw new Error("invalid private key");
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (extraEntropy != null && extraEntropy !== false) {
        const e = extraEntropy === true ? randomBytes3(lengths.secretKey) : extraEntropy;
        seedArgs.push(abytes2(e, void 0, "extraEntropy"));
      }
      const seed = concatBytes2(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int(kBytes);
        if (!Fn2.isValidNot0(k))
          return;
        const q = Point.BASE.multiply(k).toAffine();
        const r = Fn2.create(q.x);
        if (r === _0n6)
          return;
        let s;
        if (csprng !== void 0) {
          const b = bytesToNumberBE(mapHashToField(csprng(blindLength), CURVE_ORDER));
          const ibk = Fn2.inv(Fn2.mul(b, k));
          const bm = Fn2.mul(b, m);
          const bd = Fn2.mul(b, d);
          s = Fn2.create(ibk * Fn2.create(bm + bd * r));
        } else {
          const ik = invertCt(k, CURVE_ORDER);
          s = Fn2.create(ik * Fn2.create(m + r * d));
        }
        if (s === _0n6)
          return;
        let recovery = getRecoveryBit(q.x, q.y, r);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = Fn2.neg(s);
          recovery ^= 1;
        }
        return new Signature(r, normS, hasLargeRecoveryLifts ? void 0 : recovery);
      }
      return { seed, k2sig };
    }
    function sign(message, secretKey, opts2 = {}) {
      const { seed, k2sig } = prepSig(message, secretKey, opts2);
      const drbg = createHmacDrbg(hash_.outputLen, Fn2.BYTES, hmac2);
      const sig = drbg(seed, k2sig);
      return sig.toBytes(opts2.format);
    }
    function verify(signature, message, publicKey, opts2 = {}) {
      const { lowS, prehash, format } = validateSigOpts(opts2, defaultSigOpts);
      publicKey = abytes2(publicKey, void 0, "publicKey");
      message = validateMsgAndHash(message, prehash);
      if (!isBytes2(signature)) {
        const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
        throw new Error("verify expects Uint8Array signature" + end);
      }
      validateSigLength(signature, format);
      try {
        const sig = Signature.fromBytes(signature, format);
        const P = Point.fromBytes(publicKey);
        if (P.is0())
          return false;
        if (lowS && sig.hasHighS())
          return false;
        const { r, s } = sig;
        const h = bits2int_modN(message);
        const is = Fn2.inv(s);
        const u1 = Fn2.create(h * is);
        const u2 = Fn2.create(r * is);
        const R = Point.BASE.mulAddUnsafe(u1, P, u2);
        if (R.is0())
          return false;
        const q = R.toAffine();
        const v = Fn2.create(q.x);
        if (v !== r)
          return false;
        if (format === "recovered" && sig.recovery !== getRecoveryBit(q.x, q.y, r))
          return false;
        return true;
      } catch (e) {
        return false;
      }
    }
    function recoverPublicKey(signature, message, opts2 = {}) {
      const { prehash } = validateSigOpts(opts2, defaultSigOpts);
      message = validateMsgAndHash(message, prehash);
      return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
    }
    return Object.freeze({
      keygen,
      getPublicKey,
      getSharedSecret,
      utils,
      lengths,
      Point,
      sign,
      verify,
      recoverPublicKey,
      Signature,
      hash: hash_
    });
  }
  var divNearest, _0n6, _1n5, _2n3, _3n3, _4n4;
  var init_weierstrass = __esm({
    "node_modules/@noble/curves/abstract/weierstrass.js"() {
      init_hmac();
      init_utils();
      init_utils2();
      init_curve();
      init_der();
      init_modular();
      divNearest = (num2, den) => (num2 + (num2 >= 0 ? den : -den) / _2n3) / den;
      _0n6 = /* @__PURE__ */ BigInt(0);
      _1n5 = /* @__PURE__ */ BigInt(1);
      _2n3 = /* @__PURE__ */ BigInt(2);
      _3n3 = /* @__PURE__ */ BigInt(3);
      _4n4 = /* @__PURE__ */ BigInt(4);
    }
  });

  // node_modules/@noble/curves/secp256k1.js
  var secp256k1_exports = {};
  __export(secp256k1_exports, {
    __TEST: () => __TEST,
    schnorr: () => schnorr,
    schnorr_FROST: () => schnorr_FROST,
    secp256k1: () => secp256k1,
    secp256k1_FROST: () => secp256k1_FROST,
    secp256k1_hasher: () => secp256k1_hasher
  });
  function sqrtMod(y) {
    const P = secp256k1_CURVE.p;
    const _3n5 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n5, P) * b3 % P;
    const b9 = pow2(b6, _3n5, P) * b3 % P;
    const b11 = pow2(b9, _2n4, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b223 = pow2(b220, _3n5, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n4, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  function taggedHash(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = sha256(asciiToBytes(tag));
      tagP = concatBytes2(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes2(tagP, ...messages));
  }
  function schnorrGetExtPubKey(priv) {
    const { Fn: Fn2, BASE } = Pointk1;
    const d_ = Fn2.fromBytes(abytes2(priv, 32, "secretKey"));
    const p = BASE.multiply(d_);
    const affine = p.toAffine();
    const scalar = hasEven(affine.y) ? d_ : Fn2.neg(d_);
    return { scalar, bytes: affineXToBytes(affine) };
  }
  function lift_x(x) {
    const Fp2 = Fpk1;
    if (!Fp2.isValidNot0(x))
      throw new Error("invalid x: Fail if x \u2265 p");
    const xx = Fp2.sqr(x);
    const c = Fp2.add(Fp2.mulN(xx, x), BigInt(7));
    let y = Fp2.sqrt(c);
    if (!hasEven(y))
      y = Fp2.neg(y);
    const p = Pointk1.fromAffine({ x, y });
    p.assertValidity();
    return p;
  }
  function challenge(...args) {
    return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
  }
  function schnorrGetPublicKey(secretKey) {
    return schnorrGetExtPubKey(secretKey).bytes;
  }
  function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
    const { Fn: Fn2, BASE } = Pointk1;
    const m = copyBytes(abytes2(message, void 0, "message"));
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
    const a = abytes2(auxRand, 32, "auxRand");
    const t = Fn2.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
    const rand = taggedHash("BIP0340/nonce", t, px, m);
    const k_ = Fn2.create(num(rand));
    if (k_ === _0n7)
      throw new Error("sign failed: k is zero");
    const p = BASE.multiply(k_);
    const affine = p.toAffine();
    const k = hasEven(affine.y) ? k_ : Fn2.neg(k_);
    const rx = affineXToBytes(affine);
    const e = challenge(rx, px, m);
    const sig = new Uint8Array(64);
    sig.set(rx, 0);
    sig.set(Fn2.toBytes(Fn2.create(k + e * d)), 32);
    if (!schnorrVerify(sig, m, px))
      throw new Error("sign: Invalid signature produced");
    return sig;
  }
  function schnorrVerify(signature, message, publicKey) {
    const { Fp: Fp2, Fn: Fn2, BASE } = Pointk1;
    const sig = abytes2(signature, 64, "signature");
    const m = abytes2(message, void 0, "message");
    const pub = abytes2(publicKey, 32, "publicKey");
    try {
      const P = lift_x(num(pub));
      const rBytes = sig.subarray(0, 32);
      const r = num(rBytes);
      if (!Fp2.isValidNot0(r))
        return false;
      const s = num(sig.subarray(32, 64));
      if (!Fn2.isValidNot0(s))
        return false;
      const e = challenge(rBytes, pointToBytes(P), m);
      const R = BASE.mulAddUnsafe(s, P, Fn2.neg(e));
      const { x, y } = R.toAffine();
      if (R.is0() || !hasEven(y) || !Fp2.eql(x, r))
        return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  function tweak(point, merkleRoot) {
    if (merkleRoot === void 0)
      return _0n7;
    const x = pointToBytes(point);
    const t = bytesToNumberBE(taggedHash("TapTweak", x, merkleRoot));
    if (!Pointk1.Fn.isValid(t))
      throw new Error("invalid TapTweak hash");
    return t;
  }
  function frostPubToEvenY(pub) {
    const VK = Pointk1.fromBytes(pub.commitments[0]);
    if (hasEven(VK.y))
      return pub;
    return {
      signers: { min: pub.signers.min, max: pub.signers.max },
      commitments: pub.commitments.map((i) => Pointk1.fromBytes(i).negate().toBytes()),
      verifyingShares: Object.fromEntries(Object.entries(pub.verifyingShares).map(([k, v]) => [
        k,
        Pointk1.fromBytes(v).negate().toBytes()
      ]))
    };
  }
  function frostSecretToEvenY(s, pub) {
    const VK = Pointk1.fromBytes(pub.commitments[0]);
    if (hasEven(VK.y))
      return s;
    const Fn2 = Pointk1.Fn;
    return {
      ...s,
      signingShare: Fn2.toBytes(Fn2.neg(Fn2.fromBytes(s.signingShare)))
    };
  }
  function frostNoncesToEvenY(groupCommitment, nonces) {
    if (hasEven(groupCommitment.y))
      return nonces;
    const Fn2 = Pointk1.Fn;
    return {
      binding: Fn2.toBytes(Fn2.neg(Fn2.fromBytes(nonces.binding))),
      hiding: Fn2.toBytes(Fn2.neg(Fn2.fromBytes(nonces.hiding)))
    };
  }
  function frostTweakSecret(s, pub, merkleRoot) {
    const Fn2 = Pointk1.Fn;
    const keyPackage = frostSecretToEvenY(s, pub);
    const evenPub = frostPubToEvenY(pub);
    const t = tweak(Pointk1.fromBytes(evenPub.commitments[0]), merkleRoot);
    const signingShare = Fn2.toBytes(Fn2.add(Fn2.fromBytes(keyPackage.signingShare), t));
    return {
      identifier: keyPackage.identifier,
      signingShare
    };
  }
  function frostTweakPublic(pub, merkleRoot) {
    const PKPackage = frostPubToEvenY(pub);
    const t = tweak(Pointk1.fromBytes(PKPackage.commitments[0]), merkleRoot);
    if (t === _0n7)
      return PKPackage;
    const tp = Pointk1.BASE.multiply(t);
    const commitments = PKPackage.commitments.map((c, i) => (i === 0 ? Pointk1.fromBytes(c).add(tp) : Pointk1.fromBytes(c)).toBytes());
    const verifyingShares = {};
    for (const k in PKPackage.verifyingShares) {
      verifyingShares[k] = Pointk1.fromBytes(PKPackage.verifyingShares[k]).add(tp).toBytes();
    }
    return {
      signers: { min: PKPackage.signers.min, max: PKPackage.signers.max },
      commitments,
      verifyingShares
    };
  }
  var secp256k1_CURVE, secp256k1_ENDO, _0n7, _2n4, Fpk1, Pointk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes, affineXToBytes, hasEven, num, __TEST, schnorr, isoMap, mapSWU, getMapSWU, secp256k1_hasher, secp256k1_FROST, schnorr_FROST;
  var init_secp256k1 = __esm({
    "node_modules/@noble/curves/secp256k1.js"() {
      init_sha2();
      init_utils();
      init_curve();
      init_frost();
      init_hash_to_curve();
      init_modular();
      init_weierstrass();
      init_utils2();
      secp256k1_CURVE = {
        p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
        n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
        h: BigInt(1),
        a: BigInt(0),
        b: BigInt(7),
        Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
        Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
      };
      secp256k1_ENDO = {
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        basises: [
          [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
          [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
        ]
      };
      _0n7 = /* @__PURE__ */ BigInt(0);
      _2n4 = /* @__PURE__ */ BigInt(2);
      Fpk1 = /* @__PURE__ */ Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
      Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
        Fp: Fpk1,
        endo: secp256k1_ENDO
      });
      secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
      TAGGED_HASH_PREFIXES = /* @__PURE__ */ Object.create(null);
      pointToBytes = (point) => point.toBytes(true).slice(1);
      affineXToBytes = ({ x }) => Fpk1.toBytes(x);
      hasEven = (y) => !Fpk1.isOdd(y);
      num = bytesToNumberBE;
      __TEST = /* @__PURE__ */ Object.freeze({ lift_x, frostTweakPublic, frostTweakSecret });
      schnorr = /* @__PURE__ */ (() => {
        const size = 32;
        const seedLength = 48;
        const randomSecretKey = (seed) => {
          seed = seed === void 0 ? randomBytes(seedLength) : seed;
          return mapHashToField(abytes2(seed, seedLength, "seed"), secp256k1_CURVE.n);
        };
        return Object.freeze({
          keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
          getPublicKey: schnorrGetPublicKey,
          sign: schnorrSign,
          verify: schnorrVerify,
          Point: Pointk1,
          utils: Object.freeze({
            randomSecretKey,
            taggedHash,
            lift_x,
            pointToBytes
          }),
          lengths: Object.freeze({
            secretKey: size,
            publicKey: size,
            publicKeyHasPrefix: false,
            signature: size * 2,
            seed: seedLength
          })
        });
      })();
      isoMap = /* @__PURE__ */ (() => isogenyMap(Fpk1, [
        // xNum
        [
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
          "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
          "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
        ],
        // xDen
        [
          "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
          "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ],
        // yNum
        [
          "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
          "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
          "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
          "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
        ],
        // yDen
        [
          "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
          "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
          "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ]
      ].map((i) => i.map((j) => BigInt(j)))))();
      getMapSWU = () => mapSWU || (mapSWU = mapToCurveSimpleSWU(Fpk1, {
        // Building the SWU sqrt-ratio helper eagerly adds noticeable `secp256k1.js` import cost, so
        // defer it to first use; after that the cached mapper is reused directly.
        A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
        B: BigInt("1771"),
        Z: Fpk1.create(BigInt("-11"))
      }));
      secp256k1_hasher = /* @__PURE__ */ (() => createHasher2(Pointk1, (scalars) => {
        const { x, y } = getMapSWU()(Fpk1.create(scalars[0]));
        return isoMap(x, y);
      }, {
        DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
        encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
        p: Fpk1.ORDER,
        m: 1,
        k: 128,
        expand: "xmd",
        hash: sha256
      }))();
      secp256k1_FROST = /* @__PURE__ */ (() => createFROST({
        name: "FROST-secp256k1-SHA256-v1",
        Point: Pointk1,
        hashToScalar: secp256k1_hasher.hashToScalar,
        hash: sha256
      }))();
      schnorr_FROST = /* @__PURE__ */ (() => createFROST({
        name: "FROST-secp256k1-SHA256-TR-v1",
        Point: Pointk1,
        hashToScalar: secp256k1_hasher.hashToScalar,
        hash: sha256,
        // Taproot related hacks
        parsePublicKey(publicKey) {
          if (publicKey.length === 32)
            return lift_x(bytesToNumberBE(publicKey));
          if (publicKey.length === 33)
            return Pointk1.fromBytes(publicKey);
          throw new Error(`expected x-only or compressed public key, got length=${publicKey.length}`);
        },
        adjustScalar(n) {
          const PK = Pointk1.BASE.multiply(n);
          return hasEven(PK.y) ? n : Pointk1.Fn.neg(n);
        },
        adjustPoint: (p) => hasEven(p.y) ? p : p.negate(),
        challenge(R, PK, msg) {
          return challenge(pointToBytes(R), pointToBytes(PK), msg);
        },
        adjustNonces: frostNoncesToEvenY,
        adjustGroupCommitmentShare: (GC, GCShare) => !hasEven(GC.y) ? GCShare.negate() : GCShare,
        adjustPublic: frostPubToEvenY,
        adjustSecret: frostSecretToEvenY,
        adjustTx: {
          // Compat with official implementation
          encode: (tx) => tx.subarray(1),
          decode: (tx) => concatBytes2(Uint8Array.of(2), tx)
        },
        adjustDKG: (k) => {
          const merkleRoot = new Uint8Array(0);
          return {
            public: frostTweakPublic(k.public, merkleRoot),
            secret: frostTweakSecret(k.secret, k.public, merkleRoot)
          };
        }
      }))();
    }
  });

  // node_modules/@toruslabs/eccrypto/dist/lib.cjs/index.js
  var require_lib2 = __commonJS({
    "node_modules/@toruslabs/eccrypto/dist/lib.cjs/index.js"(exports) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      var _noble_curves_secp256k1_js = (init_secp256k1(), __toCommonJS(secp256k1_exports));
      var _noble_curves_utils_js = (init_utils2(), __toCommonJS(utils_exports));
      var browserCrypto = globalThis.crypto || globalThis.msCrypto || {};
      var subtle = browserCrypto.subtle || browserCrypto.webkitSubtle;
      var SECP256K1_GROUP_ORDER = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
      function assert(condition, message) {
        if (!condition) throw new Error(message || "Assertion failed");
      }
      function isValidPrivateKey(privateKey) {
        if (privateKey.length !== 32) return false;
        const privateKeyBigInt = (0, _noble_curves_utils_js.bytesToNumberBE)(privateKey);
        return privateKeyBigInt > 0n && privateKeyBigInt < SECP256K1_GROUP_ORDER;
      }
      function randomBytes3(size) {
        if (typeof browserCrypto.getRandomValues !== "function") {
          if (typeof browserCrypto.randomBytes !== "function") throw new Error("No random number generator available");
          return browserCrypto.randomBytes(size);
        }
        const arr = new Uint8Array(size);
        browserCrypto.getRandomValues(arr);
        return arr;
      }
      async function sha5122(msg) {
        if (typeof browserCrypto.createHash !== "function") {
          const hash2 = await subtle.digest("SHA-512", msg);
          return new Uint8Array(hash2);
        }
        const hash = browserCrypto.createHash("sha512");
        return new Uint8Array(hash.update(msg).digest());
      }
      function getAes(op) {
        return async function(iv, key, data) {
          if (subtle && subtle[op] && subtle.importKey) {
            const cryptoKey = await subtle.importKey("raw", key, { name: "AES-CBC" }, false, [op]);
            const encAlgorithm = {
              name: "AES-CBC",
              iv
            };
            const result = await subtle[op](encAlgorithm, cryptoKey, data);
            return new Uint8Array(result);
          } else if (op === "encrypt" && typeof browserCrypto.createCipheriv === "function") {
            const cipher = browserCrypto.createCipheriv("aes-256-cbc", key, iv);
            const firstChunk = cipher.update(data);
            const secondChunk = cipher.final();
            return (0, _noble_curves_utils_js.concatBytes)(firstChunk, secondChunk);
          } else if (op === "decrypt" && typeof browserCrypto.createDecipheriv === "function") {
            const decipher = browserCrypto.createDecipheriv("aes-256-cbc", key, iv);
            const firstChunk = decipher.update(data);
            const secondChunk = decipher.final();
            return (0, _noble_curves_utils_js.concatBytes)(firstChunk, secondChunk);
          }
          throw new Error(`Unsupported operation: ${op}`);
        };
      }
      var aesCbcEncrypt = getAes("encrypt");
      var aesCbcDecrypt = getAes("decrypt");
      async function hmacSha256Sign(key, msg) {
        if (typeof browserCrypto.createHmac !== "function") {
          const cryptoKey = await subtle.importKey("raw", key, {
            name: "HMAC",
            hash: { name: "SHA-256" }
          }, false, ["sign", "verify"]);
          const sig = await subtle.sign("HMAC", cryptoKey, msg);
          return new Uint8Array(sig);
        }
        const hmac2 = browserCrypto.createHmac("sha256", key);
        hmac2.update(msg);
        return hmac2.digest();
      }
      async function hmacSha256Verify(key, msg, sig) {
        const expectedSig = await hmacSha256Sign(key, msg);
        return (0, _noble_curves_utils_js.equalBytes)(expectedSig, sig);
      }
      function assertValidPrivateKey(privateKey) {
        assert(isValidPrivateKey(privateKey), "Bad private key");
      }
      function assertValidPublicKey(publicKey) {
        assert(_noble_curves_secp256k1_js.secp256k1.utils.isValidPublicKey(publicKey, true) || _noble_curves_secp256k1_js.secp256k1.utils.isValidPublicKey(publicKey, false), "Bad public key");
      }
      function assertValidMessage(msg) {
        assert(msg.length > 0, "Message should not be empty");
        assert(msg.length <= 32, "Message is too long");
      }
      var generatePrivate = function() {
        let privateKey = randomBytes3(32);
        while (!isValidPrivateKey(privateKey)) privateKey = randomBytes3(32);
        return privateKey;
      };
      var getPublic = function(privateKey) {
        assertValidPrivateKey(privateKey);
        return _noble_curves_secp256k1_js.secp256k1.getPublicKey(privateKey, false);
      };
      var getPublicCompressed = function(privateKey) {
        assertValidPrivateKey(privateKey);
        return _noble_curves_secp256k1_js.secp256k1.getPublicKey(privateKey);
      };
      var sign = async function(privateKey, msg) {
        assertValidPrivateKey(privateKey);
        assertValidMessage(msg);
        return _noble_curves_secp256k1_js.secp256k1.sign(msg, privateKey, {
          prehash: false,
          format: "der"
        });
      };
      var verify = async function(publicKey, msg, sig) {
        assertValidPublicKey(publicKey);
        assertValidMessage(msg);
        if (_noble_curves_secp256k1_js.secp256k1.verify(sig, msg, publicKey, {
          prehash: false,
          format: "der"
        })) return null;
        throw new Error("Bad signature");
      };
      var derive = async function(privateKeyA, publicKeyB) {
        assertValidPrivateKey(privateKeyA);
        assertValidPublicKey(publicKeyB);
        const Px = _noble_curves_secp256k1_js.secp256k1.getSharedSecret(privateKeyA, publicKeyB).subarray(1);
        const i = Px.findIndex((byte) => byte !== 0);
        return Px.subarray(i);
      };
      var deriveUnpadded = derive;
      var derivePadded = async function(privateKeyA, publicKeyB) {
        assertValidPrivateKey(privateKeyA);
        assertValidPublicKey(publicKeyB);
        return _noble_curves_secp256k1_js.secp256k1.getSharedSecret(privateKeyA, publicKeyB).subarray(1);
      };
      var encrypt = async function(publicKeyTo, msg, opts) {
        opts = opts || {};
        const padding2 = opts.padding ?? true;
        let ephemPrivateKey = opts.ephemPrivateKey || randomBytes3(32);
        while (!isValidPrivateKey(ephemPrivateKey)) ephemPrivateKey = opts.ephemPrivateKey || randomBytes3(32);
        const ephemPublicKey = getPublic(ephemPrivateKey);
        const hash = await sha5122(await (padding2 ? derivePadded : deriveUnpadded)(ephemPrivateKey, publicKeyTo));
        const iv = opts.iv || randomBytes3(16);
        const encryptionKey = hash.slice(0, 32);
        const macKey = hash.slice(32);
        const ciphertext = await aesCbcEncrypt(iv, encryptionKey, msg);
        return {
          iv,
          ephemPublicKey,
          ciphertext,
          mac: await hmacSha256Sign(macKey, (0, _noble_curves_utils_js.concatBytes)(iv, ephemPublicKey, ciphertext))
        };
      };
      var decrypt = async function(privateKey, opts, _padding) {
        const padding2 = _padding ?? false;
        const hash = await sha5122(await (padding2 ? derivePadded : deriveUnpadded)(privateKey, opts.ephemPublicKey));
        const encryptionKey = hash.slice(0, 32);
        const macGood = await hmacSha256Verify(hash.slice(32), (0, _noble_curves_utils_js.concatBytes)(opts.iv, opts.ephemPublicKey, opts.ciphertext), opts.mac);
        if (!macGood && padding2 === false) return decrypt(privateKey, opts, true);
        else if (!macGood && padding2 === true) throw new Error("bad MAC after trying padded");
        return await aesCbcDecrypt(opts.iv, encryptionKey, opts.ciphertext);
      };
      exports.decrypt = decrypt;
      exports.derive = derive;
      exports.derivePadded = derivePadded;
      exports.deriveUnpadded = deriveUnpadded;
      exports.encrypt = encrypt;
      exports.generatePrivate = generatePrivate;
      exports.getPublic = getPublic;
      exports.getPublicCompressed = getPublicCompressed;
      exports.sign = sign;
      exports.verify = verify;
    }
  });

  // node_modules/@scure/base/index.js
  var base_exports = {};
  __export(base_exports, {
    __TESTS: () => __TESTS,
    ascii: () => ascii,
    base16: () => base16,
    base32: () => base32,
    base32crockford: () => base32crockford,
    base32hex: () => base32hex,
    base32hexnopad: () => base32hexnopad,
    base32nopad: () => base32nopad,
    base36: () => base36,
    base58: () => base58,
    base58check: () => base58check,
    base58flickr: () => base58flickr,
    base58xmr: () => base58xmr,
    base58xrp: () => base58xrp,
    base64: () => base64,
    base64nopad: () => base64nopad,
    base64url: () => base64url,
    base64urlnopad: () => base64urlnopad,
    bech32: () => bech32,
    bech32m: () => bech32m,
    createBase58check: () => createBase58check,
    hex: () => hex,
    utf8: () => utf8
  });
  function isBytes3(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
  }
  function abytes3(b) {
    if (!isBytes3(b))
      throw new TypeError("Uint8Array expected");
  }
  function isArrayOf(isString, arr) {
    if (!Array.isArray(arr))
      return false;
    if (arr.length === 0)
      return true;
    if (isString) {
      return arr.every((item) => typeof item === "string");
    } else {
      return arr.every((item) => Number.isSafeInteger(item));
    }
  }
  function afn(input) {
    if (typeof input !== "function")
      throw new TypeError("function expected");
    return true;
  }
  function astr(label, input) {
    if (typeof input !== "string")
      throw new TypeError(`${label}: string expected`);
    return true;
  }
  function anumber3(n, title = "number") {
    if (typeof n !== "number")
      throw new TypeError(`${title}: expected number, got ${typeof n}`);
    if (!Number.isSafeInteger(n))
      throw new RangeError(`${title}: expected safe integer, got ${n}`);
  }
  function anumArr(label, input) {
    if (!isArrayOf(false, input))
      throw new TypeError(`${label}: array of numbers expected`);
  }
  function chain(...args) {
    const id = (a) => a;
    const wrap = (a, b) => (c) => a(b(c));
    const encode = args.map((x) => x.encode).reduceRight(wrap, id);
    const decode = args.map((x) => x.decode).reduce(wrap, id);
    return { encode, decode };
  }
  function normalize(fn) {
    afn(fn);
    return { encode: (from) => from, decode: (to) => fn(to) };
  }
  function u8ToNumArr(u8, len = u8.length) {
    const res = new Array(len);
    for (let i = 0; i < len; i++)
      res[i] = u8[i];
    return res;
  }
  function charcodesToString(codes) {
    const len = codes.length;
    if (asciiDecoder !== void 0 && len >= 12)
      return asciiDecoder.decode(codes);
    if (len <= B2S_CHUNK)
      return String.fromCharCode.apply(null, codes);
    let res = "";
    for (let i = 0; i < len; i += B2S_CHUNK)
      res += String.fromCharCode.apply(null, codes.subarray(i, i + B2S_CHUNK));
    return res;
  }
  function radix2(bits) {
    anumber3(bits);
    if (bits <= 0 || bits > 8)
      throw new RangeError("radix2: bits should be in (0..8]");
    const mask = powers[bits] - 1;
    return {
      encode: (bytes) => {
        abytes3(bytes);
        const len = bytes.length;
        const res = new Uint8Array(Math.ceil(len * 8 / bits));
        let carry = 0;
        let pos = 0;
        let j = 0;
        for (let i = 0; i < len; ) {
          if (i + 2 < len) {
            carry = carry << 24 | bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
            pos += 24;
            i += 3;
          } else {
            carry = (carry << 8 | bytes[i]) & 65535;
            pos += 8;
            i++;
          }
          for (; ; ) {
            pos -= bits;
            res[j++] = carry >> pos & mask;
            if (pos < bits)
              break;
          }
        }
        if (pos > 0)
          res[j] = carry << bits - pos & mask;
        return res;
      },
      decode: (digits) => {
        const len = digits.length;
        const res = new Uint8Array(Math.floor(len * bits / 8));
        let carry = 0;
        let pos = 0;
        let j = 0;
        for (let i = 0; i < len; i++) {
          carry = (carry << bits | digits[i]) & 65535;
          pos += bits;
          for (; pos >= 8; pos -= 8)
            res[j++] = carry >> pos - 8 & 255;
        }
        carry = carry << 8 - pos & 255;
        if (pos >= bits)
          throw new Error("Excess padding");
        if (carry > 0)
          throw new Error(`Non-zero padding: ${carry}`);
        return res;
      }
    };
  }
  function alphabet(letters, aliases) {
    const len = letters.length;
    if (len > 128)
      throw new Error("alphabet: max 128 letters");
    const encTable = new Uint8Array(len);
    const decTable = new Int8Array(128).fill(-1);
    for (let i = 0; i < len; i++) {
      const code = letters.charCodeAt(i);
      if (letters.codePointAt(i) !== code || code > 127)
        throw new Error("alphabet: single-char ASCII letters only");
      encTable[i] = code;
      decTable[code] = i;
    }
    if (aliases !== void 0) {
      for (const alias of Object.keys(aliases)) {
        const code = alias.charCodeAt(0);
        const target = decTable[aliases[alias].charCodeAt(0)];
        if (alias.length !== 1 || code > 127 || target === void 0 || target === -1)
          throw new Error(`alphabet: invalid alias ${alias}`);
        decTable[code] = target;
      }
    }
    return {
      encode: (digits) => {
        const codes = new Uint8Array(digits.length);
        for (let i = 0; i < digits.length; i++) {
          const d = digits[i];
          const code = encTable[d];
          if (code === void 0)
            throw new Error(`alphabet.encode: invalid digit ${d}`);
          codes[i] = code;
        }
        return charcodesToString(codes);
      },
      decode: (input) => {
        astr("decode", input);
        const slen = input.length;
        const digits = new Uint8Array(slen);
        for (let i = 0; i < slen; i++) {
          const code = input.charCodeAt(i);
          const digit = code < 128 ? decTable[code] : -1;
          if (digit === -1)
            throw new Error(`Unknown letter "${input[i]}". Allowed: ${letters}`);
          digits[i] = digit;
        }
        return digits;
      }
    };
  }
  function padding(bits, chr = "=") {
    anumber3(bits);
    astr("padding", chr);
    return {
      encode(data) {
        while (data.length * bits % 8)
          data += chr;
        return data;
      },
      decode(input) {
        astr("decode", input);
        let end = input.length;
        if (end * bits % 8)
          throw new Error("padding: invalid length");
        for (; end > 0 && input[end - 1] === chr; end--) {
          const byte = (end - 1) * bits;
          if (byte % 8 === 0)
            throw new Error("padding: excess padding");
        }
        return input.slice(0, end);
      }
    };
  }
  function unsafeWrapper(fn) {
    afn(fn);
    return function(...args) {
      try {
        return fn.apply(null, args);
      } catch (e) {
      }
    };
  }
  function checksum(len, fn) {
    anumber3(len);
    if (len <= 0)
      throw new RangeError(`checksum length must be positive: ${len}`);
    afn(fn);
    const _fn = fn;
    return {
      encode(data) {
        abytes3(data);
        const sum = _fn(data).slice(0, len);
        const res = new Uint8Array(data.length + len);
        res.set(data);
        res.set(sum, data.length);
        return res;
      },
      decode(data) {
        abytes3(data);
        const payload = data.slice(0, -len);
        const oldChecksum = data.slice(-len);
        const newChecksum = _fn(payload).slice(0, len);
        for (let i = 0; i < len; i++)
          if (newChecksum[i] !== oldChecksum[i])
            throw new Error("Invalid checksum");
        return payload;
      }
    };
  }
  function assertBech32Printable(label, value) {
    for (let i = 0; i < value.length; i++) {
      const c = value.charCodeAt(i);
      if (c < 33 || c > 126)
        throw new Error(`${label}: printable ASCII expected`);
    }
  }
  function wordsToU8(words) {
    const len = words.length;
    const res = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      const w = words[i];
      if (w < 0 || w >= 32)
        throw new Error(`alphabet.encode: invalid digit ${w}`);
      res[i] = w;
    }
    return res;
  }
  function bech32Polymod(pre) {
    const b = pre >> 25;
    let chk = (pre & 33554431) << 5;
    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
      if ((b >> i & 1) === 1)
        chk ^= POLYMOD_GENERATORS[i];
    }
    return chk;
  }
  function bechChecksum(prefix, words, encodingConst = 1) {
    const len = prefix.length;
    let chk = 1;
    for (let i = 0; i < len; i++) {
      const c = prefix.charCodeAt(i);
      if (c < 33 || c > 126)
        throw new Error(`Invalid prefix (${prefix})`);
      chk = bech32Polymod(chk) ^ c >> 5;
    }
    chk = bech32Polymod(chk);
    for (let i = 0; i < len; i++)
      chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
    for (let v of words)
      chk = bech32Polymod(chk) ^ v;
    for (let i = 0; i < 6; i++)
      chk = bech32Polymod(chk);
    chk ^= encodingConst;
    const sum = new Uint8Array(6);
    for (let i = 0; i < 6; i++)
      sum[i] = chk >>> 5 * (5 - i) & 31;
    return BECH_ALPHABET.encode(sum);
  }
  function genBech32(encoding) {
    const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
    const _words = radix2(5);
    const toWords = (from) => {
      abytes3(from);
      const len = from.length;
      const res = new Array(Math.ceil(len * 8 / 5));
      let carry = 0;
      let pos = 0;
      let j = 0;
      for (let i = 0; i < len; i++) {
        carry = carry << 8 | from[i];
        pos += 8;
        for (; pos >= 5; pos -= 5)
          res[j++] = carry >> pos - 5 & 31;
      }
      if (pos > 0)
        res[j] = carry << 5 - pos & 31;
      return res;
    };
    const fromWords = (to) => {
      anumArr("radix2.decode", to);
      const len = to.length;
      const digits = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        const w = to[i];
        if (w < 0 || w >= 32)
          throw new Error(`convertRadix2: invalid word=${w}`);
        digits[i] = w;
      }
      return _words.decode(digits);
    };
    const fromWordsUnsafe = unsafeWrapper(fromWords);
    function encode(prefix, words, limit = 90) {
      astr("bech32.encode prefix", prefix);
      if (limit !== false)
        anumber3(limit, "limit");
      if (isBytes3(words))
        words = u8ToNumArr(words);
      anumArr("bech32.encode", words);
      const plen = prefix.length;
      if (plen === 0)
        throw new TypeError(`Invalid prefix length ${plen}`);
      const actualLength = plen + 7 + words.length;
      if (limit !== false && actualLength > limit)
        throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
      assertBech32Printable("bech32.encode prefix", prefix);
      const lowered = prefix.toLowerCase();
      const sum = bechChecksum(lowered, words, ENCODING_CONST);
      return `${lowered}1${BECH_ALPHABET.encode(wordsToU8(words))}${sum}`;
    }
    function decode(str, limit = 90) {
      astr("bech32.decode input", str);
      if (limit !== false)
        anumber3(limit, "limit");
      const slen = str.length;
      if (slen < 8 || limit !== false && slen > limit)
        throw new TypeError(`invalid string length ${slen}, expected (8..${limit})`);
      const lowered = str.toLowerCase();
      if (str !== lowered) {
        if (!BECH_UPPERCASE_PRINTABLE.test(str)) {
          assertBech32Printable("bech32.decode input", str);
          throw new Error(`mixed-case string not allowed`);
        }
      }
      const sepIndex = lowered.lastIndexOf("1");
      if (sepIndex === 0 || sepIndex === -1)
        throw new Error(`invalid separator "1"`);
      const prefix = lowered.slice(0, sepIndex);
      const data = lowered.slice(sepIndex + 1);
      if (data.length < 6)
        throw new Error("invalid data length");
      const digits = BECH_ALPHABET.decode(data);
      const words = u8ToNumArr(digits, digits.length - 6);
      const sum = bechChecksum(prefix, words, ENCODING_CONST);
      if (!data.endsWith(sum))
        throw new Error(`Invalid checksum in ${str}`);
      return { prefix, words };
    }
    const decodeUnsafe = unsafeWrapper(decode);
    function decodeToBytes(str, limit = 90) {
      const { prefix, words } = decode(str, limit);
      return {
        prefix,
        words,
        bytes: fromWords(words)
      };
    }
    function encodeFromBytes(prefix, bytes) {
      return encode(prefix, toWords(bytes));
    }
    return {
      encode,
      decode,
      encodeFromBytes,
      decodeToBytes,
      decodeUnsafe,
      fromWords,
      fromWordsUnsafe,
      toWords
    };
  }
  var freeze, powers, asciiDecoder, B2S_CHUNK, base16, base32, base32nopad, base32hex, base32hexnopad, BASE32_CROCKFORD_ASCII, base32crockford, hasBase64Builtin, ASCII_WHITESPACE, decodeBase64Builtin, base64Fallback, base64urlFallback, base64, base64nopad, base64url, base64urlnopad, B58_GROUP, B36_GROUP, RADIX_BASE_N_MAX_LENGTH, BASE_N_MAX_BYTES, BASE_N_MAX_CHARS, radixBaseN, genBaseN, radix58, base36, genBase58, base58, base58flickr, base58xrp, XMR_BLOCK_LEN, base58xmr, createBase58check, base58check, BECH_ALPHABET, BECH_UPPERCASE_PRINTABLE, POLYMOD_GENERATORS, bech32, bech32m, ascii, _isWellFormedShim, _isWellFormed, utf8err, utf8Fallback, utf8, hexFallback, __TESTS, hasHexBuiltin2, hexBuiltin, hex;
  var init_base = __esm({
    "node_modules/@scure/base/index.js"() {
      freeze = (fn) => Object.freeze(fn());
      powers = /* @__PURE__ */ (() => {
        let res = [];
        for (let i = 0; i < 40; i++)
          res.push(2 ** i);
        return res;
      })();
      asciiDecoder = /* @__PURE__ */ (() => {
        try {
          const decoder = new TextDecoder();
          return decoder.decode(Uint8Array.of(65, 48, 43, 127)) === "A0+\x7F" ? decoder : void 0;
        } catch (e) {
          return void 0;
        }
      })();
      B2S_CHUNK = 8192;
      base16 = /* @__PURE__ */ freeze(() => chain(radix2(4), alphabet("0123456789ABCDEF")));
      base32 = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5)));
      base32nopad = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567")));
      base32hex = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5)));
      base32hexnopad = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV")));
      BASE32_CROCKFORD_ASCII = /^[\x00-\x7f]*$/;
      base32crockford = /* @__PURE__ */ freeze(() => chain(radix2(5), alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), normalize((s) => {
        astr("base32crockford.decode", s);
        const upper = s.toUpperCase();
        if (s !== upper && !BASE32_CROCKFORD_ASCII.test(s))
          throw new Error("base32crockford.decode: ASCII expected");
        return upper.replace(/O/g, "0").replace(/[IL]/g, "1");
      })));
      hasBase64Builtin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toBase64 === "function" && typeof Uint8Array.fromBase64 === "function")();
      ASCII_WHITESPACE = /[\t\n\f\r ]/;
      decodeBase64Builtin = (s, isUrl) => {
        astr("base64", s);
        const alphabet2 = isUrl ? "base64url" : "base64";
        if (s.length > 0 && ASCII_WHITESPACE.test(s))
          throw new Error("invalid base64");
        return Uint8Array.fromBase64(s, { alphabet: alphabet2, lastChunkHandling: "strict" });
      };
      base64Fallback = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6)));
      base64urlFallback = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding(6)));
      base64 = /* @__PURE__ */ freeze(() => hasBase64Builtin ? {
        encode(b) {
          abytes3(b);
          return b.toBase64();
        },
        decode(s) {
          return decodeBase64Builtin(s, false);
        }
      } : base64Fallback);
      base64nopad = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")));
      base64url = /* @__PURE__ */ freeze(() => hasBase64Builtin ? {
        encode(b) {
          abytes3(b);
          return b.toBase64({ alphabet: "base64url" });
        },
        decode(s) {
          return decodeBase64Builtin(s, true);
        }
      } : base64urlFallback);
      base64urlnopad = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")));
      B58_GROUP = 656356768;
      B36_GROUP = 60466176;
      RADIX_BASE_N_MAX_LENGTH = 65536;
      BASE_N_MAX_BYTES = 2048;
      BASE_N_MAX_CHARS = 4096;
      radixBaseN = (BASE, GROUP) => ({
        encode: (bytes) => {
          abytes3(bytes);
          const blen = bytes.length;
          if (blen === 0)
            return new Uint8Array(0);
          if (blen >= RADIX_BASE_N_MAX_LENGTH)
            throw new Error("invalid length");
          let zeros = 0;
          while (zeros < blen - 1 && bytes[zeros] === 0)
            zeros++;
          const nlimbs = Math.ceil(blen / 2);
          const limbs = new Uint16Array(nlimbs);
          const odd = blen & 1;
          if (odd)
            limbs[0] = bytes[0];
          for (let i = odd, j2 = odd; i < blen; i += 2, j2++)
            limbs[j2] = bytes[i] << 8 | bytes[i + 1];
          const groups = [];
          let pos = 0;
          while (pos < nlimbs) {
            let carry = 0;
            for (let i = pos; i < nlimbs; i++) {
              const cur = carry * 65536 + limbs[i];
              const q = Math.floor(cur / GROUP);
              carry = cur - q * GROUP;
              limbs[i] = q;
              if (q === 0 && i === pos)
                pos++;
            }
            groups.push(carry);
          }
          const top = groups.length - 1;
          let sig = top * 5;
          for (let v = groups[top]; ; v = Math.floor(v / BASE)) {
            sig++;
            if (v < BASE)
              break;
          }
          const res = new Uint8Array(zeros + sig);
          let j = res.length - 1;
          for (let g = 0; g < top; g++) {
            let v = groups[g];
            for (let k = 0; k < 5; k++) {
              res[j--] = v % BASE;
              v = Math.floor(v / BASE);
            }
          }
          for (let v = groups[top]; j >= zeros; v = Math.floor(v / BASE))
            res[j--] = v % BASE;
          return res;
        },
        decode: (digits) => {
          abytes3(digits);
          const dlen = digits.length;
          if (dlen === 0)
            return new Uint8Array(0);
          if (dlen >= RADIX_BASE_N_MAX_LENGTH)
            throw new Error("invalid length");
          let zeros = 0;
          while (zeros < dlen - 1 && digits[zeros] === 0)
            zeros++;
          const limbs = new Uint16Array(Math.ceil(dlen * 6 / 16) + 1);
          let used = 0;
          let i = 0;
          let group = dlen % 5 || 5;
          while (i < dlen) {
            let gval = 0;
            let factor = 1;
            for (const end = i + group; i < end; i++) {
              const d = digits[i];
              if (d >= BASE)
                throw new Error(`invalid integer: ${d}`);
              gval = gval * BASE + d;
              factor *= BASE;
            }
            group = 5;
            let carry = gval;
            for (let k = 0; k < used; k++) {
              const cur = limbs[k] * factor + carry;
              carry = Math.floor(cur / 65536);
              limbs[k] = cur - carry * 65536;
            }
            for (; carry > 0; carry = Math.floor(carry / 65536))
              limbs[used++] = carry % 65536;
          }
          const valueBytes = used === 0 ? 1 : used * 2 - (limbs[used - 1] < 256 ? 1 : 0);
          const res = new Uint8Array(zeros + valueBytes);
          let j = res.length - 1;
          for (let k = 0; k < used; k++) {
            const limb = limbs[k];
            res[j--] = limb & 255;
            if (j >= zeros)
              res[j--] = limb >> 8;
          }
          return res;
        }
      });
      genBaseN = (radix, abc) => {
        const letters = alphabet(abc);
        return {
          encode(bytes) {
            abytes3(bytes);
            if (bytes.length > BASE_N_MAX_BYTES)
              throw new Error("invalid length");
            return letters.encode(radix.encode(bytes));
          },
          decode(str) {
            astr("baseN.decode", str);
            if (str.length > BASE_N_MAX_CHARS)
              throw new Error("invalid length");
            return radix.decode(letters.decode(str));
          }
        };
      };
      radix58 = /* @__PURE__ */ radixBaseN(58, B58_GROUP);
      base36 = /* @__PURE__ */ freeze(() => genBaseN(radixBaseN(36, B36_GROUP), "0123456789abcdefghijklmnopqrstuvwxyz"));
      genBase58 = (abc) => genBaseN(radix58, abc);
      base58 = /* @__PURE__ */ freeze(() => genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
      base58flickr = /* @__PURE__ */ freeze(() => genBase58("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"));
      base58xrp = /* @__PURE__ */ freeze(() => genBase58("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"));
      XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
      base58xmr = /* @__PURE__ */ freeze(() => ({
        encode(data) {
          abytes3(data);
          let res = "";
          for (let i = 0; i < data.length; i += 8) {
            const block = data.subarray(i, i + 8);
            res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], "1");
          }
          return res;
        },
        decode(str) {
          astr("base58xmr.decode", str);
          const strLen = str.length;
          const tailChars = strLen % 11;
          const tailBytes = tailChars === 0 ? 0 : XMR_BLOCK_LEN.indexOf(tailChars);
          if (tailBytes === -1)
            throw new Error(`base58xmr: invalid block length ${tailChars}`);
          const res = new Uint8Array(Math.floor(strLen / 11) * 8 + tailBytes);
          let w = 0;
          for (let i = 0; i < strLen; i += 11) {
            const slice = str.slice(i, i + 11);
            const blockLen = slice.length === 11 ? 8 : tailBytes;
            const block = base58.decode(slice);
            for (let j = 0; j < block.length - blockLen; j++) {
              if (block[j] !== 0)
                throw new Error("base58xmr: wrong padding");
            }
            for (let j = block.length - blockLen; j < block.length; j++)
              res[w++] = block[j];
          }
          return res;
        }
      }));
      createBase58check = (sha2562) => {
        afn(sha2562);
        const _sha256 = sha2562;
        return chain(checksum(4, (data) => _sha256(_sha256(data))), base58);
      };
      base58check = createBase58check;
      BECH_ALPHABET = /* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l");
      BECH_UPPERCASE_PRINTABLE = /^[\x21-\x60\x7b-\x7e]+$/;
      POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
      bech32 = /* @__PURE__ */ freeze(() => genBech32("bech32"));
      bech32m = /* @__PURE__ */ freeze(() => genBech32("bech32m"));
      ascii = /* @__PURE__ */ freeze(() => ({
        encode(data) {
          abytes3(data);
          for (let i = 0; i < data.length; i++) {
            const byte = data[i];
            if (byte > 127)
              throw new RangeError(`non-ASCII byte ${byte} at ${i}`);
          }
          return charcodesToString(data);
        },
        decode(str) {
          if (typeof str !== "string")
            throw new TypeError("ascii string expected, got " + typeof str);
          const res = new Uint8Array(str.length);
          for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode > 127)
              throw new RangeError(`non-ASCII char "${str[i]}" (${charCode}) at ${i}`);
            res[i] = charCode;
          }
          return res;
        }
      }));
      _isWellFormedShim = (str) => {
        try {
          return encodeURI(str) !== null;
        } catch {
          return false;
        }
      };
      _isWellFormed = /* @__PURE__ */ (() => (
        // Pick the native check once so utf8.decode doesn't re-probe String.prototype on every call.
        typeof "".isWellFormed === "function" ? (str) => str.isWellFormed() : _isWellFormedShim
      ))();
      utf8err = (i) => new TypeError(`invalid utf8 at byte ${i}`);
      utf8Fallback = /* @__PURE__ */ freeze(() => ({
        encode(data) {
          abytes3(data);
          let res = "";
          for (let i = 0; i < data.length; ) {
            const a = data[i++];
            if (a < 128) {
              res += String.fromCharCode(a);
              continue;
            }
            if (a < 194 || i >= data.length)
              throw utf8err(i - 1);
            const b = data[i++];
            if ((b & 192) !== 128)
              throw utf8err(i - 1);
            let cp = (a & 31) << 6 | b & 63;
            if (a >= 224) {
              if (i >= data.length)
                throw utf8err(i - 1);
              const c = data[i++];
              if ((c & 192) !== 128 || a === 224 && b < 160 || a === 237 && b >= 160)
                throw utf8err(i - 1);
              cp = (a & 15) << 12 | (b & 63) << 6 | c & 63;
              if (a >= 240) {
                if (i >= data.length)
                  throw utf8err(i - 1);
                const d = data[i++];
                if (a > 244 || (d & 192) !== 128 || a === 240 && b < 144 || a === 244 && b >= 144)
                  throw utf8err(i - 1);
                cp = (a & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63;
              }
            }
            if (cp < 65536)
              res += String.fromCharCode(cp);
            else {
              cp -= 65536;
              res += String.fromCharCode((cp >> 10) + 55296, (cp & 1023) + 56320);
            }
          }
          return res;
        },
        decode(str) {
          astr("utf8", str);
          if (!_isWellFormed(str))
            throw new TypeError("utf8 expected well-formed string");
          const res = new Uint8Array(str.length * 3);
          let pos = 0;
          for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c < 128) {
              res[pos++] = c;
              continue;
            }
            if (c >= 55296 && c <= 57343) {
              const d = str.charCodeAt(++i);
              c = 65536 + (c - 55296 << 10) + d - 56320;
            }
            if (c >= 65536) {
              res[pos++] = c >> 18 | 240;
              res[pos++] = c >> 12 & 63 | 128;
            } else if (c >= 2048)
              res[pos++] = c >> 12 | 224;
            else
              res[pos++] = c >> 6 | 192;
            if (c >= 2048)
              res[pos++] = c >> 6 & 63 | 128;
            res[pos++] = c & 63 | 128;
          }
          return res.subarray(0, pos);
        }
      }));
      utf8 = /* @__PURE__ */ freeze(() => {
        let _utf8Encoder;
        let _utf8Decoder;
        const utf8Builtin = {
          // ignoreBOM preserves an explicit leading U+FEFF;
          // fatal rejects invalid UTF-8 bytes instead of replacing them.
          encode(data) {
            abytes3(data);
            return (_utf8Decoder || (_utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }))).decode(data);
          },
          decode(str) {
            astr("utf8", str);
            if (!_isWellFormed(str))
              throw new TypeError("utf8 expected well-formed string");
            return (_utf8Encoder || (_utf8Encoder = new TextEncoder())).encode(str);
          }
        };
        return {
          // Select each direction once at module init, since
          // TextEncoder and TextDecoder can exist independently.
          encode: typeof TextDecoder === "function" ? utf8Builtin.encode : utf8Fallback.encode,
          decode: typeof TextEncoder === "function" ? utf8Builtin.decode : utf8Fallback.decode
        };
      });
      hexFallback = /* @__PURE__ */ freeze(() => chain(
        radix2(4),
        // Case-insensitive decode via table aliases instead of a toLowerCase pass.
        alphabet("0123456789abcdef", { A: "a", B: "b", C: "c", D: "d", E: "e", F: "f" }),
        normalize((s) => {
          astr("hex", s);
          if (s.length % 2 !== 0)
            throw new TypeError(`hex.decode: odd-length string (${s.length})`);
          return s;
        })
      ));
      __TESTS = /* @__PURE__ */ freeze(() => ({
        alphabet,
        base64Fallback,
        base64urlFallback,
        hexFallback,
        radix2,
        radix58,
        checksum,
        utf8Fallback,
        _isWellFormedShim
      }));
      hasHexBuiltin2 = /* @__PURE__ */ (() => (
        // Require both directions before enabling the native hex path so encode/decode stay symmetric.
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      hexBuiltin = {
        // Keep local type guards so the native path preserves library-level input errors.
        // Native toHex emits lowercase hex, matching the fallback alphabet and Node's hex strings.
        encode(data) {
          abytes3(data);
          return data.toHex();
        },
        // Native fromHex accepts either hex case and rejects odd-length / non-hex syntax.
        decode(s) {
          astr("hex", s);
          return Uint8Array.fromHex(s);
        }
      };
      hex = /* @__PURE__ */ freeze(() => hasHexBuiltin2 ? hexBuiltin : hexFallback);
    }
  });

  // node_modules/@noble/hashes/sha3.js
  var sha3_exports = {};
  __export(sha3_exports, {
    Keccak: () => Keccak,
    keccakP: () => keccakP,
    keccak_224: () => keccak_224,
    keccak_256: () => keccak_256,
    keccak_384: () => keccak_384,
    keccak_512: () => keccak_512,
    sha3_224: () => sha3_224,
    sha3_256: () => sha3_256,
    sha3_384: () => sha3_384,
    sha3_512: () => sha3_512,
    shake128: () => shake128,
    shake128_32: () => shake128_32,
    shake256: () => shake256,
    shake256_64: () => shake256_64
  });
  function keccakP(s, rounds = 24) {
    if (!(s instanceof Uint32Array))
      throw new TypeError('"s" expected Uint32Array(50), got type=' + typeof s);
    if (s.length !== 50)
      throw new RangeError('"s" expected Uint32Array(50), got length=' + s.length);
    anumber(rounds, "rounds");
    if (rounds < 1 || rounds > 24)
      throw new Error('"rounds" expected integer 1..24');
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL[t];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        const b0 = s[y], b1 = s[y + 1], b2 = s[y + 2], b3 = s[y + 3];
        s[y] ^= ~s[y + 2] & s[y + 4];
        s[y + 1] ^= ~s[y + 3] & s[y + 5];
        s[y + 2] ^= ~s[y + 4] & s[y + 6];
        s[y + 3] ^= ~s[y + 5] & s[y + 7];
        s[y + 4] ^= ~s[y + 6] & s[y + 8];
        s[y + 5] ^= ~s[y + 7] & s[y + 9];
        s[y + 6] ^= ~s[y + 8] & b0;
        s[y + 7] ^= ~s[y + 9] & b1;
        s[y + 8] ^= ~b0 & b2;
        s[y + 9] ^= ~b1 & b3;
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    clean(B);
  }
  var _0n8, _1n6, _2n5, _7n2, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlSH, rotlSL, rotlBH, rotlBL, rotlH, rotlL, B, Keccak, genKeccak, sha3_224, sha3_256, sha3_384, sha3_512, keccak_224, keccak_256, keccak_384, keccak_512, genShake, shake128, shake256, shake128_32, shake256_64;
  var init_sha3 = __esm({
    "node_modules/@noble/hashes/sha3.js"() {
      init_u64();
      init_utils();
      _0n8 = BigInt(0);
      _1n6 = BigInt(1);
      _2n5 = BigInt(2);
      _7n2 = BigInt(7);
      _256n = BigInt(256);
      _0x71n = BigInt(113);
      SHA3_PI = [];
      SHA3_ROTL = [];
      _SHA3_IOTA = [];
      for (let round = 0, R = _1n6, x = 1, y = 0; round < 24; round++) {
        [x, y] = [y, (2 * x + 3 * y) % 5];
        SHA3_PI.push(2 * (5 * y + x));
        SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
        let t = _0n8;
        for (let j = 0; j < 7; j++) {
          R = (R << _1n6 ^ (R >> _7n2) * _0x71n) % _256n;
          if (R & _2n5)
            t ^= _1n6 << (_1n6 << BigInt(j)) - _1n6;
        }
        _SHA3_IOTA.push(t);
      }
      IOTAS = split(_SHA3_IOTA, true);
      SHA3_IOTA_H = IOTAS[0];
      SHA3_IOTA_L = IOTAS[1];
      rotlSH = (h, l, s) => h << s | l >>> 32 - s;
      rotlSL = (h, l, s) => l << s | h >>> 32 - s;
      rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
      rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
      rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
      rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
      B = new Uint32Array(5 * 2);
      Keccak = class _Keccak {
        state;
        pos = 0;
        posOut = 0;
        finished = false;
        state32;
        destroyed = false;
        blockLen;
        suffix;
        outputLen;
        canXOF;
        enableXOF = false;
        rounds;
        // NOTE: we accept arguments in bytes instead of bits here.
        constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
          anumber(blockLen, "blockLen");
          anumber(suffix, "suffix");
          anumber(rounds, "rounds");
          abool(enableXOF, "enableXOF");
          this.blockLen = blockLen;
          this.suffix = suffix;
          this.outputLen = outputLen;
          this.enableXOF = enableXOF;
          this.canXOF = enableXOF;
          this.rounds = rounds;
          anumber(outputLen, "outputLen");
          if (!(0 < blockLen && blockLen < 200))
            throw new Error('"blockLen" must be 1..199');
          this.state = new Uint8Array(200);
          this.state32 = u32(this.state);
        }
        clone() {
          return this._cloneInto();
        }
        keccak() {
          swap32IfBE(this.state32);
          keccakP(this.state32, this.rounds);
          swap32IfBE(this.state32);
          this.posOut = 0;
          this.pos = 0;
        }
        update(data) {
          aexists(this);
          abytes(data);
          const { blockLen, state, state32 } = this;
          const len = data.length;
          const canUseU32 = blockLen % 4 === 0 && data.byteOffset % 4 === 0;
          const blockLen32 = blockLen / 4;
          const data32 = canUseU32 && len >= blockLen ? u32(data) : void 0;
          for (let pos = 0; pos < len; ) {
            if (data32 !== void 0 && this.pos === 0 && pos % 4 === 0 && len - pos >= blockLen) {
              for (let i = 0, o = pos / 4; i < blockLen32; i++)
                state32[i] ^= data32[o + i];
              pos += blockLen;
              this.pos = blockLen;
              this.keccak();
              continue;
            }
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
              state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
              this.keccak();
          }
          return this;
        }
        finish() {
          if (this.finished)
            return;
          this.finished = true;
          const { state, suffix, pos, blockLen } = this;
          state[pos] ^= suffix;
          if ((suffix & 128) !== 0 && pos === blockLen - 1)
            this.keccak();
          state[blockLen - 1] ^= 128;
          this.keccak();
        }
        writeInto(out) {
          aexists(this, false);
          abytes(out);
          this.finish();
          const bufferOut = this.state;
          const { blockLen } = this;
          for (let pos = 0, len = out.length; pos < len; ) {
            if (this.posOut >= blockLen)
              this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
          }
          return out;
        }
        xofInto(out) {
          if (!this.enableXOF)
            throw new Error("XOF is not enabled");
          return this.writeInto(out);
        }
        xof(bytes) {
          anumber(bytes);
          return this.xofInto(new Uint8Array(bytes));
        }
        digestInto(out) {
          aoutput(out, this);
          if (this.finished)
            throw new Error("digest() was already called");
          this.writeInto(out.length === this.outputLen ? out : out.subarray(0, this.outputLen));
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.outputLen);
          this.digestInto(out);
          return out;
        }
        destroy() {
          this.destroyed = true;
          clean(this.state);
        }
        _cloneInto(to) {
          const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
          to ||= new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds);
          to.blockLen = blockLen;
          to.state32.set(this.state32);
          to.pos = this.pos;
          to.posOut = this.posOut;
          to.finished = this.finished;
          to.rounds = rounds;
          to.suffix = suffix;
          to.outputLen = outputLen;
          to.enableXOF = enableXOF;
          to.canXOF = this.canXOF;
          to.destroyed = this.destroyed;
          return to;
        }
      };
      genKeccak = (suffix, blockLen, outputLen, info = {}) => createHasher(() => new Keccak(blockLen, suffix, outputLen), info);
      sha3_224 = /* @__PURE__ */ genKeccak(
        6,
        144,
        28,
        /* @__PURE__ */ oidNist(7)
      );
      sha3_256 = /* @__PURE__ */ genKeccak(
        6,
        136,
        32,
        /* @__PURE__ */ oidNist(8)
      );
      sha3_384 = /* @__PURE__ */ genKeccak(
        6,
        104,
        48,
        /* @__PURE__ */ oidNist(9)
      );
      sha3_512 = /* @__PURE__ */ genKeccak(
        6,
        72,
        64,
        /* @__PURE__ */ oidNist(10)
      );
      keccak_224 = /* @__PURE__ */ genKeccak(1, 144, 28);
      keccak_256 = /* @__PURE__ */ genKeccak(1, 136, 32);
      keccak_384 = /* @__PURE__ */ genKeccak(1, 104, 48);
      keccak_512 = /* @__PURE__ */ genKeccak(1, 72, 64);
      genShake = (suffix, blockLen, outputLen, info = {}) => createHasher((opts = {}) => {
        opts = checkOpts({}, opts);
        return new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true);
      }, info);
      shake128 = /* @__PURE__ */ genShake(31, 168, 16, /* @__PURE__ */ oidNist(11));
      shake256 = /* @__PURE__ */ genShake(31, 136, 32, /* @__PURE__ */ oidNist(12));
      shake128_32 = /* @__PURE__ */ genShake(31, 168, 32, /* @__PURE__ */ oidNist(11));
      shake256_64 = /* @__PURE__ */ genShake(31, 136, 64, /* @__PURE__ */ oidNist(12));
    }
  });

  // node_modules/@noble/curves/abstract/edwards.js
  function isEdValidXY(Fp2, CURVE, x, y) {
    const x2 = Fp2.sqr(x);
    const y2 = Fp2.sqr(y);
    const left = Fp2.add(Fp2.mul(CURVE.a, x2), y2);
    const right = Fp2.add(Fp2.ONE, Fp2.mul(CURVE.d, Fp2.mul(x2, y2)));
    return Fp2.eql(left, right);
  }
  function edwards(params, extraOpts = {}) {
    validateObject(extraOpts, {}, {}, "extraOpts");
    const opts = extraOpts;
    const validated = createCurveFields("edwards", params, opts, opts.FpFnLE);
    const { Fp: Fp2, Fn: Fn2 } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor } = CURVE;
    if (FpLegendre(Fp2, CURVE.a) !== 1)
      throw new Error("edwards: CURVE.a must be a square in Fp for complete addition formulas");
    if (FpLegendre(Fp2, CURVE.d) !== -1)
      throw new Error("edwards: CURVE.d must be a non-square in Fp for complete addition formulas");
    validateObject(opts, {}, { uvRatio: "function", randomBytes: "function" });
    const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
    const MASK = _2n6 << BigInt(Fp2.BYTES * 8) - _1n7;
    function isOdd(n) {
      if (!Fp2.isOdd)
        throw new Error("Field does not have .isOdd()");
      return Fp2.isOdd(n);
    }
    const uvRatio2 = opts.uvRatio === void 0 ? (u, v) => {
      try {
        return { isValid: true, value: Fp2.sqrt(Fp2.div(u, v)) };
      } catch (e) {
        return { isValid: false, value: _0n9 };
      }
    } : opts.uvRatio;
    if (!isEdValidXY(Fp2, CURVE, CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const mulA = Fp2.eql(CURVE.a, Fp2.neg(Fp2.ONE)) ? (x) => Fp2.neg(x) : Fp2.eql(CURVE.a, Fp2.ONE) ? (x) => x : (x) => Fp2.mul(CURVE.a, x);
    function acoord(title, n, banZero = false) {
      const min = banZero ? _1n7 : _0n9;
      aInRange("coordinate " + title, n, min, MASK);
      return n;
    }
    function aedpoint(other) {
      if (!(other instanceof Point))
        throw new Error("EdwardsPoint expected");
    }
    class Point {
      static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp2.ONE, Fp2.mul(CURVE.Gx, CURVE.Gy));
      static ZERO = new Point(Fp2.ZERO, Fp2.ONE, Fp2.ONE, Fp2.ZERO);
      static Fp = Fp2;
      static Fn = Fn2;
      X;
      Y;
      Z;
      T;
      constructor(X, Y, Z, T) {
        this.X = acoord("x", X);
        this.Y = acoord("y", Y);
        this.Z = acoord("z", Z, true);
        this.T = acoord("t", T);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      /**
       * Create one extended Edwards point from affine coordinates.
       * Does NOT validate that the point is on-curve or torsion-free.
       * Use `.assertValidity()` on adversarial inputs.
       */
      static fromAffine(p) {
        if (p instanceof Point)
          throw new Error("extended point not allowed");
        const { x, y } = p || {};
        acoord("x", x);
        acoord("y", y);
        return new Point(x, y, Fp2.ONE, Fp2.mul(x, y));
      }
      // Uses algo from RFC8032 5.1.3.
      static fromBytes(bytes, zip215 = false) {
        const len = Fp2.BYTES;
        const { a, d } = CURVE;
        bytes = copyBytes(abytes2(bytes, len, "point"));
        abool2(zip215, "zip215");
        const normed = copyBytes(bytes);
        const lastByte = bytes[len - 1];
        normed[len - 1] = lastByte & ~128;
        const y = bytesToNumberLE(normed);
        const max = zip215 ? MASK : Fp2.ORDER;
        aInRange("point.y", y, _0n9, max);
        const y2 = Fp2.sqr(y);
        const u = Fp2.sub(y2, Fp2.ONE);
        const v = Fp2.sub(Fp2.mulN(d, y2), a);
        let { isValid, value: x } = uvRatio2(u, v);
        if (!isValid)
          throw new Error("bad point: invalid y coordinate");
        const isXOdd = isOdd(x);
        const isLastByteOdd = (lastByte & 128) !== 0;
        if (!zip215 && Fp2.is0(x) && isLastByteOdd)
          throw new Error("bad point: x=0 and x_0=1");
        if (isLastByteOdd !== isXOdd)
          x = Fp2.neg(x);
        return Point.fromAffine({ x, y });
      }
      static fromHex(hex2, zip215 = false) {
        return Point.fromBytes(hexToBytes2(hex2), zip215);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      precompute(windowSize = 6, isLazy = true) {
        wnaf.setWindowSize(this, windowSize);
        if (!isLazy)
          this.multiply(_2n6);
        return this;
      }
      // Useful in fromAffine() - not for fromBytes(), which always created valid points.
      assertValidity() {
        const p = this;
        const { a, d } = CURVE;
        if (p.is0())
          throw new Error("bad point: ZERO");
        const { X, Y, Z, T } = p;
        const X2 = Fp2.sqr(X);
        const Y2 = Fp2.sqr(Y);
        const Z2 = Fp2.sqr(Z);
        const Z4 = Fp2.sqr(Z2);
        const aX2 = Fp2.mul(X2, a);
        const left = Fp2.mul(Fp2.add(aX2, Y2), Z2);
        const right = Fp2.add(Z4, Fp2.mul(d, Fp2.mul(X2, Y2)));
        if (!Fp2.eql(left, right))
          throw new Error("bad point: equation left != right (1)");
        const XY = Fp2.mul(X, Y);
        const ZT = Fp2.mul(Z, T);
        if (!Fp2.eql(XY, ZT))
          throw new Error("bad point: equation left != right (2)");
      }
      // Compare one point to another.
      equals(other) {
        aedpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const X1Z2 = Fp2.mul(X1, Z2);
        const X2Z1 = Fp2.mul(X2, Z1);
        const Y1Z2 = Fp2.mul(Y1, Z2);
        const Y2Z1 = Fp2.mul(Y2, Z1);
        return Fp2.eql(X1Z2, X2Z1) && Fp2.eql(Y1Z2, Y2Z1);
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      negate() {
        return new Point(Fp2.neg(this.X), this.Y, this.Z, Fp2.neg(this.T));
      }
      // Fast algo for doubling Extended Point.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
      // Cost: 4M + 4S + 1*a + 6add + 1*2.
      double() {
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const A = Fp2.sqr(X1);
        const B2 = Fp2.sqr(Y1);
        const C = Fp2.mul(Fp2.sqr(Z1), _2n6);
        const D = mulA(A);
        const x1y1 = Fp2.addN(X1, Y1);
        const E = Fp2.sub(Fp2.subN(Fp2.sqr(x1y1), A), B2);
        const G = Fp2.addN(D, B2);
        const F = Fp2.subN(G, C);
        const H = Fp2.subN(D, B2);
        const X3 = Fp2.mul(E, F);
        const Y3 = Fp2.mul(G, H);
        const T3 = Fp2.mul(E, H);
        const Z3 = Fp2.mul(F, G);
        return new Point(X3, Y3, Z3, T3);
      }
      // Fast algo for adding 2 Extended Points.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
      // Cost: 9M + 1*a + 1*d + 7add.
      add(other) {
        aedpoint(other);
        const { d } = CURVE;
        const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
        const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
        const A = Fp2.mul(X1, X2);
        const B2 = Fp2.mul(Y1, Y2);
        const C = Fp2.mul(Fp2.mulN(T1, d), T2);
        const D = Fp2.mul(Z1, Z2);
        const E = Fp2.sub(Fp2.subN(Fp2.mulN(Fp2.addN(X1, Y1), Fp2.addN(X2, Y2)), A), B2);
        const F = Fp2.subN(D, C);
        const G = Fp2.addN(D, C);
        const H = Fp2.sub(B2, mulA(A));
        const X3 = Fp2.mul(E, F);
        const Y3 = Fp2.mul(G, H);
        const T3 = Fp2.mul(E, H);
        const Z3 = Fp2.mul(F, G);
        return new Point(X3, Y3, Z3, T3);
      }
      subtract(other) {
        aedpoint(other);
        return this.add(other.negate());
      }
      // Constant-time multiplication.
      multiply(scalar) {
        if (!Fn2.isValidNot0(scalar))
          throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
        const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize2);
        return normalize2([p, f])[0];
      }
      // Non-constant-time multiplication. Uses double-and-add algorithm.
      // It's faster, but should only be used when you don't care about
      // an exposed private key e.g. sig verification.
      // Keeps the same subgroup-scalar contract: 0 is allowed for public-scalar callers, but
      // n and larger values are rejected instead of being reduced mod n to the identity point.
      multiplyUnsafe(scalar) {
        if (!Fn2.isValid(scalar))
          throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
        if (scalar === _0n9)
          return Point.ZERO;
        if (this.is0() || scalar === _1n7)
          return this;
        return wnaf.mulUnsafe(this, scalar, normalize2);
      }
      // Checks if point is of small order.
      // If you add something to small order point, you will have "dirty"
      // point with torsion component.
      // Clears cofactor and checks if the result is 0.
      isSmallOrder() {
        return this.clearCofactor().is0();
      }
      // Multiplies point by curve order and checks if the result is 0.
      // Returns `false` is the point is dirty.
      isTorsionFree() {
        return wnaf.mulUnsafe(this, CURVE.n).is0();
      }
      // Converts Extended point to default (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      toAffine(invertedZ) {
        const p = this;
        let iz = invertedZ;
        if (iz != null && typeof iz !== "bigint")
          throw new TypeError('"invertedZ" expected bigint, got type=' + typeof iz);
        const { X, Y, Z } = p;
        const is0 = p.is0();
        if (iz == null)
          iz = is0 ? Fp2.create(_8n2) : Fp2.inv(Z);
        const x = Fp2.mul(X, iz);
        const y = Fp2.mul(Y, iz);
        const zz = Fp2.mul(Z, iz);
        if (is0)
          return { x: Fp2.ZERO, y: Fp2.ONE };
        if (!Fp2.eql(zz, Fp2.ONE))
          throw new Error("invZ was invalid");
        return { x, y };
      }
      clearCofactor() {
        if (cofactor === _1n7)
          return this;
        if (cofactor === _2n6)
          return this.double();
        if (cofactor === _4n5)
          return this.double().double();
        if (cofactor === _8n2)
          return this.double().double().double();
        return this.multiplyUnsafe(cofactor);
      }
      toBytes() {
        const { x, y } = this.toAffine();
        const bytes = Fp2.toBytes(y);
        bytes[bytes.length - 1] |= isOdd(x) ? 128 : 0;
        return bytes;
      }
      toHex() {
        return bytesToHex2(this.toBytes());
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    }
    const normalize2 = (points) => normalizeZ(Point, points);
    const wnaf = new ScalarMultiplier(Point, randomBytes3);
    if (wnaf.bits >= 6)
      Point.BASE.precompute(6);
    Object.freeze(Point.prototype);
    Object.freeze(Point);
    return Point;
  }
  function eddsa(Point, cHash, eddsaOpts = {}) {
    validatePointCons(Point);
    if (typeof cHash !== "function")
      throw new Error('"hash" function param is required');
    const hash = cHash;
    const opts = eddsaOpts;
    validateObject(opts, {}, {
      adjustScalarBytes: "function",
      randomBytes: "function",
      domain: "function",
      prehash: "function",
      zip215: "boolean",
      mapToCurve: "function",
      toMontgomery: "function",
      toMontgomerySecret: "function"
    });
    const { prehash } = opts;
    const { BASE, Fp: Fp2, Fn: Fn2 } = Point;
    const outputLen = hash.outputLen;
    const expectedLen = 2 * Fp2.BYTES;
    if (outputLen !== void 0) {
      asafenumber(outputLen, "hash.outputLen");
      if (outputLen !== expectedLen)
        throw new Error(`hash.outputLen must be ${expectedLen}, got ${outputLen}`);
    }
    const randomBytes3 = opts.randomBytes === void 0 ? randomBytes2 : opts.randomBytes;
    const toMontgomery2 = opts.toMontgomery;
    const toMontgomerySecret2 = opts.toMontgomerySecret;
    const adjustScalarBytes2 = opts.adjustScalarBytes === void 0 ? (bytes) => bytes : opts.adjustScalarBytes;
    const domain = opts.domain === void 0 ? (data, ctx, phflag) => {
      abool2(phflag, "phflag");
      if (ctx.length || phflag)
        throw new Error("Contexts/pre-hash are not supported");
      return data;
    } : opts.domain;
    function modN_LE(hash2) {
      return Fn2.create(bytesToNumberLE(hash2));
    }
    function getPrivateScalar(key) {
      const len = lengths.secretKey;
      abytes2(key, lengths.secretKey, "secretKey");
      const hashed = abytes2(hash(key), 2 * len, "hashedSecretKey");
      const head = adjustScalarBytes2(hashed.slice(0, len));
      const prefix = hashed.slice(len, 2 * len);
      const scalar = modN_LE(head);
      return { head, prefix, scalar };
    }
    function getExtendedPublicKey(secretKey) {
      const { head, prefix, scalar } = getPrivateScalar(secretKey);
      const point = BASE.multiply(scalar);
      const pointBytes = point.toBytes();
      return { head, prefix, scalar, point, pointBytes };
    }
    function getPublicKey(secretKey) {
      return getExtendedPublicKey(secretKey).pointBytes;
    }
    function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
      const msg = concatBytes2(...msgs);
      return modN_LE(hash(domain(msg, abytes2(context, void 0, "context"), !!prehash)));
    }
    function sign(msg, secretKey, options = {}) {
      validateObject(options, {}, {}, "options");
      msg = copyBytes(abytes2(msg, void 0, "message"));
      if (prehash)
        msg = prehash(msg);
      const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
      const r = hashDomainToScalar(options.context, prefix, msg);
      const R = BASE.multiply(r).toBytes();
      const k = hashDomainToScalar(options.context, R, pointBytes, msg);
      const s = Fn2.create(r + k * scalar);
      if (!Fn2.isValid(s))
        throw new Error("sign failed: invalid s");
      const rs = concatBytes2(R, Fn2.toBytes(s));
      return abytes2(rs, lengths.signature, "result");
    }
    const verifyOpts = {
      zip215: opts.zip215
    };
    function verify(sig, msg, publicKey, options = verifyOpts) {
      validateObject(options);
      const { context } = options;
      const zip215 = options.zip215 === void 0 ? !!verifyOpts.zip215 : options.zip215;
      const len = lengths.signature;
      sig = abytes2(sig, len, "signature");
      msg = abytes2(msg, void 0, "message");
      publicKey = abytes2(publicKey, lengths.publicKey, "publicKey");
      if (zip215 !== void 0)
        abool2(zip215, "zip215");
      if (prehash)
        msg = prehash(msg);
      const mid = len / 2;
      const r = sig.subarray(0, mid);
      const s = bytesToNumberLE(sig.subarray(mid, len));
      let A, R, SB;
      try {
        A = Point.fromBytes(publicKey, zip215);
        R = Point.fromBytes(r, zip215);
        SB = BASE.multiplyUnsafe(s);
      } catch (error) {
        return false;
      }
      if (!zip215 && A.isSmallOrder())
        return false;
      const k = hashDomainToScalar(context, r, publicKey, msg);
      const RkA = R.add(A.multiplyUnsafe(k));
      return RkA.subtract(SB).clearCofactor().is0();
    }
    const _size = Fp2.BYTES;
    const lengths = {
      secretKey: _size,
      publicKey: _size,
      signature: 2 * _size,
      seed: _size
    };
    function randomSecretKey(seed) {
      seed = seed === void 0 ? randomBytes3(lengths.seed) : seed;
      return abytes2(seed, lengths.seed, "seed");
    }
    function isValidSecretKey(key) {
      return isBytes2(key) && key.length === lengths.secretKey;
    }
    function isValidPublicKey(key, zip215) {
      try {
        return !!Point.fromBytes(key, zip215 === void 0 ? verifyOpts.zip215 : zip215);
      } catch (error) {
        return false;
      }
    }
    const utils = {
      getExtendedPublicKey,
      randomSecretKey,
      isValidSecretKey,
      isValidPublicKey,
      /** Converts an Edwards public key to a companion Montgomery public key. */
      toMontgomery(publicKey) {
        if (toMontgomery2 === void 0)
          throw new Error("Montgomery conversion is not supported for this curve");
        return toMontgomery2(Point.fromBytes(publicKey));
      },
      toMontgomerySecret(secretKey) {
        if (toMontgomerySecret2 === void 0)
          throw new Error("Montgomery conversion is not supported for this curve");
        return toMontgomerySecret2(secretKey);
      }
    };
    Object.freeze(lengths);
    Object.freeze(utils);
    return Object.freeze({
      keygen: createKeygen(randomSecretKey, getPublicKey),
      getPublicKey,
      sign,
      verify,
      utils,
      Point,
      lengths
    });
  }
  var _0n9, _1n7, _2n6, _4n5, _8n2, PrimeEdwardsPoint;
  var init_edwards = __esm({
    "node_modules/@noble/curves/abstract/edwards.js"() {
      init_utils2();
      init_curve();
      init_modular();
      _0n9 = /* @__PURE__ */ BigInt(0);
      _1n7 = /* @__PURE__ */ BigInt(1);
      _2n6 = /* @__PURE__ */ BigInt(2);
      _4n5 = /* @__PURE__ */ BigInt(4);
      _8n2 = /* @__PURE__ */ BigInt(8);
      PrimeEdwardsPoint = class {
        static BASE;
        static ZERO;
        static Fp;
        static Fn;
        ep;
        /**
         * Wrap one internal Edwards representative directly.
         * This is not a canonical encoding boundary: alternate Edwards
         * representatives may still describe the same abstract wrapper element.
         */
        constructor(ep) {
          this.ep = ep;
        }
        // Static methods that must be implemented by subclasses
        static fromBytes(_bytes) {
          notImplemented();
        }
        static fromHex(_hex) {
          notImplemented();
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        // Common implementations
        clearCofactor() {
          return this;
        }
        assertValidity() {
          this.ep.assertValidity();
        }
        /**
         * Return affine coordinates of the current internal Edwards representative.
         * This is a convenience helper, not a canonical Ristretto/Decaf encoding.
         * Equal abstract elements may expose different `x` / `y`; use
         * `toBytes()` / `fromBytes()` for canonical roundtrips.
         */
        toAffine(invertedZ) {
          return this.ep.toAffine(invertedZ);
        }
        toHex() {
          return bytesToHex2(this.toBytes());
        }
        toString() {
          return this.toHex();
        }
        isTorsionFree() {
          return true;
        }
        isSmallOrder() {
          return false;
        }
        add(other) {
          this.assertSame(other);
          return this.init(this.ep.add(other.ep));
        }
        subtract(other) {
          this.assertSame(other);
          return this.init(this.ep.subtract(other.ep));
        }
        multiply(scalar) {
          return this.init(this.ep.multiply(scalar));
        }
        multiplyUnsafe(scalar) {
          return this.init(this.ep.multiplyUnsafe(scalar));
        }
        double() {
          return this.init(this.ep.double());
        }
        negate() {
          return this.init(this.ep.negate());
        }
        precompute(windowSize, isLazy) {
          this.ep.precompute(windowSize, isLazy);
          return this;
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/montgomery.js
  function cmask(P, swap) {
    return P + swap - (swap >> _1n8 << _1n8);
  }
  function cswap(P) {
    const offset = BigInt(6) * P;
    return (mask, x_2, x_3) => {
      const sum = x_2 + x_3;
      const d = offset + x_3 - x_2;
      const a = (d * mask + x_2) % P;
      return { x_2: a, x_3: sum - a };
    };
  }
  function validateOpts(curve) {
    validateObject(curve, {
      P: "bigint",
      type: "string",
      adjustScalarBytes: "function",
      powPminus2: "function"
    }, {
      randomBytes: "function",
      scalarMultBase: "function"
    });
    return Object.freeze({ ...curve });
  }
  function montgomery(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { P, type, adjustScalarBytes: adjustScalarBytes2, powPminus2, randomBytes: rand } = CURVE;
    const mulBaseHook = CURVE.scalarMultBase;
    const is25519 = type === "x25519";
    if (!is25519 && type !== "x448")
      throw new Error("invalid type");
    const randomBytes_ = rand === void 0 ? randomBytes2 : rand;
    const montgomeryBits = is25519 ? 255 : 448;
    const swap = cswap(P);
    const fieldLen = is25519 ? 32 : 56;
    const Gu = is25519 ? BigInt(9) : BigInt(5);
    const a24 = is25519 ? BigInt(121665) : BigInt(39081);
    const minScalar = is25519 ? _2n7 ** BigInt(254) : _2n7 ** BigInt(447);
    const maxAdded = is25519 ? BigInt(8) * (_2n7 ** BigInt(251) - _1n8) : BigInt(4) * (_2n7 ** BigInt(445) - _1n8);
    const maxScalar = minScalar + maxAdded + _1n8;
    const modP = (n) => mod(n, P);
    const GuBytes = encodeU(Gu);
    function encodeU(u) {
      return numberToBytesLE(modP(u), fieldLen);
    }
    function decodeU(u) {
      const _u = copyBytes(abytes2(u, fieldLen, "uCoordinate"));
      if (is25519)
        _u[31] &= 127;
      return modP(bytesToNumberLE(_u));
    }
    function decodeScalar(scalar) {
      return bytesToNumberLE(adjustScalarBytes2(copyBytes(abytes2(scalar, fieldLen, "scalar"))));
    }
    const lowOrderU = new Set(is25519 ? [
      _0n10,
      _1n8,
      P - _1n8,
      BigInt("325606250916557431795983626356110631294008115727848805560023387167927233504"),
      BigInt("39382357235489614581723060781553021112529911719440698176882885853963445705823")
    ] : [_0n10, _1n8, P - _1n8]);
    function scalarMult(scalar, u) {
      const pointU = decodeU(u);
      if (lowOrderU.has(pointU))
        throw new Error("invalid private or public key received");
      const pu = montgomeryLadder(pointU, decodeScalar(scalar));
      if (pu === _0n10)
        throw new Error("invalid private or public key received");
      return encodeU(pu);
    }
    function scalarMultBase(scalar) {
      if (mulBaseHook === void 0)
        return scalarMult(scalar, GuBytes);
      const k = decodeScalar(scalar);
      aInRange("scalar", k, minScalar, maxScalar);
      const pu = modP(mulBaseHook(k));
      if (pu === _0n10)
        throw new Error("invalid private or public key received");
      return encodeU(pu);
    }
    const getPublicKey = scalarMultBase;
    const getSharedSecret = scalarMult;
    function montgomeryLadder(u, scalar) {
      aInRange("u", u, _0n10, P);
      aInRange("scalar", scalar, minScalar, maxScalar);
      const k = scalar;
      const x_1 = u;
      let x_2 = _1n8;
      let z_2 = _0n10;
      let x_3 = u;
      let z_3 = _1n8;
      const kx = k ^ k >> _1n8;
      for (let t = BigInt(montgomeryBits - 1); t >= _0n10; t--) {
        const mask2 = cmask(P, kx >> t);
        ({ x_2, x_3 } = swap(mask2, x_2, x_3));
        ({ x_2: z_2, x_3: z_3 } = swap(mask2, z_2, z_3));
        const A = x_2 + z_2;
        const AA = modP(A * A);
        const B2 = x_2 - z_2;
        const BB = modP(B2 * B2);
        const E = AA - BB;
        const C = x_3 + z_3;
        const D = x_3 - z_3;
        const DA = modP(D * A);
        const CB = modP(C * B2);
        const dacb = DA + CB;
        const da_cb = DA - CB;
        x_3 = modP(dacb * dacb);
        z_3 = modP(x_1 * modP(da_cb * da_cb));
        x_2 = modP(AA * BB);
        z_2 = modP(E * (AA + modP(a24 * E)));
      }
      const mask = cmask(P, k);
      ({ x_2, x_3 } = swap(mask, x_2, x_3));
      ({ x_2: z_2, x_3: z_3 } = swap(mask, z_2, z_3));
      const z2 = powPminus2(z_2);
      return modP(x_2 * z2);
    }
    const lengths = {
      secretKey: fieldLen,
      publicKey: fieldLen,
      seed: fieldLen
    };
    const randomSecretKey = (seed) => {
      seed = seed === void 0 ? randomBytes_(fieldLen) : seed;
      abytes2(seed, lengths.seed, "seed");
      return seed;
    };
    const utils = { randomSecretKey };
    Object.freeze(lengths);
    Object.freeze(utils);
    return Object.freeze({
      keygen: createKeygen(randomSecretKey, getPublicKey),
      getSharedSecret,
      getPublicKey,
      scalarMult,
      scalarMultBase,
      utils,
      GuBytes: GuBytes.slice(),
      lengths
    });
  }
  var _0n10, _1n8, _2n7;
  var init_montgomery = __esm({
    "node_modules/@noble/curves/abstract/montgomery.js"() {
      init_utils2();
      init_curve();
      init_modular();
      _0n10 = /* @__PURE__ */ BigInt(0);
      _1n8 = /* @__PURE__ */ BigInt(1);
      _2n7 = /* @__PURE__ */ BigInt(2);
    }
  });

  // node_modules/@noble/curves/abstract/oprf.js
  function createOPRF(opts) {
    validateObject(opts, {
      name: "string",
      hash: "function",
      hashToScalar: "function",
      hashToGroup: "function"
    });
    validatePointCons(opts.Point);
    const { name, Point, hash, hashToGroup: hashToGroupHook, hashToScalar } = opts;
    const { Fn: Fn2 } = Point;
    const invertSecret = (value) => invertCt(value, Fn2.ORDER);
    const hashToGroup = (msg, ctx) => hashToGroupHook(msg, {
      DST: concatBytes2(asciiToBytes("HashToGroup-"), ctx)
    });
    const hashToScalarPrefixed = (msg, ctx) => hashToScalar(msg, { DST: concatBytes2(_DST_scalarBytes, ctx) });
    const randomScalar = (rng = randomBytes2) => {
      if (typeof rng !== "function")
        throw new TypeError('"rng" expected function, got type=' + typeof rng);
      const t = mapHashToField(rng(getMinHashLength(Fn2.ORDER)), Fn2.ORDER, Fn2.isLE);
      return Fn2.isLE ? bytesToNumberLE(t) : bytesToNumberBE(t);
    };
    const msm = (points, scalars) => mulAddUnsafe(Point, points, scalars);
    const getCtx = (mode) => concatBytes2(asciiToBytes("OPRFV1-"), new Uint8Array([mode]), asciiToBytes("-" + name));
    const ctxOPRF = getCtx(0);
    const ctxVOPRF = getCtx(1);
    const ctxPOPRF = getCtx(2);
    function encode(...args) {
      const res2 = [];
      for (const a of args) {
        if (typeof a === "number")
          res2.push(numberToBytesBE(a, 2));
        else if (typeof a === "string")
          res2.push(asciiToBytes(a));
        else {
          abytes2(a);
          res2.push(numberToBytesBE(a.length, 2), a);
        }
      }
      return concatBytes2(...res2);
    }
    const inputBytes = (title, bytes) => {
      abytes2(bytes, void 0, title);
      if (bytes.length > 65535)
        throw new Error(`"${title}" expected Uint8Array of length <= 65535, got length=${bytes.length}`);
      return bytes;
    };
    const hashInput = (...bytes) => hash(encode(...bytes, "Finalize"));
    function getTranscripts(B2, C, D, ctx) {
      const Bm = B2.toBytes();
      const seed = hash(encode(Bm, concatBytes2(asciiToBytes("Seed-"), ctx)));
      const res2 = [];
      for (let i = 0; i < C.length; i++) {
        const Ci = C[i].toBytes();
        const Di = D[i].toBytes();
        const di = hashToScalarPrefixed(encode(seed, i, Ci, Di, "Composite"), ctx);
        res2.push(di);
      }
      return res2;
    }
    function computeComposites(B2, C, D, ctx) {
      const T = getTranscripts(B2, C, D, ctx);
      const M = msm(C, T);
      const Z = msm(D, T);
      return { M, Z };
    }
    function computeCompositesFast(k, B2, C, D, ctx) {
      const T = getTranscripts(B2, C, D, ctx);
      const M = msm(C, T);
      const Z = M.multiply(k);
      return { M, Z };
    }
    function challengeTranscript(B2, M, Z, t2, t3, ctx) {
      const [Bm, a0, a1, a2, a3] = [B2, M, Z, t2, t3].map((i) => i.toBytes());
      return hashToScalarPrefixed(encode(Bm, a0, a1, a2, a3, "Challenge"), ctx);
    }
    function generateProof(ctx, k, B2, C, D, rng) {
      const { M, Z } = computeCompositesFast(k, B2, C, D, ctx);
      const r = randomScalar(rng);
      const t2 = Point.BASE.multiply(r);
      const t3 = M.multiply(r);
      const c = challengeTranscript(B2, M, Z, t2, t3, ctx);
      const s = Fn2.sub(r, Fn2.mul(c, k));
      return concatBytes2(...[c, s].map((i) => Fn2.toBytes(i)));
    }
    function verifyProof(ctx, B2, C, D, proof) {
      abytes2(proof, 2 * Fn2.BYTES);
      const { M, Z } = computeComposites(B2, C, D, ctx);
      const [c, s] = [proof.subarray(0, Fn2.BYTES), proof.subarray(Fn2.BYTES)].map((f) => Fn2.fromBytes(f));
      const t2 = msm([Point.BASE, B2], [s, c]);
      const t3 = msm([M, Z], [s, c]);
      const expectedC = challengeTranscript(B2, M, Z, t2, t3, ctx);
      if (!Fn2.eql(c, expectedC))
        throw new Error("proof verification failed");
    }
    function generateKeyPair() {
      const skS = randomScalar();
      const pkS = Point.BASE.multiply(skS);
      return { secretKey: Fn2.toBytes(skS), publicKey: pkS.toBytes() };
    }
    function deriveKeyPair(ctx, seed, info) {
      abytes2(seed, 32, "seed");
      info = inputBytes("keyInfo", info);
      const dst = concatBytes2(asciiToBytes("DeriveKeyPair"), ctx);
      const msg = concatBytes2(seed, encode(info), Uint8Array.of(0));
      for (let counter = 0; counter <= 255; counter++) {
        msg[msg.length - 1] = counter;
        const skS = hashToScalar(msg, { DST: dst });
        if (Fn2.is0(skS))
          continue;
        return {
          secretKey: Fn2.toBytes(skS),
          publicKey: Point.BASE.multiply(skS).toBytes()
        };
      }
      throw new Error("Cannot derive key");
    }
    const wirePoint = (label, bytes) => {
      const point = Point.fromBytes(bytes);
      if (point.equals(Point.ZERO))
        throw new Error(label + " point at infinity");
      return point;
    };
    function blind(ctx, input, rng = randomBytes2) {
      input = inputBytes("input", input);
      const blind2 = randomScalar(rng);
      const inputPoint = hashToGroup(input, ctx);
      if (inputPoint.equals(Point.ZERO))
        throw new Error("Input point at infinity");
      const blinded = inputPoint.multiply(blind2);
      return { blind: Fn2.toBytes(blind2), blinded: blinded.toBytes() };
    }
    function evaluate(ctx, secretKey, input) {
      input = inputBytes("input", input);
      const skS = Fn2.fromBytes(secretKey);
      const inputPoint = hashToGroup(input, ctx);
      if (inputPoint.equals(Point.ZERO))
        throw new Error("Input point at infinity");
      const unblinded = inputPoint.multiply(skS).toBytes();
      return hashInput(input, unblinded);
    }
    const oprf = Object.freeze({
      generateKeyPair,
      deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxOPRF, seed, keyInfo),
      blind: (input, rng = randomBytes2) => blind(ctxOPRF, input, rng),
      blindEvaluate(secretKey, blindedPoint) {
        const skS = Fn2.fromBytes(secretKey);
        const elm = wirePoint("blinded", blindedPoint);
        return elm.multiply(skS).toBytes();
      },
      finalize(input, blindBytes, evaluatedBytes) {
        input = inputBytes("input", input);
        const blind2 = Fn2.fromBytes(blindBytes);
        const evalPoint = wirePoint("evaluated", evaluatedBytes);
        const unblinded = evalPoint.multiply(Fn2.inv(blind2)).toBytes();
        return hashInput(input, unblinded);
      },
      evaluate: (secretKey, input) => evaluate(ctxOPRF, secretKey, input)
    });
    const voprf = Object.freeze({
      generateKeyPair,
      deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxVOPRF, seed, keyInfo),
      blind: (input, rng = randomBytes2) => blind(ctxVOPRF, input, rng),
      blindEvaluateBatch(secretKey, publicKey, blinded, rng = randomBytes2) {
        if (!Array.isArray(blinded))
          throw new Error("expected array");
        const skS = Fn2.fromBytes(secretKey);
        const pkS = wirePoint("public key", publicKey);
        const blindedPoints = blinded.map((i) => wirePoint("blinded", i));
        const evaluated = blindedPoints.map((i) => i.multiply(skS));
        const proof = generateProof(ctxVOPRF, skS, pkS, blindedPoints, evaluated, rng);
        return { evaluated: evaluated.map((i) => i.toBytes()), proof };
      },
      blindEvaluate(secretKey, publicKey, blinded, rng = randomBytes2) {
        const res2 = this.blindEvaluateBatch(secretKey, publicKey, [blinded], rng);
        return { evaluated: res2.evaluated[0], proof: res2.proof };
      },
      finalizeBatch(items, publicKey, proof) {
        if (!Array.isArray(items))
          throw new Error("expected array");
        const pkS = wirePoint("public key", publicKey);
        const blindedPoints = items.map((i) => wirePoint("blinded", i.blinded));
        const evalPoints = items.map((i) => wirePoint("evaluated", i.evaluated));
        verifyProof(ctxVOPRF, pkS, blindedPoints, evalPoints, proof);
        return items.map((i, j) => {
          const input = inputBytes("input", i.input);
          const blind2 = Fn2.fromBytes(i.blind);
          const unblinded = evalPoints[j].multiply(Fn2.inv(blind2)).toBytes();
          return hashInput(input, unblinded);
        });
      },
      finalize(input, blind2, evaluated, blinded, publicKey, proof) {
        return this.finalizeBatch([{ input, blind: blind2, evaluated, blinded }], publicKey, proof)[0];
      },
      evaluate: (secretKey, input) => evaluate(ctxVOPRF, secretKey, input)
    });
    const poprf = (info) => {
      info = copyBytes(inputBytes("info", info));
      const m = hashToScalarPrefixed(encode("Info", info), ctxPOPRF);
      const T = Point.BASE.multiply(m);
      return Object.freeze({
        generateKeyPair,
        deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxPOPRF, seed, keyInfo),
        blind(input, publicKey, rng = randomBytes2) {
          input = inputBytes("input", input);
          const pkS = wirePoint("public key", publicKey);
          const tweakedKey = T.add(pkS);
          if (tweakedKey.equals(Point.ZERO))
            throw new Error("tweakedKey point at infinity");
          const blind2 = randomScalar(rng);
          const inputPoint = hashToGroup(input, ctxPOPRF);
          if (inputPoint.equals(Point.ZERO))
            throw new Error("Input point at infinity");
          const blindedPoint = inputPoint.multiply(blind2);
          return {
            blind: Fn2.toBytes(blind2),
            blinded: blindedPoint.toBytes(),
            tweakedKey: tweakedKey.toBytes()
          };
        },
        blindEvaluateBatch(secretKey, blinded, rng = randomBytes2) {
          if (!Array.isArray(blinded))
            throw new Error("expected array");
          const skS = Fn2.fromBytes(secretKey);
          const t = Fn2.add(skS, m);
          const invT = invertSecret(t);
          const blindedPoints = blinded.map((i) => wirePoint("blinded", i));
          const evalPoints = blindedPoints.map((i) => i.multiply(invT));
          const tweakedKey = Point.BASE.multiply(t);
          const proof = generateProof(ctxPOPRF, t, tweakedKey, evalPoints, blindedPoints, rng);
          return { evaluated: evalPoints.map((i) => i.toBytes()), proof };
        },
        blindEvaluate(secretKey, blinded, rng = randomBytes2) {
          const res2 = this.blindEvaluateBatch(secretKey, [blinded], rng);
          return { evaluated: res2.evaluated[0], proof: res2.proof };
        },
        finalizeBatch(items, proof, tweakedKey) {
          if (!Array.isArray(items))
            throw new Error("expected array");
          const inputs = items.map((i) => inputBytes("input", i.input));
          const evalPoints = items.map((i) => wirePoint("evaluated", i.evaluated));
          verifyProof(ctxPOPRF, wirePoint("tweakedKey", tweakedKey), evalPoints, items.map((i) => wirePoint("blinded", i.blinded)), proof);
          return items.map((i, j) => {
            const blind2 = Fn2.fromBytes(i.blind);
            const point = evalPoints[j].multiply(Fn2.inv(blind2)).toBytes();
            return hashInput(inputs[j], info, point);
          });
        },
        finalize(input, blind2, evaluated, blinded, proof, tweakedKey) {
          return this.finalizeBatch([{ input, blind: blind2, evaluated, blinded }], proof, tweakedKey)[0];
        },
        evaluate(secretKey, input) {
          input = inputBytes("input", input);
          const skS = Fn2.fromBytes(secretKey);
          const inputPoint = hashToGroup(input, ctxPOPRF);
          if (inputPoint.equals(Point.ZERO))
            throw new Error("Input point at infinity");
          const t = Fn2.add(skS, m);
          const invT = invertSecret(t);
          const unblinded = inputPoint.multiply(invT).toBytes();
          return hashInput(input, info, unblinded);
        }
      });
    };
    const res = { name, oprf, voprf, poprf, __tests: Object.freeze({ Fn: Fn2, invertSecret }) };
    return Object.freeze(res);
  }
  var _DST_scalarBytes;
  var init_oprf = __esm({
    "node_modules/@noble/curves/abstract/oprf.js"() {
      init_utils2();
      init_curve();
      init_hash_to_curve();
      init_modular();
      _DST_scalarBytes = /* @__PURE__ */ asciiToBytes(_DST_scalar);
    }
  });

  // node_modules/@noble/curves/ed25519.js
  var ed25519_exports = {};
  __export(ed25519_exports, {
    ED25519_TORSION_SUBGROUP: () => ED25519_TORSION_SUBGROUP,
    _map_to_curve_elligator2_curve25519: () => _map_to_curve_elligator2_curve25519,
    ed25519: () => ed25519,
    ed25519_FROST: () => ed25519_FROST,
    ed25519_hasher: () => ed25519_hasher,
    ed25519ctx: () => ed25519ctx,
    ed25519ph: () => ed25519ph,
    ristretto255: () => ristretto255,
    ristretto255_FROST: () => ristretto255_FROST,
    ristretto255_hasher: () => ristretto255_hasher,
    ristretto255_oprf: () => ristretto255_oprf,
    x25519: () => x25519
  });
  function ed25519_pow_2_252_3(x) {
    const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
    const P = ed25519_CURVE_p;
    const x2 = x * x % P;
    const b2 = x2 * x % P;
    const b4 = pow2(b2, _2n8, P) * b2 % P;
    const b5 = pow2(b4, _1n9, P) * x % P;
    const b10 = pow2(b5, _5n2, P) * b5 % P;
    const b20 = pow2(b10, _10n, P) * b10 % P;
    const b40 = pow2(b20, _20n, P) * b20 % P;
    const b80 = pow2(b40, _40n, P) * b40 % P;
    const b160 = pow2(b80, _80n, P) * b80 % P;
    const b240 = pow2(b160, _80n, P) * b80 % P;
    const b250 = pow2(b240, _10n, P) * b10 % P;
    const pow_p_5_8 = pow2(b250, _2n8, P) * x % P;
    return { pow_p_5_8, b2 };
  }
  function adjustScalarBytes(bytes) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
  }
  function uvRatio(u, v) {
    const P = ed25519_CURVE_p;
    const v3 = mod(v * v * v, P);
    const v7 = mod(v3 * v3 * v, P);
    const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
    let x = mod(u * v3 * pow3, P);
    const vx2 = mod(v * x * x, P);
    const root1 = x;
    const root2 = mod(x * ED25519_SQRT_M1, P);
    const useRoot1 = vx2 === u;
    const useRoot2 = vx2 === mod(-u, P);
    const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
    if (useRoot1)
      x = root1;
    if (useRoot2 || noRoot)
      x = root2;
    if (isNegativeLE(x, P))
      x = mod(-x, P);
    return { isValid: useRoot1 || useRoot2, value: x };
  }
  function toMontgomery(point) {
    const { y } = point;
    return Fp.toBytes(Fp.div(_1n9 + y, _1n9 - y));
  }
  function toMontgomerySecret(secretKey) {
    const size = ed25519_Point.Fp.BYTES;
    abytes(secretKey, size);
    return adjustScalarBytes(sha512(secretKey.subarray(0, size))).subarray(0, size);
  }
  function ed25519_domain(data, ctx, phflag) {
    if (ctx.length > 255)
      throw new Error("Context is too big");
    return concatBytes(asciiToBytes("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
  }
  function ed(opts) {
    return eddsa(ed25519_Point, sha512, Object.assign({ adjustScalarBytes, toMontgomery, toMontgomerySecret, zip215: true }, opts));
  }
  function _map_to_curve_elligator2_curve25519(u) {
    let tv1 = Fp.sqr(u);
    tv1 = Fp.mul(tv1, _2n8);
    let xd = Fp.add(tv1, Fp.ONE);
    let x1n = Fp.neg(ELL2_J);
    let tv2 = Fp.sqr(xd);
    let gxd = Fp.mul(tv2, xd);
    let gx1 = Fp.mul(tv1, ELL2_J);
    gx1 = Fp.mul(gx1, x1n);
    gx1 = Fp.add(gx1, tv2);
    gx1 = Fp.mul(gx1, x1n);
    let tv3 = Fp.sqr(gxd);
    tv2 = Fp.sqr(tv3);
    tv3 = Fp.mul(tv3, gxd);
    tv3 = Fp.mul(tv3, gx1);
    tv2 = Fp.mul(tv2, tv3);
    let y11 = ed25519_pow_2_252_3(tv2).pow_p_5_8;
    y11 = Fp.mul(y11, tv3);
    let y12 = Fp.mul(y11, ELL2_C3);
    tv2 = Fp.sqr(y11);
    tv2 = Fp.mul(tv2, gxd);
    let e1 = Fp.eql(tv2, gx1);
    let y1 = Fp.cmov(y12, y11, e1);
    let x2n = Fp.mul(x1n, tv1);
    let y21 = Fp.mul(y11, u);
    y21 = Fp.mul(y21, ELL2_C2);
    let y22 = Fp.mul(y21, ELL2_C3);
    let gx2 = Fp.mul(gx1, tv1);
    tv2 = Fp.sqr(y21);
    tv2 = Fp.mul(tv2, gxd);
    let e2 = Fp.eql(tv2, gx2);
    let y2 = Fp.cmov(y22, y21, e2);
    tv2 = Fp.sqr(y1);
    tv2 = Fp.mul(tv2, gxd);
    let e3 = Fp.eql(tv2, gx1);
    let xn = Fp.cmov(x2n, x1n, e3);
    let y = Fp.cmov(y2, y1, e3);
    let e4 = Fp.isOdd(y);
    y = Fp.cmov(y, Fp.neg(y), e3 !== e4);
    return { xMn: xn, xMd: xd, yMn: y, yMd: _1n9 };
  }
  function map_to_curve_elligator2_edwards25519(u) {
    const { xMn, xMd, yMn, yMd } = _map_to_curve_elligator2_curve25519(u);
    let xn = Fp.mul(xMn, yMd);
    xn = Fp.mul(xn, ELL2_C1_EDWARDS);
    let xd = Fp.mul(xMd, yMn);
    let yn = Fp.sub(xMn, xMd);
    let yd = Fp.add(xMn, xMd);
    let tv1 = Fp.mul(xd, yd);
    let e = Fp.eql(tv1, Fp.ZERO);
    xn = Fp.cmov(xn, Fp.ZERO, e);
    xd = Fp.cmov(xd, Fp.ONE, e);
    yn = Fp.cmov(yn, Fp.ONE, e);
    yd = Fp.cmov(yd, Fp.ONE, e);
    const [xd_inv, yd_inv] = FpInvertBatch(Fp, [xd, yd], true);
    return { x: Fp.mul(xn, xd_inv), y: Fp.mul(yn, yd_inv) };
  }
  function calcElligatorRistrettoMap(r0) {
    const { d } = ed25519_CURVE;
    const r = Fp.mul(Fp.mulN(SQRT_M1, r0), r0);
    const Ns = Fp.mul(Fp.addN(r, _1n9), ONE_MINUS_D_SQ);
    let c = BigInt(-1);
    const D = Fp.mul(Fp.subN(c, Fp.mulN(d, r)), Fp.add(r, d));
    let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
    let s_ = Fp.mul(s, r0);
    if (!Fp.isOdd(s_))
      s_ = Fp.neg(s_);
    if (!Ns_D_is_sq)
      s = s_;
    if (!Ns_D_is_sq)
      c = r;
    const Nt = Fp.sub(Fp.mulN(Fp.mulN(c, Fp.subN(r, _1n9)), D_MINUS_ONE_SQ), D);
    const s2 = Fp.sqrN(s);
    const W0 = Fp.mul(Fp.addN(s, s), D);
    const W1 = Fp.mul(Nt, SQRT_AD_MINUS_ONE);
    const W2 = Fp.sub(_1n9, s2);
    const W3 = Fp.add(_1n9, s2);
    return new ed25519_Point(Fp.mul(W0, W3), Fp.mul(W2, W1), Fp.mul(W1, W3), Fp.mul(W0, W2));
  }
  var _0n11, _1n9, _2n8, _3n4, _5n2, _8n3, ed25519_CURVE_p, ed25519_CURVE, ED25519_SQRT_M1, ed25519_Point, Fp, Fn, ed25519, ed25519ctx, ed25519ph, ed25519_FROST, x25519, ELL2_C1, ELL2_C2, ELL2_C3, ELL2_J, ELL2_C1_EDWARDS, ed25519_hasher, SQRT_M1, SQRT_AD_MINUS_ONE, INVSQRT_A_MINUS_D, ONE_MINUS_D_SQ, D_MINUS_ONE_SQ, invertSqrt, MAX_255B, bytes255ToNumberLE, _RistrettoPoint, ristretto255, ristretto255_hasher, ristretto255_oprf, ristretto255_FROST, ED25519_TORSION_SUBGROUP;
  var init_ed25519 = __esm({
    "node_modules/@noble/curves/ed25519.js"() {
      init_sha2();
      init_utils();
      init_edwards();
      init_frost();
      init_hash_to_curve();
      init_modular();
      init_montgomery();
      init_oprf();
      init_utils2();
      _0n11 = /* @__PURE__ */ BigInt(0);
      _1n9 = /* @__PURE__ */ BigInt(1);
      _2n8 = /* @__PURE__ */ BigInt(2);
      _3n4 = /* @__PURE__ */ BigInt(3);
      _5n2 = /* @__PURE__ */ BigInt(5);
      _8n3 = /* @__PURE__ */ BigInt(8);
      ed25519_CURVE_p = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
      ed25519_CURVE = /* @__PURE__ */ (() => ({
        p: ed25519_CURVE_p,
        n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
        h: _8n3,
        a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
        d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
        Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
        Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
      }))();
      ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
      ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio });
      Fp = /* @__PURE__ */ (() => ed25519_Point.Fp)();
      Fn = /* @__PURE__ */ (() => ed25519_Point.Fn)();
      ed25519 = /* @__PURE__ */ ed({});
      ed25519ctx = /* @__PURE__ */ ed({ domain: ed25519_domain });
      ed25519ph = /* @__PURE__ */ ed({ domain: ed25519_domain, prehash: sha512 });
      ed25519_FROST = /* @__PURE__ */ (() => createFROST({
        name: "FROST-ED25519-SHA512-v1",
        Point: ed25519_Point,
        validatePoint: (p) => {
          p.assertValidity();
          if (!p.isTorsionFree())
            throw new Error("bad point: not torsion-free");
        },
        hash: sha512,
        // RFC 9591 keeps H2 undecorated here for RFC 8032 compatibility. In createFROST(),
        // `H2: ''` becomes an empty DST prefix; the built-in hashToScalar fallback treats
        // that the same as omitted DST, even though custom hooks can still observe the empty bag.
        H2: ""
      }))();
      x25519 = /* @__PURE__ */ (() => {
        const P = ed25519_CURVE_p;
        const powPminus2 = (x) => {
          const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
          return mod(pow2(pow_p_5_8, _3n4, P) * b2, P);
        };
        return montgomery({
          P,
          type: "x25519",
          powPminus2,
          adjustScalarBytes,
          // ~3x faster fixed-base: [k]B on the birationally-equivalent Edwards curve using cached
          // base tables, mapped back via u = (1+y)/(1-y) = (Z+Y)/(Z-Y) with one Fermat inversion.
          // Same construction as libsodium's crypto_scalarmult_curve25519_base.
          scalarMultBase: (k) => {
            const kn = mod(k, ed25519_Point.Fn.ORDER);
            if (kn === _0n11)
              return _0n11;
            const p = ed25519_Point.BASE.multiply(kn);
            return mod((p.Z + p.Y) * powPminus2(mod(p.Z - p.Y, P)), P);
          }
        });
      })();
      ELL2_C1 = /* @__PURE__ */ (() => (ed25519_CURVE_p + _3n4) / _8n3)();
      ELL2_C2 = /* @__PURE__ */ (() => Fp.pow(_2n8, ELL2_C1))();
      ELL2_C3 = /* @__PURE__ */ (() => Fp.sqrt(Fp.neg(Fp.ONE)))();
      ELL2_J = /* @__PURE__ */ BigInt(486662);
      ELL2_C1_EDWARDS = /* @__PURE__ */ (() => FpSqrtEven(Fp, Fp.neg(BigInt(486664))))();
      ed25519_hasher = /* @__PURE__ */ (() => createHasher2(ed25519_Point, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
        DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
        encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
        p: ed25519_CURVE_p,
        m: 1,
        k: 128,
        expand: "xmd",
        hash: sha512
      }))();
      SQRT_M1 = ED25519_SQRT_M1;
      SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
      INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
      ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
      D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
      invertSqrt = (number) => uvRatio(_1n9, number);
      MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      bytes255ToNumberLE = (bytes) => Fp.create(bytesToNumberLE(bytes) & MAX_255B);
      _RistrettoPoint = class __RistrettoPoint extends PrimeEdwardsPoint {
        // Do NOT change syntax: the following gymnastics is done,
        // because typescript strips comments, which makes bundlers disable tree-shaking.
        // prettier-ignore
        static BASE = /* @__PURE__ */ (() => new __RistrettoPoint(ed25519_Point.BASE))();
        // prettier-ignore
        static ZERO = /* @__PURE__ */ (() => new __RistrettoPoint(ed25519_Point.ZERO))();
        // prettier-ignore
        static Fp = /* @__PURE__ */ (() => Fp)();
        // prettier-ignore
        static Fn = /* @__PURE__ */ (() => Fn)();
        constructor(ep) {
          super(ep);
        }
        /**
         * Create one Ristretto255 point from affine Edwards coordinates.
         * This wraps the internal Edwards representative directly and is not a
         * canonical ristretto255 decoding path.
         * Use `toBytes()` / `fromBytes()` if canonical ristretto255 bytes matter.
         */
        static fromAffine(ap) {
          return new __RistrettoPoint(ed25519_Point.fromAffine(ap));
        }
        assertSame(other) {
          if (!(other instanceof __RistrettoPoint))
            throw new Error("RistrettoPoint expected");
        }
        init(ep) {
          return new __RistrettoPoint(ep);
        }
        static fromBytes(bytes) {
          abytes(bytes, 32);
          const { a, d } = ed25519_CURVE;
          const s = bytes255ToNumberLE(bytes);
          if (!equalBytes(Fp.toBytes(s), bytes) || Fp.isOdd(s))
            throw new Error("invalid ristretto255 encoding 1");
          const s2 = Fp.sqr(s);
          const u1 = Fp.add(_1n9, Fp.mulN(a, s2));
          const u2 = Fp.sub(_1n9, Fp.mulN(a, s2));
          const u1_2 = Fp.sqr(u1);
          const u2_2 = Fp.sqr(u2);
          const v = Fp.sub(Fp.mulN(Fp.mulN(a, d), u1_2), u2_2);
          const { isValid, value: I } = invertSqrt(Fp.mul(v, u2_2));
          const Dx = Fp.mul(I, u2);
          const Dy = Fp.mul(Fp.mulN(I, Dx), v);
          let x = Fp.mul(Fp.addN(s, s), Dx);
          if (Fp.isOdd(x))
            x = Fp.neg(x);
          const y = Fp.mul(u1, Dy);
          const t = Fp.mul(x, y);
          if (!isValid || Fp.isOdd(t) || Fp.is0(y))
            throw new Error("invalid ristretto255 encoding 2");
          return new __RistrettoPoint(new ed25519_Point(x, y, Fp.ONE, t));
        }
        /**
         * Converts ristretto-encoded string to ristretto point.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
         * @param hex - Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
         */
        static fromHex(hex2) {
          return __RistrettoPoint.fromBytes(hexToBytes(hex2));
        }
        /**
         * Encodes ristretto point to Uint8Array.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
         */
        toBytes() {
          let { X, Y, Z, T } = this.ep;
          const u1 = Fp.mul(Fp.add(Z, Y), Fp.sub(Z, Y));
          const u2 = Fp.mul(X, Y);
          const u2sq = Fp.sqr(u2);
          const { value: invsqrt } = invertSqrt(Fp.mul(u1, u2sq));
          const D1 = Fp.mul(invsqrt, u1);
          const D2 = Fp.mul(invsqrt, u2);
          const zInv = Fp.mul(Fp.mulN(D1, D2), T);
          let D;
          if (Fp.isOdd(Fp.mul(T, zInv))) {
            let _x = Fp.mul(Y, SQRT_M1);
            let _y = Fp.mul(X, SQRT_M1);
            X = _x;
            Y = _y;
            D = Fp.mul(D1, INVSQRT_A_MINUS_D);
          } else {
            D = D2;
          }
          if (Fp.isOdd(Fp.mul(X, zInv)))
            Y = Fp.neg(Y);
          let s = Fp.mul(Fp.subN(Z, Y), D);
          if (Fp.isOdd(s))
            s = Fp.neg(s);
          return Fp.toBytes(s);
        }
        /**
         * Compares two Ristretto points.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
         */
        equals(other) {
          this.assertSame(other);
          const { X: X1, Y: Y1 } = this.ep;
          const { X: X2, Y: Y2 } = other.ep;
          const one = Fp.eql(Fp.mul(X1, Y2), Fp.mul(Y1, X2));
          const two = Fp.eql(Fp.mul(Y1, Y2), Fp.mul(X1, X2));
          return one || two;
        }
        is0() {
          return this.equals(__RistrettoPoint.ZERO);
        }
      };
      ristretto255 = /* @__PURE__ */ (() => {
        Object.freeze(_RistrettoPoint.BASE);
        Object.freeze(_RistrettoPoint.ZERO);
        Object.freeze(_RistrettoPoint.prototype);
        Object.freeze(_RistrettoPoint);
        return Object.freeze({ Point: _RistrettoPoint });
      })();
      ristretto255_hasher = /* @__PURE__ */ Object.freeze({
        Point: _RistrettoPoint,
        /**
        * Spec: https://www.rfc-editor.org/rfc/rfc9380.html#name-hashing-to-ristretto255. Caveats:
        * * There are no test vectors
        * * encodeToCurve / mapToCurve is undefined
        * * mapToCurve would be `calcElligatorRistrettoMap(scalars[0])`, not ristretto255_map!
        * * hashToScalar is undefined too, so we just use OPRF implementation
        * * We cannot re-use 'createHasher', because ristretto255_map is different algorithm/RFC
          (os2ip -> bytes255ToNumberLE)
        * * mapToCurve == calcElligatorRistrettoMap, hashToCurve == ristretto255_map
        * * hashToScalar is undefined in RFC9380 for ristretto, so we use the OPRF
          version here. Using `bytes255ToNumblerLE` will create a different result
          if we use `bytes255ToNumberLE` as os2ip
        * * current version is closest to spec.
        */
        hashToCurve(msg, options) {
          const DST = options?.DST === void 0 ? "ristretto255_XMD:SHA-512_R255MAP_RO_" : options.DST;
          const xmd = expand_message_xmd(msg, DST, 64, sha512);
          return ristretto255_hasher.deriveToCurve(xmd);
        },
        hashToScalar(msg, options) {
          const DST = options?.DST === void 0 ? _DST_scalar : options.DST;
          const xmd = expand_message_xmd(msg, DST, 64, sha512);
          return Fn.create(bytesToNumberLE(xmd));
        },
        /**
         * HashToCurve-like construction based on RFC 9496 (Element Derivation).
         * Converts 64 uniform random bytes into a curve point.
         *
         * WARNING: This represents an older hash-to-curve construction from before
         * RFC 9380 was finalized.
         * It was later reused as a component in the newer
         * `hash_to_ristretto255` function defined in RFC 9380.
         */
        deriveToCurve(bytes) {
          abytes(bytes, 64);
          const r1 = bytes255ToNumberLE(bytes.subarray(0, 32));
          const R1 = calcElligatorRistrettoMap(r1);
          const r2 = bytes255ToNumberLE(bytes.subarray(32, 64));
          const R2 = calcElligatorRistrettoMap(r2);
          return new _RistrettoPoint(R1.add(R2));
        }
      });
      ristretto255_oprf = /* @__PURE__ */ (() => createOPRF({
        name: "ristretto255-SHA512",
        Point: _RistrettoPoint,
        hash: sha512,
        hashToGroup: ristretto255_hasher.hashToCurve,
        hashToScalar: ristretto255_hasher.hashToScalar
      }))();
      ristretto255_FROST = /* @__PURE__ */ (() => createFROST({
        name: "FROST-RISTRETTO255-SHA512-v1",
        Point: _RistrettoPoint,
        validatePoint: (p) => {
          p.assertValidity();
        },
        hash: sha512
      }))();
      ED25519_TORSION_SUBGROUP = /* @__PURE__ */ Object.freeze([
        "0100000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
        "0000000000000000000000000000000000000000000000000000000000000080",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
        "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
      ]);
    }
  });

  // node_modules/jsonify/lib/parse.js
  var require_parse = __commonJS({
    "node_modules/jsonify/lib/parse.js"(exports, module) {
      "use strict";
      var at;
      var ch;
      var escapee = {
        '"': '"',
        "\\": "\\",
        "/": "/",
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "	"
      };
      var text;
      function error(m) {
        throw {
          name: "SyntaxError",
          message: m,
          at,
          text
        };
      }
      function next(c) {
        if (c && c !== ch) {
          error("Expected '" + c + "' instead of '" + ch + "'");
        }
        ch = text.charAt(at);
        at += 1;
        return ch;
      }
      function number() {
        var num2;
        var str = "";
        if (ch === "-") {
          str = "-";
          next("-");
        }
        while (ch >= "0" && ch <= "9") {
          str += ch;
          next();
        }
        if (ch === ".") {
          str += ".";
          while (next() && ch >= "0" && ch <= "9") {
            str += ch;
          }
        }
        if (ch === "e" || ch === "E") {
          str += ch;
          next();
          if (ch === "-" || ch === "+") {
            str += ch;
            next();
          }
          while (ch >= "0" && ch <= "9") {
            str += ch;
            next();
          }
        }
        num2 = Number(str);
        if (!isFinite(num2)) {
          error("Bad number");
        }
        return num2;
      }
      function string() {
        var hex2;
        var i;
        var str = "";
        var uffff;
        if (ch === '"') {
          while (next()) {
            if (ch === '"') {
              next();
              return str;
            } else if (ch === "\\") {
              next();
              if (ch === "u") {
                uffff = 0;
                for (i = 0; i < 4; i += 1) {
                  hex2 = parseInt(next(), 16);
                  if (!isFinite(hex2)) {
                    break;
                  }
                  uffff = uffff * 16 + hex2;
                }
                str += String.fromCharCode(uffff);
              } else if (typeof escapee[ch] === "string") {
                str += escapee[ch];
              } else {
                break;
              }
            } else {
              str += ch;
            }
          }
        }
        error("Bad string");
      }
      function white() {
        while (ch && ch <= " ") {
          next();
        }
      }
      function word() {
        switch (ch) {
          case "t":
            next("t");
            next("r");
            next("u");
            next("e");
            return true;
          case "f":
            next("f");
            next("a");
            next("l");
            next("s");
            next("e");
            return false;
          case "n":
            next("n");
            next("u");
            next("l");
            next("l");
            return null;
          default:
            error("Unexpected '" + ch + "'");
        }
      }
      function array() {
        var arr = [];
        if (ch === "[") {
          next("[");
          white();
          if (ch === "]") {
            next("]");
            return arr;
          }
          while (ch) {
            arr.push(value());
            white();
            if (ch === "]") {
              next("]");
              return arr;
            }
            next(",");
            white();
          }
        }
        error("Bad array");
      }
      function object() {
        var key;
        var obj = {};
        if (ch === "{") {
          next("{");
          white();
          if (ch === "}") {
            next("}");
            return obj;
          }
          while (ch) {
            key = string();
            white();
            next(":");
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              error('Duplicate key "' + key + '"');
            }
            obj[key] = value();
            white();
            if (ch === "}") {
              next("}");
              return obj;
            }
            next(",");
            white();
          }
        }
        error("Bad object");
      }
      function value() {
        white();
        switch (ch) {
          case "{":
            return object();
          case "[":
            return array();
          case '"':
            return string();
          case "-":
            return number();
          default:
            return ch >= "0" && ch <= "9" ? number() : word();
        }
      }
      module.exports = function(source, reviver) {
        var result;
        text = source;
        at = 0;
        ch = " ";
        result = value();
        white();
        if (ch) {
          error("Syntax error");
        }
        return typeof reviver === "function" ? (function walk(holder, key) {
          var k;
          var v;
          var val = holder[key];
          if (val && typeof val === "object") {
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(val, k)) {
                v = walk(val, k);
                if (typeof v === "undefined") {
                  delete val[k];
                } else {
                  val[k] = v;
                }
              }
            }
          }
          return reviver.call(holder, key, val);
        })({ "": result }, "") : result;
      };
    }
  });

  // node_modules/jsonify/lib/stringify.js
  var require_stringify = __commonJS({
    "node_modules/jsonify/lib/stringify.js"(exports, module) {
      "use strict";
      var escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      var gap;
      var indent;
      var meta = {
        // table of character substitutions
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
      };
      var rep;
      function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
          var c = meta[a];
          return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      }
      function str(key, holder) {
        var i;
        var k;
        var v;
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        if (typeof rep === "function") {
          value = rep.call(holder, key, value);
        }
        switch (typeof value) {
          case "string":
            return quote(value);
          case "number":
            return isFinite(value) ? String(value) : "null";
          case "boolean":
          case "null":
            return String(value);
          case "object":
            if (!value) {
              return "null";
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
              length = value.length;
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || "null";
              }
              v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
              gap = mind;
              return v;
            }
            if (rep && typeof rep === "object") {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                k = rep[i];
                if (typeof k === "string") {
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                  }
                }
              }
            } else {
              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                  v = str(k, value);
                  if (v) {
                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                  }
                }
              }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
          default:
        }
      }
      module.exports = function(value, replacer, space) {
        var i;
        gap = "";
        indent = "";
        if (typeof space === "number") {
          for (i = 0; i < space; i += 1) {
            indent += " ";
          }
        } else if (typeof space === "string") {
          indent = space;
        }
        rep = replacer;
        if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
          throw new Error("JSON.stringify");
        }
        return str("", { "": value });
      };
    }
  });

  // node_modules/jsonify/index.js
  var require_jsonify = __commonJS({
    "node_modules/jsonify/index.js"(exports) {
      "use strict";
      exports.parse = require_parse();
      exports.stringify = require_stringify();
    }
  });

  // node_modules/isarray/index.js
  var require_isarray = __commonJS({
    "node_modules/isarray/index.js"(exports, module) {
      var toString = {}.toString;
      module.exports = Array.isArray || function(arr) {
        return toString.call(arr) == "[object Array]";
      };
    }
  });

  // node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "node_modules/object-keys/isArguments.js"(exports, module) {
      "use strict";
      var toStr = Object.prototype.toString;
      module.exports = function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      };
    }
  });

  // node_modules/object-keys/implementation.js
  var require_implementation = __commonJS({
    "node_modules/object-keys/implementation.js"(exports, module) {
      "use strict";
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        };
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = (function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        })();
        equalsConstructorPrototypeIfNotBuggy = function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        };
        keysShim = function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name in object) {
              if (!(skipProto && name === "prototype") && has.call(object, name)) {
                theKeys.push(String(name));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        };
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module.exports = keysShim;
    }
  });

  // node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "node_modules/object-keys/index.js"(exports, module) {
      "use strict";
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? function keys(o) {
        return origKeys(o);
      } : require_implementation();
      var originalKeys = Object.keys;
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = (function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          })(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module.exports = keysShim;
    }
  });

  // node_modules/es-object-atoms/index.js
  var require_es_object_atoms = __commonJS({
    "node_modules/es-object-atoms/index.js"(exports, module) {
      "use strict";
      module.exports = Object;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports, module) {
      "use strict";
      module.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports, module) {
      "use strict";
      module.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports, module) {
      "use strict";
      module.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports, module) {
      "use strict";
      module.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports, module) {
      "use strict";
      module.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports, module) {
      "use strict";
      module.exports = TypeError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports, module) {
      "use strict";
      module.exports = URIError;
    }
  });

  // node_modules/math-intrinsics/abs.js
  var require_abs = __commonJS({
    "node_modules/math-intrinsics/abs.js"(exports, module) {
      "use strict";
      module.exports = Math.abs;
    }
  });

  // node_modules/math-intrinsics/floor.js
  var require_floor = __commonJS({
    "node_modules/math-intrinsics/floor.js"(exports, module) {
      "use strict";
      module.exports = Math.floor;
    }
  });

  // node_modules/math-intrinsics/max.js
  var require_max = __commonJS({
    "node_modules/math-intrinsics/max.js"(exports, module) {
      "use strict";
      module.exports = Math.max;
    }
  });

  // node_modules/math-intrinsics/min.js
  var require_min = __commonJS({
    "node_modules/math-intrinsics/min.js"(exports, module) {
      "use strict";
      module.exports = Math.min;
    }
  });

  // node_modules/math-intrinsics/pow.js
  var require_pow = __commonJS({
    "node_modules/math-intrinsics/pow.js"(exports, module) {
      "use strict";
      module.exports = Math.pow;
    }
  });

  // node_modules/math-intrinsics/round.js
  var require_round = __commonJS({
    "node_modules/math-intrinsics/round.js"(exports, module) {
      "use strict";
      module.exports = Math.round;
    }
  });

  // node_modules/math-intrinsics/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/math-intrinsics/isNaN.js"(exports, module) {
      "use strict";
      module.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/math-intrinsics/sign.js
  var require_sign = __commonJS({
    "node_modules/math-intrinsics/sign.js"(exports, module) {
      "use strict";
      var $isNaN = require_isNaN();
      module.exports = function sign(number) {
        if ($isNaN(number) || number === 0) {
          return number;
        }
        return number < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/gopd/gOPD.js
  var require_gOPD = __commonJS({
    "node_modules/gopd/gOPD.js"(exports, module) {
      "use strict";
      module.exports = Object.getOwnPropertyDescriptor;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports, module) {
      "use strict";
      var $gOPD = require_gOPD();
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports, module) {
      "use strict";
      var $defineProperty = Object.defineProperty || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module.exports = $defineProperty;
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = /* @__PURE__ */ Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (var _ in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = (
            /** @type {PropertyDescriptor} */
            Object.getOwnPropertyDescriptor(obj, sym)
          );
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/get-proto/Reflect.getPrototypeOf.js
  var require_Reflect_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
      "use strict";
      module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
    }
  });

  // node_modules/get-proto/Object.getPrototypeOf.js
  var require_Object_getPrototypeOf = __commonJS({
    "node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
      "use strict";
      var $Object = require_es_object_atoms();
      module.exports = $Object.getPrototypeOf || null;
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation2 = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var toStr = Object.prototype.toString;
      var max = Math.max;
      var funcType = "[object Function]";
      var concatty = function concatty2(a, b) {
        var arr = [];
        for (var i = 0; i < a.length; i += 1) {
          arr[i] = a[i];
        }
        for (var j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j];
        }
        return arr;
      };
      var slicy = function slicy2(arrLike, offset) {
        var arr = [];
        for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i];
        }
        return arr;
      };
      var joiny = function(arr, joiner) {
        var str = "";
        for (var i = 0; i < arr.length; i += 1) {
          str += arr[i];
          if (i + 1 < arr.length) {
            str += joiner;
          }
        }
        return str;
      };
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slicy(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              concatty(args, arguments)
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          }
          return target.apply(
            that,
            concatty(args, arguments)
          );
        };
        var boundLength = max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs[i] = "$" + i;
        }
        bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      var implementation = require_implementation2();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/call-bind-apply-helpers/functionCall.js
  var require_functionCall = __commonJS({
    "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
      "use strict";
      module.exports = Function.prototype.call;
    }
  });

  // node_modules/call-bind-apply-helpers/functionApply.js
  var require_functionApply = __commonJS({
    "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
      "use strict";
      module.exports = Function.prototype.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/reflectApply.js
  var require_reflectApply = __commonJS({
    "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
      "use strict";
      module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
    }
  });

  // node_modules/call-bind-apply-helpers/actualApply.js
  var require_actualApply = __commonJS({
    "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var $reflectApply = require_reflectApply();
      module.exports = $reflectApply || bind.call($call, $apply);
    }
  });

  // node_modules/call-bind-apply-helpers/index.js
  var require_call_bind_apply_helpers = __commonJS({
    "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $TypeError = require_type();
      var $call = require_functionCall();
      var $actualApply = require_actualApply();
      module.exports = function callBindBasic(args) {
        if (args.length < 1 || typeof args[0] !== "function") {
          throw new $TypeError("a function is required");
        }
        return $actualApply(bind, $call, args);
      };
    }
  });

  // node_modules/dunder-proto/get.js
  var require_get = __commonJS({
    "node_modules/dunder-proto/get.js"(exports, module) {
      "use strict";
      var callBind = require_call_bind_apply_helpers();
      var gOPD = require_gopd();
      var hasProtoAccessor;
      try {
        hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
        [].__proto__ === Array.prototype;
      } catch (e) {
        if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
          throw e;
        }
      }
      var desc = !!hasProtoAccessor && gOPD && gOPD(
        Object.prototype,
        /** @type {keyof typeof Object.prototype} */
        "__proto__"
      );
      var $Object = Object;
      var $getPrototypeOf = $Object.getPrototypeOf;
      module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
        /** @type {import('./get')} */
        function getDunder(value) {
          return $getPrototypeOf(value == null ? value : $Object(value));
        }
      ) : false;
    }
  });

  // node_modules/get-proto/index.js
  var require_get_proto = __commonJS({
    "node_modules/get-proto/index.js"(exports, module) {
      "use strict";
      var reflectGetProto = require_Reflect_getPrototypeOf();
      var originalGetProto = require_Object_getPrototypeOf();
      var getDunderProto = require_get();
      module.exports = reflectGetProto ? function getProto(O) {
        return reflectGetProto(O);
      } : originalGetProto ? function getProto(O) {
        if (!O || typeof O !== "object" && typeof O !== "function") {
          throw new TypeError("getProto: not an object");
        }
        return originalGetProto(O);
      } : getDunderProto ? function getProto(O) {
        return getDunderProto(O);
      } : null;
    }
  });

  // node_modules/hasown/index.js
  var require_hasown = __commonJS({
    "node_modules/hasown/index.js"(exports, module) {
      "use strict";
      var call = Function.prototype.call;
      var $hasOwn = Object.prototype.hasOwnProperty;
      var bind = require_function_bind();
      module.exports = bind.call(call, $hasOwn);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      var undefined2;
      var $Object = require_es_object_atoms();
      var $Error = require_es_errors();
      var $EvalError = require_eval();
      var $RangeError = require_range();
      var $ReferenceError = require_ref();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var $URIError = require_uri();
      var abs = require_abs();
      var floor = require_floor();
      var max = require_max();
      var min = require_min();
      var pow3 = require_pow();
      var round = require_round();
      var sign = require_sign();
      var $Function = Function;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = require_gopd();
      var $defineProperty = require_es_define_property();
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? (function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      })() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = require_get_proto();
      var $ObjectGPO = require_Object_getPrototypeOf();
      var $ReflectGPO = require_Reflect_getPrototypeOf();
      var $apply = require_functionApply();
      var $call = require_functionCall();
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        __proto__: null,
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": $Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": $EvalError,
        "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": $Object,
        "%Object.getOwnPropertyDescriptor%": $gOPD,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": $RangeError,
        "%ReferenceError%": $ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": $URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
        "%Function.prototype.call%": $call,
        "%Function.prototype.apply%": $apply,
        "%Object.defineProperty%": $defineProperty,
        "%Object.getPrototypeOf%": $ObjectGPO,
        "%Math.abs%": abs,
        "%Math.floor%": floor,
        "%Math.max%": max,
        "%Math.min%": min,
        "%Math.pow%": pow3,
        "%Math.round%": round,
        "%Math.sign%": sign,
        "%Reflect.getPrototypeOf%": $ReflectGPO
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        __proto__: null,
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_hasown();
      var $concat = bind.call($call, Array.prototype.concat);
      var $spliceApply = bind.call($apply, Array.prototype.splice);
      var $replace = bind.call($call, String.prototype.replace);
      var $strSlice = bind.call($call, String.prototype.slice);
      var $exec = bind.call($call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void undefined2;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/define-data-property/index.js
  var require_define_data_property = __commonJS({
    "node_modules/define-data-property/index.js"(exports, module) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var $SyntaxError = require_syntax();
      var $TypeError = require_type();
      var gopd = require_gopd();
      module.exports = function defineDataProperty(obj, property, value) {
        if (!obj || typeof obj !== "object" && typeof obj !== "function") {
          throw new $TypeError("`obj` must be an object or a function`");
        }
        if (typeof property !== "string" && typeof property !== "symbol") {
          throw new $TypeError("`property` must be a string or a symbol`");
        }
        if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
          throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
          throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
          throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
        }
        if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
          throw new $TypeError("`loose`, if provided, must be a boolean");
        }
        var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
        var nonWritable = arguments.length > 4 ? arguments[4] : null;
        var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
        var loose = arguments.length > 6 ? arguments[6] : false;
        var desc = !!gopd && gopd(obj, property);
        if ($defineProperty) {
          $defineProperty(obj, property, {
            configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
            enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
            value,
            writable: nonWritable === null && desc ? desc.writable : !nonWritable
          });
        } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
          obj[property] = value;
        } else {
          throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
        }
      };
    }
  });

  // node_modules/has-property-descriptors/index.js
  var require_has_property_descriptors = __commonJS({
    "node_modules/has-property-descriptors/index.js"(exports, module) {
      "use strict";
      var $defineProperty = require_es_define_property();
      var hasPropertyDescriptors = function hasPropertyDescriptors2() {
        return !!$defineProperty;
      };
      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
        if (!$defineProperty) {
          return null;
        }
        try {
          return $defineProperty([], "length", { value: 1 }).length !== 1;
        } catch (e) {
          return true;
        }
      };
      module.exports = hasPropertyDescriptors;
    }
  });

  // node_modules/set-function-length/index.js
  var require_set_function_length = __commonJS({
    "node_modules/set-function-length/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var define2 = require_define_data_property();
      var hasDescriptors = require_has_property_descriptors()();
      var gOPD = require_gopd();
      var $TypeError = require_type();
      var $floor = GetIntrinsic("%Math.floor%");
      module.exports = function setFunctionLength(fn, length) {
        if (typeof fn !== "function") {
          throw new $TypeError("`fn` is not a function");
        }
        if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
          throw new $TypeError("`length` must be a positive 32-bit integer");
        }
        var loose = arguments.length > 2 && !!arguments[2];
        var functionLengthIsConfigurable = true;
        var functionLengthIsWritable = true;
        if ("length" in fn && gOPD) {
          var desc = gOPD(fn, "length");
          if (desc && !desc.configurable) {
            functionLengthIsConfigurable = false;
          }
          if (desc && !desc.writable) {
            functionLengthIsWritable = false;
          }
        }
        if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
          if (hasDescriptors) {
            define2(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length,
              true,
              true
            );
          } else {
            define2(
              /** @type {Parameters<define>[0]} */
              fn,
              "length",
              length
            );
          }
        }
        return fn;
      };
    }
  });

  // node_modules/call-bind-apply-helpers/applyBind.js
  var require_applyBind = __commonJS({
    "node_modules/call-bind-apply-helpers/applyBind.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var $apply = require_functionApply();
      var actualApply = require_actualApply();
      module.exports = function applyBind() {
        return actualApply(bind, $apply, arguments);
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      var setFunctionLength = require_set_function_length();
      var $defineProperty = require_es_define_property();
      var callBindBasic = require_call_bind_apply_helpers();
      var applyBind = require_applyBind();
      module.exports = function callBind(originalFunction) {
        var func = callBindBasic(arguments);
        var adjustedLength = originalFunction.length - (arguments.length - 1);
        return setFunctionLength(
          func,
          1 + (adjustedLength > 0 ? adjustedLength : 0),
          true
        );
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/call-bound/index.js
  var require_call_bound = __commonJS({
    "node_modules/call-bound/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBindBasic = require_call_bind_apply_helpers();
      var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = (
          /** @type {(this: unknown, ...args: unknown[]) => unknown} */
          GetIntrinsic(name, !!allowMissing)
        );
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBindBasic(
            /** @type {const} */
            [intrinsic]
          );
        }
        return intrinsic;
      };
    }
  });

  // node_modules/json-stable-stringify/index.js
  var require_json_stable_stringify = __commonJS({
    "node_modules/json-stable-stringify/index.js"(exports, module) {
      "use strict";
      var jsonStringify = (typeof JSON !== "undefined" ? JSON : require_jsonify()).stringify;
      var isArray = require_isarray();
      var objectKeys = require_object_keys();
      var callBind = require_call_bind();
      var callBound = require_call_bound();
      var $join = callBound("Array.prototype.join");
      var $indexOf = callBound("Array.prototype.indexOf");
      var $splice = callBound("Array.prototype.splice");
      var $sort = callBound("Array.prototype.sort");
      var strRepeat = function repeat(n, char) {
        var str = "";
        for (var i = 0; i < n; i += 1) {
          str += char;
        }
        return str;
      };
      var defaultReplacer = function(_parent, _key, value) {
        return value;
      };
      module.exports = function stableStringify(obj) {
        var opts = arguments.length > 1 ? arguments[1] : void 0;
        var space = opts && opts.space || "";
        if (typeof space === "number") {
          space = strRepeat(space, " ");
        }
        var cycles = !!opts && typeof opts.cycles === "boolean" && opts.cycles;
        var replacer = opts && opts.replacer ? callBind(opts.replacer) : defaultReplacer;
        if (opts && typeof opts.collapseEmpty !== "undefined" && typeof opts.collapseEmpty !== "boolean") {
          throw new TypeError("`collapseEmpty` must be a boolean, if provided");
        }
        var collapseEmpty = !!opts && opts.collapseEmpty;
        var cmpOpt = typeof opts === "function" ? opts : opts && opts.cmp;
        var cmp = cmpOpt && function(node) {
          var get = (
            /** @type {NonNullable<typeof cmpOpt>} */
            cmpOpt.length > 2 && /** @type {import('.').Getter['get']} */
            function get2(k) {
              return node[k];
            }
          );
          return function(a, b) {
            return (
              /** @type {NonNullable<typeof cmpOpt>} */
              cmpOpt(
                { key: a, value: node[a] },
                { key: b, value: node[b] },
                // @ts-expect-error TS doesn't understand the optimization used here
                get ? (
                  /** @type {import('.').Getter} */
                  { __proto__: null, get }
                ) : void 0
              )
            );
          };
        };
        var seen = [];
        return (
          /** @type {(parent: import('.').Node, key: string | number, node: unknown, level: number) => string | undefined} */
          (function stringify(parent, key, node, level) {
            var indent = space ? "\n" + strRepeat(level, space) : "";
            var colonSeparator = space ? ": " : ":";
            if (node && /** @type {{ toJSON?: unknown }} */
            node.toJSON && typeof /** @type {{ toJSON?: unknown }} */
            node.toJSON === "function") {
              node = /** @type {{ toJSON: Function }} */
              node.toJSON();
            }
            node = replacer(parent, key, node);
            if (node === void 0) {
              return;
            }
            if (typeof node !== "object" || node === null) {
              return jsonStringify(node);
            }
            var groupOutput = function(out2, brackets) {
              return collapseEmpty && out2.length === 0 ? brackets : (brackets === "[]" ? "[" : "{") + $join(out2, ",") + indent + (brackets === "[]" ? "]" : "}");
            };
            if (isArray(node)) {
              var out = [];
              for (var i = 0; i < node.length; i++) {
                var item = stringify(node, i, node[i], level + 1) || jsonStringify(null);
                out[out.length] = indent + space + item;
              }
              return groupOutput(out, "[]");
            }
            if ($indexOf(seen, node) !== -1) {
              if (cycles) {
                return jsonStringify("__cycle__");
              }
              throw new TypeError("Converting circular structure to JSON");
            } else {
              seen[seen.length] = /** @type {import('.').NonArrayNode} */
              node;
            }
            var keys = $sort(objectKeys(node), cmp && cmp(
              /** @type {import('.').NonArrayNode} */
              node
            ));
            var out = [];
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = stringify(
                /** @type {import('.').Node} */
                node,
                key,
                /** @type {import('.').NonArrayNode} */
                node[key],
                level + 1
              );
              if (!value) {
                continue;
              }
              var keyValue = jsonStringify(key) + colonSeparator + value;
              out[out.length] = indent + space + keyValue;
            }
            $splice(seen, $indexOf(seen, node), 1);
            return groupOutput(out, "{}");
          })({ "": obj }, "", obj, 0)
        );
      };
    }
  });

  // node_modules/@fastify/deepmerge/index.js
  var require_deepmerge = __commonJS({
    "node_modules/@fastify/deepmerge/index.js"(exports, module) {
      "use strict";
      var JSON_PROTO = Object.getPrototypeOf({});
      function defaultIsMergeableObjectFactory() {
        return function defaultIsMergeableObject(value) {
          return typeof value === "object" && value !== null && !(value instanceof RegExp) && !(value instanceof Date);
        };
      }
      function deepmergeConstructor(options) {
        function isNotPrototypeKey(value) {
          return value !== "constructor" && value !== "prototype" && value !== "__proto__";
        }
        function cloneArray(value) {
          let i = 0;
          const il = value.length;
          const result = new Array(il);
          for (i; i < il; ++i) {
            result[i] = clone(value[i]);
          }
          return result;
        }
        function cloneObject(target) {
          const result = {};
          if (cloneProtoObject && Object.getPrototypeOf(target) !== JSON_PROTO) {
            return cloneProtoObject(target);
          }
          const targetKeys = getKeys(target);
          let i, il, key;
          for (i = 0, il = targetKeys.length; i < il; ++i) {
            isNotPrototypeKey(key = targetKeys[i]) && (result[key] = clone(target[key]));
          }
          return result;
        }
        function concatArrays(target, source) {
          const tl = target.length;
          const sl = source.length;
          let i = 0;
          const result = new Array(tl + sl);
          for (i; i < tl; ++i) {
            result[i] = clone(target[i]);
          }
          for (i = 0; i < sl; ++i) {
            result[i + tl] = clone(source[i]);
          }
          return result;
        }
        const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
        function getSymbolsAndKeys(value) {
          const result = Object.keys(value);
          const keys = Object.getOwnPropertySymbols(value);
          for (let i = 0, il = keys.length; i < il; ++i) {
            propertyIsEnumerable.call(value, keys[i]) && result.push(keys[i]);
          }
          return result;
        }
        const getKeys = options?.symbols ? getSymbolsAndKeys : Object.keys;
        const cloneProtoObject = typeof options?.cloneProtoObject === "function" ? options.cloneProtoObject : void 0;
        const isMergeableObject = typeof options?.isMergeableObject === "function" ? options.isMergeableObject : defaultIsMergeableObjectFactory();
        const onlyDefinedProperties = options?.onlyDefinedProperties === true;
        function isPrimitive(value) {
          return typeof value !== "object" || value === null;
        }
        const mergeArray = options && typeof options.mergeArray === "function" ? options.mergeArray({ clone, deepmerge: _deepmerge, getKeys, isMergeableObject }) : concatArrays;
        function clone(entry) {
          return isMergeableObject(entry) ? Array.isArray(entry) ? cloneArray(entry) : cloneObject(entry) : entry;
        }
        function mergeObject(target, source) {
          const result = {};
          const targetKeys = getKeys(target);
          const sourceKeys = getKeys(source);
          let i, il, key;
          for (i = 0, il = targetKeys.length; i < il; ++i) {
            isNotPrototypeKey(key = targetKeys[i]) && sourceKeys.indexOf(key) === -1 && (result[key] = clone(target[key]));
          }
          for (i = 0, il = sourceKeys.length; i < il; ++i) {
            if (!isNotPrototypeKey(key = sourceKeys[i])) {
              continue;
            }
            if (key in target) {
              if (targetKeys.indexOf(key) !== -1) {
                if (cloneProtoObject && isMergeableObject(source[key]) && Object.getPrototypeOf(source[key]) !== JSON_PROTO) {
                  result[key] = cloneProtoObject(source[key]);
                } else {
                  result[key] = _deepmerge(target[key], source[key]);
                }
              }
            } else {
              if (onlyDefinedProperties && typeof source[key] === "undefined") {
                continue;
              }
              result[key] = clone(source[key]);
            }
          }
          return result;
        }
        function _deepmerge(target, source) {
          if (onlyDefinedProperties && typeof source === "undefined") {
            return clone(target);
          }
          const sourceIsArray = Array.isArray(source);
          const targetIsArray = Array.isArray(target);
          if (isPrimitive(source)) {
            return source;
          } else if (!isMergeableObject(target)) {
            return clone(source);
          } else if (sourceIsArray && targetIsArray) {
            return mergeArray(target, source);
          } else if (sourceIsArray !== targetIsArray) {
            return clone(source);
          } else {
            return mergeObject(target, source);
          }
        }
        function _deepmergeAll() {
          switch (arguments.length) {
            case 0:
              return {};
            case 1:
              return clone(arguments[0]);
            case 2:
              return _deepmerge(arguments[0], arguments[1]);
          }
          let result;
          for (let i = 0, il = arguments.length; i < il; ++i) {
            result = _deepmerge(result, arguments[i]);
          }
          return result;
        }
        return options?.all ? _deepmergeAll : _deepmerge;
      }
      module.exports = deepmergeConstructor;
      module.exports.default = deepmergeConstructor;
      module.exports.deepmerge = deepmergeConstructor;
      Object.defineProperty(module.exports, "isMergeableObject", {
        get: defaultIsMergeableObjectFactory
      });
    }
  });

  // node_modules/@toruslabs/http-helpers/dist/lib.cjs/index.js
  var require_lib3 = __commonJS({
    "node_modules/@toruslabs/http-helpers/dist/lib.cjs/index.js"(exports) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      var __create = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames2(from), i = 0, n = keys.length, key; i < n; i++) {
          key = keys[i];
          if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
            get: ((k) => from[k]).bind(null, key),
            enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
          });
        }
        return to;
      };
      var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps2(isNodeMode || !mod2 || !mod2.__esModule || !__hasOwnProp2.call(mod2, "default") ? __defProp2(target, "default", {
        value: mod2,
        enumerable: true
      }) : target, mod2));
      var _fastify_deepmerge = require_deepmerge();
      _fastify_deepmerge = __toESM(_fastify_deepmerge);
      var loglevel = require_loglevel();
      loglevel = __toESM(loglevel);
      var log = loglevel.default.getLogger("http-helpers");
      log.setLevel(loglevel.default.levels.INFO);
      var apiKey = "torus-default";
      var embedHost = "";
      var gatewayAuthHeader = "x-api-key";
      var gatewayEmbedHostHeader = "x-embed-host";
      var sentry = null;
      var tracingOrigins = [];
      var tracingPaths = [];
      function enableSentryTracing(_sentry, _tracingOrigins, _tracingPaths) {
        sentry = _sentry;
        tracingOrigins.push(..._tracingOrigins);
        tracingPaths.push(..._tracingPaths);
      }
      function setEmbedHost(embedHost_) {
        embedHost = embedHost_;
      }
      function clearEmbedHost() {
        embedHost = "";
      }
      function getEmbedHost() {
        return embedHost;
      }
      function setAPIKey(apiKey_) {
        apiKey = apiKey_;
      }
      function clearAPIKey() {
        apiKey = "torus-default";
      }
      function getAPIKey() {
        return apiKey;
      }
      function setLogLevel(level) {
        log.setLevel(level);
      }
      async function fetchAndTrace(url, init) {
        let _url = null;
        try {
          _url = new URL(url);
        } catch {
        }
        if (sentry && _url && (tracingOrigins.includes(_url.origin) || tracingPaths.includes(_url.pathname))) return await sentry.startSpan({
          name: url,
          op: "http.client"
        }, async () => {
          return await fetch(url, init);
        });
        return fetch(url, init);
      }
      var DEFAULT_JSON_CONTENT_TYPE = "application/json; charset=utf-8";
      function withoutDefaultJsonContentType(headers) {
        if (headers instanceof Headers) {
          if (headers.get("content-type") !== DEFAULT_JSON_CONTENT_TYPE) return headers;
          const next = new Headers(headers);
          next.delete("content-type");
          return next;
        }
        if (!isPlainObject(headers)) return headers;
        if (headers["Content-Type"] !== DEFAULT_JSON_CONTENT_TYPE) return headers;
        return Object.fromEntries(Object.entries(headers).filter(([key]) => key !== "Content-Type"));
      }
      function isPlainObject(value) {
        if (value === null || typeof value !== "object") return false;
        const proto = Object.getPrototypeOf(value);
        return proto === Object.prototype || proto === null;
      }
      var merge = (0, _fastify_deepmerge.default)({ isMergeableObject: isPlainObject });
      function combineHeaders(defaults, caller) {
        if (isPlainObject(caller) && isPlainObject(defaults)) return merge(defaults, caller);
        const combined = new Headers(defaults);
        new Headers(caller).forEach((value, key) => {
          combined.set(key, value);
        });
        return combined;
      }
      function mergeRequestInit(defaults, options) {
        const { headers: callerHeaders, ...callerWithoutHeaders } = options;
        const merged = merge(defaults, callerWithoutHeaders);
        if (!Object.hasOwn(options, "headers")) return merged;
        merged.headers = callerHeaders === void 0 ? void 0 : combineHeaders(defaults.headers ?? {}, callerHeaders);
        return merged;
      }
      function getApiKeyHeaders() {
        const headers = {};
        if (apiKey) headers[gatewayAuthHeader] = apiKey;
        if (embedHost) headers[gatewayEmbedHostHeader] = embedHost;
        return headers;
      }
      function debugLogResponse(response) {
        log.info(`Response: ${response.status} ${response.statusText}`);
        log.info(`Url: ${response.url}`);
      }
      function logTracingHeader(response) {
        const tracingHeader = response.headers.get("x-web3-correlation-id");
        if (tracingHeader) log.info(`Request tracing with traceID = ${tracingHeader}`);
      }
      var promiseTimeout = async (ms, promise) => {
        let timeoutFunc = null;
        try {
          const timeout = new Promise((_resolve, reject) => {
            timeoutFunc = setTimeout(() => {
              reject(/* @__PURE__ */ new Error(`Timed out in ${ms}ms`));
            }, ms);
          });
          const result = await Promise.race([promise, timeout]);
          if (timeoutFunc != null) clearTimeout(timeoutFunc);
          return result;
        } catch (err) {
          if (timeoutFunc != null) clearTimeout(timeoutFunc);
          throw err;
        }
      };
      var get = async (url, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: {}
        };
        if (customOptions.useAPIKey) defaultOptions.headers = {
          ...defaultOptions.headers,
          ...getApiKeyHeaders()
        };
        options_.method = "GET";
        const response = await fetchAndTrace(url, mergeRequestInit(defaultOptions, options_));
        if (response.ok) {
          if (response.headers.get("content-type")?.includes("application/json")) return response.json();
          return response.text();
        }
        debugLogResponse(response);
        throw response;
      };
      var post = (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: { "Content-Type": DEFAULT_JSON_CONTENT_TYPE }
        };
        if (customOptions.useAPIKey) defaultOptions.headers = {
          ...defaultOptions.headers,
          ...getApiKeyHeaders()
        };
        options_.method = "POST";
        const options = mergeRequestInit(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          options.headers = withoutDefaultJsonContentType(options.headers);
        } else options.body = JSON.stringify(data);
        return promiseTimeout(customOptions.timeout || 6e4, fetchAndTrace(url, options).then((response) => {
          if (customOptions.logTracingHeader) logTracingHeader(response);
          if (response.ok) {
            if (response.headers.get("content-type")?.includes("application/json")) return response.json();
            return response.text();
          }
          debugLogResponse(response);
          throw response;
        }));
      };
      var patch = async (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: { "Content-Type": DEFAULT_JSON_CONTENT_TYPE }
        };
        if (customOptions.useAPIKey) defaultOptions.headers = {
          ...defaultOptions.headers,
          ...getApiKeyHeaders()
        };
        options_.method = "PATCH";
        const options = mergeRequestInit(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          options.headers = withoutDefaultJsonContentType(options.headers);
        } else options.body = JSON.stringify(data);
        const response = await fetchAndTrace(url, options);
        if (response.ok) {
          if (response.headers.get("content-type")?.includes("application/json")) return response.json();
          return response.text();
        }
        debugLogResponse(response);
        throw response;
      };
      var put = async (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: { "Content-Type": DEFAULT_JSON_CONTENT_TYPE }
        };
        if (customOptions.useAPIKey) defaultOptions.headers = {
          ...defaultOptions.headers,
          ...getApiKeyHeaders()
        };
        options_.method = "PUT";
        const options = mergeRequestInit(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          options.headers = withoutDefaultJsonContentType(options.headers);
        } else options.body = JSON.stringify(data);
        const response = await fetchAndTrace(url, options);
        if (response.ok) {
          if (response.headers.get("content-type")?.includes("application/json")) return response.json();
          return response.text();
        }
        debugLogResponse(response);
        throw response;
      };
      var remove = async (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: { "Content-Type": DEFAULT_JSON_CONTENT_TYPE }
        };
        if (customOptions.useAPIKey) defaultOptions.headers = {
          ...defaultOptions.headers,
          ...getApiKeyHeaders()
        };
        options_.method = "DELETE";
        const options = mergeRequestInit(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          options.headers = withoutDefaultJsonContentType(options.headers);
        } else options.body = JSON.stringify(data);
        const response = await fetchAndTrace(url, options);
        if (response.ok) {
          if (response.headers.get("content-type")?.includes("application/json")) return response.json();
          return response.text();
        }
        debugLogResponse(response);
        throw response;
      };
      var generateJsonRPCObject = (method, parameters) => ({
        jsonrpc: "2.0",
        method,
        id: 10,
        params: parameters
      });
      var promiseRace = (url, options, timeout = 6e4) => Promise.race([get(url, options), new Promise((_resolve, reject) => {
        setTimeout(() => {
          reject(/* @__PURE__ */ new Error("timed out"));
        }, timeout);
      })]);
      exports.clearAPIKey = clearAPIKey;
      exports.clearEmbedHost = clearEmbedHost;
      exports.enableSentryTracing = enableSentryTracing;
      exports.gatewayAuthHeader = gatewayAuthHeader;
      exports.gatewayEmbedHostHeader = gatewayEmbedHostHeader;
      exports.generateJsonRPCObject = generateJsonRPCObject;
      exports.get = get;
      exports.getAPIKey = getAPIKey;
      exports.getEmbedHost = getEmbedHost;
      exports.patch = patch;
      exports.post = post;
      exports.promiseRace = promiseRace;
      exports.promiseTimeout = promiseTimeout;
      exports.put = put;
      exports.remove = remove;
      exports.setAPIKey = setAPIKey;
      exports.setEmbedHost = setEmbedHost;
      exports.setLogLevel = setLogLevel;
    }
  });

  // node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/index.js
  var require_lib4 = __commonJS({
    "node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/index.js"(exports) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      var __create = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames2(from), i = 0, n = keys.length, key; i < n; i++) {
          key = keys[i];
          if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
            get: ((k) => from[k]).bind(null, key),
            enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
          });
        }
        return to;
      };
      var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps2(isNodeMode || !mod2 || !mod2.__esModule || !__hasOwnProp2.call(mod2, "default") ? __defProp2(target, "default", {
        value: mod2,
        enumerable: true
      }) : target, mod2));
      var _scure_base = (init_base(), __toCommonJS(base_exports));
      var _noble_hashes_sha3_js = (init_sha3(), __toCommonJS(sha3_exports));
      var _noble_curves_abstract_modular_js = (init_modular(), __toCommonJS(modular_exports));
      var _noble_curves_ed25519_js = (init_ed25519(), __toCommonJS(ed25519_exports));
      var _noble_curves_secp256k1_js = (init_secp256k1(), __toCommonJS(secp256k1_exports));
      var _noble_curves_utils_js = (init_utils2(), __toCommonJS(utils_exports));
      var _noble_hashes_sha2_js = (init_sha2(), __toCommonJS(sha2_exports));
      var json_stable_stringify = require_json_stable_stringify();
      json_stable_stringify = __toESM(json_stable_stringify);
      var _toruslabs_http_helpers = require_lib3();
      var _toruslabs_eccrypto = require_lib2();
      function assert(value, message = "Assertion failed.") {
        if (!value) {
          if (message instanceof Error) throw message;
          throw new Error(message);
        }
      }
      var HEX_REGEX = /^(?:0x)?[0-9a-f]+$/iu;
      var STRICT_HEX_REGEX = /^0x[0-9a-f]+$/iu;
      var HEX_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/u;
      var HEX_CHECKSUM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/u;
      var isString = (value) => typeof value === "string";
      function isHexString(value) {
        return isString(value) && HEX_REGEX.test(value);
      }
      function isStrictHexString(value) {
        return isString(value) && STRICT_HEX_REGEX.test(value);
      }
      function isHexAddress(value) {
        return isString(value) && HEX_ADDRESS_REGEX.test(value);
      }
      function isHexChecksumAddress(value) {
        return isString(value) && HEX_CHECKSUM_ADDRESS_REGEX.test(value);
      }
      function assertIsHexString(value) {
        assert(isHexString(value), "Value must be a hexadecimal string.");
      }
      function assertIsStrictHexString(value) {
        assert(isStrictHexString(value), 'Value must be a hexadecimal string, starting with "0x".');
      }
      function getChecksumAddress(hexAddress) {
        assert(isHexChecksumAddress(hexAddress), "Invalid hex address.");
        const address = remove0x(hexAddress).toLowerCase();
        const hashBytes = (0, _noble_hashes_sha3_js.keccak_256)(new TextEncoder().encode(address));
        const { length } = address;
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
          const byteIndex = i >> 1;
          const nibbleIndex = i & 1;
          const byte = hashBytes[byteIndex];
          const nibble = nibbleIndex === 0 ? byte >> 4 : byte & 15;
          result[i] = nibble >= 8 ? address[i].toUpperCase() : address[i];
        }
        return `0x${result.join("")}`;
      }
      function isValidChecksumAddress(possibleChecksum) {
        if (!isHexChecksumAddress(possibleChecksum)) return false;
        return getChecksumAddress(possibleChecksum) === possibleChecksum;
      }
      function isValidHexAddress(possibleAddress) {
        return isHexAddress(possibleAddress) || isValidChecksumAddress(possibleAddress);
      }
      function add0x(hexadecimal) {
        if (hexadecimal.startsWith("0x")) return hexadecimal;
        if (hexadecimal.startsWith("0X")) return `0x${hexadecimal.substring(2)}`;
        return `0x${hexadecimal}`;
      }
      function remove0x(hexadecimal) {
        if (hexadecimal.startsWith("0x") || hexadecimal.startsWith("0X")) return hexadecimal.substring(2);
        return hexadecimal;
      }
      var HEX_MINIMUM_NUMBER_CHARACTER = 48;
      var HEX_MAXIMUM_NUMBER_CHARACTER = 58;
      var HEX_CHARACTER_OFFSET = 87;
      function getPrecomputedHexValuesBuilder() {
        const lookupTable = [];
        return () => {
          if (lookupTable.length === 0) for (let i = 0; i < 256; i++) lookupTable.push(i.toString(16).padStart(2, "0"));
          return lookupTable;
        };
      }
      var getPrecomputedHexValues = getPrecomputedHexValuesBuilder();
      function isBytes4(value) {
        return value instanceof Uint8Array;
      }
      function assertIsBytes(value) {
        assert(isBytes4(value), "Value must be a Uint8Array.");
      }
      function bytesToHexPrefixedString(bytes) {
        assertIsBytes(bytes);
        if (bytes.length === 0) return "0x";
        const lookupTable = getPrecomputedHexValues();
        const hexadecimal = new Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) hexadecimal[i] = lookupTable[bytes[i]];
        return add0x(hexadecimal.join(""));
      }
      function bytesToBigInt(bytes) {
        assertIsBytes(bytes);
        const hexadecimal = bytesToHexPrefixedString(bytes);
        return BigInt(hexadecimal);
      }
      function bytesToSignedBigInt(bytes) {
        assertIsBytes(bytes);
        let value = BigInt(0);
        for (const byte of bytes) value = (value << BigInt(8)) + BigInt(byte);
        return BigInt.asIntN(bytes.length * 8, value);
      }
      function bytesToNumber(bytes) {
        assertIsBytes(bytes);
        const bigint = bytesToBigInt(bytes);
        assert(bigint <= BigInt(Number.MAX_SAFE_INTEGER), "Number is not a safe integer. Use `bytesToBigInt` instead.");
        return Number(bigint);
      }
      function bytesToUtf8(bytes) {
        return new TextDecoder().decode(bytes);
      }
      function utf8ToBytes2(value) {
        return new TextEncoder().encode(value);
      }
      function bytesToBase64(bytes) {
        assertIsBytes(bytes);
        return _scure_base.base64.encode(bytes);
      }
      function hexToBytes3(value) {
        if (value?.toLowerCase?.() === "0x") return /* @__PURE__ */ new Uint8Array();
        assertIsHexString(value);
        const strippedValue = remove0x(value).toLowerCase();
        const normalizedValue = strippedValue.length % 2 === 0 ? strippedValue : `0${strippedValue}`;
        const bytes = new Uint8Array(normalizedValue.length / 2);
        for (let i = 0; i < bytes.length; i++) {
          const c1 = normalizedValue.charCodeAt(i * 2);
          const c2 = normalizedValue.charCodeAt(i * 2 + 1);
          const n1 = c1 - (c1 < HEX_MAXIMUM_NUMBER_CHARACTER ? HEX_MINIMUM_NUMBER_CHARACTER : HEX_CHARACTER_OFFSET);
          const n2 = c2 - (c2 < HEX_MAXIMUM_NUMBER_CHARACTER ? HEX_MINIMUM_NUMBER_CHARACTER : HEX_CHARACTER_OFFSET);
          bytes[i] = n1 * 16 + n2;
        }
        return bytes;
      }
      function bigIntToBytes(value) {
        assert(typeof value === "bigint", "Value must be a bigint.");
        assert(value >= BigInt(0), "Value must be a non-negative bigint.");
        return hexToBytes3(value.toString(16));
      }
      function bigIntFits(value, bytes) {
        assert(bytes > 0);
        const mask = value >> BigInt(31);
        return !((~value & mask) + (value & ~mask) >> BigInt(bytes * 8 + -1));
      }
      function signedBigIntToBytes(value, byteLength) {
        assert(typeof value === "bigint", "Value must be a bigint.");
        assert(typeof byteLength === "number", "Byte length must be a number.");
        assert(byteLength > 0, "Byte length must be greater than 0.");
        assert(bigIntFits(value, byteLength), "Byte length is too small to represent the given value.");
        let numberValue = value;
        const bytes = new Uint8Array(byteLength);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = Number(BigInt.asUintN(8, numberValue));
          numberValue >>= BigInt(8);
        }
        return bytes.reverse();
      }
      function numberToBytes(value) {
        assert(typeof value === "number", "Value must be a number.");
        assert(value >= 0, "Value must be a non-negative number.");
        assert(Number.isSafeInteger(value), "Value is not a safe integer. Use `bigIntToBytes` instead.");
        return hexToBytes3(value.toString(16));
      }
      function base64ToBytes(value) {
        assert(typeof value === "string", "Value must be a string.");
        const segmentLength = 4;
        const diff = value.length % segmentLength;
        const normalized = (diff ? value + "=".repeat(segmentLength - diff) : value).replace(/-/g, "+").replace(/_/g, "/");
        return _scure_base.base64.decode(normalized);
      }
      function valueToBytes(value) {
        if (typeof value === "bigint") return bigIntToBytes(value);
        if (typeof value === "number") return numberToBytes(value);
        if (typeof value === "string") {
          if (value.startsWith("0x")) return hexToBytes3(value);
          return utf8ToBytes2(value);
        }
        if (isBytes4(value)) return value;
        throw new TypeError(`Unsupported value type: "${typeof value}".`);
      }
      function concatBytes3(values) {
        const normalizedValues = new Array(values.length);
        let byteLength = 0;
        for (let i = 0; i < values.length; i++) {
          const value = valueToBytes(values[i]);
          normalizedValues[i] = value;
          byteLength += value.length;
        }
        const bytes = new Uint8Array(byteLength);
        for (let i = 0, offset = 0; i < normalizedValues.length; i++) {
          bytes.set(normalizedValues[i], offset);
          offset += normalizedValues[i].length;
        }
        return bytes;
      }
      function areUint8ArraysEqual(a, b) {
        let diff = a.byteLength ^ b.byteLength;
        const len = Math.max(a.byteLength, b.byteLength);
        for (let i = 0; i < len; i++) {
          const aByte = a[i] ?? 0;
          const bByte = b[i] ?? 0;
          diff |= aByte ^ bByte;
        }
        return diff === 0;
      }
      function padString(input) {
        const segmentLength = 4;
        const diff = input.length % segmentLength;
        if (!diff) return input;
        return input + "=".repeat(segmentLength - diff);
      }
      function encodeBase64Url(input) {
        return fromBase64(bytesToBase64(typeof input === "string" ? utf8ToBytes2(input) : input));
      }
      function decodeBase64Url(base64url2) {
        return bytesToUtf8(base64ToBytes(toBase64(base64url2)));
      }
      function toBase64(base64url2) {
        return padString(base64url2 instanceof Uint8Array ? bytesToUtf8(base64url2) : base64url2).replace(/-/g, "+").replace(/_/g, "/");
      }
      function fromBase64(base642) {
        return base642.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      function toBufferLike(base64url2) {
        return base64ToBytes(toBase64(base64url2));
      }
      var numberToHexPrefixedString = (value, options) => {
        assert(typeof value === "number", "Value must be a number.");
        assert(value >= 0, "Value must be a non-negative number.");
        assert(Number.isSafeInteger(value), "Value is not a safe integer. Use `bigIntToHex` instead.");
        let hex2 = value.toString(16);
        if (hex2.length % 2 !== 0) hex2 = "0" + hex2;
        return options?.prefixed === false ? hex2 : add0x(hex2);
      };
      var bigIntToHexPrefixedString = (value, options) => {
        assert(typeof value === "bigint", "Value must be a bigint.");
        assert(value >= 0, "Value must be a non-negative bigint.");
        let hex2 = value.toString(16);
        if (hex2.length % 2 !== 0) hex2 = "0" + hex2;
        return options?.prefixed === false ? hex2 : add0x(hex2);
      };
      var bigintToHex = (value, length = 64, options) => {
        let hex2 = value.toString(16).padStart(length, "0");
        if (hex2.length % 2 !== 0) hex2 = "0" + hex2;
        return options?.prefixed ? add0x(hex2) : hex2;
      };
      var bigIntToHexPaddedString = bigintToHex;
      var hexToNumber2 = (value) => {
        assertIsHexString(value);
        const numberValue = parseInt(value, 16);
        assert(Number.isSafeInteger(numberValue), "Value is not a safe integer. Use `hexToBigInt` instead.");
        return numberValue;
      };
      var hexToBigInt = (value) => {
        assertIsHexString(value);
        return BigInt(add0x(value));
      };
      var toBigIntBE = (val) => {
        if (typeof val === "bigint") return val;
        const cleaned = val.replace(/^0x/, "");
        if (!cleaned) return 0n;
        return hexToBigInt(cleaned);
      };
      var getSecp256k1 = () => _noble_curves_secp256k1_js.secp256k1;
      var getEd25519 = () => _noble_curves_ed25519_js.ed25519;
      var getKeyCurve = (keyType) => {
        if (keyType === "secp256k1") return getSecp256k1();
        if (keyType === "ed25519") return getEd25519();
        throw new Error(`Invalid keyType: ${keyType}`);
      };
      function derivePubKey(ecCurve, sk) {
        return ecCurve.Point.BASE.multiply(sk).toAffine();
      }
      function generatePrivateKey(ecCurveOrKeyType) {
        return (typeof ecCurveOrKeyType === "string" ? getKeyCurve(ecCurveOrKeyType) : ecCurveOrKeyType).utils.randomSecretKey();
      }
      function keccak256(a, options) {
        const hash = (0, _noble_curves_utils_js.bytesToHex)((0, _noble_hashes_sha3_js.keccak_256)(a));
        return options?.prefixed === false ? hash : `0x${hash}`;
      }
      function keccak256Bytes(a) {
        return (0, _noble_hashes_sha3_js.keccak_256)(a);
      }
      function adjustScalarBytes2(bytes) {
        const first = bytes[0];
        const last = bytes[31];
        if (first === void 0 || last === void 0) throw new Error("X25519 scalar must be 32 bytes");
        bytes[0] = first & 248;
        bytes[31] = last & 127 | 64;
        return bytes;
      }
      function getEd25519ExtendedPublicKey(keyBytes) {
        const ed25519Curve = getKeyCurve("ed25519");
        const N = ed25519Curve.Point.CURVE().n;
        if (keyBytes.length !== 32) throw new Error("Invalid seed for ed25519 key derivation");
        const hashed = (0, _noble_hashes_sha2_js.sha512)(keyBytes);
        if (hashed.length !== 64) throw new Error("Invalid hash length for ed25519 seed");
        const head = (0, _noble_curves_utils_js.bytesToNumberLE)(adjustScalarBytes2(new Uint8Array(hashed.slice(0, 32))));
        const scalar = (0, _noble_curves_abstract_modular_js.mod)(head, N);
        return {
          scalar,
          point: derivePubKey(ed25519Curve, scalar)
        };
      }
      function encodeEd25519Point(point) {
        return getKeyCurve("ed25519").Point.fromAffine(point).toBytes();
      }
      var getSecpKeyFromEd25519 = (ed25519Scalar) => {
        const secp = getSecp256k1();
        const N = secp.Point.CURVE().n;
        const keyHash = (0, _noble_hashes_sha3_js.keccak_256)((0, _noble_curves_utils_js.numberToBytesBE)(ed25519Scalar, 32));
        const secpScalar = (0, _noble_curves_abstract_modular_js.mod)((0, _noble_curves_utils_js.bytesToNumberBE)(keyHash), N);
        return {
          scalar: secpScalar,
          point: derivePubKey(secp, secpScalar)
        };
      };
      function getSecp256k1PublicKeyFromAffinePoint(point) {
        return getSecp256k1().Point.fromAffine(point).toBytes(false).slice(1);
      }
      function generateAddressFromPoint(keyType, point) {
        if (keyType === "secp256k1") return getChecksumAddress(`0x${keccak256(getSecp256k1PublicKeyFromAffinePoint(point)).slice(26)}`);
        else if (keyType === "ed25519") {
          const publicKey = encodeEd25519Point(point);
          return _scure_base.base58.encode(publicKey);
        }
        throw new Error(`Invalid keyType: ${keyType}`);
      }
      function generateAddressFromPrivKey(keyType, privateKey) {
        return generateAddressFromPoint(keyType, derivePubKey(getKeyCurve(keyType), privateKey));
      }
      function generateAddressFromPubKey(keyType, publicKeyX, publicKeyY) {
        return generateAddressFromPoint(keyType, {
          x: publicKeyX,
          y: publicKeyY
        });
      }
      function getPostboxKeyFrom1OutOf1(ecCurve, privKey, nonce, options) {
        const privKeyBI = toBigIntBE(privKey);
        const nonceBI = toBigIntBE(nonce);
        const n = ecCurve.Point.CURVE().n;
        const result = (0, _noble_curves_abstract_modular_js.mod)(privKeyBI - nonceBI, n);
        return bigintToHex(result, 64, options);
      }
      var Point = class {
        x;
        y;
        keyType;
        constructor(x, y, keyType) {
          this.x = x;
          this.y = y;
          this.keyType = keyType;
        }
        encode(enc) {
          switch (enc) {
            case "arr":
              return (0, _noble_curves_utils_js.concatBytes)(hexToBytes3("04"), (0, _noble_curves_utils_js.numberToBytesBE)(this.x, 32), (0, _noble_curves_utils_js.numberToBytesBE)(this.y, 32));
            case "elliptic-compressed":
              if (this.keyType === "secp256k1") return getSecp256k1().Point.fromAffine({
                x: this.x,
                y: this.y
              }).toBytes();
              return _noble_curves_ed25519_js.ed25519.Point.fromAffine({
                x: this.x,
                y: this.y
              }).toBytes();
            default:
              throw new Error("encoding doesn't exist in Point");
          }
        }
      };
      var Share = class Share2 {
        share;
        shareIndex;
        constructor(shareIndex, share) {
          this.share = share;
          this.shareIndex = shareIndex;
        }
        static fromJSON(value) {
          const { share, shareIndex } = value;
          return new Share2(hexToBigInt(shareIndex), hexToBigInt(share));
        }
        toJSON() {
          return {
            share: bigintToHex(this.share),
            shareIndex: bigintToHex(this.shareIndex)
          };
        }
      };
      var Polynomial = class {
        polynomial;
        ecCurve;
        constructor(polynomial, ecCurve) {
          this.polynomial = polynomial;
          this.ecCurve = ecCurve;
        }
        getThreshold() {
          return this.polynomial.length;
        }
        polyEval(x) {
          const n = this.ecCurve.Point.CURVE().n;
          let xi = x;
          let sum = this.polynomial[0];
          for (let i = 1; i < this.polynomial.length; i += 1) {
            const tmp = xi * this.polynomial[i];
            sum = (0, _noble_curves_abstract_modular_js.mod)(sum + tmp, n);
            xi = (0, _noble_curves_abstract_modular_js.mod)(xi * x, n);
          }
          return sum;
        }
        generateShares(shareIndexes) {
          const shares = {};
          for (let x = 0; x < shareIndexes.length; x += 1) {
            const idx = shareIndexes[x];
            shares[bigintToHex(idx)] = new Share(idx, this.polyEval(idx));
          }
          return shares;
        }
      };
      function generatePrivateExcludingIndexes(shareIndexes, keyType) {
        const key = (0, _noble_curves_utils_js.bytesToNumberBE)(generatePrivateKey(keyType));
        if (shareIndexes.find((el) => el === key)) return generatePrivateExcludingIndexes(shareIndexes, keyType);
        return key;
      }
      var generateEmptyBigIntArray = (length) => Array.from({ length }, () => 0n);
      var denominator = (ecCurve, i, innerPoints) => {
        const n = ecCurve.Point.CURVE().n;
        let result = 1n;
        const xi = innerPoints[i].x;
        for (let j = innerPoints.length - 1; j >= 0; j -= 1) if (i !== j) {
          let tmp = xi - innerPoints[j].x;
          tmp = (0, _noble_curves_abstract_modular_js.mod)(tmp, n);
          result = (0, _noble_curves_abstract_modular_js.mod)(result * tmp, n);
        }
        return result;
      };
      var interpolationPoly = (ecCurve, i, innerPoints) => {
        const n = ecCurve.Point.CURVE().n;
        let coefficients = generateEmptyBigIntArray(innerPoints.length);
        const d = denominator(ecCurve, i, innerPoints);
        if (d === 0n) throw new Error("Denominator for interpolationPoly is 0");
        coefficients[0] = (0, _noble_curves_abstract_modular_js.invert)(d, n);
        for (let k = 0; k < innerPoints.length; k += 1) {
          const newCoefficients = generateEmptyBigIntArray(innerPoints.length);
          if (k !== i) {
            let j;
            if (k < i) j = k + 1;
            else j = k;
            j -= 1;
            for (; j >= 0; j -= 1) {
              newCoefficients[j + 1] = (0, _noble_curves_abstract_modular_js.mod)(newCoefficients[j + 1] + coefficients[j], n);
              const tmp = (0, _noble_curves_abstract_modular_js.mod)(innerPoints[k].x * coefficients[j], n);
              newCoefficients[j] = (0, _noble_curves_abstract_modular_js.mod)(newCoefficients[j] - tmp, n);
            }
            coefficients = newCoefficients;
          }
        }
        return coefficients;
      };
      var pointSort = (innerPoints) => {
        const pointArrClone = [...innerPoints];
        pointArrClone.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0);
        return pointArrClone;
      };
      var lagrange = (ecCurve, unsortedPoints) => {
        const n = ecCurve.Point.CURVE().n;
        const sortedPoints = pointSort(unsortedPoints);
        const polynomial = generateEmptyBigIntArray(sortedPoints.length);
        for (let i = 0; i < sortedPoints.length; i += 1) {
          const coefficients = interpolationPoly(ecCurve, i, sortedPoints);
          for (let k = 0; k < sortedPoints.length; k += 1) {
            const tmp = sortedPoints[i].y * coefficients[k];
            polynomial[k] = (0, _noble_curves_abstract_modular_js.mod)(polynomial[k] + tmp, n);
          }
        }
        return new Polynomial(polynomial, ecCurve);
      };
      function lagrangeInterpolatePolynomial(ecCurve, points) {
        return lagrange(ecCurve, points);
      }
      function lagrangeInterpolation(ecCurve, shares, nodeIndex) {
        if (shares.length !== nodeIndex.length) throw new Error("shares not equal to nodeIndex length in lagrangeInterpolation");
        const n = ecCurve.Point.CURVE().n;
        let secret = 0n;
        for (let i = 0; i < shares.length; i += 1) {
          let upper = 1n;
          let lower = 1n;
          for (let j = 0; j < shares.length; j += 1) if (i !== j) {
            upper = (0, _noble_curves_abstract_modular_js.mod)(upper * -nodeIndex[j], n);
            let temp = nodeIndex[i] - nodeIndex[j];
            temp = (0, _noble_curves_abstract_modular_js.mod)(temp, n);
            lower = (0, _noble_curves_abstract_modular_js.mod)(lower * temp, n);
          }
          let delta = (0, _noble_curves_abstract_modular_js.mod)(upper * (0, _noble_curves_abstract_modular_js.invert)(lower, n), n);
          delta = (0, _noble_curves_abstract_modular_js.mod)(delta * shares[i], n);
          secret = secret + delta;
        }
        return (0, _noble_curves_abstract_modular_js.mod)(secret, n);
      }
      function generateRandomPolynomial(ecCurve, keyType, degree, secret, deterministicShares) {
        const actualS = secret !== void 0 ? secret : generatePrivateExcludingIndexes([0n], keyType);
        if (!deterministicShares) {
          const poly2 = [actualS];
          for (let i = 0; i < degree; i += 1) {
            const share = generatePrivateExcludingIndexes(poly2, keyType);
            poly2.push(share);
          }
          return new Polynomial(poly2, ecCurve);
        }
        if (!Array.isArray(deterministicShares)) throw new Error("deterministic shares in generateRandomPolynomial should be an array");
        if (deterministicShares.length > degree) throw new Error("deterministicShares in generateRandomPolynomial should be less or equal than degree to ensure an element of randomness");
        const points = {};
        deterministicShares.forEach((share) => {
          points[bigintToHex(share.shareIndex)] = new Point(share.shareIndex, share.share, keyType);
        });
        for (let i = 0; i < degree - deterministicShares.length; i += 1) {
          let shareIndex = generatePrivateExcludingIndexes([0n], keyType);
          while (points[bigintToHex(shareIndex)] !== void 0) shareIndex = generatePrivateExcludingIndexes([0n], keyType);
          points[bigintToHex(shareIndex)] = new Point(shareIndex, (0, _noble_curves_utils_js.bytesToNumberBE)(generatePrivateKey(keyType)), keyType);
        }
        points["0"] = new Point(0n, actualS, keyType);
        return lagrangeInterpolatePolynomial(ecCurve, Object.values(points));
      }
      var thresholdSame = (arr, t) => {
        const hashMap = {};
        for (const value of arr) {
          const str = (0, json_stable_stringify.default)(value);
          if (str === void 0) continue;
          const count = (hashMap[str] ?? 0) + 1;
          hashMap[str] = count;
          if (count === t) return value;
        }
      };
      var kCombinations = (s, k) => {
        let set = s;
        if (typeof set === "number") set = Array.from({ length: set }, (_, i) => i);
        if (k > set.length || k <= 0) return [];
        if (k === set.length) return [set];
        if (k === 1) return set.reduce((acc, cur) => [...acc, [cur]], []);
        const combs = [];
        let tailCombs = [];
        for (let i = 0; i <= set.length - k + 1; i += 1) {
          tailCombs = kCombinations(set.slice(i + 1), k - 1);
          for (let j = 0; j < tailCombs.length; j += 1) combs.push([set[i], ...tailCombs[j]]);
        }
        return combs;
      };
      function calculateMedian(arr) {
        const arrSize = arr.length;
        if (arrSize === 0) return 0;
        const sortedArr = [...arr].sort((a, b) => a - b);
        if (arrSize % 2 !== 0) return sortedArr[Math.floor(arrSize / 2)];
        return (sortedArr[arrSize / 2 - 1] + sortedArr[arrSize / 2]) / 2;
      }
      function toEthereumSignature(recoveredSig) {
        const recovery = recoveredSig[0];
        if (recovery === void 0) throw new Error("Recovered signature must include a recovery id");
        const ethSig = /* @__PURE__ */ new Uint8Array(65);
        ethSig.set(recoveredSig.slice(1, 65), 0);
        ethSig[64] = recovery;
        return ethSig;
      }
      function getPublicKeyCoords(privateKeyBytes) {
        const pubKeyUncompressed = _noble_curves_secp256k1_js.secp256k1.getPublicKey(privateKeyBytes, false);
        return {
          x: pubKeyUncompressed.slice(1, 33),
          y: pubKeyUncompressed.slice(33, 65)
        };
      }
      function coordsToPublicKey(x, y) {
        const pubKey = /* @__PURE__ */ new Uint8Array(65);
        pubKey[0] = 4;
        pubKey.set(x, 1);
        pubKey.set(y, 33);
        return pubKey;
      }
      var MetadataStorageLayer = class {
        metadataHost;
        serverTimeOffset;
        constructor(metadataHost = "https://metadata.tor.us", serverTimeOffset = 0) {
          this.metadataHost = metadataHost;
          this.serverTimeOffset = serverTimeOffset;
        }
        static setAPIKey(apiKey) {
          (0, _toruslabs_http_helpers.setAPIKey)(apiKey);
        }
        static setEmbedHost(embedHost) {
          (0, _toruslabs_http_helpers.setEmbedHost)(embedHost);
        }
        generateMetadataParams(message, privateKeyBytes) {
          const { x, y } = getPublicKeyCoords(privateKeyBytes);
          const setData = {
            data: message,
            timestamp: Math.floor(this.serverTimeOffset + Date.now() / 1e3).toString(16)
          };
          const serialized = (0, json_stable_stringify.default)(setData);
          if (serialized === void 0) throw new Error("Failed to serialize metadata");
          const msgHash = (0, _noble_hashes_sha3_js.keccak_256)(utf8ToBytes2(serialized));
          return {
            pub_key_X: x,
            pub_key_Y: y,
            set_data: setData,
            signature: bytesToBase64(toEthereumSignature(_noble_curves_secp256k1_js.secp256k1.sign(msgHash, privateKeyBytes, {
              prehash: false,
              format: "recovered",
              lowS: false
            })))
          };
        }
        generatePubKeyParams(privateKeyBytes) {
          const { x, y } = getPublicKeyCoords(privateKeyBytes);
          return {
            pub_key_X: x,
            pub_key_Y: y
          };
        }
        async setMetadata(data, namespace, options) {
          const pubKeyHex = {
            pub_key_X: (0, _noble_curves_utils_js.bytesToHex)(data.pub_key_X),
            pub_key_Y: (0, _noble_curves_utils_js.bytesToHex)(data.pub_key_Y)
          };
          const params = namespace !== null ? {
            ...data,
            ...pubKeyHex,
            namespace
          } : {
            ...data,
            ...pubKeyHex
          };
          return (await (0, _toruslabs_http_helpers.post)(`${this.metadataHost}/set`, params, options, { useAPIKey: true })).message;
        }
        async getMetadata(pubKey, namespace, options) {
          const pubKeyHex = {
            pub_key_X: (0, _noble_curves_utils_js.bytesToHex)(pubKey.pub_key_X),
            pub_key_Y: (0, _noble_curves_utils_js.bytesToHex)(pubKey.pub_key_Y)
          };
          const params = namespace !== null ? {
            ...pubKeyHex,
            namespace
          } : pubKeyHex;
          return (await (0, _toruslabs_http_helpers.post)(`${this.metadataHost}/get`, params, options, { useAPIKey: true })).message;
        }
      };
      var WEBAUTHN_TORUS_SHARE = "webauthn_torus_share";
      var WEBAUTHN_DEVICE_SHARE = "webauthn_device_share";
      function encParamsHexToBuf(encParamsHex) {
        return {
          iv: hexToBytes3(encParamsHex.iv),
          ephemPublicKey: hexToBytes3(encParamsHex.ephemPublicKey),
          ciphertext: hexToBytes3(encParamsHex.ciphertext),
          mac: hexToBytes3(encParamsHex.mac)
        };
      }
      function encParamsBufToHex(encParams) {
        return {
          iv: (0, _noble_curves_utils_js.bytesToHex)(encParams.iv),
          ephemPublicKey: (0, _noble_curves_utils_js.bytesToHex)(encParams.ephemPublicKey),
          ciphertext: (0, _noble_curves_utils_js.bytesToHex)(encParams.ciphertext),
          mac: (0, _noble_curves_utils_js.bytesToHex)(encParams.mac)
        };
      }
      async function encryptData(privKeyBytes, d) {
        const serializedData = utf8ToBytes2(JSON.stringify(d));
        const encParamsHex = encParamsBufToHex(await (0, _toruslabs_eccrypto.encrypt)((0, _toruslabs_eccrypto.getPublic)(privKeyBytes), serializedData));
        return JSON.stringify(encParamsHex);
      }
      async function decryptData(privKeyBytes, d) {
        const encParams = encParamsHexToBuf(JSON.parse(d));
        const serializedBytes = await (0, _toruslabs_eccrypto.decrypt)(privKeyBytes, encParams);
        return JSON.parse(bytesToUtf8(serializedBytes));
      }
      async function getAndDecryptData(m, privKeyBytes, namespace) {
        const { x, y } = getPublicKeyCoords(privKeyBytes);
        const serializedData = await m.getMetadata({
          pub_key_X: x,
          pub_key_Y: y
        }, namespace);
        if (!serializedData) return null;
        return await decryptData(privKeyBytes, serializedData);
      }
      async function encryptAndSetData(m, privKeyBytes, d, namespace) {
        const sData = await encryptData(privKeyBytes, d);
        const metadataParams = m.generateMetadataParams(sData, privKeyBytes);
        await m.setMetadata(metadataParams, namespace);
      }
      async function setTorusShare(m, webAuthnPubKey, webAuthnRefBytes, subspace, subspaceData) {
        const pubKeyBytes = coordsToPublicKey(webAuthnPubKey.pub_key_X, webAuthnPubKey.pub_key_Y);
        const data = await getAndDecryptData(m, webAuthnRefBytes, WEBAUTHN_TORUS_SHARE);
        let d = {};
        if (data) d = data;
        const serializedSubspaceData = utf8ToBytes2(JSON.stringify(subspaceData));
        const encSubspaceDataHex = encParamsBufToHex(await (0, _toruslabs_eccrypto.encrypt)(pubKeyBytes, serializedSubspaceData));
        d[subspace] = encSubspaceDataHex;
        await encryptAndSetData(m, webAuthnRefBytes, d, WEBAUTHN_TORUS_SHARE);
      }
      async function setDeviceShare(m, webAuthnRefBytes, subspace, subspaceData) {
        const data = await getAndDecryptData(m, webAuthnRefBytes, WEBAUTHN_DEVICE_SHARE);
        let d = {};
        if (data) d = data;
        d[subspace] = subspaceData;
        await encryptAndSetData(m, webAuthnRefBytes, d, WEBAUTHN_DEVICE_SHARE);
      }
      async function getTorusShare(m, webAuthnKeyBytes, webAuthnRefBytes, subspace) {
        const data = await getAndDecryptData(m, webAuthnRefBytes, WEBAUTHN_TORUS_SHARE);
        if (!data) return null;
        const encParamsHex = data[subspace];
        if (!encParamsHex) return null;
        const encParams = encParamsHexToBuf(encParamsHex);
        const serializedBytes = await (0, _toruslabs_eccrypto.decrypt)(webAuthnKeyBytes, encParams);
        return JSON.parse(bytesToUtf8(serializedBytes));
      }
      async function getDeviceShare(m, webAuthnRefBytes, subspace) {
        const data = await getAndDecryptData(m, webAuthnRefBytes, WEBAUTHN_DEVICE_SHARE);
        if (!data) return null;
        const share = data[subspace];
        return share === void 0 ? null : share;
      }
      exports.MetadataStorageLayer = MetadataStorageLayer;
      exports.Point = Point;
      exports.Polynomial = Polynomial;
      exports.Share = Share;
      exports.add0x = add0x;
      exports.areUint8ArraysEqual = areUint8ArraysEqual;
      exports.assert = assert;
      exports.assertIsBytes = assertIsBytes;
      exports.assertIsHexString = assertIsHexString;
      exports.assertIsStrictHexString = assertIsStrictHexString;
      exports.base64ToBytes = base64ToBytes;
      exports.bigIntToBytes = bigIntToBytes;
      exports.bigIntToHexPaddedString = bigIntToHexPaddedString;
      exports.bigIntToHexPrefixedString = bigIntToHexPrefixedString;
      exports.bigintToHex = bigintToHex;
      exports.bytesToBase64 = bytesToBase64;
      exports.bytesToBigInt = bytesToBigInt;
      Object.defineProperty(exports, "bytesToHex", {
        enumerable: true,
        get: function() {
          return _noble_curves_utils_js.bytesToHex;
        }
      });
      exports.bytesToHexPrefixedString = bytesToHexPrefixedString;
      exports.bytesToNumber = bytesToNumber;
      Object.defineProperty(exports, "bytesToNumberBE", {
        enumerable: true,
        get: function() {
          return _noble_curves_utils_js.bytesToNumberBE;
        }
      });
      Object.defineProperty(exports, "bytesToNumberLE", {
        enumerable: true,
        get: function() {
          return _noble_curves_utils_js.bytesToNumberLE;
        }
      });
      exports.bytesToSignedBigInt = bytesToSignedBigInt;
      exports.bytesToUtf8 = bytesToUtf8;
      exports.calculateMedian = calculateMedian;
      exports.concatBytes = concatBytes3;
      exports.coordsToPublicKey = coordsToPublicKey;
      exports.decodeBase64Url = decodeBase64Url;
      exports.decryptData = decryptData;
      exports.derivePubKey = derivePubKey;
      exports.encParamsBufToHex = encParamsBufToHex;
      exports.encParamsHexToBuf = encParamsHexToBuf;
      exports.encodeBase64Url = encodeBase64Url;
      exports.encodeEd25519Point = encodeEd25519Point;
      exports.encryptAndSetData = encryptAndSetData;
      exports.encryptData = encryptData;
      exports.fromBase64 = fromBase64;
      exports.generateAddressFromPrivKey = generateAddressFromPrivKey;
      exports.generateAddressFromPubKey = generateAddressFromPubKey;
      exports.generatePrivateKey = generatePrivateKey;
      exports.generateRandomPolynomial = generateRandomPolynomial;
      exports.getAndDecryptData = getAndDecryptData;
      exports.getChecksumAddress = getChecksumAddress;
      exports.getDeviceShare = getDeviceShare;
      exports.getEd25519 = getEd25519;
      exports.getEd25519ExtendedPublicKey = getEd25519ExtendedPublicKey;
      exports.getKeyCurve = getKeyCurve;
      exports.getPostboxKeyFrom1OutOf1 = getPostboxKeyFrom1OutOf1;
      exports.getPublicKeyCoords = getPublicKeyCoords;
      exports.getSecp256k1 = getSecp256k1;
      exports.getSecp256k1PublicKeyFromAffinePoint = getSecp256k1PublicKeyFromAffinePoint;
      exports.getSecpKeyFromEd25519 = getSecpKeyFromEd25519;
      exports.getTorusShare = getTorusShare;
      exports.hexToBigInt = hexToBigInt;
      exports.hexToBytes = hexToBytes3;
      exports.hexToNumber = hexToNumber2;
      Object.defineProperty(exports, "invert", {
        enumerable: true,
        get: function() {
          return _noble_curves_abstract_modular_js.invert;
        }
      });
      exports.isBytes = isBytes4;
      exports.isHexAddress = isHexAddress;
      exports.isHexChecksumAddress = isHexChecksumAddress;
      exports.isHexString = isHexString;
      exports.isStrictHexString = isStrictHexString;
      exports.isValidChecksumAddress = isValidChecksumAddress;
      exports.isValidHexAddress = isValidHexAddress;
      exports.kCombinations = kCombinations;
      exports.keccak256 = keccak256;
      exports.keccak256Bytes = keccak256Bytes;
      Object.defineProperty(exports, "keccak_256", {
        enumerable: true,
        get: function() {
          return _noble_hashes_sha3_js.keccak_256;
        }
      });
      exports.lagrangeInterpolatePolynomial = lagrangeInterpolatePolynomial;
      exports.lagrangeInterpolation = lagrangeInterpolation;
      Object.defineProperty(exports, "mod", {
        enumerable: true,
        get: function() {
          return _noble_curves_abstract_modular_js.mod;
        }
      });
      exports.numberToBytes = numberToBytes;
      Object.defineProperty(exports, "numberToBytesBE", {
        enumerable: true,
        get: function() {
          return _noble_curves_utils_js.numberToBytesBE;
        }
      });
      exports.numberToHexPrefixedString = numberToHexPrefixedString;
      Object.defineProperty(exports, "numberToHexUnpadded", {
        enumerable: true,
        get: function() {
          return _noble_curves_utils_js.numberToHexUnpadded;
        }
      });
      exports.remove0x = remove0x;
      Object.defineProperty(exports, "secp256k1", {
        enumerable: true,
        get: function() {
          return _noble_curves_secp256k1_js.secp256k1;
        }
      });
      exports.setDeviceShare = setDeviceShare;
      exports.setTorusShare = setTorusShare;
      Object.defineProperty(exports, "sha512", {
        enumerable: true,
        get: function() {
          return _noble_hashes_sha2_js.sha512;
        }
      });
      exports.signedBigIntToBytes = signedBigIntToBytes;
      exports.thresholdSame = thresholdSame;
      exports.toBase64 = toBase64;
      exports.toBigIntBE = toBigIntBE;
      exports.toBufferLike = toBufferLike;
      exports.toEthereumSignature = toEthereumSignature;
      exports.utf8ToBytes = utf8ToBytes2;
      exports.valueToBytes = valueToBytes;
    }
  });

  // node_modules/engine.io-parser/build/cjs/commons.js
  var require_commons = __commonJS({
    "node_modules/engine.io-parser/build/cjs/commons.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ERROR_PACKET = exports.PACKET_TYPES_REVERSE = exports.PACKET_TYPES = void 0;
      var PACKET_TYPES = /* @__PURE__ */ Object.create(null);
      exports.PACKET_TYPES = PACKET_TYPES;
      PACKET_TYPES["open"] = "0";
      PACKET_TYPES["close"] = "1";
      PACKET_TYPES["ping"] = "2";
      PACKET_TYPES["pong"] = "3";
      PACKET_TYPES["message"] = "4";
      PACKET_TYPES["upgrade"] = "5";
      PACKET_TYPES["noop"] = "6";
      var PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
      exports.PACKET_TYPES_REVERSE = PACKET_TYPES_REVERSE;
      Object.keys(PACKET_TYPES).forEach((key) => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
      });
      var ERROR_PACKET = { type: "error", data: "parser error" };
      exports.ERROR_PACKET = ERROR_PACKET;
    }
  });

  // node_modules/engine.io-parser/build/cjs/encodePacket.browser.js
  var require_encodePacket_browser = __commonJS({
    "node_modules/engine.io-parser/build/cjs/encodePacket.browser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.encodePacket = void 0;
      exports.encodePacketToBinary = encodePacketToBinary;
      var commons_js_1 = require_commons();
      var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
      var withNativeArrayBuffer = typeof ArrayBuffer === "function";
      var isView = (obj) => {
        return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
      };
      var encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob && data instanceof Blob) {
          if (supportsBinary) {
            return callback(data);
          } else {
            return encodeBlobAsBase64(data, callback);
          }
        } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
          if (supportsBinary) {
            return callback(data);
          } else {
            return encodeBlobAsBase64(new Blob([data]), callback);
          }
        }
        return callback(commons_js_1.PACKET_TYPES[type] + (data || ""));
      };
      exports.encodePacket = encodePacket;
      var encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function() {
          const content = fileReader.result.split(",")[1];
          callback("b" + (content || ""));
        };
        return fileReader.readAsDataURL(data);
      };
      function toArray(data) {
        if (data instanceof Uint8Array) {
          return data;
        } else if (data instanceof ArrayBuffer) {
          return new Uint8Array(data);
        } else {
          return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        }
      }
      var TEXT_ENCODER;
      function encodePacketToBinary(packet, callback) {
        if (withNativeBlob && packet.data instanceof Blob) {
          return packet.data.arrayBuffer().then(toArray).then(callback);
        } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
          return callback(toArray(packet.data));
        }
        encodePacket(packet, false, (encoded) => {
          if (!TEXT_ENCODER) {
            TEXT_ENCODER = new TextEncoder();
          }
          callback(TEXT_ENCODER.encode(encoded));
        });
      }
    }
  });

  // node_modules/engine.io-parser/build/cjs/contrib/base64-arraybuffer.js
  var require_base64_arraybuffer = __commonJS({
    "node_modules/engine.io-parser/build/cjs/contrib/base64-arraybuffer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decode = exports.encode = void 0;
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
      for (let i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
      }
      var encode = (arraybuffer) => {
        let bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base642 = "";
        for (i = 0; i < len; i += 3) {
          base642 += chars[bytes[i] >> 2];
          base642 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
          base642 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
          base642 += chars[bytes[i + 2] & 63];
        }
        if (len % 3 === 2) {
          base642 = base642.substring(0, base642.length - 1) + "=";
        } else if (len % 3 === 1) {
          base642 = base642.substring(0, base642.length - 2) + "==";
        }
        return base642;
      };
      exports.encode = encode;
      var decode = (base642) => {
        let bufferLength = base642.length * 0.75, len = base642.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base642[base642.length - 1] === "=") {
          bufferLength--;
          if (base642[base642.length - 2] === "=") {
            bufferLength--;
          }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
          encoded1 = lookup[base642.charCodeAt(i)];
          encoded2 = lookup[base642.charCodeAt(i + 1)];
          encoded3 = lookup[base642.charCodeAt(i + 2)];
          encoded4 = lookup[base642.charCodeAt(i + 3)];
          bytes[p++] = encoded1 << 2 | encoded2 >> 4;
          bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
          bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return arraybuffer;
      };
      exports.decode = decode;
    }
  });

  // node_modules/engine.io-parser/build/cjs/decodePacket.browser.js
  var require_decodePacket_browser = __commonJS({
    "node_modules/engine.io-parser/build/cjs/decodePacket.browser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decodePacket = void 0;
      var commons_js_1 = require_commons();
      var base64_arraybuffer_js_1 = require_base64_arraybuffer();
      var withNativeArrayBuffer = typeof ArrayBuffer === "function";
      var decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
          return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
          };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
          return {
            type: "message",
            data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
          };
        }
        const packetType = commons_js_1.PACKET_TYPES_REVERSE[type];
        if (!packetType) {
          return commons_js_1.ERROR_PACKET;
        }
        return encodedPacket.length > 1 ? {
          type: commons_js_1.PACKET_TYPES_REVERSE[type],
          data: encodedPacket.substring(1)
        } : {
          type: commons_js_1.PACKET_TYPES_REVERSE[type]
        };
      };
      exports.decodePacket = decodePacket;
      var decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer) {
          const decoded = (0, base64_arraybuffer_js_1.decode)(data);
          return mapBinary(decoded, binaryType);
        } else {
          return { base64: true, data };
        }
      };
      var mapBinary = (data, binaryType) => {
        switch (binaryType) {
          case "blob":
            if (data instanceof Blob) {
              return data;
            } else {
              return new Blob([data]);
            }
          case "arraybuffer":
          default:
            if (data instanceof ArrayBuffer) {
              return data;
            } else {
              return data.buffer;
            }
        }
      };
    }
  });

  // node_modules/engine.io-parser/build/cjs/index.js
  var require_cjs = __commonJS({
    "node_modules/engine.io-parser/build/cjs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decodePayload = exports.decodePacket = exports.encodePayload = exports.encodePacket = exports.protocol = void 0;
      exports.createPacketEncoderStream = createPacketEncoderStream;
      exports.createPacketDecoderStream = createPacketDecoderStream;
      var encodePacket_js_1 = require_encodePacket_browser();
      Object.defineProperty(exports, "encodePacket", { enumerable: true, get: function() {
        return encodePacket_js_1.encodePacket;
      } });
      var decodePacket_js_1 = require_decodePacket_browser();
      Object.defineProperty(exports, "decodePacket", { enumerable: true, get: function() {
        return decodePacket_js_1.decodePacket;
      } });
      var commons_js_1 = require_commons();
      var SEPARATOR = String.fromCharCode(30);
      var encodePayload = (packets, callback) => {
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
          (0, encodePacket_js_1.encodePacket)(packet, false, (encodedPacket) => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
              callback(encodedPackets.join(SEPARATOR));
            }
          });
        });
      };
      exports.encodePayload = encodePayload;
      var decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
          const decodedPacket = (0, decodePacket_js_1.decodePacket)(encodedPackets[i], binaryType);
          packets.push(decodedPacket);
          if (decodedPacket.type === "error") {
            break;
          }
        }
        return packets;
      };
      exports.decodePayload = decodePayload;
      function createPacketEncoderStream() {
        return new TransformStream({
          transform(packet, controller) {
            (0, encodePacket_js_1.encodePacketToBinary)(packet, (encodedPacket) => {
              const payloadLength = encodedPacket.length;
              let header;
              if (payloadLength < 126) {
                header = new Uint8Array(1);
                new DataView(header.buffer).setUint8(0, payloadLength);
              } else if (payloadLength < 65536) {
                header = new Uint8Array(3);
                const view = new DataView(header.buffer);
                view.setUint8(0, 126);
                view.setUint16(1, payloadLength);
              } else {
                header = new Uint8Array(9);
                const view = new DataView(header.buffer);
                view.setUint8(0, 127);
                view.setBigUint64(1, BigInt(payloadLength));
              }
              if (packet.data && typeof packet.data !== "string") {
                header[0] |= 128;
              }
              controller.enqueue(header);
              controller.enqueue(encodedPacket);
            });
          }
        });
      }
      var TEXT_DECODER;
      function totalLength(chunks) {
        return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      }
      function concatChunks(chunks, size) {
        if (chunks[0].length === size) {
          return chunks.shift();
        }
        const buffer = new Uint8Array(size);
        let j = 0;
        for (let i = 0; i < size; i++) {
          buffer[i] = chunks[0][j++];
          if (j === chunks[0].length) {
            chunks.shift();
            j = 0;
          }
        }
        if (chunks.length && j < chunks[0].length) {
          chunks[0] = chunks[0].slice(j);
        }
        return buffer;
      }
      function createPacketDecoderStream(maxPayload, binaryType) {
        if (!TEXT_DECODER) {
          TEXT_DECODER = new TextDecoder();
        }
        const chunks = [];
        let state = 0;
        let expectedLength = -1;
        let isBinary = false;
        return new TransformStream({
          transform(chunk, controller) {
            chunks.push(chunk);
            while (true) {
              if (state === 0) {
                if (totalLength(chunks) < 1) {
                  break;
                }
                const header = concatChunks(chunks, 1);
                isBinary = (header[0] & 128) === 128;
                expectedLength = header[0] & 127;
                if (expectedLength < 126) {
                  state = 3;
                } else if (expectedLength === 126) {
                  state = 1;
                } else {
                  state = 2;
                }
              } else if (state === 1) {
                if (totalLength(chunks) < 2) {
                  break;
                }
                const headerArray = concatChunks(chunks, 2);
                expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
                state = 3;
              } else if (state === 2) {
                if (totalLength(chunks) < 8) {
                  break;
                }
                const headerArray = concatChunks(chunks, 8);
                const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
                const n = view.getUint32(0);
                if (n > Math.pow(2, 53 - 32) - 1) {
                  controller.enqueue(commons_js_1.ERROR_PACKET);
                  break;
                }
                expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
                state = 3;
              } else {
                if (totalLength(chunks) < expectedLength) {
                  break;
                }
                const data = concatChunks(chunks, expectedLength);
                controller.enqueue((0, decodePacket_js_1.decodePacket)(isBinary ? data : TEXT_DECODER.decode(data), binaryType));
                state = 0;
              }
              if (expectedLength === 0 || expectedLength > maxPayload) {
                controller.enqueue(commons_js_1.ERROR_PACKET);
                break;
              }
            }
          }
        });
      }
      exports.protocol = 4;
    }
  });

  // node_modules/@socket.io/component-emitter/lib/cjs/index.js
  var require_cjs2 = __commonJS({
    "node_modules/@socket.io/component-emitter/lib/cjs/index.js"(exports) {
      exports.Emitter = Emitter;
      function Emitter(obj) {
        if (obj) return mixin(obj);
      }
      function mixin(obj) {
        for (var key in Emitter.prototype) {
          obj[key] = Emitter.prototype[key];
        }
        return obj;
      }
      Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
        return this;
      };
      Emitter.prototype.once = function(event, fn) {
        function on() {
          this.off(event, on);
          fn.apply(this, arguments);
        }
        on.fn = fn;
        this.on(event, on);
        return this;
      };
      Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length) {
          this._callbacks = {};
          return this;
        }
        var callbacks = this._callbacks["$" + event];
        if (!callbacks) return this;
        if (1 == arguments.length) {
          delete this._callbacks["$" + event];
          return this;
        }
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
          cb = callbacks[i];
          if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);
            break;
          }
        }
        if (callbacks.length === 0) {
          delete this._callbacks["$" + event];
        }
        return this;
      };
      Emitter.prototype.emit = function(event) {
        this._callbacks = this._callbacks || {};
        var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
        if (callbacks) {
          callbacks = callbacks.slice(0);
          for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i].apply(this, args);
          }
        }
        return this;
      };
      Emitter.prototype.emitReserved = Emitter.prototype.emit;
      Emitter.prototype.listeners = function(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks["$" + event] || [];
      };
      Emitter.prototype.hasListeners = function(event) {
        return !!this.listeners(event).length;
      };
    }
  });

  // node_modules/engine.io-client/build/cjs/globals.js
  var require_globals = __commonJS({
    "node_modules/engine.io-client/build/cjs/globals.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.defaultBinaryType = exports.globalThisShim = exports.nextTick = void 0;
      exports.createCookieJar = createCookieJar;
      exports.nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
          return (cb) => Promise.resolve().then(cb);
        } else {
          return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
      })();
      exports.globalThisShim = (() => {
        if (typeof self !== "undefined") {
          return self;
        } else if (typeof window !== "undefined") {
          return window;
        } else {
          return Function("return this")();
        }
      })();
      exports.defaultBinaryType = "arraybuffer";
      function createCookieJar() {
      }
    }
  });

  // node_modules/engine.io-client/build/cjs/util.js
  var require_util = __commonJS({
    "node_modules/engine.io-client/build/cjs/util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.pick = pick;
      exports.installTimerFunctions = installTimerFunctions;
      exports.byteLength = byteLength;
      exports.randomString = randomString;
      var globals_node_js_1 = require_globals();
      function pick(obj, ...attr) {
        return attr.reduce((acc, k) => {
          if (obj.hasOwnProperty(k)) {
            acc[k] = obj[k];
          }
          return acc;
        }, {});
      }
      var NATIVE_SET_TIMEOUT = globals_node_js_1.globalThisShim.setTimeout;
      var NATIVE_CLEAR_TIMEOUT = globals_node_js_1.globalThisShim.clearTimeout;
      function installTimerFunctions(obj, opts) {
        if (opts.useNativeTimers) {
          obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globals_node_js_1.globalThisShim);
          obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globals_node_js_1.globalThisShim);
        } else {
          obj.setTimeoutFn = globals_node_js_1.globalThisShim.setTimeout.bind(globals_node_js_1.globalThisShim);
          obj.clearTimeoutFn = globals_node_js_1.globalThisShim.clearTimeout.bind(globals_node_js_1.globalThisShim);
        }
      }
      var BASE64_OVERHEAD = 1.33;
      function byteLength(obj) {
        if (typeof obj === "string") {
          return utf8Length(obj);
        }
        return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
      }
      function utf8Length(str) {
        let c = 0, length = 0;
        for (let i = 0, l = str.length; i < l; i++) {
          c = str.charCodeAt(i);
          if (c < 128) {
            length += 1;
          } else if (c < 2048) {
            length += 2;
          } else if (c < 55296 || c >= 57344) {
            length += 3;
          } else {
            i++;
            length += 4;
          }
        }
        return length;
      }
      function randomString() {
        return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
      }
    }
  });

  // node_modules/engine.io-client/build/cjs/contrib/parseqs.js
  var require_parseqs = __commonJS({
    "node_modules/engine.io-client/build/cjs/contrib/parseqs.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.encode = encode;
      exports.decode = decode;
      function encode(obj) {
        let str = "";
        for (let i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (str.length)
              str += "&";
            str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
          }
        }
        return str;
      }
      function decode(qs) {
        let qry = {};
        let pairs = qs.split("&");
        for (let i = 0, l = pairs.length; i < l; i++) {
          let pair = pairs[i].split("=");
          qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return qry;
      }
    }
  });

  // node_modules/ms/index.js
  var require_ms = __commonJS({
    "node_modules/ms/index.js"(exports, module) {
      var s = 1e3;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var w = d * 7;
      var y = d * 365.25;
      module.exports = function(val, options) {
        options = options || {};
        var type = typeof val;
        if (type === "string" && val.length > 0) {
          return parse(val);
        } else if (type === "number" && isFinite(val)) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error(
          "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
        );
      };
      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          str
        );
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || "ms").toLowerCase();
        switch (type) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return n * y;
          case "weeks":
          case "week":
          case "w":
            return n * w;
          case "days":
          case "day":
          case "d":
            return n * d;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return n * h;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return n * m;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return n * s;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return n;
          default:
            return void 0;
        }
      }
      function fmtShort(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return Math.round(ms / d) + "d";
        }
        if (msAbs >= h) {
          return Math.round(ms / h) + "h";
        }
        if (msAbs >= m) {
          return Math.round(ms / m) + "m";
        }
        if (msAbs >= s) {
          return Math.round(ms / s) + "s";
        }
        return ms + "ms";
      }
      function fmtLong(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return plural(ms, msAbs, d, "day");
        }
        if (msAbs >= h) {
          return plural(ms, msAbs, h, "hour");
        }
        if (msAbs >= m) {
          return plural(ms, msAbs, m, "minute");
        }
        if (msAbs >= s) {
          return plural(ms, msAbs, s, "second");
        }
        return ms + " ms";
      }
      function plural(ms, msAbs, n, name) {
        var isPlural = msAbs >= n * 1.5;
        return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
      }
    }
  });

  // node_modules/debug/src/common.js
  var require_common = __commonJS({
    "node_modules/debug/src/common.js"(exports, module) {
      function setup(env) {
        createDebug.debug = createDebug;
        createDebug.default = createDebug;
        createDebug.coerce = coerce;
        createDebug.disable = disable;
        createDebug.enable = enable;
        createDebug.enabled = enabled;
        createDebug.humanize = require_ms();
        createDebug.destroy = destroy;
        Object.keys(env).forEach((key) => {
          createDebug[key] = env[key];
        });
        createDebug.names = [];
        createDebug.skips = [];
        createDebug.formatters = {};
        function selectColor(namespace) {
          let hash = 0;
          for (let i = 0; i < namespace.length; i++) {
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0;
          }
          return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
        }
        createDebug.selectColor = selectColor;
        function createDebug(namespace) {
          let prevTime;
          let enableOverride = null;
          let namespacesCache;
          let enabledCache;
          function debug(...args) {
            if (!debug.enabled) {
              return;
            }
            const self2 = debug;
            const curr = Number(/* @__PURE__ */ new Date());
            const ms = curr - (prevTime || curr);
            self2.diff = ms;
            self2.prev = prevTime;
            self2.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== "string") {
              args.unshift("%O");
            }
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
              if (match === "%%") {
                return "%";
              }
              index++;
              const formatter = createDebug.formatters[format];
              if (typeof formatter === "function") {
                const val = args[index];
                match = formatter.call(self2, val);
                args.splice(index, 1);
                index--;
              }
              return match;
            });
            createDebug.formatArgs.call(self2, args);
            const logFn = self2.log || createDebug.log;
            logFn.apply(self2, args);
          }
          debug.namespace = namespace;
          debug.useColors = createDebug.useColors();
          debug.color = createDebug.selectColor(namespace);
          debug.extend = extend;
          debug.destroy = createDebug.destroy;
          Object.defineProperty(debug, "enabled", {
            enumerable: true,
            configurable: false,
            get: () => {
              if (enableOverride !== null) {
                return enableOverride;
              }
              if (namespacesCache !== createDebug.namespaces) {
                namespacesCache = createDebug.namespaces;
                enabledCache = createDebug.enabled(namespace);
              }
              return enabledCache;
            },
            set: (v) => {
              enableOverride = v;
            }
          });
          if (typeof createDebug.init === "function") {
            createDebug.init(debug);
          }
          return debug;
        }
        function extend(namespace, delimiter) {
          const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
          newDebug.log = this.log;
          return newDebug;
        }
        function enable(namespaces) {
          createDebug.save(namespaces);
          createDebug.namespaces = namespaces;
          createDebug.names = [];
          createDebug.skips = [];
          const split2 = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
          for (const ns of split2) {
            if (ns[0] === "-") {
              createDebug.skips.push(ns.slice(1));
            } else {
              createDebug.names.push(ns);
            }
          }
        }
        function matchesTemplate(search, template) {
          let searchIndex = 0;
          let templateIndex = 0;
          let starIndex = -1;
          let matchIndex = 0;
          while (searchIndex < search.length) {
            if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
              if (template[templateIndex] === "*") {
                starIndex = templateIndex;
                matchIndex = searchIndex;
                templateIndex++;
              } else {
                searchIndex++;
                templateIndex++;
              }
            } else if (starIndex !== -1) {
              templateIndex = starIndex + 1;
              matchIndex++;
              searchIndex = matchIndex;
            } else {
              return false;
            }
          }
          while (templateIndex < template.length && template[templateIndex] === "*") {
            templateIndex++;
          }
          return templateIndex === template.length;
        }
        function disable() {
          const namespaces = [
            ...createDebug.names,
            ...createDebug.skips.map((namespace) => "-" + namespace)
          ].join(",");
          createDebug.enable("");
          return namespaces;
        }
        function enabled(name) {
          for (const skip of createDebug.skips) {
            if (matchesTemplate(name, skip)) {
              return false;
            }
          }
          for (const ns of createDebug.names) {
            if (matchesTemplate(name, ns)) {
              return true;
            }
          }
          return false;
        }
        function coerce(val) {
          if (val instanceof Error) {
            return val.stack || val.message;
          }
          return val;
        }
        function destroy() {
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
        createDebug.enable(createDebug.load());
        return createDebug;
      }
      module.exports = setup;
    }
  });

  // node_modules/debug/src/browser.js
  var require_browser = __commonJS({
    "node_modules/debug/src/browser.js"(exports, module) {
      exports.formatArgs = formatArgs;
      exports.save = save;
      exports.load = load;
      exports.useColors = useColors;
      exports.storage = localstorage();
      exports.destroy = /* @__PURE__ */ (() => {
        let warned = false;
        return () => {
          if (!warned) {
            warned = true;
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
          }
        };
      })();
      exports.colors = [
        "#0000CC",
        "#0000FF",
        "#0033CC",
        "#0033FF",
        "#0066CC",
        "#0066FF",
        "#0099CC",
        "#0099FF",
        "#00CC00",
        "#00CC33",
        "#00CC66",
        "#00CC99",
        "#00CCCC",
        "#00CCFF",
        "#3300CC",
        "#3300FF",
        "#3333CC",
        "#3333FF",
        "#3366CC",
        "#3366FF",
        "#3399CC",
        "#3399FF",
        "#33CC00",
        "#33CC33",
        "#33CC66",
        "#33CC99",
        "#33CCCC",
        "#33CCFF",
        "#6600CC",
        "#6600FF",
        "#6633CC",
        "#6633FF",
        "#66CC00",
        "#66CC33",
        "#9900CC",
        "#9900FF",
        "#9933CC",
        "#9933FF",
        "#99CC00",
        "#99CC33",
        "#CC0000",
        "#CC0033",
        "#CC0066",
        "#CC0099",
        "#CC00CC",
        "#CC00FF",
        "#CC3300",
        "#CC3333",
        "#CC3366",
        "#CC3399",
        "#CC33CC",
        "#CC33FF",
        "#CC6600",
        "#CC6633",
        "#CC9900",
        "#CC9933",
        "#CCCC00",
        "#CCCC33",
        "#FF0000",
        "#FF0033",
        "#FF0066",
        "#FF0099",
        "#FF00CC",
        "#FF00FF",
        "#FF3300",
        "#FF3333",
        "#FF3366",
        "#FF3399",
        "#FF33CC",
        "#FF33FF",
        "#FF6600",
        "#FF6633",
        "#FF9900",
        "#FF9933",
        "#FFCC00",
        "#FFCC33"
      ];
      function useColors() {
        if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
          return true;
        }
        if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
          return false;
        }
        let m;
        return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
        typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
        typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
      }
      function formatArgs(args) {
        args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
        if (!this.useColors) {
          return;
        }
        const c = "color: " + this.color;
        args.splice(1, 0, c, "color: inherit");
        let index = 0;
        let lastC = 0;
        args[0].replace(/%[a-zA-Z%]/g, (match) => {
          if (match === "%%") {
            return;
          }
          index++;
          if (match === "%c") {
            lastC = index;
          }
        });
        args.splice(lastC, 0, c);
      }
      exports.log = console.debug || console.log || (() => {
      });
      function save(namespaces) {
        try {
          if (namespaces) {
            exports.storage.setItem("debug", namespaces);
          } else {
            exports.storage.removeItem("debug");
          }
        } catch (error) {
        }
      }
      function load() {
        let r;
        try {
          r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
        } catch (error) {
        }
        if (!r && typeof process !== "undefined" && "env" in process) {
          r = process.env.DEBUG;
        }
        return r;
      }
      function localstorage() {
        try {
          return localStorage;
        } catch (error) {
        }
      }
      module.exports = require_common()(exports);
      var { formatters } = module.exports;
      formatters.j = function(v) {
        try {
          return JSON.stringify(v);
        } catch (error) {
          return "[UnexpectedJSONParseError]: " + error.message;
        }
      };
    }
  });

  // node_modules/engine.io-client/build/cjs/transport.js
  var require_transport = __commonJS({
    "node_modules/engine.io-client/build/cjs/transport.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Transport = exports.TransportError = void 0;
      var engine_io_parser_1 = require_cjs();
      var component_emitter_1 = require_cjs2();
      var util_js_1 = require_util();
      var parseqs_js_1 = require_parseqs();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("engine.io-client:transport");
      var TransportError = class extends Error {
        constructor(reason, description, context) {
          super(reason);
          this.description = description;
          this.context = context;
          this.type = "TransportError";
        }
      };
      exports.TransportError = TransportError;
      var Transport = class extends component_emitter_1.Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} opts - options
         * @protected
         */
        constructor(opts) {
          super();
          this.writable = false;
          (0, util_js_1.installTimerFunctions)(this, opts);
          this.opts = opts;
          this.query = opts.query;
          this.socket = opts.socket;
          this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @protected
         */
        onError(reason, description, context) {
          super.emitReserved("error", new TransportError(reason, description, context));
          return this;
        }
        /**
         * Opens the transport.
         */
        open() {
          this.readyState = "opening";
          this.doOpen();
          return this;
        }
        /**
         * Closes the transport.
         */
        close() {
          if (this.readyState === "opening" || this.readyState === "open") {
            this.doClose();
            this.onClose();
          }
          return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         */
        send(packets) {
          if (this.readyState === "open") {
            this.write(packets);
          } else {
            debug("transport is not open, discarding packets");
          }
        }
        /**
         * Called upon open
         *
         * @protected
         */
        onOpen() {
          this.readyState = "open";
          this.writable = true;
          super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @protected
         */
        onData(data) {
          const packet = (0, engine_io_parser_1.decodePacket)(data, this.socket.binaryType);
          this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @protected
         */
        onPacket(packet) {
          super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @protected
         */
        onClose(details) {
          this.readyState = "closed";
          super.emitReserved("close", details);
        }
        /**
         * Pauses the transport, in order not to lose packets during an upgrade.
         *
         * @param onPause
         */
        pause(onPause) {
        }
        createUri(schema, query = {}) {
          return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
        }
        _hostname() {
          const hostname = this.opts.hostname;
          return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
        }
        _port() {
          if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) {
            return ":" + this.opts.port;
          } else {
            return "";
          }
        }
        _query(query) {
          const encodedQuery = (0, parseqs_js_1.encode)(query);
          return encodedQuery.length ? "?" + encodedQuery : "";
        }
      };
      exports.Transport = Transport;
    }
  });

  // node_modules/engine.io-client/build/cjs/transports/polling.js
  var require_polling = __commonJS({
    "node_modules/engine.io-client/build/cjs/transports/polling.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Polling = void 0;
      var transport_js_1 = require_transport();
      var util_js_1 = require_util();
      var engine_io_parser_1 = require_cjs();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("engine.io-client:polling");
      var Polling = class extends transport_js_1.Transport {
        constructor() {
          super(...arguments);
          this._polling = false;
        }
        get name() {
          return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @protected
         */
        doOpen() {
          this._poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} onPause - callback upon buffers are flushed and transport is paused
         * @package
         */
        pause(onPause) {
          this.readyState = "pausing";
          const pause = () => {
            debug("paused");
            this.readyState = "paused";
            onPause();
          };
          if (this._polling || !this.writable) {
            let total = 0;
            if (this._polling) {
              debug("we are currently polling - waiting to pause");
              total++;
              this.once("pollComplete", function() {
                debug("pre-pause polling complete");
                --total || pause();
              });
            }
            if (!this.writable) {
              debug("we are currently writing - waiting to pause");
              total++;
              this.once("drain", function() {
                debug("pre-pause writing complete");
                --total || pause();
              });
            }
          } else {
            pause();
          }
        }
        /**
         * Starts polling cycle.
         *
         * @private
         */
        _poll() {
          debug("polling");
          this._polling = true;
          this.doPoll();
          this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @protected
         */
        onData(data) {
          debug("polling got data %s", data);
          const callback = (packet) => {
            if ("opening" === this.readyState && packet.type === "open") {
              this.onOpen();
            }
            if ("close" === packet.type) {
              this.onClose({ description: "transport closed by the server" });
              return false;
            }
            this.onPacket(packet);
          };
          (0, engine_io_parser_1.decodePayload)(data, this.socket.binaryType).forEach(callback);
          if ("closed" !== this.readyState) {
            this._polling = false;
            this.emitReserved("pollComplete");
            if ("open" === this.readyState) {
              this._poll();
            } else {
              debug('ignoring poll - transport state "%s"', this.readyState);
            }
          }
        }
        /**
         * For polling, send a close packet.
         *
         * @protected
         */
        doClose() {
          const close = () => {
            debug("writing close packet");
            this.write([{ type: "close" }]);
          };
          if ("open" === this.readyState) {
            debug("transport open - closing");
            close();
          } else {
            debug("transport not open - deferring close");
            this.once("open", close);
          }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} packets - data packets
         * @protected
         */
        write(packets) {
          this.writable = false;
          (0, engine_io_parser_1.encodePayload)(packets, (data) => {
            this.doWrite(data, () => {
              this.writable = true;
              this.emitReserved("drain");
            });
          });
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
          const schema = this.opts.secure ? "https" : "http";
          const query = this.query || {};
          if (false !== this.opts.timestampRequests) {
            query[this.opts.timestampParam] = (0, util_js_1.randomString)();
          }
          if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
          }
          return this.createUri(schema, query);
        }
      };
      exports.Polling = Polling;
    }
  });

  // node_modules/engine.io-client/build/cjs/contrib/has-cors.js
  var require_has_cors = __commonJS({
    "node_modules/engine.io-client/build/cjs/contrib/has-cors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hasCORS = void 0;
      var value = false;
      try {
        value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
      } catch (err) {
      }
      exports.hasCORS = value;
    }
  });

  // node_modules/engine.io-client/build/cjs/transports/polling-xhr.js
  var require_polling_xhr = __commonJS({
    "node_modules/engine.io-client/build/cjs/transports/polling-xhr.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.XHR = exports.Request = exports.BaseXHR = void 0;
      var polling_js_1 = require_polling();
      var component_emitter_1 = require_cjs2();
      var util_js_1 = require_util();
      var globals_node_js_1 = require_globals();
      var has_cors_js_1 = require_has_cors();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("engine.io-client:polling");
      function empty() {
      }
      var BaseXHR = class extends polling_js_1.Polling {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @package
         */
        constructor(opts) {
          super(opts);
          if (typeof location !== "undefined") {
            const isSSL = "https:" === location.protocol;
            let port = location.port;
            if (!port) {
              port = isSSL ? "443" : "80";
            }
            this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
          }
        }
        /**
         * Sends data.
         *
         * @param {String} data - data to send.
         * @param {Function} fn - called upon flush.
         * @private
         */
        doWrite(data, fn) {
          const req = this.request({
            method: "POST",
            data
          });
          req.on("success", fn);
          req.on("error", (xhrStatus, context) => {
            this.onError("xhr post error", xhrStatus, context);
          });
        }
        /**
         * Starts a poll cycle.
         *
         * @private
         */
        doPoll() {
          debug("xhr poll");
          const req = this.request();
          req.on("data", this.onData.bind(this));
          req.on("error", (xhrStatus, context) => {
            this.onError("xhr poll error", xhrStatus, context);
          });
          this.pollXhr = req;
        }
      };
      exports.BaseXHR = BaseXHR;
      var Request = class _Request extends component_emitter_1.Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @package
         */
        constructor(createRequest, uri, opts) {
          super();
          this.createRequest = createRequest;
          (0, util_js_1.installTimerFunctions)(this, opts);
          this._opts = opts;
          this._method = opts.method || "GET";
          this._uri = uri;
          this._data = void 0 !== opts.data ? opts.data : null;
          this._create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @private
         */
        _create() {
          var _a;
          const opts = (0, util_js_1.pick)(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
          opts.xdomain = !!this._opts.xd;
          const xhr = this._xhr = this.createRequest(opts);
          try {
            debug("xhr open %s: %s", this._method, this._uri);
            xhr.open(this._method, this._uri, true);
            try {
              if (this._opts.extraHeaders) {
                xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                for (let i in this._opts.extraHeaders) {
                  if (this._opts.extraHeaders.hasOwnProperty(i)) {
                    xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
                  }
                }
              }
            } catch (e) {
            }
            if ("POST" === this._method) {
              try {
                xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
              } catch (e) {
              }
            }
            try {
              xhr.setRequestHeader("Accept", "*/*");
            } catch (e) {
            }
            (_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
            if ("withCredentials" in xhr) {
              xhr.withCredentials = this._opts.withCredentials;
            }
            if (this._opts.requestTimeout) {
              xhr.timeout = this._opts.requestTimeout;
            }
            xhr.onreadystatechange = () => {
              var _a2;
              if (xhr.readyState === 3) {
                (_a2 = this._opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(
                  // @ts-ignore
                  xhr.getResponseHeader("set-cookie")
                );
              }
              if (4 !== xhr.readyState)
                return;
              if (200 === xhr.status || 1223 === xhr.status) {
                this._onLoad();
              } else {
                this.setTimeoutFn(() => {
                  this._onError(typeof xhr.status === "number" ? xhr.status : 0);
                }, 0);
              }
            };
            debug("xhr data %s", this._data);
            xhr.send(this._data);
          } catch (e) {
            this.setTimeoutFn(() => {
              this._onError(e);
            }, 0);
            return;
          }
          if (typeof document !== "undefined") {
            this._index = _Request.requestsCount++;
            _Request.requests[this._index] = this;
          }
        }
        /**
         * Called upon error.
         *
         * @private
         */
        _onError(err) {
          this.emitReserved("error", err, this._xhr);
          this._cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @private
         */
        _cleanup(fromError) {
          if ("undefined" === typeof this._xhr || null === this._xhr) {
            return;
          }
          this._xhr.onreadystatechange = empty;
          if (fromError) {
            try {
              this._xhr.abort();
            } catch (e) {
            }
          }
          if (typeof document !== "undefined") {
            delete _Request.requests[this._index];
          }
          this._xhr = null;
        }
        /**
         * Called upon load.
         *
         * @private
         */
        _onLoad() {
          const data = this._xhr.responseText;
          if (data !== null) {
            this.emitReserved("data", data);
            this.emitReserved("success");
            this._cleanup();
          }
        }
        /**
         * Aborts the request.
         *
         * @package
         */
        abort() {
          this._cleanup();
        }
      };
      exports.Request = Request;
      Request.requestsCount = 0;
      Request.requests = {};
      if (typeof document !== "undefined") {
        if (typeof attachEvent === "function") {
          attachEvent("onunload", unloadHandler);
        } else if (typeof addEventListener === "function") {
          const terminationEvent = "onpagehide" in globals_node_js_1.globalThisShim ? "pagehide" : "unload";
          addEventListener(terminationEvent, unloadHandler, false);
        }
      }
      function unloadHandler() {
        for (let i in Request.requests) {
          if (Request.requests.hasOwnProperty(i)) {
            Request.requests[i].abort();
          }
        }
      }
      var hasXHR2 = (function() {
        const xhr = newRequest({
          xdomain: false
        });
        return xhr && xhr.responseType !== null;
      })();
      var XHR = class extends BaseXHR {
        constructor(opts) {
          super(opts);
          const forceBase64 = opts && opts.forceBase64;
          this.supportsBinary = hasXHR2 && !forceBase64;
        }
        request(opts = {}) {
          Object.assign(opts, { xd: this.xd }, this.opts);
          return new Request(newRequest, this.uri(), opts);
        }
      };
      exports.XHR = XHR;
      function newRequest(opts) {
        const xdomain = opts.xdomain;
        try {
          if ("undefined" !== typeof XMLHttpRequest && (!xdomain || has_cors_js_1.hasCORS)) {
            return new XMLHttpRequest();
          }
        } catch (e) {
        }
        if (!xdomain) {
          try {
            return new globals_node_js_1.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
          } catch (e) {
          }
        }
      }
    }
  });

  // node_modules/engine.io-client/build/cjs/transports/websocket.js
  var require_websocket = __commonJS({
    "node_modules/engine.io-client/build/cjs/transports/websocket.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WS = exports.BaseWS = void 0;
      var transport_js_1 = require_transport();
      var util_js_1 = require_util();
      var engine_io_parser_1 = require_cjs();
      var globals_node_js_1 = require_globals();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("engine.io-client:websocket");
      var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
      var BaseWS = class extends transport_js_1.Transport {
        get name() {
          return "websocket";
        }
        doOpen() {
          const uri = this.uri();
          const protocols = this.opts.protocols;
          const opts = isReactNative ? {} : (0, util_js_1.pick)(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
          if (this.opts.extraHeaders) {
            opts.headers = this.opts.extraHeaders;
          }
          try {
            this.ws = this.createSocket(uri, protocols, opts);
          } catch (err) {
            return this.emitReserved("error", err);
          }
          this.ws.binaryType = this.socket.binaryType;
          this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @private
         */
        addEventListeners() {
          this.ws.onopen = () => {
            if (this.opts.autoUnref) {
              this.ws._socket.unref();
            }
            this.onOpen();
          };
          this.ws.onclose = (closeEvent) => this.onClose({
            description: "websocket connection closed",
            context: closeEvent
          });
          this.ws.onmessage = (ev) => this.onData(ev.data);
          this.ws.onerror = (e) => this.onError("websocket error", e);
        }
        write(packets) {
          this.writable = false;
          for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            (0, engine_io_parser_1.encodePacket)(packet, this.supportsBinary, (data) => {
              try {
                this.doWrite(packet, data);
              } catch (e) {
                debug("websocket closed before onclose event");
              }
              if (lastPacket) {
                (0, globals_node_js_1.nextTick)(() => {
                  this.writable = true;
                  this.emitReserved("drain");
                }, this.setTimeoutFn);
              }
            });
          }
        }
        doClose() {
          if (typeof this.ws !== "undefined") {
            this.ws.onerror = () => {
            };
            this.ws.close();
            this.ws = null;
          }
        }
        /**
         * Generates uri for connection.
         *
         * @private
         */
        uri() {
          const schema = this.opts.secure ? "wss" : "ws";
          const query = this.query || {};
          if (this.opts.timestampRequests) {
            query[this.opts.timestampParam] = (0, util_js_1.randomString)();
          }
          if (!this.supportsBinary) {
            query.b64 = 1;
          }
          return this.createUri(schema, query);
        }
      };
      exports.BaseWS = BaseWS;
      var WebSocketCtor = globals_node_js_1.globalThisShim.WebSocket || globals_node_js_1.globalThisShim.MozWebSocket;
      var WS = class extends BaseWS {
        createSocket(uri, protocols, opts) {
          return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
        }
        doWrite(_packet, data) {
          this.ws.send(data);
        }
      };
      exports.WS = WS;
    }
  });

  // node_modules/engine.io-client/build/cjs/transports/webtransport.js
  var require_webtransport = __commonJS({
    "node_modules/engine.io-client/build/cjs/transports/webtransport.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WT = void 0;
      var transport_js_1 = require_transport();
      var globals_node_js_1 = require_globals();
      var engine_io_parser_1 = require_cjs();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("engine.io-client:webtransport");
      var WT = class extends transport_js_1.Transport {
        get name() {
          return "webtransport";
        }
        doOpen() {
          try {
            this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
          } catch (err) {
            return this.emitReserved("error", err);
          }
          this._transport.closed.then(() => {
            debug("transport closed gracefully");
            this.onClose();
          }).catch((err) => {
            debug("transport closed due to %s", err);
            this.onError("webtransport error", err);
          });
          this._transport.ready.then(() => {
            this._transport.createBidirectionalStream().then((stream) => {
              const decoderStream = (0, engine_io_parser_1.createPacketDecoderStream)(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
              const reader = stream.readable.pipeThrough(decoderStream).getReader();
              const encoderStream = (0, engine_io_parser_1.createPacketEncoderStream)();
              encoderStream.readable.pipeTo(stream.writable);
              this._writer = encoderStream.writable.getWriter();
              const read = () => {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    debug("session is closed");
                    return;
                  }
                  debug("received chunk: %o", value);
                  this.onPacket(value);
                  read();
                }).catch((err) => {
                  debug("an error occurred while reading: %s", err);
                });
              };
              read();
              const packet = { type: "open" };
              if (this.query.sid) {
                packet.data = `{"sid":"${this.query.sid}"}`;
              }
              this._writer.write(packet).then(() => this.onOpen());
            });
          });
        }
        write(packets) {
          this.writable = false;
          for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            this._writer.write(packet).then(() => {
              if (lastPacket) {
                (0, globals_node_js_1.nextTick)(() => {
                  this.writable = true;
                  this.emitReserved("drain");
                }, this.setTimeoutFn);
              }
            });
          }
        }
        doClose() {
          var _a;
          (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
        }
      };
      exports.WT = WT;
    }
  });

  // node_modules/engine.io-client/build/cjs/transports/index.js
  var require_transports = __commonJS({
    "node_modules/engine.io-client/build/cjs/transports/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.transports = void 0;
      var polling_xhr_node_js_1 = require_polling_xhr();
      var websocket_node_js_1 = require_websocket();
      var webtransport_js_1 = require_webtransport();
      exports.transports = {
        websocket: websocket_node_js_1.WS,
        webtransport: webtransport_js_1.WT,
        polling: polling_xhr_node_js_1.XHR
      };
    }
  });

  // node_modules/engine.io-client/build/cjs/contrib/parseuri.js
  var require_parseuri = __commonJS({
    "node_modules/engine.io-client/build/cjs/contrib/parseuri.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parse = parse;
      var re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
      var parts = [
        "source",
        "protocol",
        "authority",
        "userInfo",
        "user",
        "password",
        "host",
        "port",
        "relative",
        "path",
        "directory",
        "file",
        "query",
        "anchor"
      ];
      function parse(str) {
        if (str.length > 8e3) {
          throw "URI too long";
        }
        const src = str, b = str.indexOf("["), e = str.indexOf("]");
        if (b != -1 && e != -1) {
          str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
        }
        let m = re.exec(str || ""), uri = {}, i = 14;
        while (i--) {
          uri[parts[i]] = m[i] || "";
        }
        if (b != -1 && e != -1) {
          uri.source = src;
          uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
          uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
          uri.ipv6uri = true;
        }
        uri.pathNames = pathNames(uri, uri["path"]);
        uri.queryKey = queryKey(uri, uri["query"]);
        return uri;
      }
      function pathNames(obj, path) {
        const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
        if (path.slice(0, 1) == "/" || path.length === 0) {
          names.splice(0, 1);
        }
        if (path.slice(-1) == "/") {
          names.splice(names.length - 1, 1);
        }
        return names;
      }
      function queryKey(uri, query) {
        const data = {};
        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
          if ($1) {
            data[$1] = $2;
          }
        });
        return data;
      }
    }
  });

  // node_modules/engine.io-client/build/cjs/socket.js
  var require_socket = __commonJS({
    "node_modules/engine.io-client/build/cjs/socket.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Socket = void 0;
      var index_js_1 = require_transports();
      var util_js_1 = require_util();
      var parseqs_js_1 = require_parseqs();
      var parseuri_js_1 = require_parseuri();
      var component_emitter_1 = require_cjs2();
      var engine_io_parser_1 = require_cjs();
      var globals_node_js_1 = require_globals();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("engine.io-client:socket");
      var withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
      var OFFLINE_EVENT_LISTENERS = [];
      if (withEventListeners) {
        addEventListener("offline", () => {
          debug("closing %d connection(s) because the network was lost", OFFLINE_EVENT_LISTENERS.length);
          OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
        }, false);
      }
      var Socket = class _Socket extends component_emitter_1.Emitter {
        constructor(uri, opts = {}) {
          var _a, _b;
          super();
          this.binaryType = globals_node_js_1.defaultBinaryType;
          this.writeBuffer = [];
          this._prevBufferLen = 0;
          this._upgrades = [];
          this._pingInterval = -1;
          this._pingTimeout = -1;
          this._maxPayload = -1;
          this._pingTimeoutTime = Infinity;
          if (uri && "object" === typeof uri) {
            opts = uri;
            uri = null;
          }
          if (uri) {
            const parsedUri = (0, parseuri_js_1.parse)(uri);
            opts.hostname = parsedUri.host;
            opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
            opts.port = parsedUri.port;
            if (parsedUri.query)
              opts.query = parsedUri.query;
          } else if (opts.host) {
            opts.hostname = (0, parseuri_js_1.parse)(opts.host).host;
          }
          (0, util_js_1.installTimerFunctions)(this, opts);
          this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
          if (opts.hostname && !opts.port) {
            opts.port = this.secure ? "443" : "80";
          }
          this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
          this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
          if (opts.transportImplementations && opts.transports) {
            throw new Error("specifying both 'transportImplementations' and 'transports' options is not supported");
          }
          if (opts.transportImplementations || ((_a = opts.transports) === null || _a === void 0 ? void 0 : _a.length) && typeof opts.transports[0] === "function") {
            this.transports = [];
            this._transportsByName = /* @__PURE__ */ Object.create(null);
            ((_b = opts.transportImplementations) !== null && _b !== void 0 ? _b : opts.transports).forEach((t) => {
              const transportName = t.prototype.name;
              this.transports.push(transportName);
              this._transportsByName[transportName] = t;
            });
          } else {
            this.transports = opts.transports ? [...opts.transports] : ["polling", "websocket", "webtransport"];
            this._transportsByName = index_js_1.transports;
          }
          this.opts = Object.assign({
            path: "/engine.io",
            agent: false,
            withCredentials: false,
            upgrade: true,
            timestampParam: "t",
            rememberUpgrade: false,
            addTrailingSlash: true,
            rejectUnauthorized: true,
            perMessageDeflate: {
              threshold: 1024
            },
            transportOptions: {},
            closeOnBeforeunload: false
          }, opts);
          this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
          if (typeof this.opts.query === "string") {
            this.opts.query = (0, parseqs_js_1.decode)(this.opts.query);
          }
          if (withEventListeners) {
            if (this.opts.closeOnBeforeunload) {
              this._beforeunloadEventListener = () => {
                if (this.transport) {
                  this.transport.removeAllListeners();
                  this.transport.close();
                }
              };
              addEventListener("beforeunload", this._beforeunloadEventListener, false);
            }
            if (this.hostname !== "localhost") {
              debug("adding listener for the 'offline' event");
              this._offlineEventListener = () => {
                this._onClose("transport close", {
                  description: "network connection lost"
                });
              };
              OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
            }
          }
          if (this.opts.withCredentials) {
            this._cookieJar = (0, globals_node_js_1.createCookieJar)();
          }
          this._open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} name - transport name
         * @return {Transport}
         * @private
         */
        createTransport(name) {
          debug('creating transport "%s"', name);
          const query = Object.assign({}, this.opts.query);
          query.EIO = engine_io_parser_1.protocol;
          query.transport = name;
          if (this.id)
            query.sid = this.id;
          const opts = Object.assign({}, this.opts, {
            query,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
          }, this.opts.transportOptions[name]);
          debug("options: %j", opts);
          return new this._transportsByName[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @private
         */
        _open() {
          if (this.transports.length === 0) {
            this.setTimeoutFn(() => {
              this.emitReserved("error", "No transports available");
            }, 0);
            return;
          }
          const transportName = this.opts.rememberUpgrade && _Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
          this.readyState = "opening";
          const transport = this.createTransport(transportName);
          transport.open();
          this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @private
         */
        setTransport(transport) {
          debug("setting transport %s", transport.name);
          if (this.transport) {
            debug("clearing existing transport %s", this.transport.name);
            this.transport.removeAllListeners();
          }
          this.transport = transport;
          transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
        }
        /**
         * Probes a transport.
         *
         * @param {String} name - transport name
         * @private
         */
        _probe(name) {
          debug('probing transport "%s"', name);
          let transport = this.createTransport(name);
          let failed = false;
          _Socket.priorWebsocketSuccess = false;
          const onTransportOpen = () => {
            if (failed)
              return;
            debug('probe transport "%s" opened', name);
            transport.send([{ type: "ping", data: "probe" }]);
            transport.once("packet", (msg) => {
              if (failed)
                return;
              if ("pong" === msg.type && "probe" === msg.data) {
                debug('probe transport "%s" pong', name);
                this.upgrading = true;
                this.emitReserved("upgrading", transport);
                if (!transport)
                  return;
                _Socket.priorWebsocketSuccess = "websocket" === transport.name;
                debug('pausing current transport "%s"', this.transport.name);
                this.transport.pause(() => {
                  if (failed)
                    return;
                  if ("closed" === this.readyState)
                    return;
                  debug("changing transport and sending upgrade packet");
                  cleanup();
                  this.setTransport(transport);
                  transport.send([{ type: "upgrade" }]);
                  this.emitReserved("upgrade", transport);
                  transport = null;
                  this.upgrading = false;
                  this.flush();
                });
              } else {
                debug('probe transport "%s" failed', name);
                const err = new Error("probe error");
                err.transport = transport.name;
                this.emitReserved("upgradeError", err);
              }
            });
          };
          function freezeTransport() {
            if (failed)
              return;
            failed = true;
            cleanup();
            transport.close();
            transport = null;
          }
          const onerror = (err) => {
            const error = new Error("probe error: " + err);
            error.transport = transport.name;
            freezeTransport();
            debug('probe transport "%s" failed because of error: %s', name, err);
            this.emitReserved("upgradeError", error);
          };
          function onTransportClose() {
            onerror("transport closed");
          }
          function onclose() {
            onerror("socket closed");
          }
          function onupgrade(to) {
            if (transport && to.name !== transport.name) {
              debug('"%s" works - aborting "%s"', to.name, transport.name);
              freezeTransport();
            }
          }
          const cleanup = () => {
            transport.removeListener("open", onTransportOpen);
            transport.removeListener("error", onerror);
            transport.removeListener("close", onTransportClose);
            this.off("close", onclose);
            this.off("upgrading", onupgrade);
          };
          transport.once("open", onTransportOpen);
          transport.once("error", onerror);
          transport.once("close", onTransportClose);
          this.once("close", onclose);
          this.once("upgrading", onupgrade);
          if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
            this.setTimeoutFn(() => {
              if (!failed) {
                transport.open();
              }
            }, 200);
          } else {
            transport.open();
          }
        }
        /**
         * Called when connection is deemed open.
         *
         * @private
         */
        onOpen() {
          debug("socket open");
          this.readyState = "open";
          _Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
          this.emitReserved("open");
          this.flush();
          if ("open" === this.readyState && this.opts.upgrade) {
            debug("starting upgrade probes");
            for (let i = 0; i < this._upgrades.length; i++) {
              this._probe(this._upgrades[i]);
            }
          }
        }
        /**
         * Handles a packet.
         *
         * @private
         */
        _onPacket(packet) {
          if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
            debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
            this.emitReserved("packet", packet);
            this.emitReserved("heartbeat");
            switch (packet.type) {
              case "open":
                this.onHandshake(JSON.parse(packet.data));
                break;
              case "ping":
                this._sendPacket("pong");
                this.emitReserved("ping");
                this.emitReserved("pong");
                this._resetPingTimeout();
                break;
              case "error":
                const err = new Error("server error");
                err.code = packet.data;
                this._onError(err);
                break;
              case "message":
                this.emitReserved("data", packet.data);
                this.emitReserved("message", packet.data);
                break;
            }
          } else {
            debug('packet received with socket readyState "%s"', this.readyState);
          }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @private
         */
        onHandshake(data) {
          this.emitReserved("handshake", data);
          this.id = data.sid;
          this.transport.query.sid = data.sid;
          this._upgrades = this._filterUpgrades(data.upgrades);
          this._pingInterval = data.pingInterval;
          this._pingTimeout = data.pingTimeout;
          this._maxPayload = data.maxPayload;
          this.onOpen();
          if ("closed" === this.readyState)
            return;
          this._resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @private
         */
        _resetPingTimeout() {
          this.clearTimeoutFn(this._pingTimeoutTimer);
          const delay = this._pingInterval + this._pingTimeout;
          this._pingTimeoutTime = Date.now() + delay;
          this._pingTimeoutTimer = this.setTimeoutFn(() => {
            this._onClose("ping timeout");
          }, delay);
          if (this.opts.autoUnref) {
            this._pingTimeoutTimer.unref();
          }
        }
        /**
         * Called on `drain` event
         *
         * @private
         */
        _onDrain() {
          this.writeBuffer.splice(0, this._prevBufferLen);
          this._prevBufferLen = 0;
          if (0 === this.writeBuffer.length) {
            this.emitReserved("drain");
          } else {
            this.flush();
          }
        }
        /**
         * Flush write buffers.
         *
         * @private
         */
        flush() {
          if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
            const packets = this._getWritablePackets();
            debug("flushing %d packets in socket", packets.length);
            this.transport.send(packets);
            this._prevBufferLen = packets.length;
            this.emitReserved("flush");
          }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        _getWritablePackets() {
          const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
          if (!shouldCheckPayloadSize) {
            return this.writeBuffer;
          }
          let payloadSize = 1;
          for (let i = 0; i < this.writeBuffer.length; i++) {
            const data = this.writeBuffer[i].data;
            if (data) {
              payloadSize += (0, util_js_1.byteLength)(data);
            }
            if (i > 0 && payloadSize > this._maxPayload) {
              debug("only send %d out of %d packets", i, this.writeBuffer.length);
              return this.writeBuffer.slice(0, i);
            }
            payloadSize += 2;
          }
          debug("payload size is %d (max: %d)", payloadSize, this._maxPayload);
          return this.writeBuffer;
        }
        /**
         * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
         *
         * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
         * `write()` method then the message would not be buffered by the Socket.IO client.
         *
         * @return {boolean}
         * @private
         */
        /* private */
        _hasPingExpired() {
          if (!this._pingTimeoutTime)
            return true;
          const hasExpired = Date.now() > this._pingTimeoutTime;
          if (hasExpired) {
            debug("throttled timer detected, scheduling connection close");
            this._pingTimeoutTime = 0;
            (0, globals_node_js_1.nextTick)(() => {
              this._onClose("ping timeout");
            }, this.setTimeoutFn);
          }
          return hasExpired;
        }
        /**
         * Sends a message.
         *
         * @param {String} msg - message.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @return {Socket} for chaining.
         */
        write(msg, options, fn) {
          this._sendPacket("message", msg, options, fn);
          return this;
        }
        /**
         * Sends a message. Alias of {@link Socket#write}.
         *
         * @param {String} msg - message.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @return {Socket} for chaining.
         */
        send(msg, options, fn) {
          this._sendPacket("message", msg, options, fn);
          return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} type - packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} fn - callback function.
         * @private
         */
        _sendPacket(type, data, options, fn) {
          if ("function" === typeof data) {
            fn = data;
            data = void 0;
          }
          if ("function" === typeof options) {
            fn = options;
            options = null;
          }
          if ("closing" === this.readyState || "closed" === this.readyState) {
            return;
          }
          options = options || {};
          options.compress = false !== options.compress;
          const packet = {
            type,
            data,
            options
          };
          this.emitReserved("packetCreate", packet);
          this.writeBuffer.push(packet);
          if (fn)
            this.once("flush", fn);
          this.flush();
        }
        /**
         * Closes the connection.
         */
        close() {
          const close = () => {
            this._onClose("forced close");
            debug("socket closing - telling transport to close");
            this.transport.close();
          };
          const cleanupAndClose = () => {
            this.off("upgrade", cleanupAndClose);
            this.off("upgradeError", cleanupAndClose);
            close();
          };
          const waitForUpgrade = () => {
            this.once("upgrade", cleanupAndClose);
            this.once("upgradeError", cleanupAndClose);
          };
          if ("opening" === this.readyState || "open" === this.readyState) {
            this.readyState = "closing";
            if (this.writeBuffer.length) {
              this.once("drain", () => {
                if (this.upgrading) {
                  waitForUpgrade();
                } else {
                  close();
                }
              });
            } else if (this.upgrading) {
              waitForUpgrade();
            } else {
              close();
            }
          }
          return this;
        }
        /**
         * Called upon transport error
         *
         * @private
         */
        _onError(err) {
          debug("socket error %j", err);
          _Socket.priorWebsocketSuccess = false;
          if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
            debug("trying next transport");
            this.transports.shift();
            return this._open();
          }
          this.emitReserved("error", err);
          this._onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @private
         */
        _onClose(reason, description) {
          if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
            debug('socket close with reason: "%s"', reason);
            this.clearTimeoutFn(this._pingTimeoutTimer);
            this.transport.removeAllListeners("close");
            this.transport.close();
            this.transport.removeAllListeners();
            if (withEventListeners) {
              if (this._beforeunloadEventListener) {
                removeEventListener("beforeunload", this._beforeunloadEventListener, false);
              }
              if (this._offlineEventListener) {
                const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
                if (i !== -1) {
                  debug("removing listener for the 'offline' event");
                  OFFLINE_EVENT_LISTENERS.splice(i, 1);
                }
              }
            }
            this.readyState = "closed";
            this.id = null;
            this.emitReserved("close", reason, description);
            this.writeBuffer = [];
            this._prevBufferLen = 0;
          }
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} upgrades - server upgrades
         * @private
         */
        _filterUpgrades(upgrades) {
          const filteredUpgrades = [];
          for (let i = 0; i < upgrades.length; i++) {
            if (~this.transports.indexOf(upgrades[i]))
              filteredUpgrades.push(upgrades[i]);
          }
          return filteredUpgrades;
        }
      };
      exports.Socket = Socket;
      Socket.protocol = engine_io_parser_1.protocol;
    }
  });

  // node_modules/engine.io-client/build/cjs/transports/polling-fetch.js
  var require_polling_fetch = __commonJS({
    "node_modules/engine.io-client/build/cjs/transports/polling-fetch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Fetch = void 0;
      var polling_js_1 = require_polling();
      var Fetch = class extends polling_js_1.Polling {
        doPoll() {
          this._fetch().then((res) => {
            if (!res.ok) {
              return this.onError("fetch read error", res.status, res);
            }
            res.text().then((data) => this.onData(data));
          }).catch((err) => {
            this.onError("fetch read error", err);
          });
        }
        doWrite(data, callback) {
          this._fetch(data).then((res) => {
            if (!res.ok) {
              return this.onError("fetch write error", res.status, res);
            }
            callback();
          }).catch((err) => {
            this.onError("fetch write error", err);
          });
        }
        _fetch(data) {
          var _a;
          const isPost = data !== void 0;
          const headers = new Headers(this.opts.extraHeaders);
          if (isPost) {
            headers.set("content-type", "text/plain;charset=UTF-8");
          }
          (_a = this.socket._cookieJar) === null || _a === void 0 ? void 0 : _a.appendCookies(headers);
          return fetch(this.uri(), {
            method: isPost ? "POST" : "GET",
            body: isPost ? data : null,
            headers,
            credentials: this.opts.withCredentials ? "include" : "omit"
          }).then((res) => {
            var _a2;
            (_a2 = this.socket._cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(res.headers.getSetCookie());
            return res;
          });
        }
      };
      exports.Fetch = Fetch;
    }
  });

  // node_modules/engine.io-client/build/cjs/index.js
  var require_cjs3 = __commonJS({
    "node_modules/engine.io-client/build/cjs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WebTransport = exports.WebSocket = exports.NodeWebSocket = exports.XHR = exports.NodeXHR = exports.Fetch = exports.nextTick = exports.parse = exports.installTimerFunctions = exports.transports = exports.TransportError = exports.Transport = exports.protocol = exports.Socket = void 0;
      var socket_js_1 = require_socket();
      Object.defineProperty(exports, "Socket", { enumerable: true, get: function() {
        return socket_js_1.Socket;
      } });
      exports.protocol = socket_js_1.Socket.protocol;
      var transport_js_1 = require_transport();
      Object.defineProperty(exports, "Transport", { enumerable: true, get: function() {
        return transport_js_1.Transport;
      } });
      Object.defineProperty(exports, "TransportError", { enumerable: true, get: function() {
        return transport_js_1.TransportError;
      } });
      var index_js_1 = require_transports();
      Object.defineProperty(exports, "transports", { enumerable: true, get: function() {
        return index_js_1.transports;
      } });
      var util_js_1 = require_util();
      Object.defineProperty(exports, "installTimerFunctions", { enumerable: true, get: function() {
        return util_js_1.installTimerFunctions;
      } });
      var parseuri_js_1 = require_parseuri();
      Object.defineProperty(exports, "parse", { enumerable: true, get: function() {
        return parseuri_js_1.parse;
      } });
      var globals_node_js_1 = require_globals();
      Object.defineProperty(exports, "nextTick", { enumerable: true, get: function() {
        return globals_node_js_1.nextTick;
      } });
      var polling_fetch_js_1 = require_polling_fetch();
      Object.defineProperty(exports, "Fetch", { enumerable: true, get: function() {
        return polling_fetch_js_1.Fetch;
      } });
      var polling_xhr_node_js_1 = require_polling_xhr();
      Object.defineProperty(exports, "NodeXHR", { enumerable: true, get: function() {
        return polling_xhr_node_js_1.XHR;
      } });
      var polling_xhr_js_1 = require_polling_xhr();
      Object.defineProperty(exports, "XHR", { enumerable: true, get: function() {
        return polling_xhr_js_1.XHR;
      } });
      var websocket_node_js_1 = require_websocket();
      Object.defineProperty(exports, "NodeWebSocket", { enumerable: true, get: function() {
        return websocket_node_js_1.WS;
      } });
      var websocket_js_1 = require_websocket();
      Object.defineProperty(exports, "WebSocket", { enumerable: true, get: function() {
        return websocket_js_1.WS;
      } });
      var webtransport_js_1 = require_webtransport();
      Object.defineProperty(exports, "WebTransport", { enumerable: true, get: function() {
        return webtransport_js_1.WT;
      } });
    }
  });

  // node_modules/socket.io-client/build/cjs/url.js
  var require_url = __commonJS({
    "node_modules/socket.io-client/build/cjs/url.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.url = url;
      var engine_io_client_1 = require_cjs3();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("socket.io-client:url");
      function url(uri, path = "", loc) {
        let obj = uri;
        loc = loc || typeof location !== "undefined" && location;
        if (null == uri)
          uri = loc.protocol + "//" + loc.host;
        if (typeof uri === "string") {
          if ("/" === uri.charAt(0)) {
            if ("/" === uri.charAt(1)) {
              uri = loc.protocol + uri;
            } else {
              uri = loc.host + uri;
            }
          }
          if (!/^(https?|wss?):\/\//.test(uri)) {
            debug("protocol-less url %s", uri);
            if ("undefined" !== typeof loc) {
              uri = loc.protocol + "//" + uri;
            } else {
              uri = "https://" + uri;
            }
          }
          debug("parse %s", uri);
          obj = (0, engine_io_client_1.parse)(uri);
        }
        if (!obj.port) {
          if (/^(http|ws)$/.test(obj.protocol)) {
            obj.port = "80";
          } else if (/^(http|ws)s$/.test(obj.protocol)) {
            obj.port = "443";
          }
        }
        obj.path = obj.path || "/";
        const ipv6 = obj.host.indexOf(":") !== -1;
        const host = ipv6 ? "[" + obj.host + "]" : obj.host;
        obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
        obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
        return obj;
      }
    }
  });

  // node_modules/socket.io-parser/build/cjs/is-binary.js
  var require_is_binary = __commonJS({
    "node_modules/socket.io-parser/build/cjs/is-binary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isBinary = isBinary;
      exports.hasBinary = hasBinary;
      var withNativeArrayBuffer = typeof ArrayBuffer === "function";
      var isView = (obj) => {
        return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
      };
      var toString = Object.prototype.toString;
      var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
      var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
      function isBinary(obj) {
        return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
      }
      function hasBinary(obj, toJSON) {
        if (!obj || typeof obj !== "object") {
          return false;
        }
        if (Array.isArray(obj)) {
          for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
              return true;
            }
          }
          return false;
        }
        if (isBinary(obj)) {
          return true;
        }
        if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
          return hasBinary(obj.toJSON(), true);
        }
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
          }
        }
        return false;
      }
    }
  });

  // node_modules/socket.io-parser/build/cjs/binary.js
  var require_binary = __commonJS({
    "node_modules/socket.io-parser/build/cjs/binary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.deconstructPacket = deconstructPacket;
      exports.reconstructPacket = reconstructPacket;
      var is_binary_js_1 = require_is_binary();
      function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length;
        return { packet: pack, buffers };
      }
      function _deconstructPacket(data, buffers, toJSON) {
        if (!data)
          return data;
        if ((0, is_binary_js_1.isBinary)(data)) {
          const placeholder = { _placeholder: true, num: buffers.length };
          buffers.push(data);
          return placeholder;
        } else if (Array.isArray(data)) {
          const newData = new Array(data.length);
          for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
          }
          return newData;
        } else if (typeof data === "object" && !(data instanceof Date)) {
          if (data.toJSON && typeof data.toJSON === "function" && !toJSON) {
            return _deconstructPacket(data.toJSON(), buffers, true);
          }
          const newData = {};
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              newData[key] = _deconstructPacket(data[key], buffers);
            }
          }
          return newData;
        }
        return data;
      }
      function reconstructPacket(packet, buffers) {
        packet.data = _reconstructPacket(packet.data, buffers);
        delete packet.attachments;
        return packet;
      }
      function _reconstructPacket(data, buffers) {
        if (!data)
          return data;
        if (data && data._placeholder === true) {
          const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
          if (isIndexValid) {
            return buffers[data.num];
          } else {
            throw new Error("illegal attachments");
          }
        } else if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
          }
        } else if (typeof data === "object") {
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              data[key] = _reconstructPacket(data[key], buffers);
            }
          }
        }
        return data;
      }
    }
  });

  // node_modules/socket.io-parser/build/cjs/index.js
  var require_cjs4 = __commonJS({
    "node_modules/socket.io-parser/build/cjs/index.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
      exports.isPacketValid = isPacketValid;
      var component_emitter_1 = require_cjs2();
      var binary_js_1 = require_binary();
      var is_binary_js_1 = require_is_binary();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("socket.io-parser");
      var RESERVED_EVENTS = [
        "connect",
        // used on the client side
        "connect_error",
        // used on the client side
        "disconnect",
        // used on both sides
        "disconnecting",
        // used on the server side
        "newListener",
        // used by the Node.js EventEmitter
        "removeListener"
        // used by the Node.js EventEmitter
      ];
      exports.protocol = 5;
      var PacketType;
      (function(PacketType2) {
        PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
        PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
        PacketType2[PacketType2["ACK"] = 3] = "ACK";
        PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
      })(PacketType || (exports.PacketType = PacketType = {}));
      var Encoder = class {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
          this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
          debug("encoding packet %j", obj);
          if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if ((0, is_binary_js_1.hasBinary)(obj)) {
              return this.encodeAsBinary({
                type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
                nsp: obj.nsp,
                data: obj.data,
                id: obj.id
              });
            }
          }
          return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
          let str = "" + obj.type;
          if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
          }
          if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
          }
          if (null != obj.id) {
            str += obj.id;
          }
          if (null != obj.data) {
            str += JSON.stringify(obj.data, this.replacer);
          }
          debug("encoded %j as %s", obj, str);
          return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
          const deconstruction = (0, binary_js_1.deconstructPacket)(obj);
          const pack = this.encodeAsString(deconstruction.packet);
          const buffers = deconstruction.buffers;
          buffers.unshift(pack);
          return buffers;
        }
      };
      exports.Encoder = Encoder;
      var Decoder = class _Decoder extends component_emitter_1.Emitter {
        /**
         * Decoder constructor
         */
        constructor(opts) {
          super();
          this.opts = Object.assign({
            reviver: void 0,
            maxAttachments: 10
          }, typeof opts === "function" ? { reviver: opts } : opts);
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
          let packet;
          if (typeof obj === "string") {
            if (this.reconstructor) {
              throw new Error("got plaintext data when reconstructing a packet");
            }
            packet = this.decodeString(obj);
            const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
            if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
              packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
              this.reconstructor = new BinaryReconstructor(packet);
            } else {
              super.emitReserved("decoded", packet);
            }
          } else if ((0, is_binary_js_1.isBinary)(obj) || obj.base64) {
            if (!this.reconstructor) {
              throw new Error("got binary data when not reconstructing a packet");
            } else {
              packet = this.reconstructor.takeBinaryData(obj);
              if (packet) {
                this.reconstructor = null;
                super.emitReserved("decoded", packet);
              }
            }
          } else {
            throw new Error("Unknown type: " + obj);
          }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
          let i = 0;
          const p = {
            type: Number(str.charAt(0))
          };
          if (PacketType[p.type] === void 0) {
            throw new Error("unknown packet type " + p.type);
          }
          if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) {
            }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
              throw new Error("Illegal attachments");
            }
            const n = Number(buf);
            if (!isInteger(n) || n < 1) {
              throw new Error("Illegal attachments");
            } else if (n > this.opts.maxAttachments) {
              throw new Error("too many attachments");
            }
            p.attachments = n;
          }
          if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
              const c = str.charAt(i);
              if ("," === c)
                break;
              if (i === str.length)
                break;
            }
            p.nsp = str.substring(start, i);
          } else {
            p.nsp = "/";
          }
          const next = str.charAt(i + 1);
          if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
              const c = str.charAt(i);
              if (null == c || Number(c) != c) {
                --i;
                break;
              }
              if (i === str.length)
                break;
            }
            p.id = Number(str.substring(start, i + 1));
          }
          if (str.charAt(++i)) {
            const payload = this.tryParse(str.substr(i));
            if (_Decoder.isPayloadValid(p.type, payload)) {
              p.data = payload;
            } else {
              throw new Error("invalid payload");
            }
          }
          debug("decoded %s as %j", str, p);
          return p;
        }
        tryParse(str) {
          try {
            return JSON.parse(str, this.opts.reviver);
          } catch (e) {
            return false;
          }
        }
        static isPayloadValid(type, payload) {
          switch (type) {
            case PacketType.CONNECT:
              return isObject(payload);
            case PacketType.DISCONNECT:
              return payload === void 0;
            case PacketType.CONNECT_ERROR:
              return typeof payload === "string" || isObject(payload);
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
              return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
              return Array.isArray(payload);
          }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
          if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
            this.reconstructor = null;
          }
        }
      };
      exports.Decoder = Decoder;
      var BinaryReconstructor = class {
        constructor(packet) {
          this.packet = packet;
          this.buffers = [];
          this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
          this.buffers.push(binData);
          if (this.buffers.length === this.reconPack.attachments) {
            const packet = (0, binary_js_1.reconstructPacket)(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
          }
          return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
          this.reconPack = null;
          this.buffers = [];
        }
      };
      function isNamespaceValid(nsp) {
        return typeof nsp === "string";
      }
      var isInteger = Number.isInteger || function(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      function isAckIdValid(id) {
        return id === void 0 || isInteger(id);
      }
      function isObject(value) {
        return Object.prototype.toString.call(value) === "[object Object]";
      }
      function isDataValid(type, payload) {
        switch (type) {
          case PacketType.CONNECT:
            return payload === void 0 || isObject(payload);
          case PacketType.DISCONNECT:
            return payload === void 0;
          case PacketType.EVENT:
            return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
          case PacketType.ACK:
            return Array.isArray(payload);
          case PacketType.CONNECT_ERROR:
            return typeof payload === "string" || isObject(payload);
          default:
            return false;
        }
      }
      function isPacketValid(packet) {
        return isNamespaceValid(packet.nsp) && isAckIdValid(packet.id) && isDataValid(packet.type, packet.data);
      }
    }
  });

  // node_modules/socket.io-client/build/cjs/on.js
  var require_on = __commonJS({
    "node_modules/socket.io-client/build/cjs/on.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.on = on;
      function on(obj, ev, fn) {
        obj.on(ev, fn);
        return function subDestroy() {
          obj.off(ev, fn);
        };
      }
    }
  });

  // node_modules/socket.io-client/build/cjs/socket.js
  var require_socket2 = __commonJS({
    "node_modules/socket.io-client/build/cjs/socket.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Socket = void 0;
      var socket_io_parser_1 = require_cjs4();
      var on_js_1 = require_on();
      var component_emitter_1 = require_cjs2();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("socket.io-client:socket");
      var RESERVED_EVENTS = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1
      });
      var Socket = class extends component_emitter_1.Emitter {
        /**
         * `Socket` constructor.
         */
        constructor(io, nsp, opts) {
          super();
          this.connected = false;
          this.recovered = false;
          this.receiveBuffer = [];
          this.sendBuffer = [];
          this._queue = [];
          this._queueSeq = 0;
          this.ids = 0;
          this.acks = {};
          this.flags = {};
          this.io = io;
          this.nsp = nsp;
          if (opts && opts.auth) {
            this.auth = opts.auth;
          }
          this._opts = Object.assign({}, opts);
          if (this.io._autoConnect)
            this.open();
        }
        /**
         * Whether the socket is currently disconnected
         *
         * @example
         * const socket = io();
         *
         * socket.on("connect", () => {
         *   console.log(socket.disconnected); // false
         * });
         *
         * socket.on("disconnect", () => {
         *   console.log(socket.disconnected); // true
         * });
         */
        get disconnected() {
          return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
          if (this.subs)
            return;
          const io = this.io;
          this.subs = [
            (0, on_js_1.on)(io, "open", this.onopen.bind(this)),
            (0, on_js_1.on)(io, "packet", this.onpacket.bind(this)),
            (0, on_js_1.on)(io, "error", this.onerror.bind(this)),
            (0, on_js_1.on)(io, "close", this.onclose.bind(this))
          ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects.
         *
         * @example
         * const socket = io();
         *
         * console.log(socket.active); // true
         *
         * socket.on("disconnect", (reason) => {
         *   if (reason === "io server disconnect") {
         *     // the disconnection was initiated by the server, you need to manually reconnect
         *     console.log(socket.active); // false
         *   }
         *   // else the socket will automatically try to reconnect
         *   console.log(socket.active); // true
         * });
         */
        get active() {
          return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @example
         * const socket = io({
         *   autoConnect: false
         * });
         *
         * socket.connect();
         */
        connect() {
          if (this.connected)
            return this;
          this.subEvents();
          if (!this.io["_reconnecting"])
            this.io.open();
          if ("open" === this.io._readyState)
            this.onopen();
          return this;
        }
        /**
         * Alias for {@link connect()}.
         */
        open() {
          return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * This method mimics the WebSocket.send() method.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
         *
         * @example
         * socket.send("hello");
         *
         * // this is equivalent to
         * socket.emit("message", "hello");
         *
         * @return self
         */
        send(...args) {
          args.unshift("message");
          this.emit.apply(this, args);
          return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @example
         * socket.emit("hello", "world");
         *
         * // all serializable datastructures are supported (no need to call JSON.stringify)
         * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
         *
         * // with an acknowledgement from the server
         * socket.emit("hello", "world", (val) => {
         *   // ...
         * });
         *
         * @return self
         */
        emit(ev, ...args) {
          var _a, _b, _c;
          if (RESERVED_EVENTS.hasOwnProperty(ev)) {
            throw new Error('"' + ev.toString() + '" is a reserved event name');
          }
          args.unshift(ev);
          if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
            this._addToQueue(args);
            return this;
          }
          const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: args
          };
          packet.options = {};
          packet.options.compress = this.flags.compress !== false;
          if ("function" === typeof args[args.length - 1]) {
            const id = this.ids++;
            debug("emitting packet with ack id %d", id);
            const ack = args.pop();
            this._registerAckCallback(id, ack);
            packet.id = id;
          }
          const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
          const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
          const discardPacket = this.flags.volatile && !isTransportWritable;
          if (discardPacket) {
            debug("discard packet as the transport is not currently writable");
          } else if (isConnected) {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
          } else {
            this.sendBuffer.push(packet);
          }
          this.flags = {};
          return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
          var _a;
          const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
          if (timeout === void 0) {
            this.acks[id] = ack;
            return;
          }
          const timer = this.io.setTimeoutFn(() => {
            delete this.acks[id];
            for (let i = 0; i < this.sendBuffer.length; i++) {
              if (this.sendBuffer[i].id === id) {
                debug("removing packet with ack id %d from the buffer", id);
                this.sendBuffer.splice(i, 1);
              }
            }
            debug("event with ack id %d has timed out after %d ms", id, timeout);
            ack.call(this, new Error("operation has timed out"));
          }, timeout);
          const fn = (...args) => {
            this.io.clearTimeoutFn(timer);
            ack.apply(this, args);
          };
          fn.withError = true;
          this.acks[id] = fn;
        }
        /**
         * Emits an event and waits for an acknowledgement
         *
         * @example
         * // without timeout
         * const response = await socket.emitWithAck("hello", "world");
         *
         * // with a specific timeout
         * try {
         *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
         * } catch (err) {
         *   // the server did not acknowledge the event in the given delay
         * }
         *
         * @return a Promise that will be fulfilled when the server acknowledges the event
         */
        emitWithAck(ev, ...args) {
          return new Promise((resolve, reject) => {
            const fn = (arg1, arg2) => {
              return arg1 ? reject(arg1) : resolve(arg2);
            };
            fn.withError = true;
            args.push(fn);
            this.emit(ev, ...args);
          });
        }
        /**
         * Add the packet to the queue.
         * @param args
         * @private
         */
        _addToQueue(args) {
          let ack;
          if (typeof args[args.length - 1] === "function") {
            ack = args.pop();
          }
          const packet = {
            id: this._queueSeq++,
            tryCount: 0,
            pending: false,
            args,
            flags: Object.assign({ fromQueue: true }, this.flags)
          };
          args.push((err, ...responseArgs) => {
            if (packet !== this._queue[0]) {
              return debug("packet [%d] already acknowledged", packet.id);
            }
            const hasError = err !== null;
            if (hasError) {
              if (packet.tryCount > this._opts.retries) {
                debug("packet [%d] is discarded after %d tries", packet.id, packet.tryCount);
                this._queue.shift();
                if (ack) {
                  ack(err);
                }
              }
            } else {
              debug("packet [%d] was successfully sent", packet.id);
              this._queue.shift();
              if (ack) {
                ack(null, ...responseArgs);
              }
            }
            packet.pending = false;
            return this._drainQueue();
          });
          this._queue.push(packet);
          this._drainQueue();
        }
        /**
         * Send the first packet of the queue, and wait for an acknowledgement from the server.
         * @param force - whether to resend a packet that has not been acknowledged yet
         *
         * @private
         */
        _drainQueue(force = false) {
          debug("draining queue");
          if (!this.connected || this._queue.length === 0) {
            return;
          }
          const packet = this._queue[0];
          if (packet.pending && !force) {
            debug("packet [%d] has already been sent and is waiting for an ack", packet.id);
            return;
          }
          packet.pending = true;
          packet.tryCount++;
          debug("sending packet [%d] (try n\xB0%d)", packet.id, packet.tryCount);
          this.flags = packet.flags;
          this.emit.apply(this, packet.args);
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
          packet.nsp = this.nsp;
          this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
          debug("transport is open - connecting");
          if (typeof this.auth == "function") {
            this.auth((data) => {
              this._sendConnectPacket(data);
            });
          } else {
            this._sendConnectPacket(this.auth);
          }
        }
        /**
         * Sends a CONNECT packet to initiate the Socket.IO session.
         *
         * @param data
         * @private
         */
        _sendConnectPacket(data) {
          this.packet({
            type: socket_io_parser_1.PacketType.CONNECT,
            data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data) : data
          });
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
          if (!this.connected) {
            this.emitReserved("connect_error", err);
          }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
          debug("close (%s)", reason);
          this.connected = false;
          delete this.id;
          this.emitReserved("disconnect", reason, description);
          this._clearAcks();
        }
        /**
         * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
         * the server.
         *
         * @private
         */
        _clearAcks() {
          Object.keys(this.acks).forEach((id) => {
            const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
            if (!isBuffered) {
              const ack = this.acks[id];
              delete this.acks[id];
              if (ack.withError) {
                ack.call(this, new Error("socket has been disconnected"));
              }
            }
          });
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
          const sameNamespace = packet.nsp === this.nsp;
          if (!sameNamespace)
            return;
          switch (packet.type) {
            case socket_io_parser_1.PacketType.CONNECT:
              if (packet.data && packet.data.sid) {
                this.onconnect(packet.data.sid, packet.data.pid);
              } else {
                this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
              }
              break;
            case socket_io_parser_1.PacketType.EVENT:
            case socket_io_parser_1.PacketType.BINARY_EVENT:
              this.onevent(packet);
              break;
            case socket_io_parser_1.PacketType.ACK:
            case socket_io_parser_1.PacketType.BINARY_ACK:
              this.onack(packet);
              break;
            case socket_io_parser_1.PacketType.DISCONNECT:
              this.ondisconnect();
              break;
            case socket_io_parser_1.PacketType.CONNECT_ERROR:
              this.destroy();
              const err = new Error(packet.data.message);
              err.data = packet.data.data;
              this.emitReserved("connect_error", err);
              break;
          }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
          const args = packet.data || [];
          debug("emitting event %j", args);
          if (null != packet.id) {
            debug("attaching ack callback to event");
            args.push(this.ack(packet.id));
          }
          if (this.connected) {
            this.emitEvent(args);
          } else {
            this.receiveBuffer.push(Object.freeze(args));
          }
        }
        emitEvent(args) {
          if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
              listener.apply(this, args);
            }
          }
          super.emit.apply(this, args);
          if (this._pid && args.length && typeof args[args.length - 1] === "string") {
            this._lastOffset = args[args.length - 1];
          }
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
          const self2 = this;
          let sent = false;
          return function(...args) {
            if (sent)
              return;
            sent = true;
            debug("sending ack %j", args);
            self2.packet({
              type: socket_io_parser_1.PacketType.ACK,
              id,
              data: args
            });
          };
        }
        /**
         * Called upon a server acknowledgement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
          const ack = this.acks[packet.id];
          if (typeof ack !== "function") {
            debug("bad ack %s", packet.id);
            return;
          }
          delete this.acks[packet.id];
          debug("calling ack %s with %j", packet.id, packet.data);
          if (ack.withError) {
            packet.data.unshift(null);
          }
          ack.apply(this, packet.data);
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id, pid) {
          debug("socket connected with id %s", id);
          this.id = id;
          this.recovered = pid && this._pid === pid;
          this._pid = pid;
          this.connected = true;
          this.emitBuffered();
          this._drainQueue(true);
          this.emitReserved("connect");
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
          this.receiveBuffer.forEach((args) => this.emitEvent(args));
          this.receiveBuffer = [];
          this.sendBuffer.forEach((packet) => {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
          });
          this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
          debug("server disconnect (%s)", this.nsp);
          this.destroy();
          this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
          if (this.subs) {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs = void 0;
          }
          this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually. In that case, the socket will not try to reconnect.
         *
         * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
         *
         * @example
         * const socket = io();
         *
         * socket.on("disconnect", (reason) => {
         *   // console.log(reason); prints "io client disconnect"
         * });
         *
         * socket.disconnect();
         *
         * @return self
         */
        disconnect() {
          if (this.connected) {
            debug("performing disconnect (%s)", this.nsp);
            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
          }
          this.destroy();
          if (this.connected) {
            this.onclose("io client disconnect");
          }
          return this;
        }
        /**
         * Alias for {@link disconnect()}.
         *
         * @return self
         */
        close() {
          return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @example
         * socket.compress(false).emit("hello");
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         */
        compress(compress) {
          this.flags.compress = compress;
          return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @example
         * socket.volatile.emit("hello"); // the server may or may not receive it
         *
         * @returns self
         */
        get volatile() {
          this.flags.volatile = true;
          return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * @example
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         *
         * @returns self
         */
        timeout(timeout) {
          this.flags.timeout = timeout;
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @example
         * socket.onAny((event, ...args) => {
         *   console.log(`got ${event}`);
         * });
         *
         * @param listener
         */
        onAny(listener) {
          this._anyListeners = this._anyListeners || [];
          this._anyListeners.push(listener);
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @example
         * socket.prependAny((event, ...args) => {
         *   console.log(`got event ${event}`);
         * });
         *
         * @param listener
         */
        prependAny(listener) {
          this._anyListeners = this._anyListeners || [];
          this._anyListeners.unshift(listener);
          return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`got event ${event}`);
         * }
         *
         * socket.onAny(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAny(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAny();
         *
         * @param listener
         */
        offAny(listener) {
          if (!this._anyListeners) {
            return this;
          }
          if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
              if (listener === listeners[i]) {
                listeners.splice(i, 1);
                return this;
              }
            }
          } else {
            this._anyListeners = [];
          }
          return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAny() {
          return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        onAnyOutgoing(listener) {
          this._anyOutgoingListeners = this._anyOutgoingListeners || [];
          this._anyOutgoingListeners.push(listener);
          return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * Note: acknowledgements sent to the server are not included.
         *
         * @example
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(`sent event ${event}`);
         * });
         *
         * @param listener
         */
        prependAnyOutgoing(listener) {
          this._anyOutgoingListeners = this._anyOutgoingListeners || [];
          this._anyOutgoingListeners.unshift(listener);
          return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @example
         * const catchAllListener = (event, ...args) => {
         *   console.log(`sent event ${event}`);
         * }
         *
         * socket.onAnyOutgoing(catchAllListener);
         *
         * // remove a specific listener
         * socket.offAnyOutgoing(catchAllListener);
         *
         * // or remove all listeners
         * socket.offAnyOutgoing();
         *
         * @param [listener] - the catch-all listener (optional)
         */
        offAnyOutgoing(listener) {
          if (!this._anyOutgoingListeners) {
            return this;
          }
          if (listener) {
            const listeners = this._anyOutgoingListeners;
            for (let i = 0; i < listeners.length; i++) {
              if (listener === listeners[i]) {
                listeners.splice(i, 1);
                return this;
              }
            }
          } else {
            this._anyOutgoingListeners = [];
          }
          return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         */
        listenersAnyOutgoing() {
          return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
          if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const listeners = this._anyOutgoingListeners.slice();
            for (const listener of listeners) {
              listener.apply(this, packet.data);
            }
          }
        }
      };
      exports.Socket = Socket;
    }
  });

  // node_modules/socket.io-client/build/cjs/contrib/backo2.js
  var require_backo2 = __commonJS({
    "node_modules/socket.io-client/build/cjs/contrib/backo2.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Backoff = Backoff;
      function Backoff(opts) {
        opts = opts || {};
        this.ms = opts.min || 100;
        this.max = opts.max || 1e4;
        this.factor = opts.factor || 2;
        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
        this.attempts = 0;
      }
      Backoff.prototype.duration = function() {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var rand = Math.random();
          var deviation = Math.floor(rand * this.jitter * ms);
          ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
      };
      Backoff.prototype.reset = function() {
        this.attempts = 0;
      };
      Backoff.prototype.setMin = function(min) {
        this.ms = min;
      };
      Backoff.prototype.setMax = function(max) {
        this.max = max;
      };
      Backoff.prototype.setJitter = function(jitter) {
        this.jitter = jitter;
      };
    }
  });

  // node_modules/socket.io-client/build/cjs/manager.js
  var require_manager = __commonJS({
    "node_modules/socket.io-client/build/cjs/manager.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }) : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || /* @__PURE__ */ (function() {
        var ownKeys = function(o) {
          ownKeys = Object.getOwnPropertyNames || function(o2) {
            var ar = [];
            for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
            return ar;
          };
          return ownKeys(o);
        };
        return function(mod2) {
          if (mod2 && mod2.__esModule) return mod2;
          var result = {};
          if (mod2 != null) {
            for (var k = ownKeys(mod2), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod2, k[i]);
          }
          __setModuleDefault(result, mod2);
          return result;
        };
      })();
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Manager = void 0;
      var engine_io_client_1 = require_cjs3();
      var socket_js_1 = require_socket2();
      var parser = __importStar(require_cjs4());
      var on_js_1 = require_on();
      var backo2_js_1 = require_backo2();
      var component_emitter_1 = require_cjs2();
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("socket.io-client:manager");
      var Manager = class extends component_emitter_1.Emitter {
        constructor(uri, opts) {
          var _a;
          super();
          this.nsps = {};
          this.subs = [];
          if (uri && "object" === typeof uri) {
            opts = uri;
            uri = void 0;
          }
          opts = opts || {};
          opts.path = opts.path || "/socket.io";
          this.opts = opts;
          (0, engine_io_client_1.installTimerFunctions)(this, opts);
          this.reconnection(opts.reconnection !== false);
          this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
          this.reconnectionDelay(opts.reconnectionDelay || 1e3);
          this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
          this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
          this.backoff = new backo2_js_1.Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor()
          });
          this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
          this._readyState = "closed";
          this.uri = uri;
          const _parser = opts.parser || parser;
          this.encoder = new _parser.Encoder();
          this.decoder = new _parser.Decoder();
          this._autoConnect = opts.autoConnect !== false;
          if (this._autoConnect)
            this.open();
        }
        reconnection(v) {
          if (!arguments.length)
            return this._reconnection;
          this._reconnection = !!v;
          if (!v) {
            this.skipReconnect = true;
          }
          return this;
        }
        reconnectionAttempts(v) {
          if (v === void 0)
            return this._reconnectionAttempts;
          this._reconnectionAttempts = v;
          return this;
        }
        reconnectionDelay(v) {
          var _a;
          if (v === void 0)
            return this._reconnectionDelay;
          this._reconnectionDelay = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
          return this;
        }
        randomizationFactor(v) {
          var _a;
          if (v === void 0)
            return this._randomizationFactor;
          this._randomizationFactor = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
          return this;
        }
        reconnectionDelayMax(v) {
          var _a;
          if (v === void 0)
            return this._reconnectionDelayMax;
          this._reconnectionDelayMax = v;
          (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
          return this;
        }
        timeout(v) {
          if (!arguments.length)
            return this._timeout;
          this._timeout = v;
          return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
          if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
            this.reconnect();
          }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
          debug("readyState %s", this._readyState);
          if (~this._readyState.indexOf("open"))
            return this;
          debug("opening %s", this.uri);
          this.engine = new engine_io_client_1.Socket(this.uri, this.opts);
          const socket = this.engine;
          const self2 = this;
          this._readyState = "opening";
          this.skipReconnect = false;
          const openSubDestroy = (0, on_js_1.on)(socket, "open", function() {
            self2.onopen();
            fn && fn();
          });
          const onError = (err) => {
            debug("error");
            this.cleanup();
            this._readyState = "closed";
            this.emitReserved("error", err);
            if (fn) {
              fn(err);
            } else {
              this.maybeReconnectOnOpen();
            }
          };
          const errorSub = (0, on_js_1.on)(socket, "error", onError);
          if (false !== this._timeout) {
            const timeout = this._timeout;
            debug("connect attempt will timeout after %d", timeout);
            const timer = this.setTimeoutFn(() => {
              debug("connect attempt timed out after %d", timeout);
              openSubDestroy();
              onError(new Error("timeout"));
              socket.close();
            }, timeout);
            if (this.opts.autoUnref) {
              timer.unref();
            }
            this.subs.push(() => {
              this.clearTimeoutFn(timer);
            });
          }
          this.subs.push(openSubDestroy);
          this.subs.push(errorSub);
          return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
          return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
          debug("open");
          this.cleanup();
          this._readyState = "open";
          this.emitReserved("open");
          const socket = this.engine;
          this.subs.push(
            (0, on_js_1.on)(socket, "ping", this.onping.bind(this)),
            (0, on_js_1.on)(socket, "data", this.ondata.bind(this)),
            (0, on_js_1.on)(socket, "error", this.onerror.bind(this)),
            (0, on_js_1.on)(socket, "close", this.onclose.bind(this)),
            // @ts-ignore
            (0, on_js_1.on)(this.decoder, "decoded", this.ondecoded.bind(this))
          );
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
          this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
          try {
            this.decoder.add(data);
          } catch (e) {
            this.onclose("parse error", e);
          }
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
          (0, engine_io_client_1.nextTick)(() => {
            this.emitReserved("packet", packet);
          }, this.setTimeoutFn);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
          debug("error", err);
          this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
          let socket = this.nsps[nsp];
          if (!socket) {
            socket = new socket_js_1.Socket(this, nsp, opts);
            this.nsps[nsp] = socket;
          } else if (this._autoConnect && !socket.active) {
            socket.connect();
          }
          return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
          const nsps = Object.keys(this.nsps);
          for (const nsp of nsps) {
            const socket2 = this.nsps[nsp];
            if (socket2.active) {
              debug("socket %s is still active, skipping close", nsp);
              return;
            }
          }
          this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
          debug("writing packet %j", packet);
          const encodedPackets = this.encoder.encode(packet);
          for (let i = 0; i < encodedPackets.length; i++) {
            this.engine.write(encodedPackets[i], packet.options);
          }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
          debug("cleanup");
          this.subs.forEach((subDestroy) => subDestroy());
          this.subs.length = 0;
          this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
          debug("disconnect");
          this.skipReconnect = true;
          this._reconnecting = false;
          this.onclose("forced close");
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
          return this._close();
        }
        /**
         * Called when:
         *
         * - the low-level engine is closed
         * - the parser encountered a badly formatted packet
         * - all sockets are disconnected
         *
         * @private
         */
        onclose(reason, description) {
          var _a;
          debug("closed due to %s", reason);
          this.cleanup();
          (_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
          this.backoff.reset();
          this._readyState = "closed";
          this.emitReserved("close", reason, description);
          if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
          }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
          if (this._reconnecting || this.skipReconnect)
            return this;
          const self2 = this;
          if (this.backoff.attempts >= this._reconnectionAttempts) {
            debug("reconnect failed");
            this.backoff.reset();
            this.emitReserved("reconnect_failed");
            this._reconnecting = false;
          } else {
            const delay = this.backoff.duration();
            debug("will wait %dms before reconnect attempt", delay);
            this._reconnecting = true;
            const timer = this.setTimeoutFn(() => {
              if (self2.skipReconnect)
                return;
              debug("attempting reconnect");
              this.emitReserved("reconnect_attempt", self2.backoff.attempts);
              if (self2.skipReconnect)
                return;
              self2.open((err) => {
                if (err) {
                  debug("reconnect attempt error");
                  self2._reconnecting = false;
                  self2.reconnect();
                  this.emitReserved("reconnect_error", err);
                } else {
                  debug("reconnect success");
                  self2.onreconnect();
                }
              });
            }, delay);
            if (this.opts.autoUnref) {
              timer.unref();
            }
            this.subs.push(() => {
              this.clearTimeoutFn(timer);
            });
          }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
          const attempt = this.backoff.attempts;
          this._reconnecting = false;
          this.backoff.reset();
          this.emitReserved("reconnect", attempt);
        }
      };
      exports.Manager = Manager;
    }
  });

  // node_modules/socket.io-client/build/cjs/index.js
  var require_cjs5 = __commonJS({
    "node_modules/socket.io-client/build/cjs/index.js"(exports, module) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WebTransport = exports.WebSocket = exports.NodeWebSocket = exports.XHR = exports.NodeXHR = exports.Fetch = exports.Socket = exports.Manager = exports.protocol = void 0;
      exports.io = lookup;
      exports.connect = lookup;
      exports.default = lookup;
      var url_js_1 = require_url();
      var manager_js_1 = require_manager();
      Object.defineProperty(exports, "Manager", { enumerable: true, get: function() {
        return manager_js_1.Manager;
      } });
      var socket_js_1 = require_socket2();
      Object.defineProperty(exports, "Socket", { enumerable: true, get: function() {
        return socket_js_1.Socket;
      } });
      var debug_1 = __importDefault(require_browser());
      var debug = (0, debug_1.default)("socket.io-client");
      var cache = {};
      function lookup(uri, opts) {
        if (typeof uri === "object") {
          opts = uri;
          uri = void 0;
        }
        opts = opts || {};
        const parsed = (0, url_js_1.url)(uri, opts.path || "/socket.io");
        const source = parsed.source;
        const id = parsed.id;
        const path = parsed.path;
        const sameNamespace = cache[id] && path in cache[id]["nsps"];
        const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
        let io;
        if (newConnection) {
          debug("ignoring socket cache for %s", source);
          io = new manager_js_1.Manager(source, opts);
        } else {
          if (!cache[id]) {
            debug("new io instance for %s", source);
            cache[id] = new manager_js_1.Manager(source, opts);
          }
          io = cache[id];
        }
        if (parsed.query && !opts.query) {
          opts.query = parsed.queryKey;
        }
        return io.socket(parsed.path, opts);
      }
      Object.assign(lookup, {
        Manager: manager_js_1.Manager,
        Socket: socket_js_1.Socket,
        io: lookup,
        connect: lookup
      });
      var socket_io_parser_1 = require_cjs4();
      Object.defineProperty(exports, "protocol", { enumerable: true, get: function() {
        return socket_io_parser_1.protocol;
      } });
      var engine_io_client_1 = require_cjs3();
      Object.defineProperty(exports, "Fetch", { enumerable: true, get: function() {
        return engine_io_client_1.Fetch;
      } });
      Object.defineProperty(exports, "NodeXHR", { enumerable: true, get: function() {
        return engine_io_client_1.NodeXHR;
      } });
      Object.defineProperty(exports, "XHR", { enumerable: true, get: function() {
        return engine_io_client_1.XHR;
      } });
      Object.defineProperty(exports, "NodeWebSocket", { enumerable: true, get: function() {
        return engine_io_client_1.NodeWebSocket;
      } });
      Object.defineProperty(exports, "WebSocket", { enumerable: true, get: function() {
        return engine_io_client_1.WebSocket;
      } });
      Object.defineProperty(exports, "WebTransport", { enumerable: true, get: function() {
        return engine_io_client_1.WebTransport;
      } });
      module.exports = lookup;
    }
  });

  // dist/lib.cjs/index.js
  var require_lib5 = __commonJS({
    "dist/lib.cjs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      var __create = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __exportAll = (all, no_symbols) => {
        let target = {};
        for (var name in all) __defProp2(target, name, {
          get: all[name],
          enumerable: true
        });
        if (!no_symbols) __defProp2(target, Symbol.toStringTag, { value: "Module" });
        return target;
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames2(from), i = 0, n = keys.length, key; i < n; i++) {
          key = keys[i];
          if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
            get: ((k) => from[k]).bind(null, key),
            enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
          });
        }
        return to;
      };
      var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps2(isNodeMode || !mod2 || !mod2.__esModule || !__hasOwnProp2.call(mod2, "default") ? __defProp2(target, "default", {
        value: mod2,
        enumerable: true
      }) : target, mod2));
      var loglevel = require_loglevel();
      loglevel = __toESM(loglevel);
      var oblivious_set = require_index_es5();
      var _toruslabs_constants = require_lib();
      var _toruslabs_eccrypto = require_lib2();
      var _toruslabs_metadata_helpers = require_lib4();
      var socket_io_client = require_cjs5();
      function isPromise(obj) {
        if (obj && typeof obj.then === "function") return true;
        return false;
      }
      Promise.resolve(false);
      Promise.resolve(true);
      var PROMISE_RESOLVED_VOID = Promise.resolve();
      function sleep(time, resolveWith) {
        if (!time) time = 0;
        return new Promise((resolve) => {
          setTimeout(() => resolve(resolveWith), time);
        });
      }
      function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      function generateRandomId() {
        return Math.random().toString(36).substring(2);
      }
      var lastMs = 0;
      function microSeconds$5() {
        let ret = Date.now() * 1e3;
        if (ret <= lastMs) ret = lastMs + 1;
        lastMs = ret;
        return ret;
      }
      var log = loglevel.default.getLogger("broadcast-channel");
      log.setLevel("error");
      function fillOptionsWithDefaults(originalOptions = {}) {
        const options = JSON.parse(JSON.stringify(originalOptions));
        if (typeof options.webWorkerSupport === "undefined") options.webWorkerSupport = true;
        if (!options.idb) options.idb = {};
        if (!options.idb.ttl) options.idb.ttl = 45e3;
        if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
        if (originalOptions.idb && typeof originalOptions.idb.onclose === "function") options.idb.onclose = originalOptions.idb.onclose;
        if (!options.localstorage) options.localstorage = {};
        if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 6e4;
        if (!options.server) options.server = {};
        if (!options.server.build_env) options.server.build_env = _toruslabs_constants.BUILD_ENV.PRODUCTION;
        if (!options.server.api_url) options.server.api_url = `${_toruslabs_constants.STORAGE_SERVER_MAP[options.server.build_env]}/v2`;
        if (!options.server.socket_url) options.server.socket_url = `${_toruslabs_constants.STORAGE_SERVER_SOCKET_URL_MAP[options.server.build_env]}`;
        if (!options.server.removeTimeout) options.server.removeTimeout = 3e5;
        if (originalOptions.methods) options.methods = originalOptions.methods;
        return options;
      }
      var indexed_db_exports = /* @__PURE__ */ __exportAll({
        TRANSACTION_SETTINGS: () => TRANSACTION_SETTINGS,
        averageResponseTime: () => averageResponseTime$4,
        canBeUsed: () => canBeUsed$4,
        cleanOldMessages: () => cleanOldMessages,
        close: () => close$4,
        commitIndexedDBTransaction: () => commitIndexedDBTransaction,
        create: () => create$4,
        createDatabase: () => createDatabase,
        getAllMessages: () => getAllMessages,
        getIdb: () => getIdb,
        getMessagesHigherThan: () => getMessagesHigherThan,
        getOldMessages: () => getOldMessages,
        microSeconds: () => microSeconds$4,
        onMessage: () => onMessage$4,
        postMessage: () => postMessage$4,
        removeMessagesById: () => removeMessagesById,
        type: () => "idb",
        writeMessage: () => writeMessage
      });
      var microSeconds$4 = microSeconds$5;
      var DB_PREFIX = "pubkey.broadcast-channel-0-";
      var OBJECT_STORE_ID = "messages";
      var TRANSACTION_SETTINGS = { durability: "relaxed" };
      function getIdb() {
        if (typeof indexedDB !== "undefined") return indexedDB;
        if (typeof window !== "undefined") {
          const extWindow = window;
          if (typeof extWindow.mozIndexedDB !== "undefined") return extWindow.mozIndexedDB;
          if (typeof extWindow.webkitIndexedDB !== "undefined") return extWindow.webkitIndexedDB;
          if (typeof extWindow.msIndexedDB !== "undefined") return extWindow.msIndexedDB;
        }
        return false;
      }
      function commitIndexedDBTransaction(tx) {
        if (tx.commit) tx.commit();
      }
      function createDatabase(channelName) {
        const IndexedDB = getIdb();
        if (!IndexedDB) return Promise.reject(/* @__PURE__ */ new Error("IndexedDB not available"));
        const dbName = DB_PREFIX + channelName;
        const openRequest = IndexedDB.open(dbName);
        openRequest.onupgradeneeded = (ev) => {
          ev.target.result.createObjectStore(OBJECT_STORE_ID, {
            keyPath: "id",
            autoIncrement: true
          });
        };
        return new Promise((resolve, reject) => {
          openRequest.onerror = (ev) => reject(ev);
          openRequest.onsuccess = () => {
            resolve(openRequest.result);
          };
        });
      }
      function writeMessage(db, readerUuid, messageJson) {
        const writeObject = {
          uuid: readerUuid,
          time: Date.now(),
          data: messageJson
        };
        const tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
        return new Promise((resolve, reject) => {
          tx.oncomplete = () => resolve();
          tx.onerror = (ev) => reject(ev);
          tx.objectStore(OBJECT_STORE_ID).add(writeObject);
          commitIndexedDBTransaction(tx);
        });
      }
      function getAllMessages(db) {
        const tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
        const objectStore = tx.objectStore(OBJECT_STORE_ID);
        const ret = [];
        return new Promise((resolve) => {
          objectStore.openCursor().onsuccess = (ev) => {
            const cursor = ev.target.result;
            if (cursor) {
              ret.push(cursor.value);
              cursor.continue();
            } else {
              commitIndexedDBTransaction(tx);
              resolve(ret);
            }
          };
        });
      }
      function getMessagesHigherThan(db, lastCursorId) {
        const tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
        const objectStore = tx.objectStore(OBJECT_STORE_ID);
        const ret = [];
        let keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
        if (objectStore.getAll) {
          const getAllRequest = objectStore.getAll(keyRangeValue);
          return new Promise((resolve, reject) => {
            getAllRequest.onerror = (err) => reject(err);
            getAllRequest.onsuccess = function(e) {
              resolve(e.target.result);
            };
          });
        }
        function openCursor() {
          try {
            keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
            return objectStore.openCursor(keyRangeValue);
          } catch {
            return objectStore.openCursor();
          }
        }
        return new Promise((resolve, reject) => {
          const openCursorRequest = openCursor();
          openCursorRequest.onerror = (err) => reject(err);
          openCursorRequest.onsuccess = (ev) => {
            const cursor = ev.target.result;
            if (cursor) {
              if (cursor.value.id < lastCursorId + 1) cursor.continue(lastCursorId + 1);
              else {
                ret.push(cursor.value);
                cursor.continue();
              }
            } else {
              commitIndexedDBTransaction(tx);
              resolve(ret);
            }
          };
        });
      }
      function removeMessagesById(db, ids) {
        const objectStore = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS).objectStore(OBJECT_STORE_ID);
        return Promise.all(ids.map((id) => {
          const deleteRequest = objectStore.delete(id);
          return new Promise((resolve) => {
            deleteRequest.onsuccess = () => resolve();
          });
        }));
      }
      function getOldMessages(db, ttl) {
        const olderThen = Date.now() - ttl;
        const tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
        const objectStore = tx.objectStore(OBJECT_STORE_ID);
        const ret = [];
        return new Promise((resolve) => {
          objectStore.openCursor().onsuccess = (ev) => {
            const cursor = ev.target.result;
            if (cursor) {
              const msgObk = cursor.value;
              if (msgObk.time < olderThen) {
                ret.push(msgObk);
                cursor.continue();
              } else {
                commitIndexedDBTransaction(tx);
                resolve(ret);
              }
            } else resolve(ret);
          };
        });
      }
      function cleanOldMessages(db, ttl) {
        return getOldMessages(db, ttl).then((tooOld) => {
          return removeMessagesById(db, tooOld.map((msg) => msg.id));
        });
      }
      function create$4(channelName, options) {
        options = fillOptionsWithDefaults(options);
        return createDatabase(channelName).then((db) => {
          const state = {
            closed: false,
            lastCursorId: 0,
            channelName,
            options,
            uuid: generateRandomId(),
            /**
            * emittedMessagesIds
            * contains all messages that have been emitted before
            * @type {ObliviousSet}
            */
            eMIs: new oblivious_set.ObliviousSet(options.idb.ttl * 2),
            writeBlockPromise: PROMISE_RESOLVED_VOID,
            messagesCallback: null,
            readQueuePromises: [],
            db,
            time: microSeconds$5()
          };
          db.onclose = function() {
            state.closed = true;
            if (options.idb.onclose) options.idb.onclose();
          };
          _readLoop(state);
          return state;
        });
      }
      function _readLoop(state) {
        if (state.closed) return;
        readNewMessages(state).then(() => sleep(state.options.idb.fallbackInterval)).then(() => _readLoop(state)).catch((e) => {
          throw e;
        });
      }
      function _filterMessage(msgObj, state) {
        if (msgObj.uuid === state.uuid) return false;
        if (state.eMIs.has(msgObj.id)) return false;
        if (msgObj.data.time < state.messagesCallbackTime) return false;
        return true;
      }
      function readNewMessages(state) {
        if (state.closed) return PROMISE_RESOLVED_VOID;
        if (!state.messagesCallback) return PROMISE_RESOLVED_VOID;
        return getMessagesHigherThan(state.db, state.lastCursorId).then((newerMessages) => {
          newerMessages.filter((msgObj) => !!msgObj).map((msgObj) => {
            if (msgObj.id > state.lastCursorId) state.lastCursorId = msgObj.id;
            return msgObj;
          }).filter((msgObj) => _filterMessage(msgObj, state)).sort((msgObjA, msgObjB) => msgObjA.time - msgObjB.time).forEach((msgObj) => {
            if (state.messagesCallback) {
              state.eMIs.add(msgObj.id);
              state.messagesCallback(msgObj.data);
            }
          });
          return PROMISE_RESOLVED_VOID;
        });
      }
      function close$4(channelState) {
        channelState.closed = true;
        channelState.db.close();
      }
      function postMessage$4(channelState, messageJson) {
        channelState.writeBlockPromise = channelState.writeBlockPromise.then(() => writeMessage(channelState.db, channelState.uuid, messageJson)).then(() => {
          if (randomInt(0, 10) === 0) cleanOldMessages(channelState.db, channelState.options.idb.ttl);
          return PROMISE_RESOLVED_VOID;
        });
        return channelState.writeBlockPromise;
      }
      function onMessage$4(channelState, fn, time) {
        channelState.messagesCallbackTime = time;
        channelState.messagesCallback = fn;
        readNewMessages(channelState);
      }
      function canBeUsed$4() {
        if (!getIdb()) return false;
        return true;
      }
      function averageResponseTime$4(options) {
        return options.idb.fallbackInterval * 2;
      }
      var localstorage_exports = /* @__PURE__ */ __exportAll({
        addStorageEventListener: () => addStorageEventListener,
        averageResponseTime: () => averageResponseTime$3,
        canBeUsed: () => canBeUsed$3,
        close: () => close$3,
        create: () => create$3,
        getLocalStorage: () => getLocalStorage,
        microSeconds: () => microSeconds$3,
        onMessage: () => onMessage$3,
        postMessage: () => postMessage$3,
        removeStorageEventListener: () => removeStorageEventListener$1,
        storageKey: () => storageKey$1,
        type: () => type$3
      });
      var microSeconds$3 = microSeconds$5;
      var KEY_PREFIX$1 = "pubkey.broadcastChannel-";
      var type$3 = "localstorage";
      function getLocalStorage() {
        let localStorage2 = null;
        if (typeof window === "undefined") return null;
        try {
          localStorage2 = window.localStorage;
          localStorage2 = window["ie8-eventlistener/storage"] || window.localStorage;
        } catch {
        }
        return localStorage2;
      }
      function storageKey$1(channelName) {
        return KEY_PREFIX$1 + channelName;
      }
      function postMessage$3(channelState, messageJson) {
        return new Promise((resolve, reject) => {
          sleep().then(() => {
            const key = storageKey$1(channelState.channelName);
            const writeObj = {
              token: generateRandomId(),
              time: Date.now(),
              data: messageJson,
              uuid: channelState.uuid
            };
            const value = JSON.stringify(writeObj);
            getLocalStorage()?.setItem(key, value);
            const ev = document.createEvent("StorageEvent");
            ev.initStorageEvent("storage", true, true, key, null, value, "", null);
            window.dispatchEvent(ev);
            resolve();
          }).catch(reject);
        });
      }
      function addStorageEventListener(channelName, fn) {
        const key = storageKey$1(channelName);
        const listener = (ev) => {
          if (ev.key === key && ev.newValue) fn(JSON.parse(ev.newValue));
        };
        window.addEventListener("storage", listener);
        return listener;
      }
      function removeStorageEventListener$1(listener) {
        window.removeEventListener("storage", listener);
      }
      function canBeUsed$3() {
        const ls = getLocalStorage();
        if (!ls) return false;
        try {
          const key = "__broadcastchannel_check";
          ls.setItem(key, "works");
          ls.removeItem(key);
        } catch {
          return false;
        }
        return true;
      }
      function create$3(channelName, options) {
        const filledOptions = fillOptionsWithDefaults(options);
        if (!canBeUsed$3()) throw new Error("BroadcastChannel: localstorage cannot be used");
        const uuid = generateRandomId();
        const eMIs = new oblivious_set.ObliviousSet(filledOptions.localstorage.removeTimeout);
        const state = {
          channelName,
          uuid,
          time: microSeconds$5(),
          eMIs
        };
        state.listener = addStorageEventListener(channelName, (msgObj) => {
          if (!state.messagesCallback) return;
          if (msgObj.uuid === uuid) return;
          if (!msgObj.token || eMIs.has(msgObj.token)) return;
          if (msgObj.data.time && msgObj.data.time < (state.messagesCallbackTime || 0)) return;
          eMIs.add(msgObj.token);
          state.messagesCallback(msgObj.data);
        });
        return state;
      }
      function close$3(channelState) {
        if (channelState.listener) removeStorageEventListener$1(channelState.listener);
      }
      function onMessage$3(channelState, fn, time) {
        channelState.messagesCallbackTime = time;
        channelState.messagesCallback = fn;
      }
      function averageResponseTime$3() {
        const defaultTime = 120;
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("safari") && !userAgent.includes("chrome")) return 240;
        return defaultTime;
      }
      var native_exports = /* @__PURE__ */ __exportAll({
        averageResponseTime: () => averageResponseTime$2,
        canBeUsed: () => canBeUsed$2,
        close: () => close$2,
        create: () => create$2,
        microSeconds: () => microSeconds$2,
        onMessage: () => onMessage$2,
        postMessage: () => postMessage$2,
        type: () => type$2
      });
      var microSeconds$2 = microSeconds$5;
      var type$2 = "native";
      function create$2(channelName) {
        const state = {
          time: microSeconds$5(),
          messagesCallback: null,
          bc: new BroadcastChannel(channelName),
          subFns: []
        };
        state.bc.onmessage = (msg) => {
          if (state.messagesCallback) state.messagesCallback(msg.data);
        };
        return state;
      }
      function close$2(channelState) {
        channelState.bc.close();
        channelState.subFns = [];
      }
      function postMessage$2(channelState, messageJson) {
        try {
          channelState.bc.postMessage(messageJson);
          return PROMISE_RESOLVED_VOID;
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function onMessage$2(channelState, fn) {
        channelState.messagesCallback = fn;
      }
      function canBeUsed$2() {
        if (typeof window === "undefined") return false;
        if (typeof BroadcastChannel === "function") {
          if (BroadcastChannel._pubkey) throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
          return true;
        }
        return false;
      }
      function averageResponseTime$2() {
        return 150;
      }
      var server_exports = /* @__PURE__ */ __exportAll({
        averageResponseTime: () => averageResponseTime$1,
        canBeUsed: () => canBeUsed$1,
        close: () => close$1,
        create: () => create$1,
        getSocketInstance: () => getSocketInstance,
        microSeconds: () => microSeconds$1,
        onMessage: () => onMessage$1,
        postMessage: () => postMessage$1,
        removeStorageEventListener: () => removeStorageEventListener,
        setupSocketConnection: () => setupSocketConnection,
        storageKey: () => storageKey,
        type: () => type$1
      });
      var microSeconds$1 = microSeconds$5;
      var KEY_PREFIX = "pubkey.broadcastChannel-";
      var type$1 = "server";
      var SOCKET_CONN_INSTANCE = null;
      var runningChannels = /* @__PURE__ */ new Set();
      function storageKey(channelName) {
        return KEY_PREFIX + channelName;
      }
      function postMessage$1(channelState, messageJson) {
        return new Promise((resolve, reject) => {
          sleep().then(async () => {
            const key = storageKey(channelState.channelName);
            const channelEncPrivKey = (0, _toruslabs_metadata_helpers.keccak256Bytes)((0, _toruslabs_metadata_helpers.utf8ToBytes)(key));
            const encData = await (0, _toruslabs_metadata_helpers.encryptData)(channelEncPrivKey, {
              token: generateRandomId(),
              time: Date.now(),
              data: messageJson,
              uuid: channelState.uuid
            });
            const body = {
              allowedOrigin: channelState.server.allowed_origin,
              sameIpCheck: true,
              key: (0, _toruslabs_metadata_helpers.bytesToHex)((0, _toruslabs_eccrypto.getPublic)(channelEncPrivKey)),
              data: encData,
              signature: (0, _toruslabs_metadata_helpers.bytesToHex)(await (0, _toruslabs_eccrypto.sign)(channelEncPrivKey, (0, _toruslabs_metadata_helpers.keccak256Bytes)((0, _toruslabs_metadata_helpers.utf8ToBytes)(encData))))
            };
            if (channelState.timeout) body.timeout = channelState.timeout;
            return fetch(`${channelState.server.api_url}/channel/set`, {
              method: "POST",
              body: JSON.stringify(body),
              headers: { "Content-Type": "application/json; charset=utf-8" }
            }).then(resolve).catch(reject);
          }).catch(reject);
        });
      }
      function getSocketInstance(socketUrl) {
        if (SOCKET_CONN_INSTANCE) return SOCKET_CONN_INSTANCE;
        const SOCKET_CONN = (0, socket_io_client.io)(socketUrl, {
          transports: ["websocket", "polling"],
          withCredentials: true,
          reconnectionDelayMax: 1e4,
          reconnectionAttempts: 10
        });
        SOCKET_CONN.on("connect_error", (err) => {
          SOCKET_CONN.io.opts.transports = ["polling", "websocket"];
          log.error("connect error", err);
        });
        SOCKET_CONN.on("connect", async () => {
          const { engine } = SOCKET_CONN.io;
          log.debug("initially connected to", engine.transport.name);
          engine.once("upgrade", () => {
            log.debug("upgraded", engine.transport.name);
          });
          engine.once("close", (reason) => {
            log.debug("connection closed", reason);
          });
        });
        SOCKET_CONN.on("error", (err) => {
          log.error("socket errored", err);
          SOCKET_CONN.disconnect();
        });
        SOCKET_CONN_INSTANCE = SOCKET_CONN;
        return SOCKET_CONN;
      }
      function setupSocketConnection(socketUrl, channelState, fn) {
        const socketConn = getSocketInstance(socketUrl);
        const key = storageKey(channelState.channelName);
        const channelEncPrivKey = (0, _toruslabs_metadata_helpers.keccak256Bytes)((0, _toruslabs_metadata_helpers.utf8ToBytes)(key));
        const channelPubKey = (0, _toruslabs_metadata_helpers.bytesToHex)((0, _toruslabs_eccrypto.getPublic)(channelEncPrivKey));
        if (socketConn.connected) socketConn.emit("v2:check_auth_status", channelPubKey, {
          sameIpCheck: true,
          allowedOrigin: channelState.server.allowed_origin
        });
        else socketConn.once("connect", () => {
          log.debug("connected with socket");
          socketConn.emit("v2:check_auth_status", channelPubKey, {
            sameIpCheck: true,
            allowedOrigin: channelState.server.allowed_origin
          });
        });
        const reconnect = () => {
          socketConn.once("connect", async () => {
            if (runningChannels.has(channelState.channelName)) socketConn.emit("v2:check_auth_status", channelPubKey, {
              sameIpCheck: true,
              allowedOrigin: channelState.server.allowed_origin
            });
          });
        };
        const visibilityListener = () => {
          if (!socketConn || !runningChannels.has(channelState.channelName)) {
            document.removeEventListener("visibilitychange", visibilityListener);
            return;
          }
          if (!socketConn.connected && document.visibilityState === "visible") reconnect();
        };
        const listener = async (ev) => {
          try {
            const decData = await (0, _toruslabs_metadata_helpers.decryptData)(channelEncPrivKey, ev);
            log.info(decData);
            fn(decData);
          } catch (error) {
            log.error(error);
          }
        };
        socketConn.on("disconnect", () => {
          log.debug("socket disconnected");
          if (runningChannels.has(channelState.channelName)) {
            log.error("socket disconnected unexpectedly, reconnecting socket");
            reconnect();
          }
        });
        socketConn.on(`${channelPubKey}_success`, listener);
        if (typeof document !== "undefined") document.addEventListener("visibilitychange", visibilityListener);
        return socketConn;
      }
      function removeStorageEventListener() {
        if (SOCKET_CONN_INSTANCE) SOCKET_CONN_INSTANCE.disconnect();
      }
      function canBeUsed$1() {
        return true;
      }
      function create$1(channelName, originalOptions) {
        const options = fillOptionsWithDefaults(originalOptions);
        if (!canBeUsed$1()) throw new Error("BroadcastChannel: server cannot be used");
        const state = {
          channelName,
          uuid: generateRandomId(),
          eMIs: new oblivious_set.ObliviousSet(options.server.removeTimeout),
          server: {
            api_url: options.server.api_url,
            socket_url: options.server.socket_url,
            allowed_origin: options.server.allowed_origin
          },
          time: microSeconds$5()
        };
        if (options.server.timeout) state.timeout = options.server.timeout;
        setupSocketConnection(options.server.socket_url, state, (msgObj) => {
          if (!state.messagesCallback) return;
          if (msgObj.uuid === state.uuid) return;
          if (!msgObj.token || state.eMIs.has(msgObj.token)) return;
          state.eMIs.add(msgObj.token);
          state.messagesCallback(msgObj.data);
        });
        runningChannels.add(channelName);
        return state;
      }
      function close$1(channelState) {
        runningChannels.delete(channelState.channelName);
      }
      function onMessage$1(channelState, fn, time) {
        channelState.messagesCallbackTime = time;
        channelState.messagesCallback = fn;
      }
      function averageResponseTime$1() {
        return 500;
      }
      var simulate_exports = /* @__PURE__ */ __exportAll({
        SIMULATE_DELAY_TIME: () => 5,
        averageResponseTime: () => averageResponseTime,
        canBeUsed: () => canBeUsed,
        close: () => close,
        create: () => create,
        microSeconds: () => microSeconds,
        onMessage: () => onMessage,
        postMessage: () => postMessage,
        type: () => type
      });
      var microSeconds = microSeconds$5;
      var type = "simulate";
      var SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
      function create(channelName) {
        const state = {
          time: microSeconds$5(),
          name: channelName,
          messagesCallback: null
        };
        SIMULATE_CHANNELS.add(state);
        return state;
      }
      function close(channelState) {
        SIMULATE_CHANNELS.delete(channelState);
      }
      function postMessage(channelState, messageJson) {
        return new Promise((resolve) => {
          setTimeout(() => {
            Array.from(SIMULATE_CHANNELS).forEach((channel) => {
              if (channel.name === channelState.name && channel !== channelState && !!channel.messagesCallback && channel.time < messageJson.time) channel.messagesCallback(messageJson);
            });
            resolve();
          }, 5);
        });
      }
      function onMessage(channelState, fn) {
        channelState.messagesCallback = fn;
      }
      function canBeUsed() {
        return true;
      }
      function averageResponseTime() {
        return 5;
      }
      var METHODS = [
        native_exports,
        indexed_db_exports,
        localstorage_exports,
        server_exports
      ];
      function chooseMethod(options) {
        let chooseMethods = [].concat(options.methods || [], METHODS).filter(Boolean);
        if (options.type) {
          if (options.type === "simulate") return simulate_exports;
          const ret = chooseMethods.find((m) => m.type === options.type);
          if (!ret) throw new Error(`method-type ${options.type} not found`);
          else return ret;
        }
        if (!options.webWorkerSupport) chooseMethods = chooseMethods.filter((m) => m.type !== "idb");
        const useMethod = chooseMethods.find((method) => method.canBeUsed(options));
        if (!useMethod) throw new Error(`No useable method found in ${JSON.stringify(METHODS.map((m) => m.type))}`);
        else return useMethod;
      }
      var ENFORCED_OPTIONS;
      function enforceOptions(options) {
        ENFORCED_OPTIONS = options;
      }
      var OPEN_BROADCAST_CHANNELS = /* @__PURE__ */ new Set();
      var lastId = 0;
      var BroadcastChannel$1 = class {
        static _pubkey = true;
        id;
        name;
        options;
        method;
        closed;
        _addEL;
        _prepP;
        _state;
        _uMP;
        _iL;
        _onML;
        _befC;
        constructor(name, options) {
          this.id = lastId++;
          OPEN_BROADCAST_CHANNELS.add(this);
          this.name = name;
          if (ENFORCED_OPTIONS) options = ENFORCED_OPTIONS;
          this.options = fillOptionsWithDefaults(options || {});
          this.method = chooseMethod(this.options);
          this.closed = false;
          this._iL = false;
          this._onML = null;
          this._addEL = {
            message: [],
            internal: []
          };
          this._uMP = /* @__PURE__ */ new Set();
          this._befC = [];
          this._prepP = null;
          _prepareChannel(this);
        }
        get type() {
          return this.method.type;
        }
        get isClosed() {
          return this.closed;
        }
        set onmessage(fn) {
          const listenObj = {
            time: this.method.microSeconds(),
            fn
          };
          _removeListenerObject(this, "message", this._onML);
          if (fn && typeof fn === "function") {
            this._onML = listenObj;
            _addListenerObject(this, "message", listenObj);
          } else this._onML = null;
        }
        postMessage(msg) {
          if (this.closed) throw new Error(`BroadcastChannel.postMessage(): Cannot post message after channel has closed ${JSON.stringify(msg)}`);
          return _post(this, "message", msg);
        }
        postInternal(msg) {
          return _post(this, "internal", msg);
        }
        addEventListener(type2, fn) {
          const listenObj = {
            time: this.method.microSeconds(),
            fn
          };
          _addListenerObject(this, type2, listenObj);
        }
        removeEventListener(type2, fn) {
          const obj = this._addEL[type2].find((o) => o.fn === fn);
          _removeListenerObject(this, type2, obj);
        }
        close() {
          if (this.closed) return Promise.resolve();
          OPEN_BROADCAST_CHANNELS.delete(this);
          this.closed = true;
          const awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID;
          this._onML = null;
          this._addEL.message = [];
          return awaitPrepare.then(() => Promise.all(Array.from(this._uMP))).then(() => Promise.all(this._befC.map((fn) => fn()))).then(() => this.method.close ? this.method.close(this._state) : PROMISE_RESOLVED_VOID);
        }
      };
      function _post(broadcastChannel, type2, msg) {
        const msgObj = {
          time: broadcastChannel.method.microSeconds(),
          type: type2,
          data: msg
        };
        return (broadcastChannel._prepP ? broadcastChannel._prepP : PROMISE_RESOLVED_VOID).then(() => {
          const sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
          broadcastChannel._uMP.add(sendPromise);
          sendPromise.catch(() => {
          }).then(() => broadcastChannel._uMP.delete(sendPromise));
          return sendPromise;
        });
      }
      function _prepareChannel(channel) {
        const maybePromise = channel.method.create(channel.name, channel.options);
        if (isPromise(maybePromise)) {
          const promise = maybePromise;
          channel._prepP = promise;
          promise.then((s) => {
            channel._state = s;
            return s;
          }).catch((err) => {
            throw err;
          });
        } else channel._state = maybePromise;
      }
      function _hasMessageListeners(channel) {
        if (channel._addEL.message.length > 0) return true;
        if (channel._addEL.internal.length > 0) return true;
        return false;
      }
      function _startListening(channel) {
        if (!channel._iL && _hasMessageListeners(channel)) {
          const listenerFn = (msgObj) => {
            channel._addEL[msgObj.type].forEach((listenerObject) => {
              if (msgObj.time >= listenerObject.time) listenerObject.fn(msgObj.data);
              else if (channel.method.type === "server") listenerObject.fn(msgObj.data);
            });
          };
          const time = channel.method.microSeconds();
          if (channel._prepP) channel._prepP.then(() => {
            channel._iL = true;
            channel.method.onMessage(channel._state, listenerFn, time);
            return true;
          }).catch((err) => {
            throw err;
          });
          else {
            channel._iL = true;
            channel.method.onMessage(channel._state, listenerFn, time);
          }
        }
      }
      function _stopListening(channel) {
        if (channel._iL && !_hasMessageListeners(channel)) {
          channel._iL = false;
          const time = channel.method.microSeconds();
          channel.method.onMessage(channel._state, null, time);
        }
      }
      function _addListenerObject(channel, type2, obj) {
        channel._addEL[type2].push(obj);
        _startListening(channel);
      }
      function _removeListenerObject(channel, type2, obj) {
        if (obj) {
          channel._addEL[type2] = channel._addEL[type2].filter((o) => o !== obj);
          _stopListening(channel);
        }
      }
      var RedundantAdaptiveBroadcastChannel = class {
        name;
        options;
        closed;
        onML;
        methodPriority;
        channels;
        listeners;
        processedNonces;
        nonce;
        constructor(name, options = {}) {
          this.name = name;
          this.options = options;
          this.closed = false;
          this.onML = null;
          this.methodPriority = [
            type$2,
            type$3,
            type$1
          ];
          this.channels = /* @__PURE__ */ new Map();
          this.listeners = /* @__PURE__ */ new Set();
          this.processedNonces = /* @__PURE__ */ new Set();
          this.nonce = 0;
          this.initChannels();
        }
        set onmessage(fn) {
          if (this.onML) this.removeEventListener("message", this.onML);
          if (fn && typeof fn === "function") {
            this.onML = fn;
            this.addEventListener("message", fn);
          } else this.onML = null;
        }
        initChannels() {
          if (this.options.type === "simulate") this.methodPriority = [type];
          this.methodPriority.forEach((method) => {
            try {
              const channel = new BroadcastChannel$1(this.name, {
                ...this.options,
                type: method
              });
              this.channels.set(method, channel);
              log.debug(`Succeeded to initialize ${method} method in channel ${this.name}`);
              channel.onmessage = (event) => this.handleMessage(event);
            } catch (error) {
              log.warn(`Failed to initialize ${method} method in channel ${this.name}: ${error instanceof Error ? error.message : String(error)}`);
            }
          });
          if (this.channels.size === 0) throw new Error("Failed to initialize any communication method");
        }
        allChannels() {
          return Array.from(this.channels.keys());
        }
        hasChannel(method) {
          return this.channels.has(method);
        }
        handleMessage(event) {
          if (event && event.nonce) {
            if (this.processedNonces.has(event.nonce)) return;
            this.processedNonces.add(event.nonce);
            if (this.processedNonces.size > 1e3) {
              const oldestNonce = Array.from(this.processedNonces).sort()[0];
              this.processedNonces.delete(oldestNonce);
            }
            this.listeners.forEach((listener) => {
              listener(event.message);
            });
          }
        }
        async postMessage(message) {
          if (this.closed) throw new Error(`AdaptiveBroadcastChannel.postMessage(): Cannot post message after channel has closed ${/**
          * In the past when this error appeared, it was realy hard to debug.
          * So now we log the msg together with the error so it at least
          * gives some clue about where in your application this happens.
          */
          JSON.stringify(message)}`);
          const wrappedMessage = {
            nonce: this.generateNonce(),
            message
          };
          const postPromises = Array.from(this.channels.entries()).map(([method, channel]) => channel.postMessage(wrappedMessage).catch((error) => {
            log.warn(`Failed to send via ${method}: ${error.message}`);
            throw error;
          }));
          if (!(await Promise.allSettled(postPromises)).some((p) => p.status === "fulfilled")) throw new Error("Failed to send message through any method");
          return message;
        }
        generateNonce() {
          return `${Date.now()}-${this.nonce++}`;
        }
        addEventListener(_type, listener) {
          this.listeners.add(listener);
        }
        removeEventListener(_type, listener) {
          this.listeners.delete(listener);
        }
        async close() {
          if (this.closed) return;
          this.onML = null;
          const promises = [];
          for (const c of this.channels.values()) promises.push(c.close());
          await Promise.all(promises);
          this.channels.clear();
          this.listeners.clear();
          this.closed = true;
        }
      };
      exports.BroadcastChannel = BroadcastChannel$1;
      Object.defineProperty(exports, "IndexedDbMethod", {
        enumerable: true,
        get: function() {
          return indexed_db_exports;
        }
      });
      Object.defineProperty(exports, "LocalstorageMethod", {
        enumerable: true,
        get: function() {
          return localstorage_exports;
        }
      });
      Object.defineProperty(exports, "NativeMethod", {
        enumerable: true,
        get: function() {
          return native_exports;
        }
      });
      exports.OPEN_BROADCAST_CHANNELS = OPEN_BROADCAST_CHANNELS;
      exports.RedundantAdaptiveBroadcastChannel = RedundantAdaptiveBroadcastChannel;
      Object.defineProperty(exports, "ServerMethod", {
        enumerable: true,
        get: function() {
          return server_exports;
        }
      });
      exports.chooseMethod = chooseMethod;
      Object.defineProperty(exports, "decodeBase64Url", {
        enumerable: true,
        get: function() {
          return _toruslabs_metadata_helpers.decodeBase64Url;
        }
      });
      Object.defineProperty(exports, "encodeBase64Url", {
        enumerable: true,
        get: function() {
          return _toruslabs_metadata_helpers.encodeBase64Url;
        }
      });
      exports.enforceOptions = enforceOptions;
      Object.defineProperty(exports, "fromBase64", {
        enumerable: true,
        get: function() {
          return _toruslabs_metadata_helpers.fromBase64;
        }
      });
      Object.defineProperty(exports, "toBase64", {
        enumerable: true,
        get: function() {
          return _toruslabs_metadata_helpers.toBase64;
        }
      });
      Object.defineProperty(exports, "toBufferLike", {
        enumerable: true,
        get: function() {
          return _toruslabs_metadata_helpers.toBufferLike;
        }
      });
    }
  });

  // test/scripts/util.js
  var require_util2 = __commonJS({
    "test/scripts/util.js"(exports, module) {
      "use strict";
      function getParameterByName2(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
      module.exports = { getParameterByName: getParameterByName2 };
    }
  });

  // test/scripts/e2e.js
  var { BroadcastChannel: BroadcastChannel2 } = require_lib5();
  var { getParameterByName } = require_util2();
  function wait(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function randomBoolean() {
    return Math.random() > 0.5;
  }
  function run() {
    console.log("run()");
    console.log("navigator.userAgent: " + navigator.userAgent);
    var methodType = getParameterByName("methodType");
    if (!methodType || methodType === "" || methodType === "default") methodType = void 0;
    console.log("methodType: " + methodType);
    var autoStart = getParameterByName("autoStart");
    console.log("autoStart: " + autoStart);
    var selectEl = document.getElementById("method-type-select");
    selectEl.onchange = function(ev) {
      var newValue = selectEl.value;
      var newUrl = location.origin + location.pathname + "?methodType=" + encodeURIComponent(newValue);
      location = newUrl;
    };
    if (methodType) {
      selectEl.value = methodType;
    }
    var TEST_MESSAGES = 25;
    var body = document.getElementById("body");
    var msgContainer = document.getElementById("messages");
    var rightContainer = document.getElementById("right");
    var messageCountContainer = document.getElementById("msg-count");
    var messageCountWorkerContainer = document.getElementById("msg-count-worker");
    var stateContainer = document.getElementById("state");
    const iframeEl = document.getElementById("test-iframe");
    document.getElementById("user-agent").textContent = navigator.userAgent;
    var startTime;
    var channel = new BroadcastChannel2("foobar", {
      type: methodType
    });
    document.getElementById("method").textContent = channel.type;
    var messagesSend = 0;
    var answerPool = {};
    let useWorker = false;
    function gotAllAnswers(answerPool2) {
      if (!answerPool2.iframe) return false;
      if (useWorker && !answerPool2.worker) return false;
      return true;
    }
    window.startBroadcastChannel = async function() {
      console.log("window.startBroadcastChannel()");
      stateContainer.textContent = "running..";
      const rand = (/* @__PURE__ */ new Date()).getTime();
      channel.onmessage = function(msg) {
        answerPool[msg.from] = msg;
        var textnode = document.createTextNode(JSON.stringify(msg) + "</br>");
        msgContainer.appendChild(textnode);
        if (gotAllAnswers(answerPool)) {
          answerPool = {};
          if (messagesSend >= TEST_MESSAGES) {
            console.log("main: sucess");
            body.style.backgroundColor = "green";
            stateContainer.textContent = "SUCCESS";
            const amountTime = (/* @__PURE__ */ new Date()).getTime() - startTime;
            document.getElementById("time-amount").textContent = amountTime + "ms";
          } else {
            messagesSend++;
            console.log("main: send next message (" + messagesSend + ") ====================");
            messageCountContainer.textContent = messagesSend;
            channel.postMessage({
              from: "main",
              foo: "bar",
              step: messagesSend
            });
          }
        }
      };
      iframeEl.src = "./iframe.html?channelName=" + channel.name + "&methodType=" + channel.type + "&t=" + rand;
      await new Promise((res) => iframeEl.onload = () => res());
      console.log("main: Iframe has loaded");
      if (channel.type !== "localstorage" && typeof window.Worker === "function") {
        useWorker = true;
        const worker = new Worker("worker.js?t=" + rand);
        worker.onerror = (event) => {
          console.error("worker: " + event.message + " (" + event.filename + ":" + event.lineno + ")");
        };
        await new Promise((res) => {
          worker.addEventListener(
            "message",
            (e) => {
              setTimeout(() => {
                console.log("main: Worker has started");
                res();
              }, 200);
            },
            false
          );
          worker.postMessage({
            cmd: "start",
            msg: {
              channelName: channel.name,
              methodType: channel.type
            }
          });
        });
      }
      await wait(1e3);
      console.log("========== START SENDING MESSAGES " + channel.type);
      startTime = (/* @__PURE__ */ new Date()).getTime();
      channel.postMessage({
        from: "main",
        step: 0
      });
      console.log("main: message send (0)");
    };
    window.startWorkerTest = async function() {
      console.log("window.startWorkerTest()");
      stateContainer.textContent = "running..";
      if (channel.type !== "localstorage" && typeof window.Worker === "function") {
        useWorker = true;
        const worker = new Worker("worker.js?t=" + (/* @__PURE__ */ new Date()).getTime());
        worker.onerror = (event) => {
          console.error("worker: " + event.message + " (" + event.filename + ":" + event.lineno + ")");
        };
        await new Promise((res) => {
          worker.addEventListener(
            "message",
            (e) => {
              setTimeout(() => {
                console.log("main: Worker has started");
                res();
              }, 200);
            },
            false
          );
          worker.postMessage({
            cmd: "start",
            msg: {
              channelName: channel.name,
              methodType: channel.type
            }
          });
        });
      }
      console.log("========== START SENDING MESSAGES " + channel.type);
      startTime = (/* @__PURE__ */ new Date()).getTime();
      let t = 20;
      const perRun = 100;
      let k = 0;
      let done = 0;
      while (t > 0) {
        t--;
        await Promise.all(
          new Array(perRun).fill(0).map(async () => {
            if (randomBoolean()) {
              await wait(randomNumber(10, 150));
            }
            const msgId = "worker-test-" + startTime + "-" + k++;
            const waitForResponsePromise = new Promise((res) => {
              const listener = (msg) => {
                if (msg.answer == true && msg.original.id === msgId) {
                  console.dir("msg for response:;:");
                  console.dir(msg);
                  done++;
                  messageCountWorkerContainer.textContent = done;
                  channel.removeEventListener("message", listener);
                  res();
                }
              };
              channel.addEventListener("message", listener);
            });
            channel.postMessage({
              from: "main-worker",
              id: msgId
            });
            await Promise.race([waitForResponsePromise.then(() => false), wait(2e3).then(() => true)]).then((errored) => {
              if (errored) {
                const errorMessage = "ERROR startWorkerTest() timed out for msgId " + msgId;
                console.error(errorMessage);
                throw new Error(errorMessage);
              }
            });
          })
        );
      }
      body.style.backgroundColor = "green";
      stateContainer.textContent = "SUCCESS";
      const amountTime = (/* @__PURE__ */ new Date()).getTime() - startTime;
      document.getElementById("time-amount").textContent = amountTime + "ms";
    };
    if (autoStart && autoStart !== "") {
      window[autoStart]();
    }
  }
  try {
    run();
  } catch (error) {
    console.log("error in run-function:");
    console.error(error);
  }
})();
/*! Bundled license information:

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/der.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/secp256k1.js:
@noble/curves/abstract/edwards.js:
@noble/curves/abstract/montgomery.js:
@noble/curves/abstract/oprf.js:
@noble/curves/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
