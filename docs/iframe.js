"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
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

  // node_modules/core-js/modules/_global.js
  var require_global = __commonJS({
    "node_modules/core-js/modules/_global.js"(exports, module) {
      var global = module.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
      if (typeof __g == "number") __g = global;
    }
  });

  // node_modules/core-js/modules/_has.js
  var require_has = __commonJS({
    "node_modules/core-js/modules/_has.js"(exports, module) {
      var hasOwnProperty = {}.hasOwnProperty;
      module.exports = function(it, key) {
        return hasOwnProperty.call(it, key);
      };
    }
  });

  // node_modules/core-js/modules/_fails.js
  var require_fails = __commonJS({
    "node_modules/core-js/modules/_fails.js"(exports, module) {
      module.exports = function(exec) {
        try {
          return !!exec();
        } catch (e) {
          return true;
        }
      };
    }
  });

  // node_modules/core-js/modules/_descriptors.js
  var require_descriptors = __commonJS({
    "node_modules/core-js/modules/_descriptors.js"(exports, module) {
      module.exports = !require_fails()(function() {
        return Object.defineProperty({}, "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }
  });

  // node_modules/core-js/modules/_core.js
  var require_core = __commonJS({
    "node_modules/core-js/modules/_core.js"(exports, module) {
      var core = module.exports = { version: "2.6.12" };
      if (typeof __e == "number") __e = core;
    }
  });

  // node_modules/core-js/modules/_is-object.js
  var require_is_object = __commonJS({
    "node_modules/core-js/modules/_is-object.js"(exports, module) {
      module.exports = function(it) {
        return typeof it === "object" ? it !== null : typeof it === "function";
      };
    }
  });

  // node_modules/core-js/modules/_an-object.js
  var require_an_object = __commonJS({
    "node_modules/core-js/modules/_an-object.js"(exports, module) {
      var isObject = require_is_object();
      module.exports = function(it) {
        if (!isObject(it)) throw TypeError(it + " is not an object!");
        return it;
      };
    }
  });

  // node_modules/core-js/modules/_dom-create.js
  var require_dom_create = __commonJS({
    "node_modules/core-js/modules/_dom-create.js"(exports, module) {
      var isObject = require_is_object();
      var document2 = require_global().document;
      var is = isObject(document2) && isObject(document2.createElement);
      module.exports = function(it) {
        return is ? document2.createElement(it) : {};
      };
    }
  });

  // node_modules/core-js/modules/_ie8-dom-define.js
  var require_ie8_dom_define = __commonJS({
    "node_modules/core-js/modules/_ie8-dom-define.js"(exports, module) {
      module.exports = !require_descriptors() && !require_fails()(function() {
        return Object.defineProperty(require_dom_create()("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }
  });

  // node_modules/core-js/modules/_to-primitive.js
  var require_to_primitive = __commonJS({
    "node_modules/core-js/modules/_to-primitive.js"(exports, module) {
      var isObject = require_is_object();
      module.exports = function(it, S) {
        if (!isObject(it)) return it;
        var fn, val;
        if (S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
        if (typeof (fn = it.valueOf) == "function" && !isObject(val = fn.call(it))) return val;
        if (!S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
        throw TypeError("Can't convert object to primitive value");
      };
    }
  });

  // node_modules/core-js/modules/_object-dp.js
  var require_object_dp = __commonJS({
    "node_modules/core-js/modules/_object-dp.js"(exports) {
      var anObject = require_an_object();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var toPrimitive = require_to_primitive();
      var dP = Object.defineProperty;
      exports.f = require_descriptors() ? Object.defineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPrimitive(P, true);
        anObject(Attributes);
        if (IE8_DOM_DEFINE) try {
          return dP(O, P, Attributes);
        } catch (e) {
        }
        if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
      };
    }
  });

  // node_modules/core-js/modules/_property-desc.js
  var require_property_desc = __commonJS({
    "node_modules/core-js/modules/_property-desc.js"(exports, module) {
      module.exports = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value
        };
      };
    }
  });

  // node_modules/core-js/modules/_hide.js
  var require_hide = __commonJS({
    "node_modules/core-js/modules/_hide.js"(exports, module) {
      var dP = require_object_dp();
      var createDesc = require_property_desc();
      module.exports = require_descriptors() ? function(object, key, value) {
        return dP.f(object, key, createDesc(1, value));
      } : function(object, key, value) {
        object[key] = value;
        return object;
      };
    }
  });

  // node_modules/core-js/modules/_uid.js
  var require_uid = __commonJS({
    "node_modules/core-js/modules/_uid.js"(exports, module) {
      var id = 0;
      var px = Math.random();
      module.exports = function(key) {
        return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + px).toString(36));
      };
    }
  });

  // node_modules/core-js/modules/_library.js
  var require_library = __commonJS({
    "node_modules/core-js/modules/_library.js"(exports, module) {
      module.exports = false;
    }
  });

  // node_modules/core-js/modules/_shared.js
  var require_shared = __commonJS({
    "node_modules/core-js/modules/_shared.js"(exports, module) {
      var core = require_core();
      var global = require_global();
      var SHARED = "__core-js_shared__";
      var store = global[SHARED] || (global[SHARED] = {});
      (module.exports = function(key, value) {
        return store[key] || (store[key] = value !== void 0 ? value : {});
      })("versions", []).push({
        version: core.version,
        mode: require_library() ? "pure" : "global",
        copyright: "\xA9 2020 Denis Pushkarev (zloirock.ru)"
      });
    }
  });

  // node_modules/core-js/modules/_function-to-string.js
  var require_function_to_string = __commonJS({
    "node_modules/core-js/modules/_function-to-string.js"(exports, module) {
      module.exports = require_shared()("native-function-to-string", Function.toString);
    }
  });

  // node_modules/core-js/modules/_redefine.js
  var require_redefine = __commonJS({
    "node_modules/core-js/modules/_redefine.js"(exports, module) {
      var global = require_global();
      var hide = require_hide();
      var has = require_has();
      var SRC = require_uid()("src");
      var $toString = require_function_to_string();
      var TO_STRING = "toString";
      var TPL = ("" + $toString).split(TO_STRING);
      require_core().inspectSource = function(it) {
        return $toString.call(it);
      };
      (module.exports = function(O, key, val, safe) {
        var isFunction = typeof val == "function";
        if (isFunction) has(val, "name") || hide(val, "name", key);
        if (O[key] === val) return;
        if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));
        if (O === global) {
          O[key] = val;
        } else if (!safe) {
          delete O[key];
          hide(O, key, val);
        } else if (O[key]) {
          O[key] = val;
        } else {
          hide(O, key, val);
        }
      })(Function.prototype, TO_STRING, function toString() {
        return typeof this == "function" && this[SRC] || $toString.call(this);
      });
    }
  });

  // node_modules/core-js/modules/_a-function.js
  var require_a_function = __commonJS({
    "node_modules/core-js/modules/_a-function.js"(exports, module) {
      module.exports = function(it) {
        if (typeof it != "function") throw TypeError(it + " is not a function!");
        return it;
      };
    }
  });

  // node_modules/core-js/modules/_ctx.js
  var require_ctx = __commonJS({
    "node_modules/core-js/modules/_ctx.js"(exports, module) {
      var aFunction = require_a_function();
      module.exports = function(fn, that, length) {
        aFunction(fn);
        if (that === void 0) return fn;
        switch (length) {
          case 1:
            return function(a) {
              return fn.call(that, a);
            };
          case 2:
            return function(a, b) {
              return fn.call(that, a, b);
            };
          case 3:
            return function(a, b, c) {
              return fn.call(that, a, b, c);
            };
        }
        return function() {
          return fn.apply(that, arguments);
        };
      };
    }
  });

  // node_modules/core-js/modules/_export.js
  var require_export = __commonJS({
    "node_modules/core-js/modules/_export.js"(exports, module) {
      var global = require_global();
      var core = require_core();
      var hide = require_hide();
      var redefine = require_redefine();
      var ctx = require_ctx();
      var PROTOTYPE = "prototype";
      var $export = function(type, name, source) {
        var IS_FORCED = type & $export.F;
        var IS_GLOBAL = type & $export.G;
        var IS_STATIC = type & $export.S;
        var IS_PROTO = type & $export.P;
        var IS_BIND = type & $export.B;
        var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
        var exports2 = IS_GLOBAL ? core : core[name] || (core[name] = {});
        var expProto = exports2[PROTOTYPE] || (exports2[PROTOTYPE] = {});
        var key, own, out, exp;
        if (IS_GLOBAL) source = name;
        for (key in source) {
          own = !IS_FORCED && target && target[key] !== void 0;
          out = (own ? target : source)[key];
          exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == "function" ? ctx(Function.call, out) : out;
          if (target) redefine(target, key, out, type & $export.U);
          if (exports2[key] != out) hide(exports2, key, exp);
          if (IS_PROTO && expProto[key] != out) expProto[key] = out;
        }
      };
      global.core = core;
      $export.F = 1;
      $export.G = 2;
      $export.S = 4;
      $export.P = 8;
      $export.B = 16;
      $export.W = 32;
      $export.U = 64;
      $export.R = 128;
      module.exports = $export;
    }
  });

  // node_modules/core-js/modules/_meta.js
  var require_meta = __commonJS({
    "node_modules/core-js/modules/_meta.js"(exports, module) {
      var META = require_uid()("meta");
      var isObject = require_is_object();
      var has = require_has();
      var setDesc = require_object_dp().f;
      var id = 0;
      var isExtensible = Object.isExtensible || function() {
        return true;
      };
      var FREEZE = !require_fails()(function() {
        return isExtensible(Object.preventExtensions({}));
      });
      var setMeta = function(it) {
        setDesc(it, META, { value: {
          i: "O" + ++id,
          // object ID
          w: {}
          // weak collections IDs
        } });
      };
      var fastKey = function(it, create) {
        if (!isObject(it)) return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
        if (!has(it, META)) {
          if (!isExtensible(it)) return "F";
          if (!create) return "E";
          setMeta(it);
        }
        return it[META].i;
      };
      var getWeak = function(it, create) {
        if (!has(it, META)) {
          if (!isExtensible(it)) return true;
          if (!create) return false;
          setMeta(it);
        }
        return it[META].w;
      };
      var onFreeze = function(it) {
        if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
        return it;
      };
      var meta = module.exports = {
        KEY: META,
        NEED: false,
        fastKey,
        getWeak,
        onFreeze
      };
    }
  });

  // node_modules/core-js/modules/_wks.js
  var require_wks = __commonJS({
    "node_modules/core-js/modules/_wks.js"(exports, module) {
      var store = require_shared()("wks");
      var uid = require_uid();
      var Symbol2 = require_global().Symbol;
      var USE_SYMBOL = typeof Symbol2 == "function";
      var $exports = module.exports = function(name) {
        return store[name] || (store[name] = USE_SYMBOL && Symbol2[name] || (USE_SYMBOL ? Symbol2 : uid)("Symbol." + name));
      };
      $exports.store = store;
    }
  });

  // node_modules/core-js/modules/_set-to-string-tag.js
  var require_set_to_string_tag = __commonJS({
    "node_modules/core-js/modules/_set-to-string-tag.js"(exports, module) {
      var def = require_object_dp().f;
      var has = require_has();
      var TAG = require_wks()("toStringTag");
      module.exports = function(it, tag, stat) {
        if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
      };
    }
  });

  // node_modules/core-js/modules/_wks-ext.js
  var require_wks_ext = __commonJS({
    "node_modules/core-js/modules/_wks-ext.js"(exports) {
      exports.f = require_wks();
    }
  });

  // node_modules/core-js/modules/_wks-define.js
  var require_wks_define = __commonJS({
    "node_modules/core-js/modules/_wks-define.js"(exports, module) {
      var global = require_global();
      var core = require_core();
      var LIBRARY = require_library();
      var wksExt = require_wks_ext();
      var defineProperty = require_object_dp().f;
      module.exports = function(name) {
        var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
        if (name.charAt(0) != "_" && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
      };
    }
  });

  // node_modules/core-js/modules/_cof.js
  var require_cof = __commonJS({
    "node_modules/core-js/modules/_cof.js"(exports, module) {
      var toString = {}.toString;
      module.exports = function(it) {
        return toString.call(it).slice(8, -1);
      };
    }
  });

  // node_modules/core-js/modules/_iobject.js
  var require_iobject = __commonJS({
    "node_modules/core-js/modules/_iobject.js"(exports, module) {
      var cof = require_cof();
      module.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
        return cof(it) == "String" ? it.split("") : Object(it);
      };
    }
  });

  // node_modules/core-js/modules/_defined.js
  var require_defined = __commonJS({
    "node_modules/core-js/modules/_defined.js"(exports, module) {
      module.exports = function(it) {
        if (it == void 0) throw TypeError("Can't call method on  " + it);
        return it;
      };
    }
  });

  // node_modules/core-js/modules/_to-iobject.js
  var require_to_iobject = __commonJS({
    "node_modules/core-js/modules/_to-iobject.js"(exports, module) {
      var IObject = require_iobject();
      var defined = require_defined();
      module.exports = function(it) {
        return IObject(defined(it));
      };
    }
  });

  // node_modules/core-js/modules/_to-integer.js
  var require_to_integer = __commonJS({
    "node_modules/core-js/modules/_to-integer.js"(exports, module) {
      var ceil = Math.ceil;
      var floor = Math.floor;
      module.exports = function(it) {
        return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
      };
    }
  });

  // node_modules/core-js/modules/_to-length.js
  var require_to_length = __commonJS({
    "node_modules/core-js/modules/_to-length.js"(exports, module) {
      var toInteger = require_to_integer();
      var min = Math.min;
      module.exports = function(it) {
        return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
      };
    }
  });

  // node_modules/core-js/modules/_to-absolute-index.js
  var require_to_absolute_index = __commonJS({
    "node_modules/core-js/modules/_to-absolute-index.js"(exports, module) {
      var toInteger = require_to_integer();
      var max = Math.max;
      var min = Math.min;
      module.exports = function(index, length) {
        index = toInteger(index);
        return index < 0 ? max(index + length, 0) : min(index, length);
      };
    }
  });

  // node_modules/core-js/modules/_array-includes.js
  var require_array_includes = __commonJS({
    "node_modules/core-js/modules/_array-includes.js"(exports, module) {
      var toIObject = require_to_iobject();
      var toLength = require_to_length();
      var toAbsoluteIndex = require_to_absolute_index();
      module.exports = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
          var O = toIObject($this);
          var length = toLength(O.length);
          var index = toAbsoluteIndex(fromIndex, length);
          var value;
          if (IS_INCLUDES && el != el) while (length > index) {
            value = O[index++];
            if (value != value) return true;
          }
          else for (; length > index; index++) if (IS_INCLUDES || index in O) {
            if (O[index] === el) return IS_INCLUDES || index || 0;
          }
          return !IS_INCLUDES && -1;
        };
      };
    }
  });

  // node_modules/core-js/modules/_shared-key.js
  var require_shared_key = __commonJS({
    "node_modules/core-js/modules/_shared-key.js"(exports, module) {
      var shared = require_shared()("keys");
      var uid = require_uid();
      module.exports = function(key) {
        return shared[key] || (shared[key] = uid(key));
      };
    }
  });

  // node_modules/core-js/modules/_object-keys-internal.js
  var require_object_keys_internal = __commonJS({
    "node_modules/core-js/modules/_object-keys-internal.js"(exports, module) {
      var has = require_has();
      var toIObject = require_to_iobject();
      var arrayIndexOf = require_array_includes()(false);
      var IE_PROTO = require_shared_key()("IE_PROTO");
      module.exports = function(object, names) {
        var O = toIObject(object);
        var i = 0;
        var result = [];
        var key;
        for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
        while (names.length > i) if (has(O, key = names[i++])) {
          ~arrayIndexOf(result, key) || result.push(key);
        }
        return result;
      };
    }
  });

  // node_modules/core-js/modules/_enum-bug-keys.js
  var require_enum_bug_keys = __commonJS({
    "node_modules/core-js/modules/_enum-bug-keys.js"(exports, module) {
      module.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
    }
  });

  // node_modules/core-js/modules/_object-keys.js
  var require_object_keys = __commonJS({
    "node_modules/core-js/modules/_object-keys.js"(exports, module) {
      var $keys = require_object_keys_internal();
      var enumBugKeys = require_enum_bug_keys();
      module.exports = Object.keys || function keys(O) {
        return $keys(O, enumBugKeys);
      };
    }
  });

  // node_modules/core-js/modules/_object-gops.js
  var require_object_gops = __commonJS({
    "node_modules/core-js/modules/_object-gops.js"(exports) {
      exports.f = Object.getOwnPropertySymbols;
    }
  });

  // node_modules/core-js/modules/_object-pie.js
  var require_object_pie = __commonJS({
    "node_modules/core-js/modules/_object-pie.js"(exports) {
      exports.f = {}.propertyIsEnumerable;
    }
  });

  // node_modules/core-js/modules/_enum-keys.js
  var require_enum_keys = __commonJS({
    "node_modules/core-js/modules/_enum-keys.js"(exports, module) {
      var getKeys = require_object_keys();
      var gOPS = require_object_gops();
      var pIE = require_object_pie();
      module.exports = function(it) {
        var result = getKeys(it);
        var getSymbols = gOPS.f;
        if (getSymbols) {
          var symbols = getSymbols(it);
          var isEnum = pIE.f;
          var i = 0;
          var key;
          while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
        }
        return result;
      };
    }
  });

  // node_modules/core-js/modules/_is-array.js
  var require_is_array = __commonJS({
    "node_modules/core-js/modules/_is-array.js"(exports, module) {
      var cof = require_cof();
      module.exports = Array.isArray || function isArray(arg) {
        return cof(arg) == "Array";
      };
    }
  });

  // node_modules/core-js/modules/_to-object.js
  var require_to_object = __commonJS({
    "node_modules/core-js/modules/_to-object.js"(exports, module) {
      var defined = require_defined();
      module.exports = function(it) {
        return Object(defined(it));
      };
    }
  });

  // node_modules/core-js/modules/_object-dps.js
  var require_object_dps = __commonJS({
    "node_modules/core-js/modules/_object-dps.js"(exports, module) {
      var dP = require_object_dp();
      var anObject = require_an_object();
      var getKeys = require_object_keys();
      module.exports = require_descriptors() ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject(O);
        var keys = getKeys(Properties);
        var length = keys.length;
        var i = 0;
        var P;
        while (length > i) dP.f(O, P = keys[i++], Properties[P]);
        return O;
      };
    }
  });

  // node_modules/core-js/modules/_html.js
  var require_html = __commonJS({
    "node_modules/core-js/modules/_html.js"(exports, module) {
      var document2 = require_global().document;
      module.exports = document2 && document2.documentElement;
    }
  });

  // node_modules/core-js/modules/_object-create.js
  var require_object_create = __commonJS({
    "node_modules/core-js/modules/_object-create.js"(exports, module) {
      var anObject = require_an_object();
      var dPs = require_object_dps();
      var enumBugKeys = require_enum_bug_keys();
      var IE_PROTO = require_shared_key()("IE_PROTO");
      var Empty = function() {
      };
      var PROTOTYPE = "prototype";
      var createDict = function() {
        var iframe = require_dom_create()("iframe");
        var i = enumBugKeys.length;
        var lt = "<";
        var gt = ">";
        var iframeDocument;
        iframe.style.display = "none";
        require_html().appendChild(iframe);
        iframe.src = "javascript:";
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(lt + "script" + gt + "document.F=Object" + lt + "/script" + gt);
        iframeDocument.close();
        createDict = iframeDocument.F;
        while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
        return createDict();
      };
      module.exports = Object.create || function create(O, Properties) {
        var result;
        if (O !== null) {
          Empty[PROTOTYPE] = anObject(O);
          result = new Empty();
          Empty[PROTOTYPE] = null;
          result[IE_PROTO] = O;
        } else result = createDict();
        return Properties === void 0 ? result : dPs(result, Properties);
      };
    }
  });

  // node_modules/core-js/modules/_object-gopn.js
  var require_object_gopn = __commonJS({
    "node_modules/core-js/modules/_object-gopn.js"(exports) {
      var $keys = require_object_keys_internal();
      var hiddenKeys = require_enum_bug_keys().concat("length", "prototype");
      exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return $keys(O, hiddenKeys);
      };
    }
  });

  // node_modules/core-js/modules/_object-gopn-ext.js
  var require_object_gopn_ext = __commonJS({
    "node_modules/core-js/modules/_object-gopn-ext.js"(exports, module) {
      var toIObject = require_to_iobject();
      var gOPN = require_object_gopn().f;
      var toString = {}.toString;
      var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
      var getWindowNames = function(it) {
        try {
          return gOPN(it);
        } catch (e) {
          return windowNames.slice();
        }
      };
      module.exports.f = function getOwnPropertyNames(it) {
        return windowNames && toString.call(it) == "[object Window]" ? getWindowNames(it) : gOPN(toIObject(it));
      };
    }
  });

  // node_modules/core-js/modules/_object-gopd.js
  var require_object_gopd = __commonJS({
    "node_modules/core-js/modules/_object-gopd.js"(exports) {
      var pIE = require_object_pie();
      var createDesc = require_property_desc();
      var toIObject = require_to_iobject();
      var toPrimitive = require_to_primitive();
      var has = require_has();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var gOPD = Object.getOwnPropertyDescriptor;
      exports.f = require_descriptors() ? gOPD : function getOwnPropertyDescriptor(O, P) {
        O = toIObject(O);
        P = toPrimitive(P, true);
        if (IE8_DOM_DEFINE) try {
          return gOPD(O, P);
        } catch (e) {
        }
        if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
      };
    }
  });

  // node_modules/core-js/modules/es6.symbol.js
  var require_es6_symbol = __commonJS({
    "node_modules/core-js/modules/es6.symbol.js"() {
      "use strict";
      var global = require_global();
      var has = require_has();
      var DESCRIPTORS = require_descriptors();
      var $export = require_export();
      var redefine = require_redefine();
      var META = require_meta().KEY;
      var $fails = require_fails();
      var shared = require_shared();
      var setToStringTag = require_set_to_string_tag();
      var uid = require_uid();
      var wks = require_wks();
      var wksExt = require_wks_ext();
      var wksDefine = require_wks_define();
      var enumKeys = require_enum_keys();
      var isArray = require_is_array();
      var anObject = require_an_object();
      var isObject = require_is_object();
      var toObject = require_to_object();
      var toIObject = require_to_iobject();
      var toPrimitive = require_to_primitive();
      var createDesc = require_property_desc();
      var _create = require_object_create();
      var gOPNExt = require_object_gopn_ext();
      var $GOPD = require_object_gopd();
      var $GOPS = require_object_gops();
      var $DP = require_object_dp();
      var $keys = require_object_keys();
      var gOPD = $GOPD.f;
      var dP = $DP.f;
      var gOPN = gOPNExt.f;
      var $Symbol = global.Symbol;
      var $JSON = global.JSON;
      var _stringify = $JSON && $JSON.stringify;
      var PROTOTYPE = "prototype";
      var HIDDEN = wks("_hidden");
      var TO_PRIMITIVE = wks("toPrimitive");
      var isEnum = {}.propertyIsEnumerable;
      var SymbolRegistry = shared("symbol-registry");
      var AllSymbols = shared("symbols");
      var OPSymbols = shared("op-symbols");
      var ObjectProto = Object[PROTOTYPE];
      var USE_NATIVE = typeof $Symbol == "function" && !!$GOPS.f;
      var QObject = global.QObject;
      var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
      var setSymbolDesc = DESCRIPTORS && $fails(function() {
        return _create(dP({}, "a", {
          get: function() {
            return dP(this, "a", { value: 7 }).a;
          }
        })).a != 7;
      }) ? function(it, key, D) {
        var protoDesc = gOPD(ObjectProto, key);
        if (protoDesc) delete ObjectProto[key];
        dP(it, key, D);
        if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
      } : dP;
      var wrap = function(tag) {
        var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
        sym._k = tag;
        return sym;
      };
      var isSymbol = USE_NATIVE && typeof $Symbol.iterator == "symbol" ? function(it) {
        return typeof it == "symbol";
      } : function(it) {
        return it instanceof $Symbol;
      };
      var $defineProperty = function defineProperty(it, key, D) {
        if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
        anObject(it);
        key = toPrimitive(key, true);
        anObject(D);
        if (has(AllSymbols, key)) {
          if (!D.enumerable) {
            if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
            it[HIDDEN][key] = true;
          } else {
            if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
            D = _create(D, { enumerable: createDesc(0, false) });
          }
          return setSymbolDesc(it, key, D);
        }
        return dP(it, key, D);
      };
      var $defineProperties = function defineProperties(it, P) {
        anObject(it);
        var keys = enumKeys(P = toIObject(P));
        var i = 0;
        var l = keys.length;
        var key;
        while (l > i) $defineProperty(it, key = keys[i++], P[key]);
        return it;
      };
      var $create = function create(it, P) {
        return P === void 0 ? _create(it) : $defineProperties(_create(it), P);
      };
      var $propertyIsEnumerable = function propertyIsEnumerable(key) {
        var E = isEnum.call(this, key = toPrimitive(key, true));
        if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
        return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
      };
      var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
        it = toIObject(it);
        key = toPrimitive(key, true);
        if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
        var D = gOPD(it, key);
        if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
        return D;
      };
      var $getOwnPropertyNames = function getOwnPropertyNames(it) {
        var names = gOPN(toIObject(it));
        var result = [];
        var i = 0;
        var key;
        while (names.length > i) {
          if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
        }
        return result;
      };
      var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
        var IS_OP = it === ObjectProto;
        var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
        var result = [];
        var i = 0;
        var key;
        while (names.length > i) {
          if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
        }
        return result;
      };
      if (!USE_NATIVE) {
        $Symbol = function Symbol2() {
          if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor!");
          var tag = uid(arguments.length > 0 ? arguments[0] : void 0);
          var $set = function(value) {
            if (this === ObjectProto) $set.call(OPSymbols, value);
            if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
            setSymbolDesc(this, tag, createDesc(1, value));
          };
          if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
          return wrap(tag);
        };
        redefine($Symbol[PROTOTYPE], "toString", function toString() {
          return this._k;
        });
        $GOPD.f = $getOwnPropertyDescriptor;
        $DP.f = $defineProperty;
        require_object_gopn().f = gOPNExt.f = $getOwnPropertyNames;
        require_object_pie().f = $propertyIsEnumerable;
        $GOPS.f = $getOwnPropertySymbols;
        if (DESCRIPTORS && !require_library()) {
          redefine(ObjectProto, "propertyIsEnumerable", $propertyIsEnumerable, true);
        }
        wksExt.f = function(name) {
          return wrap(wks(name));
        };
      }
      $export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });
      for (es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
      "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), j = 0; es6Symbols.length > j; ) wks(es6Symbols[j++]);
      var es6Symbols;
      var j;
      for (wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k; ) wksDefine(wellKnownSymbols[k++]);
      var wellKnownSymbols;
      var k;
      $export($export.S + $export.F * !USE_NATIVE, "Symbol", {
        // 19.4.2.1 Symbol.for(key)
        "for": function(key) {
          return has(SymbolRegistry, key += "") ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
        },
        // 19.4.2.5 Symbol.keyFor(sym)
        keyFor: function keyFor(sym) {
          if (!isSymbol(sym)) throw TypeError(sym + " is not a symbol!");
          for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
        },
        useSetter: function() {
          setter = true;
        },
        useSimple: function() {
          setter = false;
        }
      });
      $export($export.S + $export.F * !USE_NATIVE, "Object", {
        // 19.1.2.2 Object.create(O [, Properties])
        create: $create,
        // 19.1.2.4 Object.defineProperty(O, P, Attributes)
        defineProperty: $defineProperty,
        // 19.1.2.3 Object.defineProperties(O, Properties)
        defineProperties: $defineProperties,
        // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
        // 19.1.2.7 Object.getOwnPropertyNames(O)
        getOwnPropertyNames: $getOwnPropertyNames,
        // 19.1.2.8 Object.getOwnPropertySymbols(O)
        getOwnPropertySymbols: $getOwnPropertySymbols
      });
      var FAILS_ON_PRIMITIVES = $fails(function() {
        $GOPS.f(1);
      });
      $export($export.S + $export.F * FAILS_ON_PRIMITIVES, "Object", {
        getOwnPropertySymbols: function getOwnPropertySymbols(it) {
          return $GOPS.f(toObject(it));
        }
      });
      $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function() {
        var S = $Symbol();
        return _stringify([S]) != "[null]" || _stringify({ a: S }) != "{}" || _stringify(Object(S)) != "{}";
      })), "JSON", {
        stringify: function stringify(it) {
          var args = [it];
          var i = 1;
          var replacer, $replacer;
          while (arguments.length > i) args.push(arguments[i++]);
          $replacer = replacer = args[1];
          if (!isObject(replacer) && it === void 0 || isSymbol(it)) return;
          if (!isArray(replacer)) replacer = function(key, value) {
            if (typeof $replacer == "function") value = $replacer.call(this, key, value);
            if (!isSymbol(value)) return value;
          };
          args[1] = replacer;
          return _stringify.apply($JSON, args);
        }
      });
      $Symbol[PROTOTYPE][TO_PRIMITIVE] || require_hide()($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
      setToStringTag($Symbol, "Symbol");
      setToStringTag(Math, "Math", true);
      setToStringTag(global.JSON, "JSON", true);
    }
  });

  // node_modules/core-js/modules/es6.object.create.js
  var require_es6_object_create = __commonJS({
    "node_modules/core-js/modules/es6.object.create.js"() {
      var $export = require_export();
      $export($export.S, "Object", { create: require_object_create() });
    }
  });

  // node_modules/core-js/modules/es6.object.define-property.js
  var require_es6_object_define_property = __commonJS({
    "node_modules/core-js/modules/es6.object.define-property.js"() {
      var $export = require_export();
      $export($export.S + $export.F * !require_descriptors(), "Object", { defineProperty: require_object_dp().f });
    }
  });

  // node_modules/core-js/modules/es6.object.define-properties.js
  var require_es6_object_define_properties = __commonJS({
    "node_modules/core-js/modules/es6.object.define-properties.js"() {
      var $export = require_export();
      $export($export.S + $export.F * !require_descriptors(), "Object", { defineProperties: require_object_dps() });
    }
  });

  // node_modules/core-js/modules/_object-sap.js
  var require_object_sap = __commonJS({
    "node_modules/core-js/modules/_object-sap.js"(exports, module) {
      var $export = require_export();
      var core = require_core();
      var fails = require_fails();
      module.exports = function(KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY];
        var exp = {};
        exp[KEY] = exec(fn);
        $export($export.S + $export.F * fails(function() {
          fn(1);
        }), "Object", exp);
      };
    }
  });

  // node_modules/core-js/modules/es6.object.get-own-property-descriptor.js
  var require_es6_object_get_own_property_descriptor = __commonJS({
    "node_modules/core-js/modules/es6.object.get-own-property-descriptor.js"() {
      var toIObject = require_to_iobject();
      var $getOwnPropertyDescriptor = require_object_gopd().f;
      require_object_sap()("getOwnPropertyDescriptor", function() {
        return function getOwnPropertyDescriptor(it, key) {
          return $getOwnPropertyDescriptor(toIObject(it), key);
        };
      });
    }
  });

  // node_modules/core-js/modules/_object-gpo.js
  var require_object_gpo = __commonJS({
    "node_modules/core-js/modules/_object-gpo.js"(exports, module) {
      var has = require_has();
      var toObject = require_to_object();
      var IE_PROTO = require_shared_key()("IE_PROTO");
      var ObjectProto = Object.prototype;
      module.exports = Object.getPrototypeOf || function(O) {
        O = toObject(O);
        if (has(O, IE_PROTO)) return O[IE_PROTO];
        if (typeof O.constructor == "function" && O instanceof O.constructor) {
          return O.constructor.prototype;
        }
        return O instanceof Object ? ObjectProto : null;
      };
    }
  });

  // node_modules/core-js/modules/es6.object.get-prototype-of.js
  var require_es6_object_get_prototype_of = __commonJS({
    "node_modules/core-js/modules/es6.object.get-prototype-of.js"() {
      var toObject = require_to_object();
      var $getPrototypeOf = require_object_gpo();
      require_object_sap()("getPrototypeOf", function() {
        return function getPrototypeOf(it) {
          return $getPrototypeOf(toObject(it));
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.object.keys.js
  var require_es6_object_keys = __commonJS({
    "node_modules/core-js/modules/es6.object.keys.js"() {
      var toObject = require_to_object();
      var $keys = require_object_keys();
      require_object_sap()("keys", function() {
        return function keys(it) {
          return $keys(toObject(it));
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.object.get-own-property-names.js
  var require_es6_object_get_own_property_names = __commonJS({
    "node_modules/core-js/modules/es6.object.get-own-property-names.js"() {
      require_object_sap()("getOwnPropertyNames", function() {
        return require_object_gopn_ext().f;
      });
    }
  });

  // node_modules/core-js/modules/es6.object.freeze.js
  var require_es6_object_freeze = __commonJS({
    "node_modules/core-js/modules/es6.object.freeze.js"() {
      var isObject = require_is_object();
      var meta = require_meta().onFreeze;
      require_object_sap()("freeze", function($freeze) {
        return function freeze(it) {
          return $freeze && isObject(it) ? $freeze(meta(it)) : it;
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.object.seal.js
  var require_es6_object_seal = __commonJS({
    "node_modules/core-js/modules/es6.object.seal.js"() {
      var isObject = require_is_object();
      var meta = require_meta().onFreeze;
      require_object_sap()("seal", function($seal) {
        return function seal(it) {
          return $seal && isObject(it) ? $seal(meta(it)) : it;
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.object.prevent-extensions.js
  var require_es6_object_prevent_extensions = __commonJS({
    "node_modules/core-js/modules/es6.object.prevent-extensions.js"() {
      var isObject = require_is_object();
      var meta = require_meta().onFreeze;
      require_object_sap()("preventExtensions", function($preventExtensions) {
        return function preventExtensions(it) {
          return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.object.is-frozen.js
  var require_es6_object_is_frozen = __commonJS({
    "node_modules/core-js/modules/es6.object.is-frozen.js"() {
      var isObject = require_is_object();
      require_object_sap()("isFrozen", function($isFrozen) {
        return function isFrozen(it) {
          return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.object.is-sealed.js
  var require_es6_object_is_sealed = __commonJS({
    "node_modules/core-js/modules/es6.object.is-sealed.js"() {
      var isObject = require_is_object();
      require_object_sap()("isSealed", function($isSealed) {
        return function isSealed(it) {
          return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.object.is-extensible.js
  var require_es6_object_is_extensible = __commonJS({
    "node_modules/core-js/modules/es6.object.is-extensible.js"() {
      var isObject = require_is_object();
      require_object_sap()("isExtensible", function($isExtensible) {
        return function isExtensible(it) {
          return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
        };
      });
    }
  });

  // node_modules/core-js/modules/_object-assign.js
  var require_object_assign = __commonJS({
    "node_modules/core-js/modules/_object-assign.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var getKeys = require_object_keys();
      var gOPS = require_object_gops();
      var pIE = require_object_pie();
      var toObject = require_to_object();
      var IObject = require_iobject();
      var $assign = Object.assign;
      module.exports = !$assign || require_fails()(function() {
        var A = {};
        var B = {};
        var S = /* @__PURE__ */ Symbol();
        var K = "abcdefghijklmnopqrst";
        A[S] = 7;
        K.split("").forEach(function(k) {
          B[k] = k;
        });
        return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join("") != K;
      }) ? function assign(target, source) {
        var T = toObject(target);
        var aLen = arguments.length;
        var index = 1;
        var getSymbols = gOPS.f;
        var isEnum = pIE.f;
        while (aLen > index) {
          var S = IObject(arguments[index++]);
          var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
          var length = keys.length;
          var j = 0;
          var key;
          while (length > j) {
            key = keys[j++];
            if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
          }
        }
        return T;
      } : $assign;
    }
  });

  // node_modules/core-js/modules/es6.object.assign.js
  var require_es6_object_assign = __commonJS({
    "node_modules/core-js/modules/es6.object.assign.js"() {
      var $export = require_export();
      $export($export.S + $export.F, "Object", { assign: require_object_assign() });
    }
  });

  // node_modules/core-js/modules/_same-value.js
  var require_same_value = __commonJS({
    "node_modules/core-js/modules/_same-value.js"(exports, module) {
      module.exports = Object.is || function is(x, y) {
        return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
      };
    }
  });

  // node_modules/core-js/modules/es6.object.is.js
  var require_es6_object_is = __commonJS({
    "node_modules/core-js/modules/es6.object.is.js"() {
      var $export = require_export();
      $export($export.S, "Object", { is: require_same_value() });
    }
  });

  // node_modules/core-js/modules/_set-proto.js
  var require_set_proto = __commonJS({
    "node_modules/core-js/modules/_set-proto.js"(exports, module) {
      var isObject = require_is_object();
      var anObject = require_an_object();
      var check = function(O, proto) {
        anObject(O);
        if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
      };
      module.exports = {
        set: Object.setPrototypeOf || ("__proto__" in {} ? (
          // eslint-disable-line
          (function(test, buggy, set) {
            try {
              set = require_ctx()(Function.call, require_object_gopd().f(Object.prototype, "__proto__").set, 2);
              set(test, []);
              buggy = !(test instanceof Array);
            } catch (e) {
              buggy = true;
            }
            return function setPrototypeOf(O, proto) {
              check(O, proto);
              if (buggy) O.__proto__ = proto;
              else set(O, proto);
              return O;
            };
          })({}, false)
        ) : void 0),
        check
      };
    }
  });

  // node_modules/core-js/modules/es6.object.set-prototype-of.js
  var require_es6_object_set_prototype_of = __commonJS({
    "node_modules/core-js/modules/es6.object.set-prototype-of.js"() {
      var $export = require_export();
      $export($export.S, "Object", { setPrototypeOf: require_set_proto().set });
    }
  });

  // node_modules/core-js/modules/_classof.js
  var require_classof = __commonJS({
    "node_modules/core-js/modules/_classof.js"(exports, module) {
      var cof = require_cof();
      var TAG = require_wks()("toStringTag");
      var ARG = cof(/* @__PURE__ */ (function() {
        return arguments;
      })()) == "Arguments";
      var tryGet = function(it, key) {
        try {
          return it[key];
        } catch (e) {
        }
      };
      module.exports = function(it) {
        var O, T, B;
        return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (T = tryGet(O = Object(it), TAG)) == "string" ? T : ARG ? cof(O) : (B = cof(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : B;
      };
    }
  });

  // node_modules/core-js/modules/es6.object.to-string.js
  var require_es6_object_to_string = __commonJS({
    "node_modules/core-js/modules/es6.object.to-string.js"() {
      "use strict";
      var classof = require_classof();
      var test = {};
      test[require_wks()("toStringTag")] = "z";
      if (test + "" != "[object z]") {
        require_redefine()(Object.prototype, "toString", function toString() {
          return "[object " + classof(this) + "]";
        }, true);
      }
    }
  });

  // node_modules/core-js/modules/_invoke.js
  var require_invoke = __commonJS({
    "node_modules/core-js/modules/_invoke.js"(exports, module) {
      module.exports = function(fn, args, that) {
        var un = that === void 0;
        switch (args.length) {
          case 0:
            return un ? fn() : fn.call(that);
          case 1:
            return un ? fn(args[0]) : fn.call(that, args[0]);
          case 2:
            return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
          case 3:
            return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
          case 4:
            return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
        }
        return fn.apply(that, args);
      };
    }
  });

  // node_modules/core-js/modules/_bind.js
  var require_bind = __commonJS({
    "node_modules/core-js/modules/_bind.js"(exports, module) {
      "use strict";
      var aFunction = require_a_function();
      var isObject = require_is_object();
      var invoke = require_invoke();
      var arraySlice = [].slice;
      var factories = {};
      var construct = function(F, len, args) {
        if (!(len in factories)) {
          for (var n = [], i = 0; i < len; i++) n[i] = "a[" + i + "]";
          factories[len] = Function("F,a", "return new F(" + n.join(",") + ")");
        }
        return factories[len](F, args);
      };
      module.exports = Function.bind || function bind(that) {
        var fn = aFunction(this);
        var partArgs = arraySlice.call(arguments, 1);
        var bound = function() {
          var args = partArgs.concat(arraySlice.call(arguments));
          return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
        };
        if (isObject(fn.prototype)) bound.prototype = fn.prototype;
        return bound;
      };
    }
  });

  // node_modules/core-js/modules/es6.function.bind.js
  var require_es6_function_bind = __commonJS({
    "node_modules/core-js/modules/es6.function.bind.js"() {
      var $export = require_export();
      $export($export.P, "Function", { bind: require_bind() });
    }
  });

  // node_modules/core-js/modules/es6.function.name.js
  var require_es6_function_name = __commonJS({
    "node_modules/core-js/modules/es6.function.name.js"() {
      var dP = require_object_dp().f;
      var FProto = Function.prototype;
      var nameRE = /^\s*function ([^ (]*)/;
      var NAME = "name";
      NAME in FProto || require_descriptors() && dP(FProto, NAME, {
        configurable: true,
        get: function() {
          try {
            return ("" + this).match(nameRE)[1];
          } catch (e) {
            return "";
          }
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.function.has-instance.js
  var require_es6_function_has_instance = __commonJS({
    "node_modules/core-js/modules/es6.function.has-instance.js"() {
      "use strict";
      var isObject = require_is_object();
      var getPrototypeOf = require_object_gpo();
      var HAS_INSTANCE = require_wks()("hasInstance");
      var FunctionProto = Function.prototype;
      if (!(HAS_INSTANCE in FunctionProto)) require_object_dp().f(FunctionProto, HAS_INSTANCE, { value: function(O) {
        if (typeof this != "function" || !isObject(O)) return false;
        if (!isObject(this.prototype)) return O instanceof this;
        while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
        return false;
      } });
    }
  });

  // node_modules/core-js/modules/_string-ws.js
  var require_string_ws = __commonJS({
    "node_modules/core-js/modules/_string-ws.js"(exports, module) {
      module.exports = "	\n\v\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
    }
  });

  // node_modules/core-js/modules/_string-trim.js
  var require_string_trim = __commonJS({
    "node_modules/core-js/modules/_string-trim.js"(exports, module) {
      var $export = require_export();
      var defined = require_defined();
      var fails = require_fails();
      var spaces = require_string_ws();
      var space = "[" + spaces + "]";
      var non = "\u200B\x85";
      var ltrim = RegExp("^" + space + space + "*");
      var rtrim = RegExp(space + space + "*$");
      var exporter = function(KEY, exec, ALIAS) {
        var exp = {};
        var FORCE = fails(function() {
          return !!spaces[KEY]() || non[KEY]() != non;
        });
        var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
        if (ALIAS) exp[ALIAS] = fn;
        $export($export.P + $export.F * FORCE, "String", exp);
      };
      var trim = exporter.trim = function(string, TYPE) {
        string = String(defined(string));
        if (TYPE & 1) string = string.replace(ltrim, "");
        if (TYPE & 2) string = string.replace(rtrim, "");
        return string;
      };
      module.exports = exporter;
    }
  });

  // node_modules/core-js/modules/_parse-int.js
  var require_parse_int = __commonJS({
    "node_modules/core-js/modules/_parse-int.js"(exports, module) {
      var $parseInt = require_global().parseInt;
      var $trim = require_string_trim().trim;
      var ws = require_string_ws();
      var hex = /^[-+]?0[xX]/;
      module.exports = $parseInt(ws + "08") !== 8 || $parseInt(ws + "0x16") !== 22 ? function parseInt2(str, radix) {
        var string = $trim(String(str), 3);
        return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
      } : $parseInt;
    }
  });

  // node_modules/core-js/modules/es6.parse-int.js
  var require_es6_parse_int = __commonJS({
    "node_modules/core-js/modules/es6.parse-int.js"() {
      var $export = require_export();
      var $parseInt = require_parse_int();
      $export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });
    }
  });

  // node_modules/core-js/modules/_parse-float.js
  var require_parse_float = __commonJS({
    "node_modules/core-js/modules/_parse-float.js"(exports, module) {
      var $parseFloat = require_global().parseFloat;
      var $trim = require_string_trim().trim;
      module.exports = 1 / $parseFloat(require_string_ws() + "-0") !== -Infinity ? function parseFloat2(str) {
        var string = $trim(String(str), 3);
        var result = $parseFloat(string);
        return result === 0 && string.charAt(0) == "-" ? -0 : result;
      } : $parseFloat;
    }
  });

  // node_modules/core-js/modules/es6.parse-float.js
  var require_es6_parse_float = __commonJS({
    "node_modules/core-js/modules/es6.parse-float.js"() {
      var $export = require_export();
      var $parseFloat = require_parse_float();
      $export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });
    }
  });

  // node_modules/core-js/modules/_inherit-if-required.js
  var require_inherit_if_required = __commonJS({
    "node_modules/core-js/modules/_inherit-if-required.js"(exports, module) {
      var isObject = require_is_object();
      var setPrototypeOf = require_set_proto().set;
      module.exports = function(that, target, C) {
        var S = target.constructor;
        var P;
        if (S !== C && typeof S == "function" && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
          setPrototypeOf(that, P);
        }
        return that;
      };
    }
  });

  // node_modules/core-js/modules/es6.number.constructor.js
  var require_es6_number_constructor = __commonJS({
    "node_modules/core-js/modules/es6.number.constructor.js"() {
      "use strict";
      var global = require_global();
      var has = require_has();
      var cof = require_cof();
      var inheritIfRequired = require_inherit_if_required();
      var toPrimitive = require_to_primitive();
      var fails = require_fails();
      var gOPN = require_object_gopn().f;
      var gOPD = require_object_gopd().f;
      var dP = require_object_dp().f;
      var $trim = require_string_trim().trim;
      var NUMBER = "Number";
      var $Number = global[NUMBER];
      var Base = $Number;
      var proto = $Number.prototype;
      var BROKEN_COF = cof(require_object_create()(proto)) == NUMBER;
      var TRIM = "trim" in String.prototype;
      var toNumber = function(argument) {
        var it = toPrimitive(argument, false);
        if (typeof it == "string" && it.length > 2) {
          it = TRIM ? it.trim() : $trim(it, 3);
          var first = it.charCodeAt(0);
          var third, radix, maxCode;
          if (first === 43 || first === 45) {
            third = it.charCodeAt(2);
            if (third === 88 || third === 120) return NaN;
          } else if (first === 48) {
            switch (it.charCodeAt(1)) {
              case 66:
              case 98:
                radix = 2;
                maxCode = 49;
                break;
              // fast equal /^0b[01]+$/i
              case 79:
              case 111:
                radix = 8;
                maxCode = 55;
                break;
              // fast equal /^0o[0-7]+$/i
              default:
                return +it;
            }
            for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
              code = digits.charCodeAt(i);
              if (code < 48 || code > maxCode) return NaN;
            }
            return parseInt(digits, radix);
          }
        }
        return +it;
      };
      if (!$Number(" 0o1") || !$Number("0b1") || $Number("+0x1")) {
        $Number = function Number2(value) {
          var it = arguments.length < 1 ? 0 : value;
          var that = this;
          return that instanceof $Number && (BROKEN_COF ? fails(function() {
            proto.valueOf.call(that);
          }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
        };
        for (keys = require_descriptors() ? gOPN(Base) : (
          // ES3:
          "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(",")
        ), j = 0; keys.length > j; j++) {
          if (has(Base, key = keys[j]) && !has($Number, key)) {
            dP($Number, key, gOPD(Base, key));
          }
        }
        $Number.prototype = proto;
        proto.constructor = $Number;
        require_redefine()(global, NUMBER, $Number);
      }
      var keys;
      var j;
      var key;
    }
  });

  // node_modules/core-js/modules/_a-number-value.js
  var require_a_number_value = __commonJS({
    "node_modules/core-js/modules/_a-number-value.js"(exports, module) {
      var cof = require_cof();
      module.exports = function(it, msg) {
        if (typeof it != "number" && cof(it) != "Number") throw TypeError(msg);
        return +it;
      };
    }
  });

  // node_modules/core-js/modules/_string-repeat.js
  var require_string_repeat = __commonJS({
    "node_modules/core-js/modules/_string-repeat.js"(exports, module) {
      "use strict";
      var toInteger = require_to_integer();
      var defined = require_defined();
      module.exports = function repeat(count) {
        var str = String(defined(this));
        var res = "";
        var n = toInteger(count);
        if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
        for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
        return res;
      };
    }
  });

  // node_modules/core-js/modules/es6.number.to-fixed.js
  var require_es6_number_to_fixed = __commonJS({
    "node_modules/core-js/modules/es6.number.to-fixed.js"() {
      "use strict";
      var $export = require_export();
      var toInteger = require_to_integer();
      var aNumberValue = require_a_number_value();
      var repeat = require_string_repeat();
      var $toFixed = 1 .toFixed;
      var floor = Math.floor;
      var data = [0, 0, 0, 0, 0, 0];
      var ERROR = "Number.toFixed: incorrect invocation!";
      var ZERO = "0";
      var multiply = function(n, c) {
        var i = -1;
        var c2 = c;
        while (++i < 6) {
          c2 += n * data[i];
          data[i] = c2 % 1e7;
          c2 = floor(c2 / 1e7);
        }
      };
      var divide = function(n) {
        var i = 6;
        var c = 0;
        while (--i >= 0) {
          c += data[i];
          data[i] = floor(c / n);
          c = c % n * 1e7;
        }
      };
      var numToString = function() {
        var i = 6;
        var s = "";
        while (--i >= 0) {
          if (s !== "" || i === 0 || data[i] !== 0) {
            var t = String(data[i]);
            s = s === "" ? t : s + repeat.call(ZERO, 7 - t.length) + t;
          }
        }
        return s;
      };
      var pow = function(x, n, acc) {
        return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
      };
      var log = function(x) {
        var n = 0;
        var x2 = x;
        while (x2 >= 4096) {
          n += 12;
          x2 /= 4096;
        }
        while (x2 >= 2) {
          n += 1;
          x2 /= 2;
        }
        return n;
      };
      $export($export.P + $export.F * (!!$toFixed && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !require_fails()(function() {
        $toFixed.call({});
      })), "Number", {
        toFixed: function toFixed(fractionDigits) {
          var x = aNumberValue(this, ERROR);
          var f = toInteger(fractionDigits);
          var s = "";
          var m = ZERO;
          var e, z, j, k;
          if (f < 0 || f > 20) throw RangeError(ERROR);
          if (x != x) return "NaN";
          if (x <= -1e21 || x >= 1e21) return String(x);
          if (x < 0) {
            s = "-";
            x = -x;
          }
          if (x > 1e-21) {
            e = log(x * pow(2, 69, 1)) - 69;
            z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
            z *= 4503599627370496;
            e = 52 - e;
            if (e > 0) {
              multiply(0, z);
              j = f;
              while (j >= 7) {
                multiply(1e7, 0);
                j -= 7;
              }
              multiply(pow(10, j, 1), 0);
              j = e - 1;
              while (j >= 23) {
                divide(1 << 23);
                j -= 23;
              }
              divide(1 << j);
              multiply(1, 1);
              divide(2);
              m = numToString();
            } else {
              multiply(0, z);
              multiply(1 << -e, 0);
              m = numToString() + repeat.call(ZERO, f);
            }
          }
          if (f > 0) {
            k = m.length;
            m = s + (k <= f ? "0." + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + "." + m.slice(k - f));
          } else {
            m = s + m;
          }
          return m;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.number.to-precision.js
  var require_es6_number_to_precision = __commonJS({
    "node_modules/core-js/modules/es6.number.to-precision.js"() {
      "use strict";
      var $export = require_export();
      var $fails = require_fails();
      var aNumberValue = require_a_number_value();
      var $toPrecision = 1 .toPrecision;
      $export($export.P + $export.F * ($fails(function() {
        return $toPrecision.call(1, void 0) !== "1";
      }) || !$fails(function() {
        $toPrecision.call({});
      })), "Number", {
        toPrecision: function toPrecision(precision) {
          var that = aNumberValue(this, "Number#toPrecision: incorrect invocation!");
          return precision === void 0 ? $toPrecision.call(that) : $toPrecision.call(that, precision);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.number.epsilon.js
  var require_es6_number_epsilon = __commonJS({
    "node_modules/core-js/modules/es6.number.epsilon.js"() {
      var $export = require_export();
      $export($export.S, "Number", { EPSILON: Math.pow(2, -52) });
    }
  });

  // node_modules/core-js/modules/es6.number.is-finite.js
  var require_es6_number_is_finite = __commonJS({
    "node_modules/core-js/modules/es6.number.is-finite.js"() {
      var $export = require_export();
      var _isFinite = require_global().isFinite;
      $export($export.S, "Number", {
        isFinite: function isFinite2(it) {
          return typeof it == "number" && _isFinite(it);
        }
      });
    }
  });

  // node_modules/core-js/modules/_is-integer.js
  var require_is_integer = __commonJS({
    "node_modules/core-js/modules/_is-integer.js"(exports, module) {
      var isObject = require_is_object();
      var floor = Math.floor;
      module.exports = function isInteger(it) {
        return !isObject(it) && isFinite(it) && floor(it) === it;
      };
    }
  });

  // node_modules/core-js/modules/es6.number.is-integer.js
  var require_es6_number_is_integer = __commonJS({
    "node_modules/core-js/modules/es6.number.is-integer.js"() {
      var $export = require_export();
      $export($export.S, "Number", { isInteger: require_is_integer() });
    }
  });

  // node_modules/core-js/modules/es6.number.is-nan.js
  var require_es6_number_is_nan = __commonJS({
    "node_modules/core-js/modules/es6.number.is-nan.js"() {
      var $export = require_export();
      $export($export.S, "Number", {
        isNaN: function isNaN2(number) {
          return number != number;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.number.is-safe-integer.js
  var require_es6_number_is_safe_integer = __commonJS({
    "node_modules/core-js/modules/es6.number.is-safe-integer.js"() {
      var $export = require_export();
      var isInteger = require_is_integer();
      var abs = Math.abs;
      $export($export.S, "Number", {
        isSafeInteger: function isSafeInteger(number) {
          return isInteger(number) && abs(number) <= 9007199254740991;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.number.max-safe-integer.js
  var require_es6_number_max_safe_integer = __commonJS({
    "node_modules/core-js/modules/es6.number.max-safe-integer.js"() {
      var $export = require_export();
      $export($export.S, "Number", { MAX_SAFE_INTEGER: 9007199254740991 });
    }
  });

  // node_modules/core-js/modules/es6.number.min-safe-integer.js
  var require_es6_number_min_safe_integer = __commonJS({
    "node_modules/core-js/modules/es6.number.min-safe-integer.js"() {
      var $export = require_export();
      $export($export.S, "Number", { MIN_SAFE_INTEGER: -9007199254740991 });
    }
  });

  // node_modules/core-js/modules/es6.number.parse-float.js
  var require_es6_number_parse_float = __commonJS({
    "node_modules/core-js/modules/es6.number.parse-float.js"() {
      var $export = require_export();
      var $parseFloat = require_parse_float();
      $export($export.S + $export.F * (Number.parseFloat != $parseFloat), "Number", { parseFloat: $parseFloat });
    }
  });

  // node_modules/core-js/modules/es6.number.parse-int.js
  var require_es6_number_parse_int = __commonJS({
    "node_modules/core-js/modules/es6.number.parse-int.js"() {
      var $export = require_export();
      var $parseInt = require_parse_int();
      $export($export.S + $export.F * (Number.parseInt != $parseInt), "Number", { parseInt: $parseInt });
    }
  });

  // node_modules/core-js/modules/_math-log1p.js
  var require_math_log1p = __commonJS({
    "node_modules/core-js/modules/_math-log1p.js"(exports, module) {
      module.exports = Math.log1p || function log1p(x) {
        return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
      };
    }
  });

  // node_modules/core-js/modules/es6.math.acosh.js
  var require_es6_math_acosh = __commonJS({
    "node_modules/core-js/modules/es6.math.acosh.js"() {
      var $export = require_export();
      var log1p = require_math_log1p();
      var sqrt = Math.sqrt;
      var $acosh = Math.acosh;
      $export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710 && $acosh(Infinity) == Infinity), "Math", {
        acosh: function acosh(x) {
          return (x = +x) < 1 ? NaN : x > 9490626562425156e-8 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.asinh.js
  var require_es6_math_asinh = __commonJS({
    "node_modules/core-js/modules/es6.math.asinh.js"() {
      var $export = require_export();
      var $asinh = Math.asinh;
      function asinh(x) {
        return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
      }
      $export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), "Math", { asinh });
    }
  });

  // node_modules/core-js/modules/es6.math.atanh.js
  var require_es6_math_atanh = __commonJS({
    "node_modules/core-js/modules/es6.math.atanh.js"() {
      var $export = require_export();
      var $atanh = Math.atanh;
      $export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), "Math", {
        atanh: function atanh(x) {
          return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
        }
      });
    }
  });

  // node_modules/core-js/modules/_math-sign.js
  var require_math_sign = __commonJS({
    "node_modules/core-js/modules/_math-sign.js"(exports, module) {
      module.exports = Math.sign || function sign(x) {
        return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/core-js/modules/es6.math.cbrt.js
  var require_es6_math_cbrt = __commonJS({
    "node_modules/core-js/modules/es6.math.cbrt.js"() {
      var $export = require_export();
      var sign = require_math_sign();
      $export($export.S, "Math", {
        cbrt: function cbrt(x) {
          return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.clz32.js
  var require_es6_math_clz32 = __commonJS({
    "node_modules/core-js/modules/es6.math.clz32.js"() {
      var $export = require_export();
      $export($export.S, "Math", {
        clz32: function clz32(x) {
          return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.cosh.js
  var require_es6_math_cosh = __commonJS({
    "node_modules/core-js/modules/es6.math.cosh.js"() {
      var $export = require_export();
      var exp = Math.exp;
      $export($export.S, "Math", {
        cosh: function cosh(x) {
          return (exp(x = +x) + exp(-x)) / 2;
        }
      });
    }
  });

  // node_modules/core-js/modules/_math-expm1.js
  var require_math_expm1 = __commonJS({
    "node_modules/core-js/modules/_math-expm1.js"(exports, module) {
      var $expm1 = Math.expm1;
      module.exports = !$expm1 || $expm1(10) > 22025.465794806718 || $expm1(10) < 22025.465794806718 || $expm1(-2e-17) != -2e-17 ? function expm1(x) {
        return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
      } : $expm1;
    }
  });

  // node_modules/core-js/modules/es6.math.expm1.js
  var require_es6_math_expm1 = __commonJS({
    "node_modules/core-js/modules/es6.math.expm1.js"() {
      var $export = require_export();
      var $expm1 = require_math_expm1();
      $export($export.S + $export.F * ($expm1 != Math.expm1), "Math", { expm1: $expm1 });
    }
  });

  // node_modules/core-js/modules/_math-fround.js
  var require_math_fround = __commonJS({
    "node_modules/core-js/modules/_math-fround.js"(exports, module) {
      var sign = require_math_sign();
      var pow = Math.pow;
      var EPSILON = pow(2, -52);
      var EPSILON32 = pow(2, -23);
      var MAX32 = pow(2, 127) * (2 - EPSILON32);
      var MIN32 = pow(2, -126);
      var roundTiesToEven = function(n) {
        return n + 1 / EPSILON - 1 / EPSILON;
      };
      module.exports = Math.fround || function fround(x) {
        var $abs = Math.abs(x);
        var $sign = sign(x);
        var a, result;
        if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
        a = (1 + EPSILON32 / EPSILON) * $abs;
        result = a - (a - $abs);
        if (result > MAX32 || result != result) return $sign * Infinity;
        return $sign * result;
      };
    }
  });

  // node_modules/core-js/modules/es6.math.fround.js
  var require_es6_math_fround = __commonJS({
    "node_modules/core-js/modules/es6.math.fround.js"() {
      var $export = require_export();
      $export($export.S, "Math", { fround: require_math_fround() });
    }
  });

  // node_modules/core-js/modules/es6.math.hypot.js
  var require_es6_math_hypot = __commonJS({
    "node_modules/core-js/modules/es6.math.hypot.js"() {
      var $export = require_export();
      var abs = Math.abs;
      $export($export.S, "Math", {
        hypot: function hypot(value1, value2) {
          var sum = 0;
          var i = 0;
          var aLen = arguments.length;
          var larg = 0;
          var arg, div;
          while (i < aLen) {
            arg = abs(arguments[i++]);
            if (larg < arg) {
              div = larg / arg;
              sum = sum * div * div + 1;
              larg = arg;
            } else if (arg > 0) {
              div = arg / larg;
              sum += div * div;
            } else sum += arg;
          }
          return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.imul.js
  var require_es6_math_imul = __commonJS({
    "node_modules/core-js/modules/es6.math.imul.js"() {
      var $export = require_export();
      var $imul = Math.imul;
      $export($export.S + $export.F * require_fails()(function() {
        return $imul(4294967295, 5) != -5 || $imul.length != 2;
      }), "Math", {
        imul: function imul(x, y) {
          var UINT16 = 65535;
          var xn = +x;
          var yn = +y;
          var xl = UINT16 & xn;
          var yl = UINT16 & yn;
          return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.log10.js
  var require_es6_math_log10 = __commonJS({
    "node_modules/core-js/modules/es6.math.log10.js"() {
      var $export = require_export();
      $export($export.S, "Math", {
        log10: function log10(x) {
          return Math.log(x) * Math.LOG10E;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.log1p.js
  var require_es6_math_log1p = __commonJS({
    "node_modules/core-js/modules/es6.math.log1p.js"() {
      var $export = require_export();
      $export($export.S, "Math", { log1p: require_math_log1p() });
    }
  });

  // node_modules/core-js/modules/es6.math.log2.js
  var require_es6_math_log2 = __commonJS({
    "node_modules/core-js/modules/es6.math.log2.js"() {
      var $export = require_export();
      $export($export.S, "Math", {
        log2: function log2(x) {
          return Math.log(x) / Math.LN2;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.sign.js
  var require_es6_math_sign = __commonJS({
    "node_modules/core-js/modules/es6.math.sign.js"() {
      var $export = require_export();
      $export($export.S, "Math", { sign: require_math_sign() });
    }
  });

  // node_modules/core-js/modules/es6.math.sinh.js
  var require_es6_math_sinh = __commonJS({
    "node_modules/core-js/modules/es6.math.sinh.js"() {
      var $export = require_export();
      var expm1 = require_math_expm1();
      var exp = Math.exp;
      $export($export.S + $export.F * require_fails()(function() {
        return !Math.sinh(-2e-17) != -2e-17;
      }), "Math", {
        sinh: function sinh(x) {
          return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.tanh.js
  var require_es6_math_tanh = __commonJS({
    "node_modules/core-js/modules/es6.math.tanh.js"() {
      var $export = require_export();
      var expm1 = require_math_expm1();
      var exp = Math.exp;
      $export($export.S, "Math", {
        tanh: function tanh(x) {
          var a = expm1(x = +x);
          var b = expm1(-x);
          return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.math.trunc.js
  var require_es6_math_trunc = __commonJS({
    "node_modules/core-js/modules/es6.math.trunc.js"() {
      var $export = require_export();
      $export($export.S, "Math", {
        trunc: function trunc(it) {
          return (it > 0 ? Math.floor : Math.ceil)(it);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.string.from-code-point.js
  var require_es6_string_from_code_point = __commonJS({
    "node_modules/core-js/modules/es6.string.from-code-point.js"() {
      var $export = require_export();
      var toAbsoluteIndex = require_to_absolute_index();
      var fromCharCode = String.fromCharCode;
      var $fromCodePoint = String.fromCodePoint;
      $export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), "String", {
        // 21.1.2.2 String.fromCodePoint(...codePoints)
        fromCodePoint: function fromCodePoint(x) {
          var res = [];
          var aLen = arguments.length;
          var i = 0;
          var code;
          while (aLen > i) {
            code = +arguments[i++];
            if (toAbsoluteIndex(code, 1114111) !== code) throw RangeError(code + " is not a valid code point");
            res.push(
              code < 65536 ? fromCharCode(code) : fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320)
            );
          }
          return res.join("");
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.string.raw.js
  var require_es6_string_raw = __commonJS({
    "node_modules/core-js/modules/es6.string.raw.js"() {
      var $export = require_export();
      var toIObject = require_to_iobject();
      var toLength = require_to_length();
      $export($export.S, "String", {
        // 21.1.2.4 String.raw(callSite, ...substitutions)
        raw: function raw(callSite) {
          var tpl = toIObject(callSite.raw);
          var len = toLength(tpl.length);
          var aLen = arguments.length;
          var res = [];
          var i = 0;
          while (len > i) {
            res.push(String(tpl[i++]));
            if (i < aLen) res.push(String(arguments[i]));
          }
          return res.join("");
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.string.trim.js
  var require_es6_string_trim = __commonJS({
    "node_modules/core-js/modules/es6.string.trim.js"() {
      "use strict";
      require_string_trim()("trim", function($trim) {
        return function trim() {
          return $trim(this, 3);
        };
      });
    }
  });

  // node_modules/core-js/modules/_string-at.js
  var require_string_at = __commonJS({
    "node_modules/core-js/modules/_string-at.js"(exports, module) {
      var toInteger = require_to_integer();
      var defined = require_defined();
      module.exports = function(TO_STRING) {
        return function(that, pos) {
          var s = String(defined(that));
          var i = toInteger(pos);
          var l = s.length;
          var a, b;
          if (i < 0 || i >= l) return TO_STRING ? "" : void 0;
          a = s.charCodeAt(i);
          return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
        };
      };
    }
  });

  // node_modules/core-js/modules/_iterators.js
  var require_iterators = __commonJS({
    "node_modules/core-js/modules/_iterators.js"(exports, module) {
      module.exports = {};
    }
  });

  // node_modules/core-js/modules/_iter-create.js
  var require_iter_create = __commonJS({
    "node_modules/core-js/modules/_iter-create.js"(exports, module) {
      "use strict";
      var create = require_object_create();
      var descriptor = require_property_desc();
      var setToStringTag = require_set_to_string_tag();
      var IteratorPrototype = {};
      require_hide()(IteratorPrototype, require_wks()("iterator"), function() {
        return this;
      });
      module.exports = function(Constructor, NAME, next) {
        Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
        setToStringTag(Constructor, NAME + " Iterator");
      };
    }
  });

  // node_modules/core-js/modules/_iter-define.js
  var require_iter_define = __commonJS({
    "node_modules/core-js/modules/_iter-define.js"(exports, module) {
      "use strict";
      var LIBRARY = require_library();
      var $export = require_export();
      var redefine = require_redefine();
      var hide = require_hide();
      var Iterators = require_iterators();
      var $iterCreate = require_iter_create();
      var setToStringTag = require_set_to_string_tag();
      var getPrototypeOf = require_object_gpo();
      var ITERATOR = require_wks()("iterator");
      var BUGGY = !([].keys && "next" in [].keys());
      var FF_ITERATOR = "@@iterator";
      var KEYS = "keys";
      var VALUES = "values";
      var returnThis = function() {
        return this;
      };
      module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
        $iterCreate(Constructor, NAME, next);
        var getMethod = function(kind) {
          if (!BUGGY && kind in proto) return proto[kind];
          switch (kind) {
            case KEYS:
              return function keys() {
                return new Constructor(this, kind);
              };
            case VALUES:
              return function values() {
                return new Constructor(this, kind);
              };
          }
          return function entries() {
            return new Constructor(this, kind);
          };
        };
        var TAG = NAME + " Iterator";
        var DEF_VALUES = DEFAULT == VALUES;
        var VALUES_BUG = false;
        var proto = Base.prototype;
        var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
        var $default = $native || getMethod(DEFAULT);
        var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod("entries") : void 0;
        var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
        var methods, key, IteratorPrototype;
        if ($anyNative) {
          IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
          if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
            setToStringTag(IteratorPrototype, TAG, true);
            if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != "function") hide(IteratorPrototype, ITERATOR, returnThis);
          }
        }
        if (DEF_VALUES && $native && $native.name !== VALUES) {
          VALUES_BUG = true;
          $default = function values() {
            return $native.call(this);
          };
        }
        if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
          hide(proto, ITERATOR, $default);
        }
        Iterators[NAME] = $default;
        Iterators[TAG] = returnThis;
        if (DEFAULT) {
          methods = {
            values: DEF_VALUES ? $default : getMethod(VALUES),
            keys: IS_SET ? $default : getMethod(KEYS),
            entries: $entries
          };
          if (FORCED) for (key in methods) {
            if (!(key in proto)) redefine(proto, key, methods[key]);
          }
          else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
        }
        return methods;
      };
    }
  });

  // node_modules/core-js/modules/es6.string.iterator.js
  var require_es6_string_iterator = __commonJS({
    "node_modules/core-js/modules/es6.string.iterator.js"() {
      "use strict";
      var $at = require_string_at()(true);
      require_iter_define()(String, "String", function(iterated) {
        this._t = String(iterated);
        this._i = 0;
      }, function() {
        var O = this._t;
        var index = this._i;
        var point;
        if (index >= O.length) return { value: void 0, done: true };
        point = $at(O, index);
        this._i += point.length;
        return { value: point, done: false };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.code-point-at.js
  var require_es6_string_code_point_at = __commonJS({
    "node_modules/core-js/modules/es6.string.code-point-at.js"() {
      "use strict";
      var $export = require_export();
      var $at = require_string_at()(false);
      $export($export.P, "String", {
        // 21.1.3.3 String.prototype.codePointAt(pos)
        codePointAt: function codePointAt(pos) {
          return $at(this, pos);
        }
      });
    }
  });

  // node_modules/core-js/modules/_is-regexp.js
  var require_is_regexp = __commonJS({
    "node_modules/core-js/modules/_is-regexp.js"(exports, module) {
      var isObject = require_is_object();
      var cof = require_cof();
      var MATCH = require_wks()("match");
      module.exports = function(it) {
        var isRegExp;
        return isObject(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : cof(it) == "RegExp");
      };
    }
  });

  // node_modules/core-js/modules/_string-context.js
  var require_string_context = __commonJS({
    "node_modules/core-js/modules/_string-context.js"(exports, module) {
      var isRegExp = require_is_regexp();
      var defined = require_defined();
      module.exports = function(that, searchString, NAME) {
        if (isRegExp(searchString)) throw TypeError("String#" + NAME + " doesn't accept regex!");
        return String(defined(that));
      };
    }
  });

  // node_modules/core-js/modules/_fails-is-regexp.js
  var require_fails_is_regexp = __commonJS({
    "node_modules/core-js/modules/_fails-is-regexp.js"(exports, module) {
      var MATCH = require_wks()("match");
      module.exports = function(KEY) {
        var re = /./;
        try {
          "/./"[KEY](re);
        } catch (e) {
          try {
            re[MATCH] = false;
            return !"/./"[KEY](re);
          } catch (f) {
          }
        }
        return true;
      };
    }
  });

  // node_modules/core-js/modules/es6.string.ends-with.js
  var require_es6_string_ends_with = __commonJS({
    "node_modules/core-js/modules/es6.string.ends-with.js"() {
      "use strict";
      var $export = require_export();
      var toLength = require_to_length();
      var context = require_string_context();
      var ENDS_WITH = "endsWith";
      var $endsWith = ""[ENDS_WITH];
      $export($export.P + $export.F * require_fails_is_regexp()(ENDS_WITH), "String", {
        endsWith: function endsWith(searchString) {
          var that = context(this, searchString, ENDS_WITH);
          var endPosition = arguments.length > 1 ? arguments[1] : void 0;
          var len = toLength(that.length);
          var end = endPosition === void 0 ? len : Math.min(toLength(endPosition), len);
          var search = String(searchString);
          return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.string.includes.js
  var require_es6_string_includes = __commonJS({
    "node_modules/core-js/modules/es6.string.includes.js"() {
      "use strict";
      var $export = require_export();
      var context = require_string_context();
      var INCLUDES = "includes";
      $export($export.P + $export.F * require_fails_is_regexp()(INCLUDES), "String", {
        includes: function includes(searchString) {
          return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.string.repeat.js
  var require_es6_string_repeat = __commonJS({
    "node_modules/core-js/modules/es6.string.repeat.js"() {
      var $export = require_export();
      $export($export.P, "String", {
        // 21.1.3.13 String.prototype.repeat(count)
        repeat: require_string_repeat()
      });
    }
  });

  // node_modules/core-js/modules/es6.string.starts-with.js
  var require_es6_string_starts_with = __commonJS({
    "node_modules/core-js/modules/es6.string.starts-with.js"() {
      "use strict";
      var $export = require_export();
      var toLength = require_to_length();
      var context = require_string_context();
      var STARTS_WITH = "startsWith";
      var $startsWith = ""[STARTS_WITH];
      $export($export.P + $export.F * require_fails_is_regexp()(STARTS_WITH), "String", {
        startsWith: function startsWith(searchString) {
          var that = context(this, searchString, STARTS_WITH);
          var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : void 0, that.length));
          var search = String(searchString);
          return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
        }
      });
    }
  });

  // node_modules/core-js/modules/_string-html.js
  var require_string_html = __commonJS({
    "node_modules/core-js/modules/_string-html.js"(exports, module) {
      var $export = require_export();
      var fails = require_fails();
      var defined = require_defined();
      var quot = /"/g;
      var createHTML = function(string, tag, attribute, value) {
        var S = String(defined(string));
        var p1 = "<" + tag;
        if (attribute !== "") p1 += " " + attribute + '="' + String(value).replace(quot, "&quot;") + '"';
        return p1 + ">" + S + "</" + tag + ">";
      };
      module.exports = function(NAME, exec) {
        var O = {};
        O[NAME] = exec(createHTML);
        $export($export.P + $export.F * fails(function() {
          var test = ""[NAME]('"');
          return test !== test.toLowerCase() || test.split('"').length > 3;
        }), "String", O);
      };
    }
  });

  // node_modules/core-js/modules/es6.string.anchor.js
  var require_es6_string_anchor = __commonJS({
    "node_modules/core-js/modules/es6.string.anchor.js"() {
      "use strict";
      require_string_html()("anchor", function(createHTML) {
        return function anchor(name) {
          return createHTML(this, "a", "name", name);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.big.js
  var require_es6_string_big = __commonJS({
    "node_modules/core-js/modules/es6.string.big.js"() {
      "use strict";
      require_string_html()("big", function(createHTML) {
        return function big() {
          return createHTML(this, "big", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.blink.js
  var require_es6_string_blink = __commonJS({
    "node_modules/core-js/modules/es6.string.blink.js"() {
      "use strict";
      require_string_html()("blink", function(createHTML) {
        return function blink() {
          return createHTML(this, "blink", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.bold.js
  var require_es6_string_bold = __commonJS({
    "node_modules/core-js/modules/es6.string.bold.js"() {
      "use strict";
      require_string_html()("bold", function(createHTML) {
        return function bold() {
          return createHTML(this, "b", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.fixed.js
  var require_es6_string_fixed = __commonJS({
    "node_modules/core-js/modules/es6.string.fixed.js"() {
      "use strict";
      require_string_html()("fixed", function(createHTML) {
        return function fixed() {
          return createHTML(this, "tt", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.fontcolor.js
  var require_es6_string_fontcolor = __commonJS({
    "node_modules/core-js/modules/es6.string.fontcolor.js"() {
      "use strict";
      require_string_html()("fontcolor", function(createHTML) {
        return function fontcolor(color) {
          return createHTML(this, "font", "color", color);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.fontsize.js
  var require_es6_string_fontsize = __commonJS({
    "node_modules/core-js/modules/es6.string.fontsize.js"() {
      "use strict";
      require_string_html()("fontsize", function(createHTML) {
        return function fontsize(size) {
          return createHTML(this, "font", "size", size);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.italics.js
  var require_es6_string_italics = __commonJS({
    "node_modules/core-js/modules/es6.string.italics.js"() {
      "use strict";
      require_string_html()("italics", function(createHTML) {
        return function italics() {
          return createHTML(this, "i", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.link.js
  var require_es6_string_link = __commonJS({
    "node_modules/core-js/modules/es6.string.link.js"() {
      "use strict";
      require_string_html()("link", function(createHTML) {
        return function link(url) {
          return createHTML(this, "a", "href", url);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.small.js
  var require_es6_string_small = __commonJS({
    "node_modules/core-js/modules/es6.string.small.js"() {
      "use strict";
      require_string_html()("small", function(createHTML) {
        return function small() {
          return createHTML(this, "small", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.strike.js
  var require_es6_string_strike = __commonJS({
    "node_modules/core-js/modules/es6.string.strike.js"() {
      "use strict";
      require_string_html()("strike", function(createHTML) {
        return function strike() {
          return createHTML(this, "strike", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.sub.js
  var require_es6_string_sub = __commonJS({
    "node_modules/core-js/modules/es6.string.sub.js"() {
      "use strict";
      require_string_html()("sub", function(createHTML) {
        return function sub() {
          return createHTML(this, "sub", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.string.sup.js
  var require_es6_string_sup = __commonJS({
    "node_modules/core-js/modules/es6.string.sup.js"() {
      "use strict";
      require_string_html()("sup", function(createHTML) {
        return function sup() {
          return createHTML(this, "sup", "", "");
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.date.now.js
  var require_es6_date_now = __commonJS({
    "node_modules/core-js/modules/es6.date.now.js"() {
      var $export = require_export();
      $export($export.S, "Date", { now: function() {
        return (/* @__PURE__ */ new Date()).getTime();
      } });
    }
  });

  // node_modules/core-js/modules/es6.date.to-json.js
  var require_es6_date_to_json = __commonJS({
    "node_modules/core-js/modules/es6.date.to-json.js"() {
      "use strict";
      var $export = require_export();
      var toObject = require_to_object();
      var toPrimitive = require_to_primitive();
      $export($export.P + $export.F * require_fails()(function() {
        return (/* @__PURE__ */ new Date(NaN)).toJSON() !== null || Date.prototype.toJSON.call({ toISOString: function() {
          return 1;
        } }) !== 1;
      }), "Date", {
        // eslint-disable-next-line no-unused-vars
        toJSON: function toJSON(key) {
          var O = toObject(this);
          var pv = toPrimitive(O);
          return typeof pv == "number" && !isFinite(pv) ? null : O.toISOString();
        }
      });
    }
  });

  // node_modules/core-js/modules/_date-to-iso-string.js
  var require_date_to_iso_string = __commonJS({
    "node_modules/core-js/modules/_date-to-iso-string.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      var getTime = Date.prototype.getTime;
      var $toISOString = Date.prototype.toISOString;
      var lz = function(num2) {
        return num2 > 9 ? num2 : "0" + num2;
      };
      module.exports = fails(function() {
        return $toISOString.call(new Date(-5e13 - 1)) != "0385-07-25T07:06:39.999Z";
      }) || !fails(function() {
        $toISOString.call(/* @__PURE__ */ new Date(NaN));
      }) ? function toISOString() {
        if (!isFinite(getTime.call(this))) throw RangeError("Invalid time value");
        var d = this;
        var y = d.getUTCFullYear();
        var m = d.getUTCMilliseconds();
        var s = y < 0 ? "-" : y > 9999 ? "+" : "";
        return s + ("00000" + Math.abs(y)).slice(s ? -6 : -4) + "-" + lz(d.getUTCMonth() + 1) + "-" + lz(d.getUTCDate()) + "T" + lz(d.getUTCHours()) + ":" + lz(d.getUTCMinutes()) + ":" + lz(d.getUTCSeconds()) + "." + (m > 99 ? m : "0" + lz(m)) + "Z";
      } : $toISOString;
    }
  });

  // node_modules/core-js/modules/es6.date.to-iso-string.js
  var require_es6_date_to_iso_string = __commonJS({
    "node_modules/core-js/modules/es6.date.to-iso-string.js"() {
      var $export = require_export();
      var toISOString = require_date_to_iso_string();
      $export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), "Date", {
        toISOString
      });
    }
  });

  // node_modules/core-js/modules/es6.date.to-string.js
  var require_es6_date_to_string = __commonJS({
    "node_modules/core-js/modules/es6.date.to-string.js"() {
      var DateProto = Date.prototype;
      var INVALID_DATE = "Invalid Date";
      var TO_STRING = "toString";
      var $toString = DateProto[TO_STRING];
      var getTime = DateProto.getTime;
      if (/* @__PURE__ */ new Date(NaN) + "" != INVALID_DATE) {
        require_redefine()(DateProto, TO_STRING, function toString() {
          var value = getTime.call(this);
          return value === value ? $toString.call(this) : INVALID_DATE;
        });
      }
    }
  });

  // node_modules/core-js/modules/_date-to-primitive.js
  var require_date_to_primitive = __commonJS({
    "node_modules/core-js/modules/_date-to-primitive.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      var toPrimitive = require_to_primitive();
      var NUMBER = "number";
      module.exports = function(hint) {
        if (hint !== "string" && hint !== NUMBER && hint !== "default") throw TypeError("Incorrect hint");
        return toPrimitive(anObject(this), hint != NUMBER);
      };
    }
  });

  // node_modules/core-js/modules/es6.date.to-primitive.js
  var require_es6_date_to_primitive = __commonJS({
    "node_modules/core-js/modules/es6.date.to-primitive.js"() {
      var TO_PRIMITIVE = require_wks()("toPrimitive");
      var proto = Date.prototype;
      if (!(TO_PRIMITIVE in proto)) require_hide()(proto, TO_PRIMITIVE, require_date_to_primitive());
    }
  });

  // node_modules/core-js/modules/es6.array.is-array.js
  var require_es6_array_is_array = __commonJS({
    "node_modules/core-js/modules/es6.array.is-array.js"() {
      var $export = require_export();
      $export($export.S, "Array", { isArray: require_is_array() });
    }
  });

  // node_modules/core-js/modules/_iter-call.js
  var require_iter_call = __commonJS({
    "node_modules/core-js/modules/_iter-call.js"(exports, module) {
      var anObject = require_an_object();
      module.exports = function(iterator, fn, value, entries) {
        try {
          return entries ? fn(anObject(value)[0], value[1]) : fn(value);
        } catch (e) {
          var ret = iterator["return"];
          if (ret !== void 0) anObject(ret.call(iterator));
          throw e;
        }
      };
    }
  });

  // node_modules/core-js/modules/_is-array-iter.js
  var require_is_array_iter = __commonJS({
    "node_modules/core-js/modules/_is-array-iter.js"(exports, module) {
      var Iterators = require_iterators();
      var ITERATOR = require_wks()("iterator");
      var ArrayProto = Array.prototype;
      module.exports = function(it) {
        return it !== void 0 && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
      };
    }
  });

  // node_modules/core-js/modules/_create-property.js
  var require_create_property = __commonJS({
    "node_modules/core-js/modules/_create-property.js"(exports, module) {
      "use strict";
      var $defineProperty = require_object_dp();
      var createDesc = require_property_desc();
      module.exports = function(object, index, value) {
        if (index in object) $defineProperty.f(object, index, createDesc(0, value));
        else object[index] = value;
      };
    }
  });

  // node_modules/core-js/modules/core.get-iterator-method.js
  var require_core_get_iterator_method = __commonJS({
    "node_modules/core-js/modules/core.get-iterator-method.js"(exports, module) {
      var classof = require_classof();
      var ITERATOR = require_wks()("iterator");
      var Iterators = require_iterators();
      module.exports = require_core().getIteratorMethod = function(it) {
        if (it != void 0) return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
      };
    }
  });

  // node_modules/core-js/modules/_iter-detect.js
  var require_iter_detect = __commonJS({
    "node_modules/core-js/modules/_iter-detect.js"(exports, module) {
      var ITERATOR = require_wks()("iterator");
      var SAFE_CLOSING = false;
      try {
        riter = [7][ITERATOR]();
        riter["return"] = function() {
          SAFE_CLOSING = true;
        };
        Array.from(riter, function() {
          throw 2;
        });
      } catch (e) {
      }
      var riter;
      module.exports = function(exec, skipClosing) {
        if (!skipClosing && !SAFE_CLOSING) return false;
        var safe = false;
        try {
          var arr = [7];
          var iter = arr[ITERATOR]();
          iter.next = function() {
            return { done: safe = true };
          };
          arr[ITERATOR] = function() {
            return iter;
          };
          exec(arr);
        } catch (e) {
        }
        return safe;
      };
    }
  });

  // node_modules/core-js/modules/es6.array.from.js
  var require_es6_array_from = __commonJS({
    "node_modules/core-js/modules/es6.array.from.js"() {
      "use strict";
      var ctx = require_ctx();
      var $export = require_export();
      var toObject = require_to_object();
      var call = require_iter_call();
      var isArrayIter = require_is_array_iter();
      var toLength = require_to_length();
      var createProperty = require_create_property();
      var getIterFn = require_core_get_iterator_method();
      $export($export.S + $export.F * !require_iter_detect()(function(iter) {
        Array.from(iter);
      }), "Array", {
        // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
        from: function from(arrayLike) {
          var O = toObject(arrayLike);
          var C = typeof this == "function" ? this : Array;
          var aLen = arguments.length;
          var mapfn = aLen > 1 ? arguments[1] : void 0;
          var mapping = mapfn !== void 0;
          var index = 0;
          var iterFn = getIterFn(O);
          var length, result, step, iterator;
          if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : void 0, 2);
          if (iterFn != void 0 && !(C == Array && isArrayIter(iterFn))) {
            for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
              createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
            }
          } else {
            length = toLength(O.length);
            for (result = new C(length); length > index; index++) {
              createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
            }
          }
          result.length = index;
          return result;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.of.js
  var require_es6_array_of = __commonJS({
    "node_modules/core-js/modules/es6.array.of.js"() {
      "use strict";
      var $export = require_export();
      var createProperty = require_create_property();
      $export($export.S + $export.F * require_fails()(function() {
        function F() {
        }
        return !(Array.of.call(F) instanceof F);
      }), "Array", {
        // 22.1.2.3 Array.of( ...items)
        of: function of() {
          var index = 0;
          var aLen = arguments.length;
          var result = new (typeof this == "function" ? this : Array)(aLen);
          while (aLen > index) createProperty(result, index, arguments[index++]);
          result.length = aLen;
          return result;
        }
      });
    }
  });

  // node_modules/core-js/modules/_strict-method.js
  var require_strict_method = __commonJS({
    "node_modules/core-js/modules/_strict-method.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = function(method, arg) {
        return !!method && fails(function() {
          arg ? method.call(null, function() {
          }, 1) : method.call(null);
        });
      };
    }
  });

  // node_modules/core-js/modules/es6.array.join.js
  var require_es6_array_join = __commonJS({
    "node_modules/core-js/modules/es6.array.join.js"() {
      "use strict";
      var $export = require_export();
      var toIObject = require_to_iobject();
      var arrayJoin = [].join;
      $export($export.P + $export.F * (require_iobject() != Object || !require_strict_method()(arrayJoin)), "Array", {
        join: function join(separator) {
          return arrayJoin.call(toIObject(this), separator === void 0 ? "," : separator);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.slice.js
  var require_es6_array_slice = __commonJS({
    "node_modules/core-js/modules/es6.array.slice.js"() {
      "use strict";
      var $export = require_export();
      var html = require_html();
      var cof = require_cof();
      var toAbsoluteIndex = require_to_absolute_index();
      var toLength = require_to_length();
      var arraySlice = [].slice;
      $export($export.P + $export.F * require_fails()(function() {
        if (html) arraySlice.call(html);
      }), "Array", {
        slice: function slice(begin, end) {
          var len = toLength(this.length);
          var klass = cof(this);
          end = end === void 0 ? len : end;
          if (klass == "Array") return arraySlice.call(this, begin, end);
          var start = toAbsoluteIndex(begin, len);
          var upTo = toAbsoluteIndex(end, len);
          var size = toLength(upTo - start);
          var cloned = new Array(size);
          var i = 0;
          for (; i < size; i++) cloned[i] = klass == "String" ? this.charAt(start + i) : this[start + i];
          return cloned;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.sort.js
  var require_es6_array_sort = __commonJS({
    "node_modules/core-js/modules/es6.array.sort.js"() {
      "use strict";
      var $export = require_export();
      var aFunction = require_a_function();
      var toObject = require_to_object();
      var fails = require_fails();
      var $sort = [].sort;
      var test = [1, 2, 3];
      $export($export.P + $export.F * (fails(function() {
        test.sort(void 0);
      }) || !fails(function() {
        test.sort(null);
      }) || !require_strict_method()($sort)), "Array", {
        // 22.1.3.25 Array.prototype.sort(comparefn)
        sort: function sort(comparefn) {
          return comparefn === void 0 ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
        }
      });
    }
  });

  // node_modules/core-js/modules/_array-species-constructor.js
  var require_array_species_constructor = __commonJS({
    "node_modules/core-js/modules/_array-species-constructor.js"(exports, module) {
      var isObject = require_is_object();
      var isArray = require_is_array();
      var SPECIES = require_wks()("species");
      module.exports = function(original) {
        var C;
        if (isArray(original)) {
          C = original.constructor;
          if (typeof C == "function" && (C === Array || isArray(C.prototype))) C = void 0;
          if (isObject(C)) {
            C = C[SPECIES];
            if (C === null) C = void 0;
          }
        }
        return C === void 0 ? Array : C;
      };
    }
  });

  // node_modules/core-js/modules/_array-species-create.js
  var require_array_species_create = __commonJS({
    "node_modules/core-js/modules/_array-species-create.js"(exports, module) {
      var speciesConstructor = require_array_species_constructor();
      module.exports = function(original, length) {
        return new (speciesConstructor(original))(length);
      };
    }
  });

  // node_modules/core-js/modules/_array-methods.js
  var require_array_methods = __commonJS({
    "node_modules/core-js/modules/_array-methods.js"(exports, module) {
      var ctx = require_ctx();
      var IObject = require_iobject();
      var toObject = require_to_object();
      var toLength = require_to_length();
      var asc = require_array_species_create();
      module.exports = function(TYPE, $create) {
        var IS_MAP = TYPE == 1;
        var IS_FILTER = TYPE == 2;
        var IS_SOME = TYPE == 3;
        var IS_EVERY = TYPE == 4;
        var IS_FIND_INDEX = TYPE == 6;
        var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
        var create = $create || asc;
        return function($this, callbackfn, that) {
          var O = toObject($this);
          var self2 = IObject(O);
          var f = ctx(callbackfn, that, 3);
          var length = toLength(self2.length);
          var index = 0;
          var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : void 0;
          var val, res;
          for (; length > index; index++) if (NO_HOLES || index in self2) {
            val = self2[index];
            res = f(val, index, O);
            if (TYPE) {
              if (IS_MAP) result[index] = res;
              else if (res) switch (TYPE) {
                case 3:
                  return true;
                // some
                case 5:
                  return val;
                // find
                case 6:
                  return index;
                // findIndex
                case 2:
                  result.push(val);
              }
              else if (IS_EVERY) return false;
            }
          }
          return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
        };
      };
    }
  });

  // node_modules/core-js/modules/es6.array.for-each.js
  var require_es6_array_for_each = __commonJS({
    "node_modules/core-js/modules/es6.array.for-each.js"() {
      "use strict";
      var $export = require_export();
      var $forEach = require_array_methods()(0);
      var STRICT = require_strict_method()([].forEach, true);
      $export($export.P + $export.F * !STRICT, "Array", {
        // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
        forEach: function forEach(callbackfn) {
          return $forEach(this, callbackfn, arguments[1]);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.map.js
  var require_es6_array_map = __commonJS({
    "node_modules/core-js/modules/es6.array.map.js"() {
      "use strict";
      var $export = require_export();
      var $map = require_array_methods()(1);
      $export($export.P + $export.F * !require_strict_method()([].map, true), "Array", {
        // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
        map: function map(callbackfn) {
          return $map(this, callbackfn, arguments[1]);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.filter.js
  var require_es6_array_filter = __commonJS({
    "node_modules/core-js/modules/es6.array.filter.js"() {
      "use strict";
      var $export = require_export();
      var $filter = require_array_methods()(2);
      $export($export.P + $export.F * !require_strict_method()([].filter, true), "Array", {
        // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
        filter: function filter(callbackfn) {
          return $filter(this, callbackfn, arguments[1]);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.some.js
  var require_es6_array_some = __commonJS({
    "node_modules/core-js/modules/es6.array.some.js"() {
      "use strict";
      var $export = require_export();
      var $some = require_array_methods()(3);
      $export($export.P + $export.F * !require_strict_method()([].some, true), "Array", {
        // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
        some: function some(callbackfn) {
          return $some(this, callbackfn, arguments[1]);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.every.js
  var require_es6_array_every = __commonJS({
    "node_modules/core-js/modules/es6.array.every.js"() {
      "use strict";
      var $export = require_export();
      var $every = require_array_methods()(4);
      $export($export.P + $export.F * !require_strict_method()([].every, true), "Array", {
        // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
        every: function every(callbackfn) {
          return $every(this, callbackfn, arguments[1]);
        }
      });
    }
  });

  // node_modules/core-js/modules/_array-reduce.js
  var require_array_reduce = __commonJS({
    "node_modules/core-js/modules/_array-reduce.js"(exports, module) {
      var aFunction = require_a_function();
      var toObject = require_to_object();
      var IObject = require_iobject();
      var toLength = require_to_length();
      module.exports = function(that, callbackfn, aLen, memo, isRight) {
        aFunction(callbackfn);
        var O = toObject(that);
        var self2 = IObject(O);
        var length = toLength(O.length);
        var index = isRight ? length - 1 : 0;
        var i = isRight ? -1 : 1;
        if (aLen < 2) for (; ; ) {
          if (index in self2) {
            memo = self2[index];
            index += i;
            break;
          }
          index += i;
          if (isRight ? index < 0 : length <= index) {
            throw TypeError("Reduce of empty array with no initial value");
          }
        }
        for (; isRight ? index >= 0 : length > index; index += i) if (index in self2) {
          memo = callbackfn(memo, self2[index], index, O);
        }
        return memo;
      };
    }
  });

  // node_modules/core-js/modules/es6.array.reduce.js
  var require_es6_array_reduce = __commonJS({
    "node_modules/core-js/modules/es6.array.reduce.js"() {
      "use strict";
      var $export = require_export();
      var $reduce = require_array_reduce();
      $export($export.P + $export.F * !require_strict_method()([].reduce, true), "Array", {
        // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
        reduce: function reduce(callbackfn) {
          return $reduce(this, callbackfn, arguments.length, arguments[1], false);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.reduce-right.js
  var require_es6_array_reduce_right = __commonJS({
    "node_modules/core-js/modules/es6.array.reduce-right.js"() {
      "use strict";
      var $export = require_export();
      var $reduce = require_array_reduce();
      $export($export.P + $export.F * !require_strict_method()([].reduceRight, true), "Array", {
        // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
        reduceRight: function reduceRight(callbackfn) {
          return $reduce(this, callbackfn, arguments.length, arguments[1], true);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.index-of.js
  var require_es6_array_index_of = __commonJS({
    "node_modules/core-js/modules/es6.array.index-of.js"() {
      "use strict";
      var $export = require_export();
      var $indexOf = require_array_includes()(false);
      var $native = [].indexOf;
      var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;
      $export($export.P + $export.F * (NEGATIVE_ZERO || !require_strict_method()($native)), "Array", {
        // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
        indexOf: function indexOf(searchElement) {
          return NEGATIVE_ZERO ? $native.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments[1]);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.array.last-index-of.js
  var require_es6_array_last_index_of = __commonJS({
    "node_modules/core-js/modules/es6.array.last-index-of.js"() {
      "use strict";
      var $export = require_export();
      var toIObject = require_to_iobject();
      var toInteger = require_to_integer();
      var toLength = require_to_length();
      var $native = [].lastIndexOf;
      var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;
      $export($export.P + $export.F * (NEGATIVE_ZERO || !require_strict_method()($native)), "Array", {
        // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
        lastIndexOf: function lastIndexOf(searchElement) {
          if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
          var O = toIObject(this);
          var length = toLength(O.length);
          var index = length - 1;
          if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
          if (index < 0) index = length + index;
          for (; index >= 0; index--) if (index in O) {
            if (O[index] === searchElement) return index || 0;
          }
          return -1;
        }
      });
    }
  });

  // node_modules/core-js/modules/_array-copy-within.js
  var require_array_copy_within = __commonJS({
    "node_modules/core-js/modules/_array-copy-within.js"(exports, module) {
      "use strict";
      var toObject = require_to_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var toLength = require_to_length();
      module.exports = [].copyWithin || function copyWithin(target, start) {
        var O = toObject(this);
        var len = toLength(O.length);
        var to = toAbsoluteIndex(target, len);
        var from = toAbsoluteIndex(start, len);
        var end = arguments.length > 2 ? arguments[2] : void 0;
        var count = Math.min((end === void 0 ? len : toAbsoluteIndex(end, len)) - from, len - to);
        var inc = 1;
        if (from < to && to < from + count) {
          inc = -1;
          from += count - 1;
          to += count - 1;
        }
        while (count-- > 0) {
          if (from in O) O[to] = O[from];
          else delete O[to];
          to += inc;
          from += inc;
        }
        return O;
      };
    }
  });

  // node_modules/core-js/modules/_add-to-unscopables.js
  var require_add_to_unscopables = __commonJS({
    "node_modules/core-js/modules/_add-to-unscopables.js"(exports, module) {
      var UNSCOPABLES = require_wks()("unscopables");
      var ArrayProto = Array.prototype;
      if (ArrayProto[UNSCOPABLES] == void 0) require_hide()(ArrayProto, UNSCOPABLES, {});
      module.exports = function(key) {
        ArrayProto[UNSCOPABLES][key] = true;
      };
    }
  });

  // node_modules/core-js/modules/es6.array.copy-within.js
  var require_es6_array_copy_within = __commonJS({
    "node_modules/core-js/modules/es6.array.copy-within.js"() {
      var $export = require_export();
      $export($export.P, "Array", { copyWithin: require_array_copy_within() });
      require_add_to_unscopables()("copyWithin");
    }
  });

  // node_modules/core-js/modules/_array-fill.js
  var require_array_fill = __commonJS({
    "node_modules/core-js/modules/_array-fill.js"(exports, module) {
      "use strict";
      var toObject = require_to_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var toLength = require_to_length();
      module.exports = function fill(value) {
        var O = toObject(this);
        var length = toLength(O.length);
        var aLen = arguments.length;
        var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : void 0, length);
        var end = aLen > 2 ? arguments[2] : void 0;
        var endPos = end === void 0 ? length : toAbsoluteIndex(end, length);
        while (endPos > index) O[index++] = value;
        return O;
      };
    }
  });

  // node_modules/core-js/modules/es6.array.fill.js
  var require_es6_array_fill = __commonJS({
    "node_modules/core-js/modules/es6.array.fill.js"() {
      var $export = require_export();
      $export($export.P, "Array", { fill: require_array_fill() });
      require_add_to_unscopables()("fill");
    }
  });

  // node_modules/core-js/modules/es6.array.find.js
  var require_es6_array_find = __commonJS({
    "node_modules/core-js/modules/es6.array.find.js"() {
      "use strict";
      var $export = require_export();
      var $find = require_array_methods()(5);
      var KEY = "find";
      var forced = true;
      if (KEY in []) Array(1)[KEY](function() {
        forced = false;
      });
      $export($export.P + $export.F * forced, "Array", {
        find: function find(callbackfn) {
          return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      require_add_to_unscopables()(KEY);
    }
  });

  // node_modules/core-js/modules/es6.array.find-index.js
  var require_es6_array_find_index = __commonJS({
    "node_modules/core-js/modules/es6.array.find-index.js"() {
      "use strict";
      var $export = require_export();
      var $find = require_array_methods()(6);
      var KEY = "findIndex";
      var forced = true;
      if (KEY in []) Array(1)[KEY](function() {
        forced = false;
      });
      $export($export.P + $export.F * forced, "Array", {
        findIndex: function findIndex(callbackfn) {
          return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      require_add_to_unscopables()(KEY);
    }
  });

  // node_modules/core-js/modules/_set-species.js
  var require_set_species = __commonJS({
    "node_modules/core-js/modules/_set-species.js"(exports, module) {
      "use strict";
      var global = require_global();
      var dP = require_object_dp();
      var DESCRIPTORS = require_descriptors();
      var SPECIES = require_wks()("species");
      module.exports = function(KEY) {
        var C = global[KEY];
        if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
          configurable: true,
          get: function() {
            return this;
          }
        });
      };
    }
  });

  // node_modules/core-js/modules/es6.array.species.js
  var require_es6_array_species = __commonJS({
    "node_modules/core-js/modules/es6.array.species.js"() {
      require_set_species()("Array");
    }
  });

  // node_modules/core-js/modules/_iter-step.js
  var require_iter_step = __commonJS({
    "node_modules/core-js/modules/_iter-step.js"(exports, module) {
      module.exports = function(done, value) {
        return { value, done: !!done };
      };
    }
  });

  // node_modules/core-js/modules/es6.array.iterator.js
  var require_es6_array_iterator = __commonJS({
    "node_modules/core-js/modules/es6.array.iterator.js"(exports, module) {
      "use strict";
      var addToUnscopables = require_add_to_unscopables();
      var step = require_iter_step();
      var Iterators = require_iterators();
      var toIObject = require_to_iobject();
      module.exports = require_iter_define()(Array, "Array", function(iterated, kind) {
        this._t = toIObject(iterated);
        this._i = 0;
        this._k = kind;
      }, function() {
        var O = this._t;
        var kind = this._k;
        var index = this._i++;
        if (!O || index >= O.length) {
          this._t = void 0;
          return step(1);
        }
        if (kind == "keys") return step(0, index);
        if (kind == "values") return step(0, O[index]);
        return step(0, [index, O[index]]);
      }, "values");
      Iterators.Arguments = Iterators.Array;
      addToUnscopables("keys");
      addToUnscopables("values");
      addToUnscopables("entries");
    }
  });

  // node_modules/core-js/modules/_flags.js
  var require_flags = __commonJS({
    "node_modules/core-js/modules/_flags.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      module.exports = function() {
        var that = anObject(this);
        var result = "";
        if (that.global) result += "g";
        if (that.ignoreCase) result += "i";
        if (that.multiline) result += "m";
        if (that.unicode) result += "u";
        if (that.sticky) result += "y";
        return result;
      };
    }
  });

  // node_modules/core-js/modules/es6.regexp.constructor.js
  var require_es6_regexp_constructor = __commonJS({
    "node_modules/core-js/modules/es6.regexp.constructor.js"() {
      var global = require_global();
      var inheritIfRequired = require_inherit_if_required();
      var dP = require_object_dp().f;
      var gOPN = require_object_gopn().f;
      var isRegExp = require_is_regexp();
      var $flags = require_flags();
      var $RegExp = global.RegExp;
      var Base = $RegExp;
      var proto = $RegExp.prototype;
      var re1 = /a/g;
      var re2 = /a/g;
      var CORRECT_NEW = new $RegExp(re1) !== re1;
      if (require_descriptors() && (!CORRECT_NEW || require_fails()(function() {
        re2[require_wks()("match")] = false;
        return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, "i") != "/a/i";
      }))) {
        $RegExp = function RegExp2(p, f) {
          var tiRE = this instanceof $RegExp;
          var piRE = isRegExp(p);
          var fiU = f === void 0;
          return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(
            CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f),
            tiRE ? this : proto,
            $RegExp
          );
        };
        proxy = function(key) {
          key in $RegExp || dP($RegExp, key, {
            configurable: true,
            get: function() {
              return Base[key];
            },
            set: function(it) {
              Base[key] = it;
            }
          });
        };
        for (keys = gOPN(Base), i = 0; keys.length > i; ) proxy(keys[i++]);
        proto.constructor = $RegExp;
        $RegExp.prototype = proto;
        require_redefine()(global, "RegExp", $RegExp);
      }
      var proxy;
      var keys;
      var i;
      require_set_species()("RegExp");
    }
  });

  // node_modules/core-js/modules/_regexp-exec.js
  var require_regexp_exec = __commonJS({
    "node_modules/core-js/modules/_regexp-exec.js"(exports, module) {
      "use strict";
      var regexpFlags = require_flags();
      var nativeExec = RegExp.prototype.exec;
      var nativeReplace = String.prototype.replace;
      var patchedExec = nativeExec;
      var LAST_INDEX = "lastIndex";
      var UPDATES_LAST_INDEX_WRONG = (function() {
        var re1 = /a/, re2 = /b*/g;
        nativeExec.call(re1, "a");
        nativeExec.call(re2, "a");
        return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
      })();
      var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
      var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;
      if (PATCH) {
        patchedExec = function exec(str) {
          var re = this;
          var lastIndex, reCopy, match, i;
          if (NPCG_INCLUDED) {
            reCopy = new RegExp("^" + re.source + "$(?!\\s)", regexpFlags.call(re));
          }
          if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];
          match = nativeExec.call(re, str);
          if (UPDATES_LAST_INDEX_WRONG && match) {
            re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
          }
          if (NPCG_INCLUDED && match && match.length > 1) {
            nativeReplace.call(match[0], reCopy, function() {
              for (i = 1; i < arguments.length - 2; i++) {
                if (arguments[i] === void 0) match[i] = void 0;
              }
            });
          }
          return match;
        };
      }
      module.exports = patchedExec;
    }
  });

  // node_modules/core-js/modules/es6.regexp.exec.js
  var require_es6_regexp_exec = __commonJS({
    "node_modules/core-js/modules/es6.regexp.exec.js"() {
      "use strict";
      var regexpExec = require_regexp_exec();
      require_export()({
        target: "RegExp",
        proto: true,
        forced: regexpExec !== /./.exec
      }, {
        exec: regexpExec
      });
    }
  });

  // node_modules/core-js/modules/es6.regexp.flags.js
  var require_es6_regexp_flags = __commonJS({
    "node_modules/core-js/modules/es6.regexp.flags.js"() {
      if (require_descriptors() && /./g.flags != "g") require_object_dp().f(RegExp.prototype, "flags", {
        configurable: true,
        get: require_flags()
      });
    }
  });

  // node_modules/core-js/modules/es6.regexp.to-string.js
  var require_es6_regexp_to_string = __commonJS({
    "node_modules/core-js/modules/es6.regexp.to-string.js"() {
      "use strict";
      require_es6_regexp_flags();
      var anObject = require_an_object();
      var $flags = require_flags();
      var DESCRIPTORS = require_descriptors();
      var TO_STRING = "toString";
      var $toString = /./[TO_STRING];
      var define2 = function(fn) {
        require_redefine()(RegExp.prototype, TO_STRING, fn, true);
      };
      if (require_fails()(function() {
        return $toString.call({ source: "a", flags: "b" }) != "/a/b";
      })) {
        define2(function toString() {
          var R = anObject(this);
          return "/".concat(
            R.source,
            "/",
            "flags" in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : void 0
          );
        });
      } else if ($toString.name != TO_STRING) {
        define2(function toString() {
          return $toString.call(this);
        });
      }
    }
  });

  // node_modules/core-js/modules/_advance-string-index.js
  var require_advance_string_index = __commonJS({
    "node_modules/core-js/modules/_advance-string-index.js"(exports, module) {
      "use strict";
      var at = require_string_at()(true);
      module.exports = function(S, index, unicode) {
        return index + (unicode ? at(S, index).length : 1);
      };
    }
  });

  // node_modules/core-js/modules/_regexp-exec-abstract.js
  var require_regexp_exec_abstract = __commonJS({
    "node_modules/core-js/modules/_regexp-exec-abstract.js"(exports, module) {
      "use strict";
      var classof = require_classof();
      var builtinExec = RegExp.prototype.exec;
      module.exports = function(R, S) {
        var exec = R.exec;
        if (typeof exec === "function") {
          var result = exec.call(R, S);
          if (typeof result !== "object") {
            throw new TypeError("RegExp exec method returned something other than an Object or null");
          }
          return result;
        }
        if (classof(R) !== "RegExp") {
          throw new TypeError("RegExp#exec called on incompatible receiver");
        }
        return builtinExec.call(R, S);
      };
    }
  });

  // node_modules/core-js/modules/_fix-re-wks.js
  var require_fix_re_wks = __commonJS({
    "node_modules/core-js/modules/_fix-re-wks.js"(exports, module) {
      "use strict";
      require_es6_regexp_exec();
      var redefine = require_redefine();
      var hide = require_hide();
      var fails = require_fails();
      var defined = require_defined();
      var wks = require_wks();
      var regexpExec = require_regexp_exec();
      var SPECIES = wks("species");
      var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
        var re = /./;
        re.exec = function() {
          var result = [];
          result.groups = { a: "7" };
          return result;
        };
        return "".replace(re, "$<a>") !== "7";
      });
      var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function() {
        var re = /(?:)/;
        var originalExec = re.exec;
        re.exec = function() {
          return originalExec.apply(this, arguments);
        };
        var result = "ab".split(re);
        return result.length === 2 && result[0] === "a" && result[1] === "b";
      })();
      module.exports = function(KEY, length, exec) {
        var SYMBOL = wks(KEY);
        var DELEGATES_TO_SYMBOL = !fails(function() {
          var O = {};
          O[SYMBOL] = function() {
            return 7;
          };
          return ""[KEY](O) != 7;
        });
        var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function() {
          var execCalled = false;
          var re = /a/;
          re.exec = function() {
            execCalled = true;
            return null;
          };
          if (KEY === "split") {
            re.constructor = {};
            re.constructor[SPECIES] = function() {
              return re;
            };
          }
          re[SYMBOL]("");
          return !execCalled;
        }) : void 0;
        if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === "replace" && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
          var nativeRegExpMethod = /./[SYMBOL];
          var fns = exec(
            defined,
            SYMBOL,
            ""[KEY],
            function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
              if (regexp.exec === regexpExec) {
                if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                  return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                }
                return { done: true, value: nativeMethod.call(str, regexp, arg2) };
              }
              return { done: false };
            }
          );
          var strfn = fns[0];
          var rxfn = fns[1];
          redefine(String.prototype, KEY, strfn);
          hide(
            RegExp.prototype,
            SYMBOL,
            length == 2 ? function(string, arg) {
              return rxfn.call(string, this, arg);
            } : function(string) {
              return rxfn.call(string, this);
            }
          );
        }
      };
    }
  });

  // node_modules/core-js/modules/es6.regexp.match.js
  var require_es6_regexp_match = __commonJS({
    "node_modules/core-js/modules/es6.regexp.match.js"() {
      "use strict";
      var anObject = require_an_object();
      var toLength = require_to_length();
      var advanceStringIndex = require_advance_string_index();
      var regExpExec = require_regexp_exec_abstract();
      require_fix_re_wks()("match", 1, function(defined, MATCH, $match, maybeCallNative) {
        return [
          // `String.prototype.match` method
          // https://tc39.github.io/ecma262/#sec-string.prototype.match
          function match(regexp) {
            var O = defined(this);
            var fn = regexp == void 0 ? void 0 : regexp[MATCH];
            return fn !== void 0 ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
          },
          // `RegExp.prototype[@@match]` method
          // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
          function(regexp) {
            var res = maybeCallNative($match, regexp, this);
            if (res.done) return res.value;
            var rx = anObject(regexp);
            var S = String(this);
            if (!rx.global) return regExpExec(rx, S);
            var fullUnicode = rx.unicode;
            rx.lastIndex = 0;
            var A = [];
            var n = 0;
            var result;
            while ((result = regExpExec(rx, S)) !== null) {
              var matchStr = String(result[0]);
              A[n] = matchStr;
              if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
              n++;
            }
            return n === 0 ? null : A;
          }
        ];
      });
    }
  });

  // node_modules/core-js/modules/es6.regexp.replace.js
  var require_es6_regexp_replace = __commonJS({
    "node_modules/core-js/modules/es6.regexp.replace.js"() {
      "use strict";
      var anObject = require_an_object();
      var toObject = require_to_object();
      var toLength = require_to_length();
      var toInteger = require_to_integer();
      var advanceStringIndex = require_advance_string_index();
      var regExpExec = require_regexp_exec_abstract();
      var max = Math.max;
      var min = Math.min;
      var floor = Math.floor;
      var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
      var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;
      var maybeToString = function(it) {
        return it === void 0 ? it : String(it);
      };
      require_fix_re_wks()("replace", 2, function(defined, REPLACE, $replace, maybeCallNative) {
        return [
          // `String.prototype.replace` method
          // https://tc39.github.io/ecma262/#sec-string.prototype.replace
          function replace(searchValue, replaceValue) {
            var O = defined(this);
            var fn = searchValue == void 0 ? void 0 : searchValue[REPLACE];
            return fn !== void 0 ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
          },
          // `RegExp.prototype[@@replace]` method
          // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
          function(regexp, replaceValue) {
            var res = maybeCallNative($replace, regexp, this, replaceValue);
            if (res.done) return res.value;
            var rx = anObject(regexp);
            var S = String(this);
            var functionalReplace = typeof replaceValue === "function";
            if (!functionalReplace) replaceValue = String(replaceValue);
            var global = rx.global;
            if (global) {
              var fullUnicode = rx.unicode;
              rx.lastIndex = 0;
            }
            var results = [];
            while (true) {
              var result = regExpExec(rx, S);
              if (result === null) break;
              results.push(result);
              if (!global) break;
              var matchStr = String(result[0]);
              if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
            }
            var accumulatedResult = "";
            var nextSourcePosition = 0;
            for (var i = 0; i < results.length; i++) {
              result = results[i];
              var matched = String(result[0]);
              var position = max(min(toInteger(result.index), S.length), 0);
              var captures = [];
              for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
              var namedCaptures = result.groups;
              if (functionalReplace) {
                var replacerArgs = [matched].concat(captures, position, S);
                if (namedCaptures !== void 0) replacerArgs.push(namedCaptures);
                var replacement = String(replaceValue.apply(void 0, replacerArgs));
              } else {
                replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
              }
              if (position >= nextSourcePosition) {
                accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
                nextSourcePosition = position + matched.length;
              }
            }
            return accumulatedResult + S.slice(nextSourcePosition);
          }
        ];
        function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
          var tailPos = position + matched.length;
          var m = captures.length;
          var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
          if (namedCaptures !== void 0) {
            namedCaptures = toObject(namedCaptures);
            symbols = SUBSTITUTION_SYMBOLS;
          }
          return $replace.call(replacement, symbols, function(match, ch) {
            var capture;
            switch (ch.charAt(0)) {
              case "$":
                return "$";
              case "&":
                return matched;
              case "`":
                return str.slice(0, position);
              case "'":
                return str.slice(tailPos);
              case "<":
                capture = namedCaptures[ch.slice(1, -1)];
                break;
              default:
                var n = +ch;
                if (n === 0) return match;
                if (n > m) {
                  var f = floor(n / 10);
                  if (f === 0) return match;
                  if (f <= m) return captures[f - 1] === void 0 ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                  return match;
                }
                capture = captures[n - 1];
            }
            return capture === void 0 ? "" : capture;
          });
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.regexp.search.js
  var require_es6_regexp_search = __commonJS({
    "node_modules/core-js/modules/es6.regexp.search.js"() {
      "use strict";
      var anObject = require_an_object();
      var sameValue = require_same_value();
      var regExpExec = require_regexp_exec_abstract();
      require_fix_re_wks()("search", 1, function(defined, SEARCH, $search, maybeCallNative) {
        return [
          // `String.prototype.search` method
          // https://tc39.github.io/ecma262/#sec-string.prototype.search
          function search(regexp) {
            var O = defined(this);
            var fn = regexp == void 0 ? void 0 : regexp[SEARCH];
            return fn !== void 0 ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
          },
          // `RegExp.prototype[@@search]` method
          // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
          function(regexp) {
            var res = maybeCallNative($search, regexp, this);
            if (res.done) return res.value;
            var rx = anObject(regexp);
            var S = String(this);
            var previousLastIndex = rx.lastIndex;
            if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
            var result = regExpExec(rx, S);
            if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
            return result === null ? -1 : result.index;
          }
        ];
      });
    }
  });

  // node_modules/core-js/modules/_species-constructor.js
  var require_species_constructor = __commonJS({
    "node_modules/core-js/modules/_species-constructor.js"(exports, module) {
      var anObject = require_an_object();
      var aFunction = require_a_function();
      var SPECIES = require_wks()("species");
      module.exports = function(O, D) {
        var C = anObject(O).constructor;
        var S;
        return C === void 0 || (S = anObject(C)[SPECIES]) == void 0 ? D : aFunction(S);
      };
    }
  });

  // node_modules/core-js/modules/es6.regexp.split.js
  var require_es6_regexp_split = __commonJS({
    "node_modules/core-js/modules/es6.regexp.split.js"() {
      "use strict";
      var isRegExp = require_is_regexp();
      var anObject = require_an_object();
      var speciesConstructor = require_species_constructor();
      var advanceStringIndex = require_advance_string_index();
      var toLength = require_to_length();
      var callRegExpExec = require_regexp_exec_abstract();
      var regexpExec = require_regexp_exec();
      var fails = require_fails();
      var $min = Math.min;
      var $push = [].push;
      var $SPLIT = "split";
      var LENGTH = "length";
      var LAST_INDEX = "lastIndex";
      var MAX_UINT32 = 4294967295;
      var SUPPORTS_Y = !fails(function() {
        RegExp(MAX_UINT32, "y");
      });
      require_fix_re_wks()("split", 2, function(defined, SPLIT, $split, maybeCallNative) {
        var internalSplit;
        if ("abbc"[$SPLIT](/(b)*/)[1] == "c" || "test"[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || "ab"[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || "."[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || "."[$SPLIT](/()()/)[LENGTH] > 1 || ""[$SPLIT](/.?/)[LENGTH]) {
          internalSplit = function(separator, limit) {
            var string = String(this);
            if (separator === void 0 && limit === 0) return [];
            if (!isRegExp(separator)) return $split.call(string, separator, limit);
            var output = [];
            var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.unicode ? "u" : "") + (separator.sticky ? "y" : "");
            var lastLastIndex = 0;
            var splitLimit = limit === void 0 ? MAX_UINT32 : limit >>> 0;
            var separatorCopy = new RegExp(separator.source, flags + "g");
            var match, lastIndex, lastLength;
            while (match = regexpExec.call(separatorCopy, string)) {
              lastIndex = separatorCopy[LAST_INDEX];
              if (lastIndex > lastLastIndex) {
                output.push(string.slice(lastLastIndex, match.index));
                if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
                lastLength = match[0][LENGTH];
                lastLastIndex = lastIndex;
                if (output[LENGTH] >= splitLimit) break;
              }
              if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++;
            }
            if (lastLastIndex === string[LENGTH]) {
              if (lastLength || !separatorCopy.test("")) output.push("");
            } else output.push(string.slice(lastLastIndex));
            return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
          };
        } else if ("0"[$SPLIT](void 0, 0)[LENGTH]) {
          internalSplit = function(separator, limit) {
            return separator === void 0 && limit === 0 ? [] : $split.call(this, separator, limit);
          };
        } else {
          internalSplit = $split;
        }
        return [
          // `String.prototype.split` method
          // https://tc39.github.io/ecma262/#sec-string.prototype.split
          function split(separator, limit) {
            var O = defined(this);
            var splitter = separator == void 0 ? void 0 : separator[SPLIT];
            return splitter !== void 0 ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
          },
          // `RegExp.prototype[@@split]` method
          // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
          //
          // NOTE: This cannot be properly polyfilled in engines that don't support
          // the 'y' flag.
          function(regexp, limit) {
            var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
            if (res.done) return res.value;
            var rx = anObject(regexp);
            var S = String(this);
            var C = speciesConstructor(rx, RegExp);
            var unicodeMatching = rx.unicode;
            var flags = (rx.ignoreCase ? "i" : "") + (rx.multiline ? "m" : "") + (rx.unicode ? "u" : "") + (SUPPORTS_Y ? "y" : "g");
            var splitter = new C(SUPPORTS_Y ? rx : "^(?:" + rx.source + ")", flags);
            var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
            if (lim === 0) return [];
            if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
            var p = 0;
            var q = 0;
            var A = [];
            while (q < S.length) {
              splitter.lastIndex = SUPPORTS_Y ? q : 0;
              var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
              var e;
              if (z === null || (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
                q = advanceStringIndex(S, q, unicodeMatching);
              } else {
                A.push(S.slice(p, q));
                if (A.length === lim) return A;
                for (var i = 1; i <= z.length - 1; i++) {
                  A.push(z[i]);
                  if (A.length === lim) return A;
                }
                q = p = e;
              }
            }
            A.push(S.slice(p));
            return A;
          }
        ];
      });
    }
  });

  // node_modules/core-js/modules/_an-instance.js
  var require_an_instance = __commonJS({
    "node_modules/core-js/modules/_an-instance.js"(exports, module) {
      module.exports = function(it, Constructor, name, forbiddenField) {
        if (!(it instanceof Constructor) || forbiddenField !== void 0 && forbiddenField in it) {
          throw TypeError(name + ": incorrect invocation!");
        }
        return it;
      };
    }
  });

  // node_modules/core-js/modules/_for-of.js
  var require_for_of = __commonJS({
    "node_modules/core-js/modules/_for-of.js"(exports, module) {
      var ctx = require_ctx();
      var call = require_iter_call();
      var isArrayIter = require_is_array_iter();
      var anObject = require_an_object();
      var toLength = require_to_length();
      var getIterFn = require_core_get_iterator_method();
      var BREAK = {};
      var RETURN = {};
      var exports = module.exports = function(iterable, entries, fn, that, ITERATOR) {
        var iterFn = ITERATOR ? function() {
          return iterable;
        } : getIterFn(iterable);
        var f = ctx(fn, that, entries ? 2 : 1);
        var index = 0;
        var length, step, iterator, result;
        if (typeof iterFn != "function") throw TypeError(iterable + " is not iterable!");
        if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
          result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
          if (result === BREAK || result === RETURN) return result;
        }
        else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
          result = call(iterator, f, step.value, entries);
          if (result === BREAK || result === RETURN) return result;
        }
      };
      exports.BREAK = BREAK;
      exports.RETURN = RETURN;
    }
  });

  // node_modules/core-js/modules/_task.js
  var require_task = __commonJS({
    "node_modules/core-js/modules/_task.js"(exports, module) {
      var ctx = require_ctx();
      var invoke = require_invoke();
      var html = require_html();
      var cel = require_dom_create();
      var global = require_global();
      var process2 = global.process;
      var setTask = global.setImmediate;
      var clearTask = global.clearImmediate;
      var MessageChannel = global.MessageChannel;
      var Dispatch = global.Dispatch;
      var counter = 0;
      var queue = {};
      var ONREADYSTATECHANGE = "onreadystatechange";
      var defer;
      var channel2;
      var port;
      var run = function() {
        var id = +this;
        if (queue.hasOwnProperty(id)) {
          var fn = queue[id];
          delete queue[id];
          fn();
        }
      };
      var listener = function(event) {
        run.call(event.data);
      };
      if (!setTask || !clearTask) {
        setTask = function setImmediate(fn) {
          var args = [];
          var i = 1;
          while (arguments.length > i) args.push(arguments[i++]);
          queue[++counter] = function() {
            invoke(typeof fn == "function" ? fn : Function(fn), args);
          };
          defer(counter);
          return counter;
        };
        clearTask = function clearImmediate(id) {
          delete queue[id];
        };
        if (require_cof()(process2) == "process") {
          defer = function(id) {
            process2.nextTick(ctx(run, id, 1));
          };
        } else if (Dispatch && Dispatch.now) {
          defer = function(id) {
            Dispatch.now(ctx(run, id, 1));
          };
        } else if (MessageChannel) {
          channel2 = new MessageChannel();
          port = channel2.port2;
          channel2.port1.onmessage = listener;
          defer = ctx(port.postMessage, port, 1);
        } else if (global.addEventListener && typeof postMessage == "function" && !global.importScripts) {
          defer = function(id) {
            global.postMessage(id + "", "*");
          };
          global.addEventListener("message", listener, false);
        } else if (ONREADYSTATECHANGE in cel("script")) {
          defer = function(id) {
            html.appendChild(cel("script"))[ONREADYSTATECHANGE] = function() {
              html.removeChild(this);
              run.call(id);
            };
          };
        } else {
          defer = function(id) {
            setTimeout(ctx(run, id, 1), 0);
          };
        }
      }
      module.exports = {
        set: setTask,
        clear: clearTask
      };
    }
  });

  // node_modules/core-js/modules/_microtask.js
  var require_microtask = __commonJS({
    "node_modules/core-js/modules/_microtask.js"(exports, module) {
      var global = require_global();
      var macrotask = require_task().set;
      var Observer = global.MutationObserver || global.WebKitMutationObserver;
      var process2 = global.process;
      var Promise2 = global.Promise;
      var isNode = require_cof()(process2) == "process";
      module.exports = function() {
        var head, last, notify;
        var flush = function() {
          var parent, fn;
          if (isNode && (parent = process2.domain)) parent.exit();
          while (head) {
            fn = head.fn;
            head = head.next;
            try {
              fn();
            } catch (e) {
              if (head) notify();
              else last = void 0;
              throw e;
            }
          }
          last = void 0;
          if (parent) parent.enter();
        };
        if (isNode) {
          notify = function() {
            process2.nextTick(flush);
          };
        } else if (Observer && !(global.navigator && global.navigator.standalone)) {
          var toggle = true;
          var node = document.createTextNode("");
          new Observer(flush).observe(node, { characterData: true });
          notify = function() {
            node.data = toggle = !toggle;
          };
        } else if (Promise2 && Promise2.resolve) {
          var promise = Promise2.resolve(void 0);
          notify = function() {
            promise.then(flush);
          };
        } else {
          notify = function() {
            macrotask.call(global, flush);
          };
        }
        return function(fn) {
          var task = { fn, next: void 0 };
          if (last) last.next = task;
          if (!head) {
            head = task;
            notify();
          }
          last = task;
        };
      };
    }
  });

  // node_modules/core-js/modules/_new-promise-capability.js
  var require_new_promise_capability = __commonJS({
    "node_modules/core-js/modules/_new-promise-capability.js"(exports, module) {
      "use strict";
      var aFunction = require_a_function();
      function PromiseCapability(C) {
        var resolve, reject;
        this.promise = new C(function($$resolve, $$reject) {
          if (resolve !== void 0 || reject !== void 0) throw TypeError("Bad Promise constructor");
          resolve = $$resolve;
          reject = $$reject;
        });
        this.resolve = aFunction(resolve);
        this.reject = aFunction(reject);
      }
      module.exports.f = function(C) {
        return new PromiseCapability(C);
      };
    }
  });

  // node_modules/core-js/modules/_perform.js
  var require_perform = __commonJS({
    "node_modules/core-js/modules/_perform.js"(exports, module) {
      module.exports = function(exec) {
        try {
          return { e: false, v: exec() };
        } catch (e) {
          return { e: true, v: e };
        }
      };
    }
  });

  // node_modules/core-js/modules/_user-agent.js
  var require_user_agent = __commonJS({
    "node_modules/core-js/modules/_user-agent.js"(exports, module) {
      var global = require_global();
      var navigator2 = global.navigator;
      module.exports = navigator2 && navigator2.userAgent || "";
    }
  });

  // node_modules/core-js/modules/_promise-resolve.js
  var require_promise_resolve = __commonJS({
    "node_modules/core-js/modules/_promise-resolve.js"(exports, module) {
      var anObject = require_an_object();
      var isObject = require_is_object();
      var newPromiseCapability = require_new_promise_capability();
      module.exports = function(C, x) {
        anObject(C);
        if (isObject(x) && x.constructor === C) return x;
        var promiseCapability = newPromiseCapability.f(C);
        var resolve = promiseCapability.resolve;
        resolve(x);
        return promiseCapability.promise;
      };
    }
  });

  // node_modules/core-js/modules/_redefine-all.js
  var require_redefine_all = __commonJS({
    "node_modules/core-js/modules/_redefine-all.js"(exports, module) {
      var redefine = require_redefine();
      module.exports = function(target, src, safe) {
        for (var key in src) redefine(target, key, src[key], safe);
        return target;
      };
    }
  });

  // node_modules/core-js/modules/es6.promise.js
  var require_es6_promise = __commonJS({
    "node_modules/core-js/modules/es6.promise.js"() {
      "use strict";
      var LIBRARY = require_library();
      var global = require_global();
      var ctx = require_ctx();
      var classof = require_classof();
      var $export = require_export();
      var isObject = require_is_object();
      var aFunction = require_a_function();
      var anInstance = require_an_instance();
      var forOf = require_for_of();
      var speciesConstructor = require_species_constructor();
      var task = require_task().set;
      var microtask = require_microtask()();
      var newPromiseCapabilityModule = require_new_promise_capability();
      var perform = require_perform();
      var userAgent = require_user_agent();
      var promiseResolve = require_promise_resolve();
      var PROMISE = "Promise";
      var TypeError2 = global.TypeError;
      var process2 = global.process;
      var versions = process2 && process2.versions;
      var v8 = versions && versions.v8 || "";
      var $Promise = global[PROMISE];
      var isNode = classof(process2) == "process";
      var empty = function() {
      };
      var Internal;
      var newGenericPromiseCapability;
      var OwnPromiseCapability;
      var Wrapper;
      var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
      var USE_NATIVE = !!(function() {
        try {
          var promise = $Promise.resolve(1);
          var FakePromise = (promise.constructor = {})[require_wks()("species")] = function(exec) {
            exec(empty, empty);
          };
          return (isNode || typeof PromiseRejectionEvent == "function") && promise.then(empty) instanceof FakePromise && v8.indexOf("6.6") !== 0 && userAgent.indexOf("Chrome/66") === -1;
        } catch (e) {
        }
      })();
      var isThenable = function(it) {
        var then;
        return isObject(it) && typeof (then = it.then) == "function" ? then : false;
      };
      var notify = function(promise, isReject) {
        if (promise._n) return;
        promise._n = true;
        var chain = promise._c;
        microtask(function() {
          var value = promise._v;
          var ok = promise._s == 1;
          var i = 0;
          var run = function(reaction) {
            var handler = ok ? reaction.ok : reaction.fail;
            var resolve = reaction.resolve;
            var reject = reaction.reject;
            var domain = reaction.domain;
            var result, then, exited;
            try {
              if (handler) {
                if (!ok) {
                  if (promise._h == 2) onHandleUnhandled(promise);
                  promise._h = 1;
                }
                if (handler === true) result = value;
                else {
                  if (domain) domain.enter();
                  result = handler(value);
                  if (domain) {
                    domain.exit();
                    exited = true;
                  }
                }
                if (result === reaction.promise) {
                  reject(TypeError2("Promise-chain cycle"));
                } else if (then = isThenable(result)) {
                  then.call(result, resolve, reject);
                } else resolve(result);
              } else reject(value);
            } catch (e) {
              if (domain && !exited) domain.exit();
              reject(e);
            }
          };
          while (chain.length > i) run(chain[i++]);
          promise._c = [];
          promise._n = false;
          if (isReject && !promise._h) onUnhandled(promise);
        });
      };
      var onUnhandled = function(promise) {
        task.call(global, function() {
          var value = promise._v;
          var unhandled = isUnhandled(promise);
          var result, handler, console2;
          if (unhandled) {
            result = perform(function() {
              if (isNode) {
                process2.emit("unhandledRejection", value, promise);
              } else if (handler = global.onunhandledrejection) {
                handler({ promise, reason: value });
              } else if ((console2 = global.console) && console2.error) {
                console2.error("Unhandled promise rejection", value);
              }
            });
            promise._h = isNode || isUnhandled(promise) ? 2 : 1;
          }
          promise._a = void 0;
          if (unhandled && result.e) throw result.v;
        });
      };
      var isUnhandled = function(promise) {
        return promise._h !== 1 && (promise._a || promise._c).length === 0;
      };
      var onHandleUnhandled = function(promise) {
        task.call(global, function() {
          var handler;
          if (isNode) {
            process2.emit("rejectionHandled", promise);
          } else if (handler = global.onrejectionhandled) {
            handler({ promise, reason: promise._v });
          }
        });
      };
      var $reject = function(value) {
        var promise = this;
        if (promise._d) return;
        promise._d = true;
        promise = promise._w || promise;
        promise._v = value;
        promise._s = 2;
        if (!promise._a) promise._a = promise._c.slice();
        notify(promise, true);
      };
      var $resolve = function(value) {
        var promise = this;
        var then;
        if (promise._d) return;
        promise._d = true;
        promise = promise._w || promise;
        try {
          if (promise === value) throw TypeError2("Promise can't be resolved itself");
          if (then = isThenable(value)) {
            microtask(function() {
              var wrapper = { _w: promise, _d: false };
              try {
                then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
              } catch (e) {
                $reject.call(wrapper, e);
              }
            });
          } else {
            promise._v = value;
            promise._s = 1;
            notify(promise, false);
          }
        } catch (e) {
          $reject.call({ _w: promise, _d: false }, e);
        }
      };
      if (!USE_NATIVE) {
        $Promise = function Promise2(executor) {
          anInstance(this, $Promise, PROMISE, "_h");
          aFunction(executor);
          Internal.call(this);
          try {
            executor(ctx($resolve, this, 1), ctx($reject, this, 1));
          } catch (err) {
            $reject.call(this, err);
          }
        };
        Internal = function Promise2(executor) {
          this._c = [];
          this._a = void 0;
          this._s = 0;
          this._d = false;
          this._v = void 0;
          this._h = 0;
          this._n = false;
        };
        Internal.prototype = require_redefine_all()($Promise.prototype, {
          // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
          then: function then(onFulfilled, onRejected) {
            var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
            reaction.ok = typeof onFulfilled == "function" ? onFulfilled : true;
            reaction.fail = typeof onRejected == "function" && onRejected;
            reaction.domain = isNode ? process2.domain : void 0;
            this._c.push(reaction);
            if (this._a) this._a.push(reaction);
            if (this._s) notify(this, false);
            return reaction.promise;
          },
          // 25.4.5.1 Promise.prototype.catch(onRejected)
          "catch": function(onRejected) {
            return this.then(void 0, onRejected);
          }
        });
        OwnPromiseCapability = function() {
          var promise = new Internal();
          this.promise = promise;
          this.resolve = ctx($resolve, promise, 1);
          this.reject = ctx($reject, promise, 1);
        };
        newPromiseCapabilityModule.f = newPromiseCapability = function(C) {
          return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
        };
      }
      $export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
      require_set_to_string_tag()($Promise, PROMISE);
      require_set_species()(PROMISE);
      Wrapper = require_core()[PROMISE];
      $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
        // 25.4.4.5 Promise.reject(r)
        reject: function reject(r) {
          var capability = newPromiseCapability(this);
          var $$reject = capability.reject;
          $$reject(r);
          return capability.promise;
        }
      });
      $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
        // 25.4.4.6 Promise.resolve(x)
        resolve: function resolve(x) {
          return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
        }
      });
      $export($export.S + $export.F * !(USE_NATIVE && require_iter_detect()(function(iter) {
        $Promise.all(iter)["catch"](empty);
      })), PROMISE, {
        // 25.4.4.1 Promise.all(iterable)
        all: function all(iterable) {
          var C = this;
          var capability = newPromiseCapability(C);
          var resolve = capability.resolve;
          var reject = capability.reject;
          var result = perform(function() {
            var values = [];
            var index = 0;
            var remaining = 1;
            forOf(iterable, false, function(promise) {
              var $index = index++;
              var alreadyCalled = false;
              values.push(void 0);
              remaining++;
              C.resolve(promise).then(function(value) {
                if (alreadyCalled) return;
                alreadyCalled = true;
                values[$index] = value;
                --remaining || resolve(values);
              }, reject);
            });
            --remaining || resolve(values);
          });
          if (result.e) reject(result.v);
          return capability.promise;
        },
        // 25.4.4.4 Promise.race(iterable)
        race: function race(iterable) {
          var C = this;
          var capability = newPromiseCapability(C);
          var reject = capability.reject;
          var result = perform(function() {
            forOf(iterable, false, function(promise) {
              C.resolve(promise).then(capability.resolve, reject);
            });
          });
          if (result.e) reject(result.v);
          return capability.promise;
        }
      });
    }
  });

  // node_modules/core-js/modules/_validate-collection.js
  var require_validate_collection = __commonJS({
    "node_modules/core-js/modules/_validate-collection.js"(exports, module) {
      var isObject = require_is_object();
      module.exports = function(it, TYPE) {
        if (!isObject(it) || it._t !== TYPE) throw TypeError("Incompatible receiver, " + TYPE + " required!");
        return it;
      };
    }
  });

  // node_modules/core-js/modules/_collection-strong.js
  var require_collection_strong = __commonJS({
    "node_modules/core-js/modules/_collection-strong.js"(exports, module) {
      "use strict";
      var dP = require_object_dp().f;
      var create = require_object_create();
      var redefineAll = require_redefine_all();
      var ctx = require_ctx();
      var anInstance = require_an_instance();
      var forOf = require_for_of();
      var $iterDefine = require_iter_define();
      var step = require_iter_step();
      var setSpecies = require_set_species();
      var DESCRIPTORS = require_descriptors();
      var fastKey = require_meta().fastKey;
      var validate = require_validate_collection();
      var SIZE = DESCRIPTORS ? "_s" : "size";
      var getEntry = function(that, key) {
        var index = fastKey(key);
        var entry;
        if (index !== "F") return that._i[index];
        for (entry = that._f; entry; entry = entry.n) {
          if (entry.k == key) return entry;
        }
      };
      module.exports = {
        getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
          var C = wrapper(function(that, iterable) {
            anInstance(that, C, NAME, "_i");
            that._t = NAME;
            that._i = create(null);
            that._f = void 0;
            that._l = void 0;
            that[SIZE] = 0;
            if (iterable != void 0) forOf(iterable, IS_MAP, that[ADDER], that);
          });
          redefineAll(C.prototype, {
            // 23.1.3.1 Map.prototype.clear()
            // 23.2.3.2 Set.prototype.clear()
            clear: function clear() {
              for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
                entry.r = true;
                if (entry.p) entry.p = entry.p.n = void 0;
                delete data[entry.i];
              }
              that._f = that._l = void 0;
              that[SIZE] = 0;
            },
            // 23.1.3.3 Map.prototype.delete(key)
            // 23.2.3.4 Set.prototype.delete(value)
            "delete": function(key) {
              var that = validate(this, NAME);
              var entry = getEntry(that, key);
              if (entry) {
                var next = entry.n;
                var prev = entry.p;
                delete that._i[entry.i];
                entry.r = true;
                if (prev) prev.n = next;
                if (next) next.p = prev;
                if (that._f == entry) that._f = next;
                if (that._l == entry) that._l = prev;
                that[SIZE]--;
              }
              return !!entry;
            },
            // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
            // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
            forEach: function forEach(callbackfn) {
              validate(this, NAME);
              var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : void 0, 3);
              var entry;
              while (entry = entry ? entry.n : this._f) {
                f(entry.v, entry.k, this);
                while (entry && entry.r) entry = entry.p;
              }
            },
            // 23.1.3.7 Map.prototype.has(key)
            // 23.2.3.7 Set.prototype.has(value)
            has: function has(key) {
              return !!getEntry(validate(this, NAME), key);
            }
          });
          if (DESCRIPTORS) dP(C.prototype, "size", {
            get: function() {
              return validate(this, NAME)[SIZE];
            }
          });
          return C;
        },
        def: function(that, key, value) {
          var entry = getEntry(that, key);
          var prev, index;
          if (entry) {
            entry.v = value;
          } else {
            that._l = entry = {
              i: index = fastKey(key, true),
              // <- index
              k: key,
              // <- key
              v: value,
              // <- value
              p: prev = that._l,
              // <- previous entry
              n: void 0,
              // <- next entry
              r: false
              // <- removed
            };
            if (!that._f) that._f = entry;
            if (prev) prev.n = entry;
            that[SIZE]++;
            if (index !== "F") that._i[index] = entry;
          }
          return that;
        },
        getEntry,
        setStrong: function(C, NAME, IS_MAP) {
          $iterDefine(C, NAME, function(iterated, kind) {
            this._t = validate(iterated, NAME);
            this._k = kind;
            this._l = void 0;
          }, function() {
            var that = this;
            var kind = that._k;
            var entry = that._l;
            while (entry && entry.r) entry = entry.p;
            if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
              that._t = void 0;
              return step(1);
            }
            if (kind == "keys") return step(0, entry.k);
            if (kind == "values") return step(0, entry.v);
            return step(0, [entry.k, entry.v]);
          }, IS_MAP ? "entries" : "values", !IS_MAP, true);
          setSpecies(NAME);
        }
      };
    }
  });

  // node_modules/core-js/modules/_collection.js
  var require_collection = __commonJS({
    "node_modules/core-js/modules/_collection.js"(exports, module) {
      "use strict";
      var global = require_global();
      var $export = require_export();
      var redefine = require_redefine();
      var redefineAll = require_redefine_all();
      var meta = require_meta();
      var forOf = require_for_of();
      var anInstance = require_an_instance();
      var isObject = require_is_object();
      var fails = require_fails();
      var $iterDetect = require_iter_detect();
      var setToStringTag = require_set_to_string_tag();
      var inheritIfRequired = require_inherit_if_required();
      module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
        var Base = global[NAME];
        var C = Base;
        var ADDER = IS_MAP ? "set" : "add";
        var proto = C && C.prototype;
        var O = {};
        var fixMethod = function(KEY) {
          var fn = proto[KEY];
          redefine(
            proto,
            KEY,
            KEY == "delete" ? function(a) {
              return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
            } : KEY == "has" ? function has(a) {
              return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
            } : KEY == "get" ? function get(a) {
              return IS_WEAK && !isObject(a) ? void 0 : fn.call(this, a === 0 ? 0 : a);
            } : KEY == "add" ? function add(a) {
              fn.call(this, a === 0 ? 0 : a);
              return this;
            } : function set(a, b) {
              fn.call(this, a === 0 ? 0 : a, b);
              return this;
            }
          );
        };
        if (typeof C != "function" || !(IS_WEAK || proto.forEach && !fails(function() {
          new C().entries().next();
        }))) {
          C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
          redefineAll(C.prototype, methods);
          meta.NEED = true;
        } else {
          var instance = new C();
          var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
          var THROWS_ON_PRIMITIVES = fails(function() {
            instance.has(1);
          });
          var ACCEPT_ITERABLES = $iterDetect(function(iter) {
            new C(iter);
          });
          var BUGGY_ZERO = !IS_WEAK && fails(function() {
            var $instance = new C();
            var index = 5;
            while (index--) $instance[ADDER](index, index);
            return !$instance.has(-0);
          });
          if (!ACCEPT_ITERABLES) {
            C = wrapper(function(target, iterable) {
              anInstance(target, C, NAME);
              var that = inheritIfRequired(new Base(), target, C);
              if (iterable != void 0) forOf(iterable, IS_MAP, that[ADDER], that);
              return that;
            });
            C.prototype = proto;
            proto.constructor = C;
          }
          if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
            fixMethod("delete");
            fixMethod("has");
            IS_MAP && fixMethod("get");
          }
          if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
          if (IS_WEAK && proto.clear) delete proto.clear;
        }
        setToStringTag(C, NAME);
        O[NAME] = C;
        $export($export.G + $export.W + $export.F * (C != Base), O);
        if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
        return C;
      };
    }
  });

  // node_modules/core-js/modules/es6.map.js
  var require_es6_map = __commonJS({
    "node_modules/core-js/modules/es6.map.js"(exports, module) {
      "use strict";
      var strong = require_collection_strong();
      var validate = require_validate_collection();
      var MAP = "Map";
      module.exports = require_collection()(MAP, function(get) {
        return function Map2() {
          return get(this, arguments.length > 0 ? arguments[0] : void 0);
        };
      }, {
        // 23.1.3.6 Map.prototype.get(key)
        get: function get(key) {
          var entry = strong.getEntry(validate(this, MAP), key);
          return entry && entry.v;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function set(key, value) {
          return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
        }
      }, strong, true);
    }
  });

  // node_modules/core-js/modules/es6.set.js
  var require_es6_set = __commonJS({
    "node_modules/core-js/modules/es6.set.js"(exports, module) {
      "use strict";
      var strong = require_collection_strong();
      var validate = require_validate_collection();
      var SET = "Set";
      module.exports = require_collection()(SET, function(get) {
        return function Set2() {
          return get(this, arguments.length > 0 ? arguments[0] : void 0);
        };
      }, {
        // 23.2.3.1 Set.prototype.add(value)
        add: function add(value) {
          return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
        }
      }, strong);
    }
  });

  // node_modules/core-js/modules/_collection-weak.js
  var require_collection_weak = __commonJS({
    "node_modules/core-js/modules/_collection-weak.js"(exports, module) {
      "use strict";
      var redefineAll = require_redefine_all();
      var getWeak = require_meta().getWeak;
      var anObject = require_an_object();
      var isObject = require_is_object();
      var anInstance = require_an_instance();
      var forOf = require_for_of();
      var createArrayMethod = require_array_methods();
      var $has = require_has();
      var validate = require_validate_collection();
      var arrayFind = createArrayMethod(5);
      var arrayFindIndex = createArrayMethod(6);
      var id = 0;
      var uncaughtFrozenStore = function(that) {
        return that._l || (that._l = new UncaughtFrozenStore());
      };
      var UncaughtFrozenStore = function() {
        this.a = [];
      };
      var findUncaughtFrozen = function(store, key) {
        return arrayFind(store.a, function(it) {
          return it[0] === key;
        });
      };
      UncaughtFrozenStore.prototype = {
        get: function(key) {
          var entry = findUncaughtFrozen(this, key);
          if (entry) return entry[1];
        },
        has: function(key) {
          return !!findUncaughtFrozen(this, key);
        },
        set: function(key, value) {
          var entry = findUncaughtFrozen(this, key);
          if (entry) entry[1] = value;
          else this.a.push([key, value]);
        },
        "delete": function(key) {
          var index = arrayFindIndex(this.a, function(it) {
            return it[0] === key;
          });
          if (~index) this.a.splice(index, 1);
          return !!~index;
        }
      };
      module.exports = {
        getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
          var C = wrapper(function(that, iterable) {
            anInstance(that, C, NAME, "_i");
            that._t = NAME;
            that._i = id++;
            that._l = void 0;
            if (iterable != void 0) forOf(iterable, IS_MAP, that[ADDER], that);
          });
          redefineAll(C.prototype, {
            // 23.3.3.2 WeakMap.prototype.delete(key)
            // 23.4.3.3 WeakSet.prototype.delete(value)
            "delete": function(key) {
              if (!isObject(key)) return false;
              var data = getWeak(key);
              if (data === true) return uncaughtFrozenStore(validate(this, NAME))["delete"](key);
              return data && $has(data, this._i) && delete data[this._i];
            },
            // 23.3.3.4 WeakMap.prototype.has(key)
            // 23.4.3.4 WeakSet.prototype.has(value)
            has: function has(key) {
              if (!isObject(key)) return false;
              var data = getWeak(key);
              if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
              return data && $has(data, this._i);
            }
          });
          return C;
        },
        def: function(that, key, value) {
          var data = getWeak(anObject(key), true);
          if (data === true) uncaughtFrozenStore(that).set(key, value);
          else data[that._i] = value;
          return that;
        },
        ufstore: uncaughtFrozenStore
      };
    }
  });

  // node_modules/core-js/modules/es6.weak-map.js
  var require_es6_weak_map = __commonJS({
    "node_modules/core-js/modules/es6.weak-map.js"(exports, module) {
      "use strict";
      var global = require_global();
      var each = require_array_methods()(0);
      var redefine = require_redefine();
      var meta = require_meta();
      var assign = require_object_assign();
      var weak = require_collection_weak();
      var isObject = require_is_object();
      var validate = require_validate_collection();
      var NATIVE_WEAK_MAP = require_validate_collection();
      var IS_IE11 = !global.ActiveXObject && "ActiveXObject" in global;
      var WEAK_MAP = "WeakMap";
      var getWeak = meta.getWeak;
      var isExtensible = Object.isExtensible;
      var uncaughtFrozenStore = weak.ufstore;
      var InternalMap;
      var wrapper = function(get) {
        return function WeakMap2() {
          return get(this, arguments.length > 0 ? arguments[0] : void 0);
        };
      };
      var methods = {
        // 23.3.3.3 WeakMap.prototype.get(key)
        get: function get(key) {
          if (isObject(key)) {
            var data = getWeak(key);
            if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
            return data ? data[this._i] : void 0;
          }
        },
        // 23.3.3.5 WeakMap.prototype.set(key, value)
        set: function set(key, value) {
          return weak.def(validate(this, WEAK_MAP), key, value);
        }
      };
      var $WeakMap = module.exports = require_collection()(WEAK_MAP, wrapper, methods, weak, true, true);
      if (NATIVE_WEAK_MAP && IS_IE11) {
        InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
        assign(InternalMap.prototype, methods);
        meta.NEED = true;
        each(["delete", "has", "get", "set"], function(key) {
          var proto = $WeakMap.prototype;
          var method = proto[key];
          redefine(proto, key, function(a, b) {
            if (isObject(a) && !isExtensible(a)) {
              if (!this._f) this._f = new InternalMap();
              var result = this._f[key](a, b);
              return key == "set" ? this : result;
            }
            return method.call(this, a, b);
          });
        });
      }
    }
  });

  // node_modules/core-js/modules/es6.weak-set.js
  var require_es6_weak_set = __commonJS({
    "node_modules/core-js/modules/es6.weak-set.js"() {
      "use strict";
      var weak = require_collection_weak();
      var validate = require_validate_collection();
      var WEAK_SET = "WeakSet";
      require_collection()(WEAK_SET, function(get) {
        return function WeakSet2() {
          return get(this, arguments.length > 0 ? arguments[0] : void 0);
        };
      }, {
        // 23.4.3.1 WeakSet.prototype.add(value)
        add: function add(value) {
          return weak.def(validate(this, WEAK_SET), value, true);
        }
      }, weak, false, true);
    }
  });

  // node_modules/core-js/modules/_typed.js
  var require_typed = __commonJS({
    "node_modules/core-js/modules/_typed.js"(exports, module) {
      var global = require_global();
      var hide = require_hide();
      var uid = require_uid();
      var TYPED = uid("typed_array");
      var VIEW = uid("view");
      var ABV = !!(global.ArrayBuffer && global.DataView);
      var CONSTR = ABV;
      var i = 0;
      var l = 9;
      var Typed;
      var TypedArrayConstructors = "Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");
      while (i < l) {
        if (Typed = global[TypedArrayConstructors[i++]]) {
          hide(Typed.prototype, TYPED, true);
          hide(Typed.prototype, VIEW, true);
        } else CONSTR = false;
      }
      module.exports = {
        ABV,
        CONSTR,
        TYPED,
        VIEW
      };
    }
  });

  // node_modules/core-js/modules/_to-index.js
  var require_to_index = __commonJS({
    "node_modules/core-js/modules/_to-index.js"(exports, module) {
      var toInteger = require_to_integer();
      var toLength = require_to_length();
      module.exports = function(it) {
        if (it === void 0) return 0;
        var number = toInteger(it);
        var length = toLength(number);
        if (number !== length) throw RangeError("Wrong length!");
        return length;
      };
    }
  });

  // node_modules/core-js/modules/_typed-buffer.js
  var require_typed_buffer = __commonJS({
    "node_modules/core-js/modules/_typed-buffer.js"(exports) {
      "use strict";
      var global = require_global();
      var DESCRIPTORS = require_descriptors();
      var LIBRARY = require_library();
      var $typed = require_typed();
      var hide = require_hide();
      var redefineAll = require_redefine_all();
      var fails = require_fails();
      var anInstance = require_an_instance();
      var toInteger = require_to_integer();
      var toLength = require_to_length();
      var toIndex = require_to_index();
      var gOPN = require_object_gopn().f;
      var dP = require_object_dp().f;
      var arrayFill = require_array_fill();
      var setToStringTag = require_set_to_string_tag();
      var ARRAY_BUFFER = "ArrayBuffer";
      var DATA_VIEW = "DataView";
      var PROTOTYPE = "prototype";
      var WRONG_LENGTH = "Wrong length!";
      var WRONG_INDEX = "Wrong index!";
      var $ArrayBuffer = global[ARRAY_BUFFER];
      var $DataView = global[DATA_VIEW];
      var Math2 = global.Math;
      var RangeError2 = global.RangeError;
      var Infinity2 = global.Infinity;
      var BaseBuffer = $ArrayBuffer;
      var abs = Math2.abs;
      var pow = Math2.pow;
      var floor = Math2.floor;
      var log = Math2.log;
      var LN2 = Math2.LN2;
      var BUFFER = "buffer";
      var BYTE_LENGTH = "byteLength";
      var BYTE_OFFSET = "byteOffset";
      var $BUFFER = DESCRIPTORS ? "_b" : BUFFER;
      var $LENGTH = DESCRIPTORS ? "_l" : BYTE_LENGTH;
      var $OFFSET = DESCRIPTORS ? "_o" : BYTE_OFFSET;
      function packIEEE754(value, mLen, nBytes) {
        var buffer = new Array(nBytes);
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
        var i = 0;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        var e, m, c;
        value = abs(value);
        if (value != value || value === Infinity2) {
          m = value != value ? 1 : 0;
          e = eMax;
        } else {
          e = floor(log(value) / LN2);
          if (value * (c = pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * pow(2, eBias - 1) * pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8) ;
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8) ;
        buffer[--i] |= s * 128;
        return buffer;
      }
      function unpackIEEE754(buffer, mLen, nBytes) {
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = eLen - 7;
        var i = nBytes - 1;
        var s = buffer[i--];
        var e = s & 127;
        var m;
        s >>= 7;
        for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8) ;
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8) ;
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : s ? -Infinity2 : Infinity2;
        } else {
          m = m + pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * pow(2, e - mLen);
      }
      function unpackI32(bytes) {
        return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
      }
      function packI8(it) {
        return [it & 255];
      }
      function packI16(it) {
        return [it & 255, it >> 8 & 255];
      }
      function packI32(it) {
        return [it & 255, it >> 8 & 255, it >> 16 & 255, it >> 24 & 255];
      }
      function packF64(it) {
        return packIEEE754(it, 52, 8);
      }
      function packF32(it) {
        return packIEEE754(it, 23, 4);
      }
      function addGetter(C, key2, internal) {
        dP(C[PROTOTYPE], key2, { get: function() {
          return this[internal];
        } });
      }
      function get(view2, bytes, index, isLittleEndian) {
        var numIndex = +index;
        var intIndex = toIndex(numIndex);
        if (intIndex + bytes > view2[$LENGTH]) throw RangeError2(WRONG_INDEX);
        var store = view2[$BUFFER]._b;
        var start = intIndex + view2[$OFFSET];
        var pack = store.slice(start, start + bytes);
        return isLittleEndian ? pack : pack.reverse();
      }
      function set(view2, bytes, index, conversion, value, isLittleEndian) {
        var numIndex = +index;
        var intIndex = toIndex(numIndex);
        if (intIndex + bytes > view2[$LENGTH]) throw RangeError2(WRONG_INDEX);
        var store = view2[$BUFFER]._b;
        var start = intIndex + view2[$OFFSET];
        var pack = conversion(+value);
        for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
      }
      if (!$typed.ABV) {
        $ArrayBuffer = function ArrayBuffer2(length) {
          anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
          var byteLength = toIndex(length);
          this._b = arrayFill.call(new Array(byteLength), 0);
          this[$LENGTH] = byteLength;
        };
        $DataView = function DataView2(buffer, byteOffset, byteLength) {
          anInstance(this, $DataView, DATA_VIEW);
          anInstance(buffer, $ArrayBuffer, DATA_VIEW);
          var bufferLength = buffer[$LENGTH];
          var offset = toInteger(byteOffset);
          if (offset < 0 || offset > bufferLength) throw RangeError2("Wrong offset!");
          byteLength = byteLength === void 0 ? bufferLength - offset : toLength(byteLength);
          if (offset + byteLength > bufferLength) throw RangeError2(WRONG_LENGTH);
          this[$BUFFER] = buffer;
          this[$OFFSET] = offset;
          this[$LENGTH] = byteLength;
        };
        if (DESCRIPTORS) {
          addGetter($ArrayBuffer, BYTE_LENGTH, "_l");
          addGetter($DataView, BUFFER, "_b");
          addGetter($DataView, BYTE_LENGTH, "_l");
          addGetter($DataView, BYTE_OFFSET, "_o");
        }
        redefineAll($DataView[PROTOTYPE], {
          getInt8: function getInt8(byteOffset) {
            return get(this, 1, byteOffset)[0] << 24 >> 24;
          },
          getUint8: function getUint8(byteOffset) {
            return get(this, 1, byteOffset)[0];
          },
          getInt16: function getInt16(byteOffset) {
            var bytes = get(this, 2, byteOffset, arguments[1]);
            return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
          },
          getUint16: function getUint16(byteOffset) {
            var bytes = get(this, 2, byteOffset, arguments[1]);
            return bytes[1] << 8 | bytes[0];
          },
          getInt32: function getInt32(byteOffset) {
            return unpackI32(get(this, 4, byteOffset, arguments[1]));
          },
          getUint32: function getUint32(byteOffset) {
            return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
          },
          getFloat32: function getFloat32(byteOffset) {
            return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
          },
          getFloat64: function getFloat64(byteOffset) {
            return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
          },
          setInt8: function setInt8(byteOffset, value) {
            set(this, 1, byteOffset, packI8, value);
          },
          setUint8: function setUint8(byteOffset, value) {
            set(this, 1, byteOffset, packI8, value);
          },
          setInt16: function setInt16(byteOffset, value) {
            set(this, 2, byteOffset, packI16, value, arguments[2]);
          },
          setUint16: function setUint16(byteOffset, value) {
            set(this, 2, byteOffset, packI16, value, arguments[2]);
          },
          setInt32: function setInt32(byteOffset, value) {
            set(this, 4, byteOffset, packI32, value, arguments[2]);
          },
          setUint32: function setUint32(byteOffset, value) {
            set(this, 4, byteOffset, packI32, value, arguments[2]);
          },
          setFloat32: function setFloat32(byteOffset, value) {
            set(this, 4, byteOffset, packF32, value, arguments[2]);
          },
          setFloat64: function setFloat64(byteOffset, value) {
            set(this, 8, byteOffset, packF64, value, arguments[2]);
          }
        });
      } else {
        if (!fails(function() {
          $ArrayBuffer(1);
        }) || !fails(function() {
          new $ArrayBuffer(-1);
        }) || fails(function() {
          new $ArrayBuffer();
          new $ArrayBuffer(1.5);
          new $ArrayBuffer(NaN);
          return $ArrayBuffer.name != ARRAY_BUFFER;
        })) {
          $ArrayBuffer = function ArrayBuffer2(length) {
            anInstance(this, $ArrayBuffer);
            return new BaseBuffer(toIndex(length));
          };
          ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
          for (keys = gOPN(BaseBuffer), j = 0; keys.length > j; ) {
            if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
          }
          if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
        }
        view = new $DataView(new $ArrayBuffer(2));
        $setInt8 = $DataView[PROTOTYPE].setInt8;
        view.setInt8(0, 2147483648);
        view.setInt8(1, 2147483649);
        if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
          setInt8: function setInt8(byteOffset, value) {
            $setInt8.call(this, byteOffset, value << 24 >> 24);
          },
          setUint8: function setUint8(byteOffset, value) {
            $setInt8.call(this, byteOffset, value << 24 >> 24);
          }
        }, true);
      }
      var ArrayBufferProto;
      var keys;
      var j;
      var key;
      var view;
      var $setInt8;
      setToStringTag($ArrayBuffer, ARRAY_BUFFER);
      setToStringTag($DataView, DATA_VIEW);
      hide($DataView[PROTOTYPE], $typed.VIEW, true);
      exports[ARRAY_BUFFER] = $ArrayBuffer;
      exports[DATA_VIEW] = $DataView;
    }
  });

  // node_modules/core-js/modules/es6.typed.array-buffer.js
  var require_es6_typed_array_buffer = __commonJS({
    "node_modules/core-js/modules/es6.typed.array-buffer.js"() {
      "use strict";
      var $export = require_export();
      var $typed = require_typed();
      var buffer = require_typed_buffer();
      var anObject = require_an_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var toLength = require_to_length();
      var isObject = require_is_object();
      var ArrayBuffer2 = require_global().ArrayBuffer;
      var speciesConstructor = require_species_constructor();
      var $ArrayBuffer = buffer.ArrayBuffer;
      var $DataView = buffer.DataView;
      var $isView = $typed.ABV && ArrayBuffer2.isView;
      var $slice = $ArrayBuffer.prototype.slice;
      var VIEW = $typed.VIEW;
      var ARRAY_BUFFER = "ArrayBuffer";
      $export($export.G + $export.W + $export.F * (ArrayBuffer2 !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });
      $export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
        // 24.1.3.1 ArrayBuffer.isView(arg)
        isView: function isView(it) {
          return $isView && $isView(it) || isObject(it) && VIEW in it;
        }
      });
      $export($export.P + $export.U + $export.F * require_fails()(function() {
        return !new $ArrayBuffer(2).slice(1, void 0).byteLength;
      }), ARRAY_BUFFER, {
        // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
        slice: function slice(start, end) {
          if ($slice !== void 0 && end === void 0) return $slice.call(anObject(this), start);
          var len = anObject(this).byteLength;
          var first = toAbsoluteIndex(start, len);
          var fin = toAbsoluteIndex(end === void 0 ? len : end, len);
          var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
          var viewS = new $DataView(this);
          var viewT = new $DataView(result);
          var index = 0;
          while (first < fin) {
            viewT.setUint8(index++, viewS.getUint8(first++));
          }
          return result;
        }
      });
      require_set_species()(ARRAY_BUFFER);
    }
  });

  // node_modules/core-js/modules/es6.typed.data-view.js
  var require_es6_typed_data_view = __commonJS({
    "node_modules/core-js/modules/es6.typed.data-view.js"() {
      var $export = require_export();
      $export($export.G + $export.W + $export.F * !require_typed().ABV, {
        DataView: require_typed_buffer().DataView
      });
    }
  });

  // node_modules/core-js/modules/_typed-array.js
  var require_typed_array = __commonJS({
    "node_modules/core-js/modules/_typed-array.js"(exports, module) {
      "use strict";
      if (require_descriptors()) {
        LIBRARY = require_library();
        global = require_global();
        fails = require_fails();
        $export = require_export();
        $typed = require_typed();
        $buffer = require_typed_buffer();
        ctx = require_ctx();
        anInstance = require_an_instance();
        propertyDesc = require_property_desc();
        hide = require_hide();
        redefineAll = require_redefine_all();
        toInteger = require_to_integer();
        toLength = require_to_length();
        toIndex = require_to_index();
        toAbsoluteIndex = require_to_absolute_index();
        toPrimitive = require_to_primitive();
        has = require_has();
        classof = require_classof();
        isObject = require_is_object();
        toObject = require_to_object();
        isArrayIter = require_is_array_iter();
        create = require_object_create();
        getPrototypeOf = require_object_gpo();
        gOPN = require_object_gopn().f;
        getIterFn = require_core_get_iterator_method();
        uid = require_uid();
        wks = require_wks();
        createArrayMethod = require_array_methods();
        createArrayIncludes = require_array_includes();
        speciesConstructor = require_species_constructor();
        ArrayIterators = require_es6_array_iterator();
        Iterators = require_iterators();
        $iterDetect = require_iter_detect();
        setSpecies = require_set_species();
        arrayFill = require_array_fill();
        arrayCopyWithin = require_array_copy_within();
        $DP = require_object_dp();
        $GOPD = require_object_gopd();
        dP = $DP.f;
        gOPD = $GOPD.f;
        RangeError2 = global.RangeError;
        TypeError2 = global.TypeError;
        Uint8Array2 = global.Uint8Array;
        ARRAY_BUFFER = "ArrayBuffer";
        SHARED_BUFFER = "Shared" + ARRAY_BUFFER;
        BYTES_PER_ELEMENT = "BYTES_PER_ELEMENT";
        PROTOTYPE = "prototype";
        ArrayProto = Array[PROTOTYPE];
        $ArrayBuffer = $buffer.ArrayBuffer;
        $DataView = $buffer.DataView;
        arrayForEach = createArrayMethod(0);
        arrayFilter = createArrayMethod(2);
        arraySome = createArrayMethod(3);
        arrayEvery = createArrayMethod(4);
        arrayFind = createArrayMethod(5);
        arrayFindIndex = createArrayMethod(6);
        arrayIncludes = createArrayIncludes(true);
        arrayIndexOf = createArrayIncludes(false);
        arrayValues = ArrayIterators.values;
        arrayKeys = ArrayIterators.keys;
        arrayEntries = ArrayIterators.entries;
        arrayLastIndexOf = ArrayProto.lastIndexOf;
        arrayReduce = ArrayProto.reduce;
        arrayReduceRight = ArrayProto.reduceRight;
        arrayJoin = ArrayProto.join;
        arraySort = ArrayProto.sort;
        arraySlice = ArrayProto.slice;
        arrayToString = ArrayProto.toString;
        arrayToLocaleString = ArrayProto.toLocaleString;
        ITERATOR = wks("iterator");
        TAG = wks("toStringTag");
        TYPED_CONSTRUCTOR = uid("typed_constructor");
        DEF_CONSTRUCTOR = uid("def_constructor");
        ALL_CONSTRUCTORS = $typed.CONSTR;
        TYPED_ARRAY = $typed.TYPED;
        VIEW = $typed.VIEW;
        WRONG_LENGTH = "Wrong length!";
        $map = createArrayMethod(1, function(O, length) {
          return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
        });
        LITTLE_ENDIAN = fails(function() {
          return new Uint8Array2(new Uint16Array([1]).buffer)[0] === 1;
        });
        FORCED_SET = !!Uint8Array2 && !!Uint8Array2[PROTOTYPE].set && fails(function() {
          new Uint8Array2(1).set({});
        });
        toOffset = function(it, BYTES) {
          var offset = toInteger(it);
          if (offset < 0 || offset % BYTES) throw RangeError2("Wrong offset!");
          return offset;
        };
        validate = function(it) {
          if (isObject(it) && TYPED_ARRAY in it) return it;
          throw TypeError2(it + " is not a typed array!");
        };
        allocate = function(C, length) {
          if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
            throw TypeError2("It is not a typed array constructor!");
          }
          return new C(length);
        };
        speciesFromList = function(O, list) {
          return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
        };
        fromList = function(C, list) {
          var index = 0;
          var length = list.length;
          var result = allocate(C, length);
          while (length > index) result[index] = list[index++];
          return result;
        };
        addGetter = function(it, key, internal) {
          dP(it, key, { get: function() {
            return this._d[internal];
          } });
        };
        $from = function from(source) {
          var O = toObject(source);
          var aLen = arguments.length;
          var mapfn = aLen > 1 ? arguments[1] : void 0;
          var mapping = mapfn !== void 0;
          var iterFn = getIterFn(O);
          var i, length, values, result, step, iterator;
          if (iterFn != void 0 && !isArrayIter(iterFn)) {
            for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
              values.push(step.value);
            }
            O = values;
          }
          if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
          for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
            result[i] = mapping ? mapfn(O[i], i) : O[i];
          }
          return result;
        };
        $of = function of() {
          var index = 0;
          var length = arguments.length;
          var result = allocate(this, length);
          while (length > index) result[index] = arguments[index++];
          return result;
        };
        TO_LOCALE_BUG = !!Uint8Array2 && fails(function() {
          arrayToLocaleString.call(new Uint8Array2(1));
        });
        $toLocaleString = function toLocaleString() {
          return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
        };
        proto = {
          copyWithin: function copyWithin(target, start) {
            return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : void 0);
          },
          every: function every(callbackfn) {
            return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
          },
          fill: function fill(value) {
            return arrayFill.apply(validate(this), arguments);
          },
          filter: function filter(callbackfn) {
            return speciesFromList(this, arrayFilter(
              validate(this),
              callbackfn,
              arguments.length > 1 ? arguments[1] : void 0
            ));
          },
          find: function find(predicate) {
            return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : void 0);
          },
          findIndex: function findIndex(predicate) {
            return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : void 0);
          },
          forEach: function forEach(callbackfn) {
            arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
          },
          indexOf: function indexOf(searchElement) {
            return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : void 0);
          },
          includes: function includes(searchElement) {
            return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : void 0);
          },
          join: function join(separator) {
            return arrayJoin.apply(validate(this), arguments);
          },
          lastIndexOf: function lastIndexOf(searchElement) {
            return arrayLastIndexOf.apply(validate(this), arguments);
          },
          map: function map(mapfn) {
            return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : void 0);
          },
          reduce: function reduce(callbackfn) {
            return arrayReduce.apply(validate(this), arguments);
          },
          reduceRight: function reduceRight(callbackfn) {
            return arrayReduceRight.apply(validate(this), arguments);
          },
          reverse: function reverse() {
            var that = this;
            var length = validate(that).length;
            var middle = Math.floor(length / 2);
            var index = 0;
            var value;
            while (index < middle) {
              value = that[index];
              that[index++] = that[--length];
              that[length] = value;
            }
            return that;
          },
          some: function some(callbackfn) {
            return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : void 0);
          },
          sort: function sort(comparefn) {
            return arraySort.call(validate(this), comparefn);
          },
          subarray: function subarray(begin, end) {
            var O = validate(this);
            var length = O.length;
            var $begin = toAbsoluteIndex(begin, length);
            return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
              O.buffer,
              O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
              toLength((end === void 0 ? length : toAbsoluteIndex(end, length)) - $begin)
            );
          }
        };
        $slice = function slice(start, end) {
          return speciesFromList(this, arraySlice.call(validate(this), start, end));
        };
        $set = function set(arrayLike) {
          validate(this);
          var offset = toOffset(arguments[1], 1);
          var length = this.length;
          var src = toObject(arrayLike);
          var len = toLength(src.length);
          var index = 0;
          if (len + offset > length) throw RangeError2(WRONG_LENGTH);
          while (index < len) this[offset + index] = src[index++];
        };
        $iterators = {
          entries: function entries() {
            return arrayEntries.call(validate(this));
          },
          keys: function keys() {
            return arrayKeys.call(validate(this));
          },
          values: function values() {
            return arrayValues.call(validate(this));
          }
        };
        isTAIndex = function(target, key) {
          return isObject(target) && target[TYPED_ARRAY] && typeof key != "symbol" && key in target && String(+key) == String(key);
        };
        $getDesc = function getOwnPropertyDescriptor(target, key) {
          return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD(target, key);
        };
        $setDesc = function defineProperty(target, key, desc) {
          if (isTAIndex(target, key = toPrimitive(key, true)) && isObject(desc) && has(desc, "value") && !has(desc, "get") && !has(desc, "set") && !desc.configurable && (!has(desc, "writable") || desc.writable) && (!has(desc, "enumerable") || desc.enumerable)) {
            target[key] = desc.value;
            return target;
          }
          return dP(target, key, desc);
        };
        if (!ALL_CONSTRUCTORS) {
          $GOPD.f = $getDesc;
          $DP.f = $setDesc;
        }
        $export($export.S + $export.F * !ALL_CONSTRUCTORS, "Object", {
          getOwnPropertyDescriptor: $getDesc,
          defineProperty: $setDesc
        });
        if (fails(function() {
          arrayToString.call({});
        })) {
          arrayToString = arrayToLocaleString = function toString() {
            return arrayJoin.call(this);
          };
        }
        $TypedArrayPrototype$ = redefineAll({}, proto);
        redefineAll($TypedArrayPrototype$, $iterators);
        hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
        redefineAll($TypedArrayPrototype$, {
          slice: $slice,
          set: $set,
          constructor: function() {
          },
          toString: arrayToString,
          toLocaleString: $toLocaleString
        });
        addGetter($TypedArrayPrototype$, "buffer", "b");
        addGetter($TypedArrayPrototype$, "byteOffset", "o");
        addGetter($TypedArrayPrototype$, "byteLength", "l");
        addGetter($TypedArrayPrototype$, "length", "e");
        dP($TypedArrayPrototype$, TAG, {
          get: function() {
            return this[TYPED_ARRAY];
          }
        });
        module.exports = function(KEY, BYTES, wrapper, CLAMPED) {
          CLAMPED = !!CLAMPED;
          var NAME = KEY + (CLAMPED ? "Clamped" : "") + "Array";
          var GETTER = "get" + KEY;
          var SETTER = "set" + KEY;
          var TypedArray = global[NAME];
          var Base = TypedArray || {};
          var TAC = TypedArray && getPrototypeOf(TypedArray);
          var FORCED = !TypedArray || !$typed.ABV;
          var O = {};
          var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
          var getter = function(that, index) {
            var data = that._d;
            return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
          };
          var setter = function(that, index, value) {
            var data = that._d;
            if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 255 ? 255 : value & 255;
            data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
          };
          var addElement = function(that, index) {
            dP(that, index, {
              get: function() {
                return getter(this, index);
              },
              set: function(value) {
                return setter(this, index, value);
              },
              enumerable: true
            });
          };
          if (FORCED) {
            TypedArray = wrapper(function(that, data, $offset, $length) {
              anInstance(that, TypedArray, NAME, "_d");
              var index = 0;
              var offset = 0;
              var buffer, byteLength, length, klass;
              if (!isObject(data)) {
                length = toIndex(data);
                byteLength = length * BYTES;
                buffer = new $ArrayBuffer(byteLength);
              } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
                buffer = data;
                offset = toOffset($offset, BYTES);
                var $len = data.byteLength;
                if ($length === void 0) {
                  if ($len % BYTES) throw RangeError2(WRONG_LENGTH);
                  byteLength = $len - offset;
                  if (byteLength < 0) throw RangeError2(WRONG_LENGTH);
                } else {
                  byteLength = toLength($length) * BYTES;
                  if (byteLength + offset > $len) throw RangeError2(WRONG_LENGTH);
                }
                length = byteLength / BYTES;
              } else if (TYPED_ARRAY in data) {
                return fromList(TypedArray, data);
              } else {
                return $from.call(TypedArray, data);
              }
              hide(that, "_d", {
                b: buffer,
                o: offset,
                l: byteLength,
                e: length,
                v: new $DataView(buffer)
              });
              while (index < length) addElement(that, index++);
            });
            TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
            hide(TypedArrayPrototype, "constructor", TypedArray);
          } else if (!fails(function() {
            TypedArray(1);
          }) || !fails(function() {
            new TypedArray(-1);
          }) || !$iterDetect(function(iter) {
            new TypedArray();
            new TypedArray(null);
            new TypedArray(1.5);
            new TypedArray(iter);
          }, true)) {
            TypedArray = wrapper(function(that, data, $offset, $length) {
              anInstance(that, TypedArray, NAME);
              var klass;
              if (!isObject(data)) return new Base(toIndex(data));
              if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
                return $length !== void 0 ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== void 0 ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
              }
              if (TYPED_ARRAY in data) return fromList(TypedArray, data);
              return $from.call(TypedArray, data);
            });
            arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key) {
              if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
            });
            TypedArray[PROTOTYPE] = TypedArrayPrototype;
            if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
          }
          var $nativeIterator = TypedArrayPrototype[ITERATOR];
          var CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == "values" || $nativeIterator.name == void 0);
          var $iterator = $iterators.values;
          hide(TypedArray, TYPED_CONSTRUCTOR, true);
          hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
          hide(TypedArrayPrototype, VIEW, true);
          hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);
          if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
            dP(TypedArrayPrototype, TAG, {
              get: function() {
                return NAME;
              }
            });
          }
          O[NAME] = TypedArray;
          $export($export.G + $export.W + $export.F * (TypedArray != Base), O);
          $export($export.S, NAME, {
            BYTES_PER_ELEMENT: BYTES
          });
          $export($export.S + $export.F * fails(function() {
            Base.of.call(TypedArray, 1);
          }), NAME, {
            from: $from,
            of: $of
          });
          if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);
          $export($export.P, NAME, proto);
          setSpecies(NAME);
          $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });
          $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);
          if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;
          $export($export.P + $export.F * fails(function() {
            new TypedArray(1).slice();
          }), NAME, { slice: $slice });
          $export($export.P + $export.F * (fails(function() {
            return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
          }) || !fails(function() {
            TypedArrayPrototype.toLocaleString.call([1, 2]);
          })), NAME, { toLocaleString: $toLocaleString });
          Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
          if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
        };
      } else module.exports = function() {
      };
      var LIBRARY;
      var global;
      var fails;
      var $export;
      var $typed;
      var $buffer;
      var ctx;
      var anInstance;
      var propertyDesc;
      var hide;
      var redefineAll;
      var toInteger;
      var toLength;
      var toIndex;
      var toAbsoluteIndex;
      var toPrimitive;
      var has;
      var classof;
      var isObject;
      var toObject;
      var isArrayIter;
      var create;
      var getPrototypeOf;
      var gOPN;
      var getIterFn;
      var uid;
      var wks;
      var createArrayMethod;
      var createArrayIncludes;
      var speciesConstructor;
      var ArrayIterators;
      var Iterators;
      var $iterDetect;
      var setSpecies;
      var arrayFill;
      var arrayCopyWithin;
      var $DP;
      var $GOPD;
      var dP;
      var gOPD;
      var RangeError2;
      var TypeError2;
      var Uint8Array2;
      var ARRAY_BUFFER;
      var SHARED_BUFFER;
      var BYTES_PER_ELEMENT;
      var PROTOTYPE;
      var ArrayProto;
      var $ArrayBuffer;
      var $DataView;
      var arrayForEach;
      var arrayFilter;
      var arraySome;
      var arrayEvery;
      var arrayFind;
      var arrayFindIndex;
      var arrayIncludes;
      var arrayIndexOf;
      var arrayValues;
      var arrayKeys;
      var arrayEntries;
      var arrayLastIndexOf;
      var arrayReduce;
      var arrayReduceRight;
      var arrayJoin;
      var arraySort;
      var arraySlice;
      var arrayToString;
      var arrayToLocaleString;
      var ITERATOR;
      var TAG;
      var TYPED_CONSTRUCTOR;
      var DEF_CONSTRUCTOR;
      var ALL_CONSTRUCTORS;
      var TYPED_ARRAY;
      var VIEW;
      var WRONG_LENGTH;
      var $map;
      var LITTLE_ENDIAN;
      var FORCED_SET;
      var toOffset;
      var validate;
      var allocate;
      var speciesFromList;
      var fromList;
      var addGetter;
      var $from;
      var $of;
      var TO_LOCALE_BUG;
      var $toLocaleString;
      var proto;
      var $slice;
      var $set;
      var $iterators;
      var isTAIndex;
      var $getDesc;
      var $setDesc;
      var $TypedArrayPrototype$;
    }
  });

  // node_modules/core-js/modules/es6.typed.int8-array.js
  var require_es6_typed_int8_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.int8-array.js"() {
      require_typed_array()("Int8", 1, function(init) {
        return function Int8Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.typed.uint8-array.js
  var require_es6_typed_uint8_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.uint8-array.js"() {
      require_typed_array()("Uint8", 1, function(init) {
        return function Uint8Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.typed.uint8-clamped-array.js
  var require_es6_typed_uint8_clamped_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.uint8-clamped-array.js"() {
      require_typed_array()("Uint8", 1, function(init) {
        return function Uint8ClampedArray2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      }, true);
    }
  });

  // node_modules/core-js/modules/es6.typed.int16-array.js
  var require_es6_typed_int16_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.int16-array.js"() {
      require_typed_array()("Int16", 2, function(init) {
        return function Int16Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.typed.uint16-array.js
  var require_es6_typed_uint16_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.uint16-array.js"() {
      require_typed_array()("Uint16", 2, function(init) {
        return function Uint16Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.typed.int32-array.js
  var require_es6_typed_int32_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.int32-array.js"() {
      require_typed_array()("Int32", 4, function(init) {
        return function Int32Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.typed.uint32-array.js
  var require_es6_typed_uint32_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.uint32-array.js"() {
      require_typed_array()("Uint32", 4, function(init) {
        return function Uint32Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.typed.float32-array.js
  var require_es6_typed_float32_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.float32-array.js"() {
      require_typed_array()("Float32", 4, function(init) {
        return function Float32Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.typed.float64-array.js
  var require_es6_typed_float64_array = __commonJS({
    "node_modules/core-js/modules/es6.typed.float64-array.js"() {
      require_typed_array()("Float64", 8, function(init) {
        return function Float64Array2(data, byteOffset, length) {
          return init(this, data, byteOffset, length);
        };
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.apply.js
  var require_es6_reflect_apply = __commonJS({
    "node_modules/core-js/modules/es6.reflect.apply.js"() {
      var $export = require_export();
      var aFunction = require_a_function();
      var anObject = require_an_object();
      var rApply = (require_global().Reflect || {}).apply;
      var fApply = Function.apply;
      $export($export.S + $export.F * !require_fails()(function() {
        rApply(function() {
        });
      }), "Reflect", {
        apply: function apply(target, thisArgument, argumentsList) {
          var T = aFunction(target);
          var L = anObject(argumentsList);
          return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.construct.js
  var require_es6_reflect_construct = __commonJS({
    "node_modules/core-js/modules/es6.reflect.construct.js"() {
      var $export = require_export();
      var create = require_object_create();
      var aFunction = require_a_function();
      var anObject = require_an_object();
      var isObject = require_is_object();
      var fails = require_fails();
      var bind = require_bind();
      var rConstruct = (require_global().Reflect || {}).construct;
      var NEW_TARGET_BUG = fails(function() {
        function F() {
        }
        return !(rConstruct(function() {
        }, [], F) instanceof F);
      });
      var ARGS_BUG = !fails(function() {
        rConstruct(function() {
        });
      });
      $export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), "Reflect", {
        construct: function construct(Target, args) {
          aFunction(Target);
          anObject(args);
          var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
          if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
          if (Target == newTarget) {
            switch (args.length) {
              case 0:
                return new Target();
              case 1:
                return new Target(args[0]);
              case 2:
                return new Target(args[0], args[1]);
              case 3:
                return new Target(args[0], args[1], args[2]);
              case 4:
                return new Target(args[0], args[1], args[2], args[3]);
            }
            var $args = [null];
            $args.push.apply($args, args);
            return new (bind.apply(Target, $args))();
          }
          var proto = newTarget.prototype;
          var instance = create(isObject(proto) ? proto : Object.prototype);
          var result = Function.apply.call(Target, instance, args);
          return isObject(result) ? result : instance;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.define-property.js
  var require_es6_reflect_define_property = __commonJS({
    "node_modules/core-js/modules/es6.reflect.define-property.js"() {
      var dP = require_object_dp();
      var $export = require_export();
      var anObject = require_an_object();
      var toPrimitive = require_to_primitive();
      $export($export.S + $export.F * require_fails()(function() {
        Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
      }), "Reflect", {
        defineProperty: function defineProperty(target, propertyKey, attributes) {
          anObject(target);
          propertyKey = toPrimitive(propertyKey, true);
          anObject(attributes);
          try {
            dP.f(target, propertyKey, attributes);
            return true;
          } catch (e) {
            return false;
          }
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.delete-property.js
  var require_es6_reflect_delete_property = __commonJS({
    "node_modules/core-js/modules/es6.reflect.delete-property.js"() {
      var $export = require_export();
      var gOPD = require_object_gopd().f;
      var anObject = require_an_object();
      $export($export.S, "Reflect", {
        deleteProperty: function deleteProperty(target, propertyKey) {
          var desc = gOPD(anObject(target), propertyKey);
          return desc && !desc.configurable ? false : delete target[propertyKey];
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.enumerate.js
  var require_es6_reflect_enumerate = __commonJS({
    "node_modules/core-js/modules/es6.reflect.enumerate.js"() {
      "use strict";
      var $export = require_export();
      var anObject = require_an_object();
      var Enumerate = function(iterated) {
        this._t = anObject(iterated);
        this._i = 0;
        var keys = this._k = [];
        var key;
        for (key in iterated) keys.push(key);
      };
      require_iter_create()(Enumerate, "Object", function() {
        var that = this;
        var keys = that._k;
        var key;
        do {
          if (that._i >= keys.length) return { value: void 0, done: true };
        } while (!((key = keys[that._i++]) in that._t));
        return { value: key, done: false };
      });
      $export($export.S, "Reflect", {
        enumerate: function enumerate(target) {
          return new Enumerate(target);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.get.js
  var require_es6_reflect_get = __commonJS({
    "node_modules/core-js/modules/es6.reflect.get.js"() {
      var gOPD = require_object_gopd();
      var getPrototypeOf = require_object_gpo();
      var has = require_has();
      var $export = require_export();
      var isObject = require_is_object();
      var anObject = require_an_object();
      function get(target, propertyKey) {
        var receiver = arguments.length < 3 ? target : arguments[2];
        var desc, proto;
        if (anObject(target) === receiver) return target[propertyKey];
        if (desc = gOPD.f(target, propertyKey)) return has(desc, "value") ? desc.value : desc.get !== void 0 ? desc.get.call(receiver) : void 0;
        if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
      }
      $export($export.S, "Reflect", { get });
    }
  });

  // node_modules/core-js/modules/es6.reflect.get-own-property-descriptor.js
  var require_es6_reflect_get_own_property_descriptor = __commonJS({
    "node_modules/core-js/modules/es6.reflect.get-own-property-descriptor.js"() {
      var gOPD = require_object_gopd();
      var $export = require_export();
      var anObject = require_an_object();
      $export($export.S, "Reflect", {
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
          return gOPD.f(anObject(target), propertyKey);
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.get-prototype-of.js
  var require_es6_reflect_get_prototype_of = __commonJS({
    "node_modules/core-js/modules/es6.reflect.get-prototype-of.js"() {
      var $export = require_export();
      var getProto = require_object_gpo();
      var anObject = require_an_object();
      $export($export.S, "Reflect", {
        getPrototypeOf: function getPrototypeOf(target) {
          return getProto(anObject(target));
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.has.js
  var require_es6_reflect_has = __commonJS({
    "node_modules/core-js/modules/es6.reflect.has.js"() {
      var $export = require_export();
      $export($export.S, "Reflect", {
        has: function has(target, propertyKey) {
          return propertyKey in target;
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.is-extensible.js
  var require_es6_reflect_is_extensible = __commonJS({
    "node_modules/core-js/modules/es6.reflect.is-extensible.js"() {
      var $export = require_export();
      var anObject = require_an_object();
      var $isExtensible = Object.isExtensible;
      $export($export.S, "Reflect", {
        isExtensible: function isExtensible(target) {
          anObject(target);
          return $isExtensible ? $isExtensible(target) : true;
        }
      });
    }
  });

  // node_modules/core-js/modules/_own-keys.js
  var require_own_keys = __commonJS({
    "node_modules/core-js/modules/_own-keys.js"(exports, module) {
      var gOPN = require_object_gopn();
      var gOPS = require_object_gops();
      var anObject = require_an_object();
      var Reflect2 = require_global().Reflect;
      module.exports = Reflect2 && Reflect2.ownKeys || function ownKeys(it) {
        var keys = gOPN.f(anObject(it));
        var getSymbols = gOPS.f;
        return getSymbols ? keys.concat(getSymbols(it)) : keys;
      };
    }
  });

  // node_modules/core-js/modules/es6.reflect.own-keys.js
  var require_es6_reflect_own_keys = __commonJS({
    "node_modules/core-js/modules/es6.reflect.own-keys.js"() {
      var $export = require_export();
      $export($export.S, "Reflect", { ownKeys: require_own_keys() });
    }
  });

  // node_modules/core-js/modules/es6.reflect.prevent-extensions.js
  var require_es6_reflect_prevent_extensions = __commonJS({
    "node_modules/core-js/modules/es6.reflect.prevent-extensions.js"() {
      var $export = require_export();
      var anObject = require_an_object();
      var $preventExtensions = Object.preventExtensions;
      $export($export.S, "Reflect", {
        preventExtensions: function preventExtensions(target) {
          anObject(target);
          try {
            if ($preventExtensions) $preventExtensions(target);
            return true;
          } catch (e) {
            return false;
          }
        }
      });
    }
  });

  // node_modules/core-js/modules/es6.reflect.set.js
  var require_es6_reflect_set = __commonJS({
    "node_modules/core-js/modules/es6.reflect.set.js"() {
      var dP = require_object_dp();
      var gOPD = require_object_gopd();
      var getPrototypeOf = require_object_gpo();
      var has = require_has();
      var $export = require_export();
      var createDesc = require_property_desc();
      var anObject = require_an_object();
      var isObject = require_is_object();
      function set(target, propertyKey, V) {
        var receiver = arguments.length < 4 ? target : arguments[3];
        var ownDesc = gOPD.f(anObject(target), propertyKey);
        var existingDescriptor, proto;
        if (!ownDesc) {
          if (isObject(proto = getPrototypeOf(target))) {
            return set(proto, propertyKey, V, receiver);
          }
          ownDesc = createDesc(0);
        }
        if (has(ownDesc, "value")) {
          if (ownDesc.writable === false || !isObject(receiver)) return false;
          if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
            if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
            existingDescriptor.value = V;
            dP.f(receiver, propertyKey, existingDescriptor);
          } else dP.f(receiver, propertyKey, createDesc(0, V));
          return true;
        }
        return ownDesc.set === void 0 ? false : (ownDesc.set.call(receiver, V), true);
      }
      $export($export.S, "Reflect", { set });
    }
  });

  // node_modules/core-js/modules/es6.reflect.set-prototype-of.js
  var require_es6_reflect_set_prototype_of = __commonJS({
    "node_modules/core-js/modules/es6.reflect.set-prototype-of.js"() {
      var $export = require_export();
      var setProto = require_set_proto();
      if (setProto) $export($export.S, "Reflect", {
        setPrototypeOf: function setPrototypeOf(target, proto) {
          setProto.check(target, proto);
          try {
            setProto.set(target, proto);
            return true;
          } catch (e) {
            return false;
          }
        }
      });
    }
  });

  // node_modules/core-js/es6/index.js
  var require_es6 = __commonJS({
    "node_modules/core-js/es6/index.js"(exports, module) {
      require_es6_symbol();
      require_es6_object_create();
      require_es6_object_define_property();
      require_es6_object_define_properties();
      require_es6_object_get_own_property_descriptor();
      require_es6_object_get_prototype_of();
      require_es6_object_keys();
      require_es6_object_get_own_property_names();
      require_es6_object_freeze();
      require_es6_object_seal();
      require_es6_object_prevent_extensions();
      require_es6_object_is_frozen();
      require_es6_object_is_sealed();
      require_es6_object_is_extensible();
      require_es6_object_assign();
      require_es6_object_is();
      require_es6_object_set_prototype_of();
      require_es6_object_to_string();
      require_es6_function_bind();
      require_es6_function_name();
      require_es6_function_has_instance();
      require_es6_parse_int();
      require_es6_parse_float();
      require_es6_number_constructor();
      require_es6_number_to_fixed();
      require_es6_number_to_precision();
      require_es6_number_epsilon();
      require_es6_number_is_finite();
      require_es6_number_is_integer();
      require_es6_number_is_nan();
      require_es6_number_is_safe_integer();
      require_es6_number_max_safe_integer();
      require_es6_number_min_safe_integer();
      require_es6_number_parse_float();
      require_es6_number_parse_int();
      require_es6_math_acosh();
      require_es6_math_asinh();
      require_es6_math_atanh();
      require_es6_math_cbrt();
      require_es6_math_clz32();
      require_es6_math_cosh();
      require_es6_math_expm1();
      require_es6_math_fround();
      require_es6_math_hypot();
      require_es6_math_imul();
      require_es6_math_log10();
      require_es6_math_log1p();
      require_es6_math_log2();
      require_es6_math_sign();
      require_es6_math_sinh();
      require_es6_math_tanh();
      require_es6_math_trunc();
      require_es6_string_from_code_point();
      require_es6_string_raw();
      require_es6_string_trim();
      require_es6_string_iterator();
      require_es6_string_code_point_at();
      require_es6_string_ends_with();
      require_es6_string_includes();
      require_es6_string_repeat();
      require_es6_string_starts_with();
      require_es6_string_anchor();
      require_es6_string_big();
      require_es6_string_blink();
      require_es6_string_bold();
      require_es6_string_fixed();
      require_es6_string_fontcolor();
      require_es6_string_fontsize();
      require_es6_string_italics();
      require_es6_string_link();
      require_es6_string_small();
      require_es6_string_strike();
      require_es6_string_sub();
      require_es6_string_sup();
      require_es6_date_now();
      require_es6_date_to_json();
      require_es6_date_to_iso_string();
      require_es6_date_to_string();
      require_es6_date_to_primitive();
      require_es6_array_is_array();
      require_es6_array_from();
      require_es6_array_of();
      require_es6_array_join();
      require_es6_array_slice();
      require_es6_array_sort();
      require_es6_array_for_each();
      require_es6_array_map();
      require_es6_array_filter();
      require_es6_array_some();
      require_es6_array_every();
      require_es6_array_reduce();
      require_es6_array_reduce_right();
      require_es6_array_index_of();
      require_es6_array_last_index_of();
      require_es6_array_copy_within();
      require_es6_array_fill();
      require_es6_array_find();
      require_es6_array_find_index();
      require_es6_array_species();
      require_es6_array_iterator();
      require_es6_regexp_constructor();
      require_es6_regexp_exec();
      require_es6_regexp_to_string();
      require_es6_regexp_flags();
      require_es6_regexp_match();
      require_es6_regexp_replace();
      require_es6_regexp_search();
      require_es6_regexp_split();
      require_es6_promise();
      require_es6_map();
      require_es6_set();
      require_es6_weak_map();
      require_es6_weak_set();
      require_es6_typed_array_buffer();
      require_es6_typed_data_view();
      require_es6_typed_int8_array();
      require_es6_typed_uint8_array();
      require_es6_typed_uint8_clamped_array();
      require_es6_typed_int16_array();
      require_es6_typed_uint16_array();
      require_es6_typed_int32_array();
      require_es6_typed_uint32_array();
      require_es6_typed_float32_array();
      require_es6_typed_float64_array();
      require_es6_reflect_apply();
      require_es6_reflect_construct();
      require_es6_reflect_define_property();
      require_es6_reflect_delete_property();
      require_es6_reflect_enumerate();
      require_es6_reflect_get();
      require_es6_reflect_get_own_property_descriptor();
      require_es6_reflect_get_prototype_of();
      require_es6_reflect_has();
      require_es6_reflect_is_extensible();
      require_es6_reflect_own_keys();
      require_es6_reflect_prevent_extensions();
      require_es6_reflect_set();
      require_es6_reflect_set_prototype_of();
      module.exports = require_core();
    }
  });

  // node_modules/core-js/modules/es7.array.includes.js
  var require_es7_array_includes = __commonJS({
    "node_modules/core-js/modules/es7.array.includes.js"() {
      "use strict";
      var $export = require_export();
      var $includes = require_array_includes()(true);
      $export($export.P, "Array", {
        includes: function includes(el) {
          return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
        }
      });
      require_add_to_unscopables()("includes");
    }
  });

  // node_modules/core-js/fn/array/includes.js
  var require_includes = __commonJS({
    "node_modules/core-js/fn/array/includes.js"(exports, module) {
      require_es7_array_includes();
      module.exports = require_core().Array.includes;
    }
  });

  // node_modules/core-js/modules/_flatten-into-array.js
  var require_flatten_into_array = __commonJS({
    "node_modules/core-js/modules/_flatten-into-array.js"(exports, module) {
      "use strict";
      var isArray = require_is_array();
      var isObject = require_is_object();
      var toLength = require_to_length();
      var ctx = require_ctx();
      var IS_CONCAT_SPREADABLE = require_wks()("isConcatSpreadable");
      function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
        var targetIndex = start;
        var sourceIndex = 0;
        var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
        var element, spreadable;
        while (sourceIndex < sourceLen) {
          if (sourceIndex in source) {
            element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];
            spreadable = false;
            if (isObject(element)) {
              spreadable = element[IS_CONCAT_SPREADABLE];
              spreadable = spreadable !== void 0 ? !!spreadable : isArray(element);
            }
            if (spreadable && depth > 0) {
              targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
            } else {
              if (targetIndex >= 9007199254740991) throw TypeError();
              target[targetIndex] = element;
            }
            targetIndex++;
          }
          sourceIndex++;
        }
        return targetIndex;
      }
      module.exports = flattenIntoArray;
    }
  });

  // node_modules/core-js/modules/es7.array.flat-map.js
  var require_es7_array_flat_map = __commonJS({
    "node_modules/core-js/modules/es7.array.flat-map.js"() {
      "use strict";
      var $export = require_export();
      var flattenIntoArray = require_flatten_into_array();
      var toObject = require_to_object();
      var toLength = require_to_length();
      var aFunction = require_a_function();
      var arraySpeciesCreate = require_array_species_create();
      $export($export.P, "Array", {
        flatMap: function flatMap(callbackfn) {
          var O = toObject(this);
          var sourceLen, A;
          aFunction(callbackfn);
          sourceLen = toLength(O.length);
          A = arraySpeciesCreate(O, 0);
          flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
          return A;
        }
      });
      require_add_to_unscopables()("flatMap");
    }
  });

  // node_modules/core-js/fn/array/flat-map.js
  var require_flat_map = __commonJS({
    "node_modules/core-js/fn/array/flat-map.js"(exports, module) {
      require_es7_array_flat_map();
      module.exports = require_core().Array.flatMap;
    }
  });

  // node_modules/core-js/modules/_string-pad.js
  var require_string_pad = __commonJS({
    "node_modules/core-js/modules/_string-pad.js"(exports, module) {
      var toLength = require_to_length();
      var repeat = require_string_repeat();
      var defined = require_defined();
      module.exports = function(that, maxLength, fillString, left) {
        var S = String(defined(that));
        var stringLength = S.length;
        var fillStr = fillString === void 0 ? " " : String(fillString);
        var intMaxLength = toLength(maxLength);
        if (intMaxLength <= stringLength || fillStr == "") return S;
        var fillLen = intMaxLength - stringLength;
        var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
        if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
        return left ? stringFiller + S : S + stringFiller;
      };
    }
  });

  // node_modules/core-js/modules/es7.string.pad-start.js
  var require_es7_string_pad_start = __commonJS({
    "node_modules/core-js/modules/es7.string.pad-start.js"() {
      "use strict";
      var $export = require_export();
      var $pad = require_string_pad();
      var userAgent = require_user_agent();
      var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);
      $export($export.P + $export.F * WEBKIT_BUG, "String", {
        padStart: function padStart(maxLength) {
          return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : void 0, true);
        }
      });
    }
  });

  // node_modules/core-js/fn/string/pad-start.js
  var require_pad_start = __commonJS({
    "node_modules/core-js/fn/string/pad-start.js"(exports, module) {
      require_es7_string_pad_start();
      module.exports = require_core().String.padStart;
    }
  });

  // node_modules/core-js/modules/es7.string.pad-end.js
  var require_es7_string_pad_end = __commonJS({
    "node_modules/core-js/modules/es7.string.pad-end.js"() {
      "use strict";
      var $export = require_export();
      var $pad = require_string_pad();
      var userAgent = require_user_agent();
      var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);
      $export($export.P + $export.F * WEBKIT_BUG, "String", {
        padEnd: function padEnd(maxLength) {
          return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : void 0, false);
        }
      });
    }
  });

  // node_modules/core-js/fn/string/pad-end.js
  var require_pad_end = __commonJS({
    "node_modules/core-js/fn/string/pad-end.js"(exports, module) {
      require_es7_string_pad_end();
      module.exports = require_core().String.padEnd;
    }
  });

  // node_modules/core-js/modules/es7.string.trim-left.js
  var require_es7_string_trim_left = __commonJS({
    "node_modules/core-js/modules/es7.string.trim-left.js"() {
      "use strict";
      require_string_trim()("trimLeft", function($trim) {
        return function trimLeft() {
          return $trim(this, 1);
        };
      }, "trimStart");
    }
  });

  // node_modules/core-js/fn/string/trim-start.js
  var require_trim_start = __commonJS({
    "node_modules/core-js/fn/string/trim-start.js"(exports, module) {
      require_es7_string_trim_left();
      module.exports = require_core().String.trimLeft;
    }
  });

  // node_modules/core-js/modules/es7.string.trim-right.js
  var require_es7_string_trim_right = __commonJS({
    "node_modules/core-js/modules/es7.string.trim-right.js"() {
      "use strict";
      require_string_trim()("trimRight", function($trim) {
        return function trimRight() {
          return $trim(this, 2);
        };
      }, "trimEnd");
    }
  });

  // node_modules/core-js/fn/string/trim-end.js
  var require_trim_end = __commonJS({
    "node_modules/core-js/fn/string/trim-end.js"(exports, module) {
      require_es7_string_trim_right();
      module.exports = require_core().String.trimRight;
    }
  });

  // node_modules/core-js/modules/es7.symbol.async-iterator.js
  var require_es7_symbol_async_iterator = __commonJS({
    "node_modules/core-js/modules/es7.symbol.async-iterator.js"() {
      require_wks_define()("asyncIterator");
    }
  });

  // node_modules/core-js/fn/symbol/async-iterator.js
  var require_async_iterator = __commonJS({
    "node_modules/core-js/fn/symbol/async-iterator.js"(exports, module) {
      require_es7_symbol_async_iterator();
      module.exports = require_wks_ext().f("asyncIterator");
    }
  });

  // node_modules/core-js/modules/es7.object.get-own-property-descriptors.js
  var require_es7_object_get_own_property_descriptors = __commonJS({
    "node_modules/core-js/modules/es7.object.get-own-property-descriptors.js"() {
      var $export = require_export();
      var ownKeys = require_own_keys();
      var toIObject = require_to_iobject();
      var gOPD = require_object_gopd();
      var createProperty = require_create_property();
      $export($export.S, "Object", {
        getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
          var O = toIObject(object);
          var getDesc = gOPD.f;
          var keys = ownKeys(O);
          var result = {};
          var i = 0;
          var key, desc;
          while (keys.length > i) {
            desc = getDesc(O, key = keys[i++]);
            if (desc !== void 0) createProperty(result, key, desc);
          }
          return result;
        }
      });
    }
  });

  // node_modules/core-js/fn/object/get-own-property-descriptors.js
  var require_get_own_property_descriptors = __commonJS({
    "node_modules/core-js/fn/object/get-own-property-descriptors.js"(exports, module) {
      require_es7_object_get_own_property_descriptors();
      module.exports = require_core().Object.getOwnPropertyDescriptors;
    }
  });

  // node_modules/core-js/modules/_object-to-array.js
  var require_object_to_array = __commonJS({
    "node_modules/core-js/modules/_object-to-array.js"(exports, module) {
      var DESCRIPTORS = require_descriptors();
      var getKeys = require_object_keys();
      var toIObject = require_to_iobject();
      var isEnum = require_object_pie().f;
      module.exports = function(isEntries) {
        return function(it) {
          var O = toIObject(it);
          var keys = getKeys(O);
          var length = keys.length;
          var i = 0;
          var result = [];
          var key;
          while (length > i) {
            key = keys[i++];
            if (!DESCRIPTORS || isEnum.call(O, key)) {
              result.push(isEntries ? [key, O[key]] : O[key]);
            }
          }
          return result;
        };
      };
    }
  });

  // node_modules/core-js/modules/es7.object.values.js
  var require_es7_object_values = __commonJS({
    "node_modules/core-js/modules/es7.object.values.js"() {
      var $export = require_export();
      var $values = require_object_to_array()(false);
      $export($export.S, "Object", {
        values: function values(it) {
          return $values(it);
        }
      });
    }
  });

  // node_modules/core-js/fn/object/values.js
  var require_values = __commonJS({
    "node_modules/core-js/fn/object/values.js"(exports, module) {
      require_es7_object_values();
      module.exports = require_core().Object.values;
    }
  });

  // node_modules/core-js/modules/es7.object.entries.js
  var require_es7_object_entries = __commonJS({
    "node_modules/core-js/modules/es7.object.entries.js"() {
      var $export = require_export();
      var $entries = require_object_to_array()(true);
      $export($export.S, "Object", {
        entries: function entries(it) {
          return $entries(it);
        }
      });
    }
  });

  // node_modules/core-js/fn/object/entries.js
  var require_entries = __commonJS({
    "node_modules/core-js/fn/object/entries.js"(exports, module) {
      require_es7_object_entries();
      module.exports = require_core().Object.entries;
    }
  });

  // node_modules/core-js/modules/es7.promise.finally.js
  var require_es7_promise_finally = __commonJS({
    "node_modules/core-js/modules/es7.promise.finally.js"() {
      "use strict";
      var $export = require_export();
      var core = require_core();
      var global = require_global();
      var speciesConstructor = require_species_constructor();
      var promiseResolve = require_promise_resolve();
      $export($export.P + $export.R, "Promise", { "finally": function(onFinally) {
        var C = speciesConstructor(this, core.Promise || global.Promise);
        var isFunction = typeof onFinally == "function";
        return this.then(
          isFunction ? function(x) {
            return promiseResolve(C, onFinally()).then(function() {
              return x;
            });
          } : onFinally,
          isFunction ? function(e) {
            return promiseResolve(C, onFinally()).then(function() {
              throw e;
            });
          } : onFinally
        );
      } });
    }
  });

  // node_modules/core-js/fn/promise/finally.js
  var require_finally = __commonJS({
    "node_modules/core-js/fn/promise/finally.js"(exports, module) {
      "use strict";
      require_es6_promise();
      require_es7_promise_finally();
      module.exports = require_core().Promise["finally"];
    }
  });

  // node_modules/core-js/modules/web.timers.js
  var require_web_timers = __commonJS({
    "node_modules/core-js/modules/web.timers.js"() {
      var global = require_global();
      var $export = require_export();
      var userAgent = require_user_agent();
      var slice = [].slice;
      var MSIE = /MSIE .\./.test(userAgent);
      var wrap = function(set) {
        return function(fn, time) {
          var boundArgs = arguments.length > 2;
          var args = boundArgs ? slice.call(arguments, 2) : false;
          return set(boundArgs ? function() {
            (typeof fn == "function" ? fn : Function(fn)).apply(this, args);
          } : fn, time);
        };
      };
      $export($export.G + $export.B + $export.F * MSIE, {
        setTimeout: wrap(global.setTimeout),
        setInterval: wrap(global.setInterval)
      });
    }
  });

  // node_modules/core-js/modules/web.immediate.js
  var require_web_immediate = __commonJS({
    "node_modules/core-js/modules/web.immediate.js"() {
      var $export = require_export();
      var $task = require_task();
      $export($export.G + $export.B, {
        setImmediate: $task.set,
        clearImmediate: $task.clear
      });
    }
  });

  // node_modules/core-js/modules/web.dom.iterable.js
  var require_web_dom_iterable = __commonJS({
    "node_modules/core-js/modules/web.dom.iterable.js"() {
      var $iterators = require_es6_array_iterator();
      var getKeys = require_object_keys();
      var redefine = require_redefine();
      var global = require_global();
      var hide = require_hide();
      var Iterators = require_iterators();
      var wks = require_wks();
      var ITERATOR = wks("iterator");
      var TO_STRING_TAG = wks("toStringTag");
      var ArrayValues = Iterators.Array;
      var DOMIterables = {
        CSSRuleList: true,
        // TODO: Not spec compliant, should be false.
        CSSStyleDeclaration: false,
        CSSValueList: false,
        ClientRectList: false,
        DOMRectList: false,
        DOMStringList: false,
        DOMTokenList: true,
        DataTransferItemList: false,
        FileList: false,
        HTMLAllCollection: false,
        HTMLCollection: false,
        HTMLFormElement: false,
        HTMLSelectElement: false,
        MediaList: true,
        // TODO: Not spec compliant, should be false.
        MimeTypeArray: false,
        NamedNodeMap: false,
        NodeList: true,
        PaintRequestList: false,
        Plugin: false,
        PluginArray: false,
        SVGLengthList: false,
        SVGNumberList: false,
        SVGPathSegList: false,
        SVGPointList: false,
        SVGStringList: false,
        SVGTransformList: false,
        SourceBufferList: false,
        StyleSheetList: true,
        // TODO: Not spec compliant, should be false.
        TextTrackCueList: false,
        TextTrackList: false,
        TouchList: false
      };
      for (collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
        NAME = collections[i];
        explicit = DOMIterables[NAME];
        Collection = global[NAME];
        proto = Collection && Collection.prototype;
        if (proto) {
          if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
          if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
          Iterators[NAME] = ArrayValues;
          if (explicit) {
            for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
          }
        }
      }
      var NAME;
      var explicit;
      var Collection;
      var proto;
      var key;
      var collections;
      var i;
    }
  });

  // node_modules/core-js/web/index.js
  var require_web = __commonJS({
    "node_modules/core-js/web/index.js"(exports, module) {
      require_web_timers();
      require_web_immediate();
      require_web_dom_iterable();
      module.exports = require_core();
    }
  });

  // node_modules/regenerator-runtime/runtime.js
  var require_runtime = __commonJS({
    "node_modules/regenerator-runtime/runtime.js"(exports, module) {
      var runtime = (function(exports2) {
        "use strict";
        var Op = Object.prototype;
        var hasOwn = Op.hasOwnProperty;
        var defineProperty = Object.defineProperty || function(obj, key, desc) {
          obj[key] = desc.value;
        };
        var undefined2;
        var $Symbol = typeof Symbol === "function" ? Symbol : {};
        var iteratorSymbol = $Symbol.iterator || "@@iterator";
        var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
        var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
        function define2(obj, key, value) {
          Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
          return obj[key];
        }
        try {
          define2({}, "");
        } catch (err) {
          define2 = function(obj, key, value) {
            return obj[key] = value;
          };
        }
        function wrap(innerFn, outerFn, self2, tryLocsList) {
          var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
          var generator = Object.create(protoGenerator.prototype);
          var context = new Context(tryLocsList || []);
          defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self2, context) });
          return generator;
        }
        exports2.wrap = wrap;
        function tryCatch(fn, obj, arg) {
          try {
            return { type: "normal", arg: fn.call(obj, arg) };
          } catch (err) {
            return { type: "throw", arg: err };
          }
        }
        var GenStateSuspendedStart = "suspendedStart";
        var GenStateSuspendedYield = "suspendedYield";
        var GenStateExecuting = "executing";
        var GenStateCompleted = "completed";
        var ContinueSentinel = {};
        function Generator() {
        }
        function GeneratorFunction() {
        }
        function GeneratorFunctionPrototype() {
        }
        var IteratorPrototype = {};
        define2(IteratorPrototype, iteratorSymbol, function() {
          return this;
        });
        var getProto = Object.getPrototypeOf;
        var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
        if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
          IteratorPrototype = NativeIteratorPrototype;
        }
        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
        GeneratorFunction.prototype = GeneratorFunctionPrototype;
        defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
        defineProperty(
          GeneratorFunctionPrototype,
          "constructor",
          { value: GeneratorFunction, configurable: true }
        );
        GeneratorFunction.displayName = define2(
          GeneratorFunctionPrototype,
          toStringTagSymbol,
          "GeneratorFunction"
        );
        function defineIteratorMethods(prototype) {
          ["next", "throw", "return"].forEach(function(method) {
            define2(prototype, method, function(arg) {
              return this._invoke(method, arg);
            });
          });
        }
        exports2.isGeneratorFunction = function(genFun) {
          var ctor = typeof genFun === "function" && genFun.constructor;
          return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
        };
        exports2.mark = function(genFun) {
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
          } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            define2(genFun, toStringTagSymbol, "GeneratorFunction");
          }
          genFun.prototype = Object.create(Gp);
          return genFun;
        };
        exports2.awrap = function(arg) {
          return { __await: arg };
        };
        function AsyncIterator(generator, PromiseImpl) {
          function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
            if (record.type === "throw") {
              reject(record.arg);
            } else {
              var result = record.arg;
              var value = result.value;
              if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
                return PromiseImpl.resolve(value.__await).then(function(value2) {
                  invoke("next", value2, resolve, reject);
                }, function(err) {
                  invoke("throw", err, resolve, reject);
                });
              }
              return PromiseImpl.resolve(value).then(function(unwrapped) {
                result.value = unwrapped;
                resolve(result);
              }, function(error) {
                return invoke("throw", error, resolve, reject);
              });
            }
          }
          var previousPromise;
          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return new PromiseImpl(function(resolve, reject) {
                invoke(method, arg, resolve, reject);
              });
            }
            return previousPromise = // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(
              callInvokeWithMethodAndArg,
              // Avoid propagating failures to Promises returned by later
              // invocations of the iterator.
              callInvokeWithMethodAndArg
            ) : callInvokeWithMethodAndArg();
          }
          defineProperty(this, "_invoke", { value: enqueue });
        }
        defineIteratorMethods(AsyncIterator.prototype);
        define2(AsyncIterator.prototype, asyncIteratorSymbol, function() {
          return this;
        });
        exports2.AsyncIterator = AsyncIterator;
        exports2.async = function(innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
          if (PromiseImpl === void 0) PromiseImpl = Promise;
          var iter = new AsyncIterator(
            wrap(innerFn, outerFn, self2, tryLocsList),
            PromiseImpl
          );
          return exports2.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
        };
        function makeInvokeMethod(innerFn, self2, context) {
          var state = GenStateSuspendedStart;
          return function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error("Generator is already running");
            }
            if (state === GenStateCompleted) {
              if (method === "throw") {
                throw arg;
              }
              return doneResult();
            }
            context.method = method;
            context.arg = arg;
            while (true) {
              var delegate = context.delegate;
              if (delegate) {
                var delegateResult = maybeInvokeDelegate(delegate, context);
                if (delegateResult) {
                  if (delegateResult === ContinueSentinel) continue;
                  return delegateResult;
                }
              }
              if (context.method === "next") {
                context.sent = context._sent = context.arg;
              } else if (context.method === "throw") {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted;
                  throw context.arg;
                }
                context.dispatchException(context.arg);
              } else if (context.method === "return") {
                context.abrupt("return", context.arg);
              }
              state = GenStateExecuting;
              var record = tryCatch(innerFn, self2, context);
              if (record.type === "normal") {
                state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                if (record.arg === ContinueSentinel) {
                  continue;
                }
                return {
                  value: record.arg,
                  done: context.done
                };
              } else if (record.type === "throw") {
                state = GenStateCompleted;
                context.method = "throw";
                context.arg = record.arg;
              }
            }
          };
        }
        function maybeInvokeDelegate(delegate, context) {
          var methodName = context.method;
          var method = delegate.iterator[methodName];
          if (method === undefined2) {
            context.delegate = null;
            if (methodName === "throw" && delegate.iterator["return"]) {
              context.method = "return";
              context.arg = undefined2;
              maybeInvokeDelegate(delegate, context);
              if (context.method === "throw") {
                return ContinueSentinel;
              }
            }
            if (methodName !== "return") {
              context.method = "throw";
              context.arg = new TypeError(
                "The iterator does not provide a '" + methodName + "' method"
              );
            }
            return ContinueSentinel;
          }
          var record = tryCatch(method, delegate.iterator, context.arg);
          if (record.type === "throw") {
            context.method = "throw";
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
          }
          var info = record.arg;
          if (!info) {
            context.method = "throw";
            context.arg = new TypeError("iterator result is not an object");
            context.delegate = null;
            return ContinueSentinel;
          }
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
            if (context.method !== "return") {
              context.method = "next";
              context.arg = undefined2;
            }
          } else {
            return info;
          }
          context.delegate = null;
          return ContinueSentinel;
        }
        defineIteratorMethods(Gp);
        define2(Gp, toStringTagSymbol, "Generator");
        define2(Gp, iteratorSymbol, function() {
          return this;
        });
        define2(Gp, "toString", function() {
          return "[object Generator]";
        });
        function pushTryEntry(locs) {
          var entry = { tryLoc: locs[0] };
          if (1 in locs) {
            entry.catchLoc = locs[1];
          }
          if (2 in locs) {
            entry.finallyLoc = locs[2];
            entry.afterLoc = locs[3];
          }
          this.tryEntries.push(entry);
        }
        function resetTryEntry(entry) {
          var record = entry.completion || {};
          record.type = "normal";
          delete record.arg;
          entry.completion = record;
        }
        function Context(tryLocsList) {
          this.tryEntries = [{ tryLoc: "root" }];
          tryLocsList.forEach(pushTryEntry, this);
          this.reset(true);
        }
        exports2.keys = function(val) {
          var object = Object(val);
          var keys = [];
          for (var key in object) {
            keys.push(key);
          }
          keys.reverse();
          return function next() {
            while (keys.length) {
              var key2 = keys.pop();
              if (key2 in object) {
                next.value = key2;
                next.done = false;
                return next;
              }
            }
            next.done = true;
            return next;
          };
        };
        function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
            if (iteratorMethod) {
              return iteratorMethod.call(iterable);
            }
            if (typeof iterable.next === "function") {
              return iterable;
            }
            if (!isNaN(iterable.length)) {
              var i = -1, next = function next2() {
                while (++i < iterable.length) {
                  if (hasOwn.call(iterable, i)) {
                    next2.value = iterable[i];
                    next2.done = false;
                    return next2;
                  }
                }
                next2.value = undefined2;
                next2.done = true;
                return next2;
              };
              return next.next = next;
            }
          }
          return { next: doneResult };
        }
        exports2.values = values;
        function doneResult() {
          return { value: undefined2, done: true };
        }
        Context.prototype = {
          constructor: Context,
          reset: function(skipTempReset) {
            this.prev = 0;
            this.next = 0;
            this.sent = this._sent = undefined2;
            this.done = false;
            this.delegate = null;
            this.method = "next";
            this.arg = undefined2;
            this.tryEntries.forEach(resetTryEntry);
            if (!skipTempReset) {
              for (var name in this) {
                if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                  this[name] = undefined2;
                }
              }
            }
          },
          stop: function() {
            this.done = true;
            var rootEntry = this.tryEntries[0];
            var rootRecord = rootEntry.completion;
            if (rootRecord.type === "throw") {
              throw rootRecord.arg;
            }
            return this.rval;
          },
          dispatchException: function(exception) {
            if (this.done) {
              throw exception;
            }
            var context = this;
            function handle(loc, caught) {
              record.type = "throw";
              record.arg = exception;
              context.next = loc;
              if (caught) {
                context.method = "next";
                context.arg = undefined2;
              }
              return !!caught;
            }
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              var record = entry.completion;
              if (entry.tryLoc === "root") {
                return handle("end");
              }
              if (entry.tryLoc <= this.prev) {
                var hasCatch = hasOwn.call(entry, "catchLoc");
                var hasFinally = hasOwn.call(entry, "finallyLoc");
                if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  } else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  }
                } else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else {
                  throw new Error("try statement without catch or finally");
                }
              }
            }
          },
          abrupt: function(type, arg) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                var finallyEntry = entry;
                break;
              }
            }
            if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
              finallyEntry = null;
            }
            var record = finallyEntry ? finallyEntry.completion : {};
            record.type = type;
            record.arg = arg;
            if (finallyEntry) {
              this.method = "next";
              this.next = finallyEntry.finallyLoc;
              return ContinueSentinel;
            }
            return this.complete(record);
          },
          complete: function(record, afterLoc) {
            if (record.type === "throw") {
              throw record.arg;
            }
            if (record.type === "break" || record.type === "continue") {
              this.next = record.arg;
            } else if (record.type === "return") {
              this.rval = this.arg = record.arg;
              this.method = "return";
              this.next = "end";
            } else if (record.type === "normal" && afterLoc) {
              this.next = afterLoc;
            }
            return ContinueSentinel;
          },
          finish: function(finallyLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc);
                resetTryEntry(entry);
                return ContinueSentinel;
              }
            }
          },
          "catch": function(tryLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc === tryLoc) {
                var record = entry.completion;
                if (record.type === "throw") {
                  var thrown = record.arg;
                  resetTryEntry(entry);
                }
                return thrown;
              }
            }
            throw new Error("illegal catch attempt");
          },
          delegateYield: function(iterable, resultName, nextLoc) {
            this.delegate = {
              iterator: values(iterable),
              resultName,
              nextLoc
            };
            if (this.method === "next") {
              this.arg = undefined2;
            }
            return ContinueSentinel;
          }
        };
        return exports2;
      })(
        // If this script is executing as a CommonJS module, use module.exports
        // as the regeneratorRuntime namespace. Otherwise create a new empty
        // object. Either way, the resulting object will be used to initialize
        // the regeneratorRuntime variable at the top of this file.
        typeof module === "object" ? module.exports : {}
      );
      try {
        regeneratorRuntime = runtime;
      } catch (accidentalStrictMode) {
        if (typeof globalThis === "object") {
          globalThis.regeneratorRuntime = runtime;
        } else {
          Function("r", "regeneratorRuntime = r")(runtime);
        }
      }
    }
  });

  // node_modules/@babel/polyfill/lib/noConflict.js
  var require_noConflict = __commonJS({
    "node_modules/@babel/polyfill/lib/noConflict.js"() {
      "use strict";
      require_es6();
      require_includes();
      require_flat_map();
      require_pad_start();
      require_pad_end();
      require_trim_start();
      require_trim_end();
      require_async_iterator();
      require_get_own_property_descriptors();
      require_values();
      require_entries();
      require_finally();
      require_web();
      require_runtime();
    }
  });

  // node_modules/core-js/library/modules/_global.js
  var require_global2 = __commonJS({
    "node_modules/core-js/library/modules/_global.js"(exports, module) {
      var global = module.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
      if (typeof __g == "number") __g = global;
    }
  });

  // node_modules/core-js/library/modules/_core.js
  var require_core2 = __commonJS({
    "node_modules/core-js/library/modules/_core.js"(exports, module) {
      var core = module.exports = { version: "2.6.12" };
      if (typeof __e == "number") __e = core;
    }
  });

  // node_modules/core-js/library/modules/_a-function.js
  var require_a_function2 = __commonJS({
    "node_modules/core-js/library/modules/_a-function.js"(exports, module) {
      module.exports = function(it) {
        if (typeof it != "function") throw TypeError(it + " is not a function!");
        return it;
      };
    }
  });

  // node_modules/core-js/library/modules/_ctx.js
  var require_ctx2 = __commonJS({
    "node_modules/core-js/library/modules/_ctx.js"(exports, module) {
      var aFunction = require_a_function2();
      module.exports = function(fn, that, length) {
        aFunction(fn);
        if (that === void 0) return fn;
        switch (length) {
          case 1:
            return function(a) {
              return fn.call(that, a);
            };
          case 2:
            return function(a, b) {
              return fn.call(that, a, b);
            };
          case 3:
            return function(a, b, c) {
              return fn.call(that, a, b, c);
            };
        }
        return function() {
          return fn.apply(that, arguments);
        };
      };
    }
  });

  // node_modules/core-js/library/modules/_is-object.js
  var require_is_object2 = __commonJS({
    "node_modules/core-js/library/modules/_is-object.js"(exports, module) {
      module.exports = function(it) {
        return typeof it === "object" ? it !== null : typeof it === "function";
      };
    }
  });

  // node_modules/core-js/library/modules/_an-object.js
  var require_an_object2 = __commonJS({
    "node_modules/core-js/library/modules/_an-object.js"(exports, module) {
      var isObject = require_is_object2();
      module.exports = function(it) {
        if (!isObject(it)) throw TypeError(it + " is not an object!");
        return it;
      };
    }
  });

  // node_modules/core-js/library/modules/_fails.js
  var require_fails2 = __commonJS({
    "node_modules/core-js/library/modules/_fails.js"(exports, module) {
      module.exports = function(exec) {
        try {
          return !!exec();
        } catch (e) {
          return true;
        }
      };
    }
  });

  // node_modules/core-js/library/modules/_descriptors.js
  var require_descriptors2 = __commonJS({
    "node_modules/core-js/library/modules/_descriptors.js"(exports, module) {
      module.exports = !require_fails2()(function() {
        return Object.defineProperty({}, "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }
  });

  // node_modules/core-js/library/modules/_dom-create.js
  var require_dom_create2 = __commonJS({
    "node_modules/core-js/library/modules/_dom-create.js"(exports, module) {
      var isObject = require_is_object2();
      var document2 = require_global2().document;
      var is = isObject(document2) && isObject(document2.createElement);
      module.exports = function(it) {
        return is ? document2.createElement(it) : {};
      };
    }
  });

  // node_modules/core-js/library/modules/_ie8-dom-define.js
  var require_ie8_dom_define2 = __commonJS({
    "node_modules/core-js/library/modules/_ie8-dom-define.js"(exports, module) {
      module.exports = !require_descriptors2() && !require_fails2()(function() {
        return Object.defineProperty(require_dom_create2()("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }
  });

  // node_modules/core-js/library/modules/_to-primitive.js
  var require_to_primitive2 = __commonJS({
    "node_modules/core-js/library/modules/_to-primitive.js"(exports, module) {
      var isObject = require_is_object2();
      module.exports = function(it, S) {
        if (!isObject(it)) return it;
        var fn, val;
        if (S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
        if (typeof (fn = it.valueOf) == "function" && !isObject(val = fn.call(it))) return val;
        if (!S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
        throw TypeError("Can't convert object to primitive value");
      };
    }
  });

  // node_modules/core-js/library/modules/_object-dp.js
  var require_object_dp2 = __commonJS({
    "node_modules/core-js/library/modules/_object-dp.js"(exports) {
      var anObject = require_an_object2();
      var IE8_DOM_DEFINE = require_ie8_dom_define2();
      var toPrimitive = require_to_primitive2();
      var dP = Object.defineProperty;
      exports.f = require_descriptors2() ? Object.defineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPrimitive(P, true);
        anObject(Attributes);
        if (IE8_DOM_DEFINE) try {
          return dP(O, P, Attributes);
        } catch (e) {
        }
        if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
        if ("value" in Attributes) O[P] = Attributes.value;
        return O;
      };
    }
  });

  // node_modules/core-js/library/modules/_property-desc.js
  var require_property_desc2 = __commonJS({
    "node_modules/core-js/library/modules/_property-desc.js"(exports, module) {
      module.exports = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value
        };
      };
    }
  });

  // node_modules/core-js/library/modules/_hide.js
  var require_hide2 = __commonJS({
    "node_modules/core-js/library/modules/_hide.js"(exports, module) {
      var dP = require_object_dp2();
      var createDesc = require_property_desc2();
      module.exports = require_descriptors2() ? function(object, key, value) {
        return dP.f(object, key, createDesc(1, value));
      } : function(object, key, value) {
        object[key] = value;
        return object;
      };
    }
  });

  // node_modules/core-js/library/modules/_has.js
  var require_has2 = __commonJS({
    "node_modules/core-js/library/modules/_has.js"(exports, module) {
      var hasOwnProperty = {}.hasOwnProperty;
      module.exports = function(it, key) {
        return hasOwnProperty.call(it, key);
      };
    }
  });

  // node_modules/core-js/library/modules/_export.js
  var require_export2 = __commonJS({
    "node_modules/core-js/library/modules/_export.js"(exports, module) {
      var global = require_global2();
      var core = require_core2();
      var ctx = require_ctx2();
      var hide = require_hide2();
      var has = require_has2();
      var PROTOTYPE = "prototype";
      var $export = function(type, name, source) {
        var IS_FORCED = type & $export.F;
        var IS_GLOBAL = type & $export.G;
        var IS_STATIC = type & $export.S;
        var IS_PROTO = type & $export.P;
        var IS_BIND = type & $export.B;
        var IS_WRAP = type & $export.W;
        var exports2 = IS_GLOBAL ? core : core[name] || (core[name] = {});
        var expProto = exports2[PROTOTYPE];
        var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
        var key, own, out;
        if (IS_GLOBAL) source = name;
        for (key in source) {
          own = !IS_FORCED && target && target[key] !== void 0;
          if (own && has(exports2, key)) continue;
          out = own ? target[key] : source[key];
          exports2[key] = IS_GLOBAL && typeof target[key] != "function" ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? (function(C) {
            var F = function(a, b, c) {
              if (this instanceof C) {
                switch (arguments.length) {
                  case 0:
                    return new C();
                  case 1:
                    return new C(a);
                  case 2:
                    return new C(a, b);
                }
                return new C(a, b, c);
              }
              return C.apply(this, arguments);
            };
            F[PROTOTYPE] = C[PROTOTYPE];
            return F;
          })(out) : IS_PROTO && typeof out == "function" ? ctx(Function.call, out) : out;
          if (IS_PROTO) {
            (exports2.virtual || (exports2.virtual = {}))[key] = out;
            if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
          }
        }
      };
      $export.F = 1;
      $export.G = 2;
      $export.S = 4;
      $export.P = 8;
      $export.B = 16;
      $export.W = 32;
      $export.U = 64;
      $export.R = 128;
      module.exports = $export;
    }
  });

  // node_modules/core-js/library/modules/es7.global.js
  var require_es7_global = __commonJS({
    "node_modules/core-js/library/modules/es7.global.js"() {
      var $export = require_export2();
      $export($export.G, { global: require_global2() });
    }
  });

  // node_modules/core-js/library/fn/global.js
  var require_global3 = __commonJS({
    "node_modules/core-js/library/fn/global.js"(exports, module) {
      require_es7_global();
      module.exports = require_core2().global;
    }
  });

  // node_modules/@babel/polyfill/lib/index.js
  var require_lib = __commonJS({
    "node_modules/@babel/polyfill/lib/index.js"() {
      "use strict";
      require_noConflict();
      var _global = _interopRequireDefault(require_global3());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { "default": obj };
      }
      if (_global["default"]._babelPolyfill && typeof console !== "undefined" && console.warn) {
        console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended and may have consequences if different versions of the polyfills are applied sequentially. If you do need to load the polyfill more than once, use @babel/polyfill/noConflict instead to bypass the warning.");
      }
      _global["default"]._babelPolyfill = true;
    }
  });

  // test_tmp/scripts/util.js
  var require_util = __commonJS({
    "test_tmp/scripts/util.js"(exports, module) {
      "use strict";
      function getParameterByName2(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
      module.exports = {
        getParameterByName: getParameterByName2
      };
    }
  });

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

  // dist/lib.cjs/util.js
  var require_util2 = __commonJS({
    "dist/lib.cjs/util.js"(exports) {
      "use strict";
      var loglevel = require_loglevel();
      function isPromise(obj) {
        if (obj && typeof obj.then === "function") {
          return true;
        }
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
      function microSeconds() {
        let ret = Date.now() * 1e3;
        if (ret <= lastMs) {
          ret = lastMs + 1;
        }
        lastMs = ret;
        return ret;
      }
      var log = loglevel.getLogger("broadcast-channel");
      log.setLevel("error");
      exports.PROMISE_RESOLVED_VOID = PROMISE_RESOLVED_VOID;
      exports.generateRandomId = generateRandomId;
      exports.isPromise = isPromise;
      exports.log = log;
      exports.microSeconds = microSeconds;
      exports.randomInt = randomInt;
      exports.sleep = sleep;
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

  // node_modules/@toruslabs/constants/dist/lib.cjs/constants.js
  var require_constants = __commonJS({
    "node_modules/@toruslabs/constants/dist/lib.cjs/constants.js"(exports) {
      "use strict";
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
      var PROXY_CONTRACT_ADDRESS = {
        [TORUS_LEGACY_NETWORK.MAINNET]: "0xf20336e16B5182637f09821c27BDe29b0AFcfe80",
        [TORUS_LEGACY_NETWORK.TESTNET]: "0xd084604e5FA387FbC2Da8bAab07fDD6aDED4614A",
        [TORUS_LEGACY_NETWORK.CYAN]: "0x9f072ba19b3370e512aa1b4bfcdaf97283168005",
        [TORUS_LEGACY_NETWORK.AQUA]: "0x29Dea82a0509153b91040ee13cDBba0f03efb625",
        [TORUS_LEGACY_NETWORK.CELESTE]: "0x6Bffb4e89453069E7487f0fa5c9f4a2D771cce6c"
      };
      var MULTI_CLUSTER_NETWORKS = [
        // TORUS_LEGACY_NETWORK.AQUA,
        // TORUS_LEGACY_NETWORK.CELESTE,
        // TORUS_LEGACY_NETWORK.CYAN,
      ];
      var LEGACY_NETWORKS_ROUTE_MAP = {
        [TORUS_LEGACY_NETWORK.AQUA]: {
          migrationCompleted: true,
          networkIdentifier: "aqua",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.CELESTE]: {
          migrationCompleted: true,
          networkIdentifier: "celeste",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.CYAN]: {
          migrationCompleted: true,
          networkIdentifier: "cyan",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.MAINNET]: {
          migrationCompleted: true,
          networkIdentifier: "mainnet",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET
        },
        [TORUS_LEGACY_NETWORK.TESTNET]: {
          migrationCompleted: true,
          networkIdentifier: "teal",
          networkMigratedTo: TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET
        }
      };
      var NETWORK_MAP = {
        [TORUS_LEGACY_NETWORK.MAINNET]: "mainnet",
        [TORUS_LEGACY_NETWORK.TESTNET]: "goerli",
        [TORUS_LEGACY_NETWORK.CYAN]: "polygon-mainnet",
        [TORUS_LEGACY_NETWORK.AQUA]: "polygon-mainnet",
        [TORUS_LEGACY_NETWORK.CELESTE]: "polygon-mainnet"
      };
      var SIGNER_MAP = {
        [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_MAINNET]: "https://api.web3auth.io/signer-service",
        [TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET]: "https://api.web3auth.io/signer-service",
        [TORUS_LEGACY_NETWORK.MAINNET]: "https://api.web3auth.io/signer-service",
        [TORUS_LEGACY_NETWORK.TESTNET]: "https://api.web3auth.io/signer-service",
        [TORUS_LEGACY_NETWORK.CYAN]: "https://api.web3auth.io/signer-polygon-service",
        [TORUS_LEGACY_NETWORK.AQUA]: "https://api.web3auth.io/signer-polygon-service",
        [TORUS_LEGACY_NETWORK.CELESTE]: "https://api.web3auth.io/signer-polygon-service"
      };
      var METADATA_MAP = {
        [TORUS_LEGACY_NETWORK.MAINNET]: "https://api.web3auth.io/metadata-service",
        [TORUS_LEGACY_NETWORK.TESTNET]: "https://api.web3auth.io/metadata-service",
        [TORUS_LEGACY_NETWORK.CYAN]: "https://api.web3auth.io/metadata-service",
        [TORUS_LEGACY_NETWORK.AQUA]: "https://api.web3auth.io/metadata-service",
        [TORUS_LEGACY_NETWORK.CELESTE]: "https://api.web3auth.io/metadata-service"
      };
      var FND_SERVER = "https://api.web3auth.io/fnd-service";
      var SESSION_SERVER_API_URL = "https://api.web3auth.io/session-service";
      var SESSION_SERVER_SOCKET_URL = "https://session.web3auth.io";
      var AUTHJS_SERVER_URL = "https://api.web3auth.io/authjs-service";
      var KEY_TYPE = {
        SECP256K1: "secp256k1",
        ED25519: "ed25519"
      };
      var SIG_TYPE = {
        ECDSA_SECP256K1: "ecdsa-secp256k1",
        ED25519: "ed25519",
        BIP340: "bip340"
      };
      exports.AUTHJS_SERVER_URL = AUTHJS_SERVER_URL;
      exports.FND_SERVER = FND_SERVER;
      exports.KEY_TYPE = KEY_TYPE;
      exports.LEGACY_NETWORKS_ROUTE_MAP = LEGACY_NETWORKS_ROUTE_MAP;
      exports.METADATA_MAP = METADATA_MAP;
      exports.MULTI_CLUSTER_NETWORKS = MULTI_CLUSTER_NETWORKS;
      exports.NETWORK_MAP = NETWORK_MAP;
      exports.PROXY_CONTRACT_ADDRESS = PROXY_CONTRACT_ADDRESS;
      exports.SESSION_SERVER_API_URL = SESSION_SERVER_API_URL;
      exports.SESSION_SERVER_SOCKET_URL = SESSION_SERVER_SOCKET_URL;
      exports.SIGNER_MAP = SIGNER_MAP;
      exports.SIG_TYPE = SIG_TYPE;
      exports.TORUS_LEGACY_NETWORK = TORUS_LEGACY_NETWORK;
      exports.TORUS_SAPPHIRE_NETWORK = TORUS_SAPPHIRE_NETWORK;
    }
  });

  // node_modules/@toruslabs/constants/dist/lib.cjs/interfaces.js
  var require_interfaces = __commonJS({
    "node_modules/@toruslabs/constants/dist/lib.cjs/interfaces.js"(exports) {
      "use strict";
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
        outputs: [{
          internalType: "uint256",
          name: "currentEpoch",
          type: "uint256"
        }, {
          internalType: "string[]",
          name: "torusNodeEndpoints",
          type: "string[]"
        }, {
          internalType: "uint256[]",
          name: "torusNodePubX",
          type: "uint256[]"
        }, {
          internalType: "uint256[]",
          name: "torusNodePubY",
          type: "uint256[]"
        }, {
          internalType: "uint256[]",
          name: "torusIndexes",
          type: "uint256[]"
        }],
        stateMutability: "view",
        type: "function"
      }];
      exports.abi = abi;
    }
  });

  // node_modules/@toruslabs/constants/dist/lib.cjs/index.js
  var require_lib2 = __commonJS({
    "node_modules/@toruslabs/constants/dist/lib.cjs/index.js"(exports) {
      "use strict";
      var constants = require_constants();
      var interfaces = require_interfaces();
      exports.AUTHJS_SERVER_URL = constants.AUTHJS_SERVER_URL;
      exports.FND_SERVER = constants.FND_SERVER;
      exports.KEY_TYPE = constants.KEY_TYPE;
      exports.LEGACY_NETWORKS_ROUTE_MAP = constants.LEGACY_NETWORKS_ROUTE_MAP;
      exports.METADATA_MAP = constants.METADATA_MAP;
      exports.MULTI_CLUSTER_NETWORKS = constants.MULTI_CLUSTER_NETWORKS;
      exports.NETWORK_MAP = constants.NETWORK_MAP;
      exports.PROXY_CONTRACT_ADDRESS = constants.PROXY_CONTRACT_ADDRESS;
      exports.SESSION_SERVER_API_URL = constants.SESSION_SERVER_API_URL;
      exports.SESSION_SERVER_SOCKET_URL = constants.SESSION_SERVER_SOCKET_URL;
      exports.SIGNER_MAP = constants.SIGNER_MAP;
      exports.SIG_TYPE = constants.SIG_TYPE;
      exports.TORUS_LEGACY_NETWORK = constants.TORUS_LEGACY_NETWORK;
      exports.TORUS_SAPPHIRE_NETWORK = constants.TORUS_SAPPHIRE_NETWORK;
      exports.abi = interfaces.abi;
    }
  });

  // dist/lib.cjs/options.js
  var require_options = __commonJS({
    "dist/lib.cjs/options.js"(exports) {
      "use strict";
      var constants = require_lib2();
      function fillOptionsWithDefaults(originalOptions = {}) {
        const options = JSON.parse(JSON.stringify(originalOptions));
        if (typeof options.webWorkerSupport === "undefined") options.webWorkerSupport = true;
        if (!options.idb) options.idb = {};
        if (!options.idb.ttl) options.idb.ttl = 1e3 * 45;
        if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
        if (originalOptions.idb && typeof originalOptions.idb.onclose === "function") options.idb.onclose = originalOptions.idb.onclose;
        if (!options.localstorage) options.localstorage = {};
        if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1e3 * 60;
        if (!options.server) options.server = {};
        if (!options.server.api_url) options.server.api_url = `${constants.SESSION_SERVER_API_URL}/v2`;
        if (!options.server.socket_url) options.server.socket_url = `${constants.SESSION_SERVER_SOCKET_URL}`;
        if (!options.server.removeTimeout) options.server.removeTimeout = 1e3 * 60 * 5;
        if (originalOptions.methods) options.methods = originalOptions.methods;
        return options;
      }
      exports.fillOptionsWithDefaults = fillOptionsWithDefaults;
    }
  });

  // dist/lib.cjs/methods/indexed-db.js
  var require_indexed_db = __commonJS({
    "dist/lib.cjs/methods/indexed-db.js"(exports) {
      "use strict";
      var util = require_util2();
      var obliviousSet = require_index_es5();
      var options = require_options();
      var microSeconds = util.microSeconds;
      var DB_PREFIX = "pubkey.broadcast-channel-0-";
      var OBJECT_STORE_ID = "messages";
      var TRANSACTION_SETTINGS = {
        durability: "relaxed"
      };
      var type = "idb";
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
        if (tx.commit) {
          tx.commit();
        }
      }
      function createDatabase(channelName2) {
        const IndexedDB = getIdb();
        if (!IndexedDB) return Promise.reject(new Error("IndexedDB not available"));
        const dbName = DB_PREFIX + channelName2;
        const openRequest = IndexedDB.open(dbName);
        openRequest.onupgradeneeded = (ev) => {
          const db = ev.target.result;
          db.createObjectStore(OBJECT_STORE_ID, {
            keyPath: "id",
            autoIncrement: true
          });
        };
        const dbPromise = new Promise((resolve, reject) => {
          openRequest.onerror = (ev) => reject(ev);
          openRequest.onsuccess = () => {
            resolve(openRequest.result);
          };
        });
        return dbPromise;
      }
      function writeMessage(db, readerUuid, messageJson) {
        const time = Date.now();
        const writeObject = {
          uuid: readerUuid,
          time,
          data: messageJson
        };
        const tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
        return new Promise((resolve, reject) => {
          tx.oncomplete = () => resolve();
          tx.onerror = (ev) => reject(ev);
          const objectStore = tx.objectStore(OBJECT_STORE_ID);
          objectStore.add(writeObject);
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
              if (cursor.value.id < lastCursorId + 1) {
                cursor.continue(lastCursorId + 1);
              } else {
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
        const tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
        const objectStore = tx.objectStore(OBJECT_STORE_ID);
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
            } else {
              resolve(ret);
            }
          };
        });
      }
      function cleanOldMessages(db, ttl) {
        return getOldMessages(db, ttl).then((tooOld) => {
          return removeMessagesById(db, tooOld.map((msg) => msg.id));
        });
      }
      function create(channelName2, options$1) {
        options$1 = options.fillOptionsWithDefaults(options$1);
        return createDatabase(channelName2).then((db) => {
          const state = {
            closed: false,
            lastCursorId: 0,
            channelName: channelName2,
            options: options$1,
            uuid: util.generateRandomId(),
            /**
             * emittedMessagesIds
             * contains all messages that have been emitted before
             * @type {ObliviousSet}
             */
            eMIs: new obliviousSet.ObliviousSet(options$1.idb.ttl * 2),
            // ensures we do not read messages in parrallel
            writeBlockPromise: util.PROMISE_RESOLVED_VOID,
            messagesCallback: null,
            readQueuePromises: [],
            db,
            time: util.microSeconds()
          };
          db.onclose = function() {
            state.closed = true;
            if (options$1.idb.onclose) options$1.idb.onclose();
          };
          _readLoop(state);
          return state;
        });
      }
      function _readLoop(state) {
        if (state.closed) return;
        readNewMessages(state).then(() => util.sleep(state.options.idb.fallbackInterval)).then(() => _readLoop(state)).catch((e) => {
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
        if (state.closed) return util.PROMISE_RESOLVED_VOID;
        if (!state.messagesCallback) return util.PROMISE_RESOLVED_VOID;
        return getMessagesHigherThan(state.db, state.lastCursorId).then((newerMessages) => {
          const useMessages = newerMessages.filter((msgObj) => !!msgObj).map((msgObj) => {
            if (msgObj.id > state.lastCursorId) {
              state.lastCursorId = msgObj.id;
            }
            return msgObj;
          }).filter((msgObj) => _filterMessage(msgObj, state)).sort((msgObjA, msgObjB) => msgObjA.time - msgObjB.time);
          useMessages.forEach((msgObj) => {
            if (state.messagesCallback) {
              state.eMIs.add(msgObj.id);
              state.messagesCallback(msgObj.data);
            }
          });
          return util.PROMISE_RESOLVED_VOID;
        });
      }
      function close(channelState) {
        channelState.closed = true;
        channelState.db.close();
      }
      function postMessage2(channelState, messageJson) {
        channelState.writeBlockPromise = channelState.writeBlockPromise.then(() => writeMessage(channelState.db, channelState.uuid, messageJson)).then(() => {
          if (util.randomInt(0, 10) === 0) {
            cleanOldMessages(channelState.db, channelState.options.idb.ttl);
          }
          return util.PROMISE_RESOLVED_VOID;
        });
        return channelState.writeBlockPromise;
      }
      function onMessage(channelState, fn, time) {
        channelState.messagesCallbackTime = time;
        channelState.messagesCallback = fn;
        readNewMessages(channelState);
      }
      function canBeUsed() {
        const idb = getIdb();
        if (!idb) return false;
        return true;
      }
      function averageResponseTime(options2) {
        return options2.idb.fallbackInterval * 2;
      }
      exports.TRANSACTION_SETTINGS = TRANSACTION_SETTINGS;
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
      exports.microSeconds = microSeconds;
      exports.onMessage = onMessage;
      exports.postMessage = postMessage2;
      exports.removeMessagesById = removeMessagesById;
      exports.type = type;
      exports.writeMessage = writeMessage;
    }
  });

  // dist/lib.cjs/methods/localstorage.js
  var require_localstorage = __commonJS({
    "dist/lib.cjs/methods/localstorage.js"(exports) {
      "use strict";
      var obliviousSet = require_index_es5();
      var options = require_options();
      var util = require_util2();
      var microSeconds = util.microSeconds;
      var KEY_PREFIX = "pubkey.broadcastChannel-";
      var type = "localstorage";
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
      function storageKey(channelName2) {
        return KEY_PREFIX + channelName2;
      }
      function postMessage2(channelState, messageJson) {
        return new Promise((resolve, reject) => {
          util.sleep().then(() => {
            var _getLocalStorage;
            const key = storageKey(channelState.channelName);
            const writeObj = {
              token: util.generateRandomId(),
              time: Date.now(),
              data: messageJson,
              uuid: channelState.uuid
            };
            const value = JSON.stringify(writeObj);
            (_getLocalStorage = getLocalStorage()) === null || _getLocalStorage === void 0 || _getLocalStorage.setItem(key, value);
            const ev = document.createEvent("StorageEvent");
            ev.initStorageEvent("storage", true, true, key, null, value, "", null);
            window.dispatchEvent(ev);
            resolve();
          }).catch(reject);
        });
      }
      function addStorageEventListener(channelName2, fn) {
        const key = storageKey(channelName2);
        const listener = (ev) => {
          if (ev.key === key && ev.newValue) {
            fn(JSON.parse(ev.newValue));
          }
        };
        window.addEventListener("storage", listener);
        return listener;
      }
      function removeStorageEventListener(listener) {
        window.removeEventListener("storage", listener);
      }
      function canBeUsed() {
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
      function create(channelName2, options$1) {
        const filledOptions = options.fillOptionsWithDefaults(options$1);
        if (!canBeUsed()) {
          throw new Error("BroadcastChannel: localstorage cannot be used");
        }
        const uuid = util.generateRandomId();
        const eMIs = new obliviousSet.ObliviousSet(filledOptions.localstorage.removeTimeout);
        const state = {
          channelName: channelName2,
          uuid,
          time: util.microSeconds(),
          eMIs
          // emittedMessagesIds
        };
        state.listener = addStorageEventListener(channelName2, (msgObj) => {
          if (!state.messagesCallback) return;
          if (msgObj.uuid === uuid) return;
          if (!msgObj.token || eMIs.has(msgObj.token)) return;
          if (msgObj.data.time && msgObj.data.time < (state.messagesCallbackTime || 0)) return;
          eMIs.add(msgObj.token);
          state.messagesCallback(msgObj.data);
        });
        return state;
      }
      function close(channelState) {
        if (channelState.listener) {
          removeStorageEventListener(channelState.listener);
        }
      }
      function onMessage(channelState, fn, time) {
        channelState.messagesCallbackTime = time;
        channelState.messagesCallback = fn;
      }
      function averageResponseTime() {
        const defaultTime = 120;
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
          return defaultTime * 2;
        }
        return defaultTime;
      }
      exports.addStorageEventListener = addStorageEventListener;
      exports.averageResponseTime = averageResponseTime;
      exports.canBeUsed = canBeUsed;
      exports.close = close;
      exports.create = create;
      exports.getLocalStorage = getLocalStorage;
      exports.microSeconds = microSeconds;
      exports.onMessage = onMessage;
      exports.postMessage = postMessage2;
      exports.removeStorageEventListener = removeStorageEventListener;
      exports.storageKey = storageKey;
      exports.type = type;
    }
  });

  // dist/lib.cjs/methods/native.js
  var require_native = __commonJS({
    "dist/lib.cjs/methods/native.js"(exports) {
      "use strict";
      var util = require_util2();
      var microSeconds = util.microSeconds;
      var type = "native";
      function create(channelName2) {
        const state = {
          time: util.microSeconds(),
          messagesCallback: null,
          bc: new BroadcastChannel(channelName2),
          subFns: []
          // subscriberFunctions
        };
        state.bc.onmessage = (msg) => {
          if (state.messagesCallback) {
            state.messagesCallback(msg.data);
          }
        };
        return state;
      }
      function close(channelState) {
        channelState.bc.close();
        channelState.subFns = [];
      }
      function postMessage2(channelState, messageJson) {
        try {
          channelState.bc.postMessage(messageJson);
          return util.PROMISE_RESOLVED_VOID;
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function onMessage(channelState, fn) {
        channelState.messagesCallback = fn;
      }
      function canBeUsed() {
        if (typeof window === "undefined") return false;
        if (typeof BroadcastChannel === "function") {
          if (BroadcastChannel._pubkey) {
            throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
          }
          return true;
        }
        return false;
      }
      function averageResponseTime() {
        return 150;
      }
      exports.averageResponseTime = averageResponseTime;
      exports.canBeUsed = canBeUsed;
      exports.close = close;
      exports.create = create;
      exports.microSeconds = microSeconds;
      exports.onMessage = onMessage;
      exports.postMessage = postMessage2;
      exports.type = type;
    }
  });

  // node_modules/@noble/hashes/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n, title = "") {
    if (!Number.isSafeInteger(n) || n < 0) {
      const prefix = title && `"${title}" `;
      throw new Error(`${prefix}expected integer >= 0, got ${n}`);
    }
  }
  function abytes(value, length, title = "") {
    const bytes = isBytes(value);
    const len = value?.length;
    const needsLen = length !== void 0;
    if (!bytes || needsLen && len !== length) {
      const prefix = title && `"${title}" `;
      const ofLen = needsLen ? ` of length ${length}` : "";
      const got = bytes ? `length=${len}` : `type=${typeof value}`;
      throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
    }
    return value;
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash must wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "digestInto() output");
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error('"digestInto() output" expected to be of length >=' + min);
    }
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
  function bytesToHex(bytes) {
    abytes(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes[bytes[i]];
    }
    return hex;
  }
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    if (hasHexBuiltin)
      return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
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
  function createHasher(hashCons, info = {}) {
    const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  function randomBytes(bytesLength = 32) {
    const cr = typeof globalThis === "object" ? globalThis.crypto : null;
    if (typeof cr?.getRandomValues !== "function")
      throw new Error("crypto.getRandomValues must be defined");
    return cr.getRandomValues(new Uint8Array(bytesLength));
  }
  var hasHexBuiltin, hexes, asciis, oidNist;
  var init_utils = __esm({
    "node_modules/@noble/hashes/utils.js"() {
      hasHexBuiltin = /* @__PURE__ */ (() => (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      oidNist = (suffix) => ({
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
  var HashMD, SHA256_IV;
  var init_md = __esm({
    "node_modules/@noble/hashes/_md.js"() {
      init_utils();
      HashMD = class {
        blockLen;
        outputLen;
        padOffset;
        isLE;
        // For partial updates less than block size
        buffer;
        view;
        finished = false;
        length = 0;
        pos = 0;
        destroyed = false;
        constructor(blockLen, outputLen, padOffset, isLE) {
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE;
          this.buffer = new Uint8Array(blockLen);
          this.view = createView(this.buffer);
        }
        update(data) {
          aexists(this);
          abytes(data);
          const { view, buffer, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = createView(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          clean(this.buffer.subarray(pos));
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
          view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
          this.process(view, 0);
          const oview = createView(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen must be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to ||= new this.constructor();
          to.set(...this.get());
          const { blockLen, buffer, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (length % blockLen)
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
    }
  });

  // node_modules/@noble/hashes/sha2.js
  var SHA256_K, SHA256_W, SHA2_32B, _SHA256, sha256;
  var init_sha2 = __esm({
    "node_modules/@noble/hashes/sha2.js"() {
      init_md();
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
        constructor(outputLen) {
          super(64, outputLen, 8, false);
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
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
          let { A, B, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = sigma0 + Maj(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          clean(SHA256_W);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          clean(this.buffer);
        }
      };
      _SHA256 = class extends SHA2_32B {
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        A = SHA256_IV[0] | 0;
        B = SHA256_IV[1] | 0;
        C = SHA256_IV[2] | 0;
        D = SHA256_IV[3] | 0;
        E = SHA256_IV[4] | 0;
        F = SHA256_IV[5] | 0;
        G = SHA256_IV[6] | 0;
        H = SHA256_IV[7] | 0;
        constructor() {
          super(32);
        }
      };
      sha256 = /* @__PURE__ */ createHasher(
        () => new _SHA256(),
        /* @__PURE__ */ oidNist(1)
      );
    }
  });

  // node_modules/@noble/curves/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    aInRange: () => aInRange,
    abool: () => abool,
    abytes: () => abytes,
    anumber: () => anumber,
    asafenumber: () => asafenumber,
    asciiToBytes: () => asciiToBytes,
    bitGet: () => bitGet,
    bitLen: () => bitLen,
    bitMask: () => bitMask,
    bitSet: () => bitSet,
    bytesToHex: () => bytesToHex,
    bytesToNumberBE: () => bytesToNumberBE,
    bytesToNumberLE: () => bytesToNumberLE,
    concatBytes: () => concatBytes,
    copyBytes: () => copyBytes,
    createHmacDrbg: () => createHmacDrbg,
    equalBytes: () => equalBytes,
    hexToBytes: () => hexToBytes,
    hexToNumber: () => hexToNumber,
    inRange: () => inRange,
    isBytes: () => isBytes,
    memoized: () => memoized,
    notImplemented: () => notImplemented,
    numberToBytesBE: () => numberToBytesBE,
    numberToBytesLE: () => numberToBytesLE,
    numberToHexUnpadded: () => numberToHexUnpadded,
    numberToVarBytesBE: () => numberToVarBytesBE,
    randomBytes: () => randomBytes,
    validateObject: () => validateObject
  });
  function abool(value, title = "") {
    if (typeof value !== "boolean") {
      const prefix = title && `"${title}" `;
      throw new Error(prefix + "expected boolean, got type=" + typeof value);
    }
    return value;
  }
  function abignumber(n) {
    if (typeof n === "bigint") {
      if (!isPosBig(n))
        throw new Error("positive bigint expected, got " + n);
    } else
      anumber(n);
    return n;
  }
  function asafenumber(value, title = "") {
    if (!Number.isSafeInteger(value)) {
      const prefix = title && `"${title}" `;
      throw new Error(prefix + "expected safe integer, got type=" + typeof value);
    }
  }
  function numberToHexUnpadded(num2) {
    const hex = abignumber(num2).toString(16);
    return hex.length & 1 ? "0" + hex : hex;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n : BigInt("0x" + hex);
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
  }
  function bytesToNumberLE(bytes) {
    return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
  }
  function numberToBytesBE(n, len) {
    anumber(len);
    n = abignumber(n);
    const res = hexToBytes(n.toString(16).padStart(len * 2, "0"));
    if (res.length !== len)
      throw new Error("number too large");
    return res;
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(abignumber(n)));
  }
  function equalBytes(a, b) {
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  function copyBytes(bytes) {
    return Uint8Array.from(bytes);
  }
  function asciiToBytes(ascii) {
    return Uint8Array.from(ascii, (c, i) => {
      const charCode = c.charCodeAt(0);
      if (c.length !== 1 || charCode > 127) {
        throw new Error(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
      }
      return charCode;
    });
  }
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
      ;
    return len;
  }
  function bitGet(n, pos) {
    return n >> BigInt(pos) & _1n;
  }
  function bitSet(n, pos, value) {
    return n | (value ? _1n : _0n) << BigInt(pos);
  }
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    anumber(hashLen, "hashLen");
    anumber(qByteLen, "qByteLen");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
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
    const h = (...msgs) => hmacFn(k, concatBytes(v, ...msgs));
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
      return concatBytes(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen())))
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  function validateObject(object, fields = {}, optFields = {}) {
    if (!object || typeof object !== "object")
      throw new Error("expected valid options object");
    function checkField(fieldName, expectedType, isOpt) {
      const val = object[fieldName];
      if (isOpt && val === void 0)
        return;
      const current = typeof val;
      if (current !== expectedType || val === null)
        throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
    }
    const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
    iter(fields, false);
    iter(optFields, true);
  }
  function memoized(fn) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map.set(arg, computed);
      return computed;
    };
  }
  var _0n, _1n, isPosBig, bitMask, notImplemented;
  var init_utils2 = __esm({
    "node_modules/@noble/curves/utils.js"() {
      init_utils();
      init_utils();
      _0n = /* @__PURE__ */ BigInt(0);
      _1n = /* @__PURE__ */ BigInt(1);
      isPosBig = (n) => typeof n === "bigint" && _0n <= n;
      bitMask = (n) => (_1n << BigInt(n)) - _1n;
      notImplemented = () => {
        throw new Error("not implemented");
      };
    }
  });

  // node_modules/@noble/curves/abstract/modular.js
  function mod(a, b) {
    const result = a % b;
    return result >= _0n2 ? result : b + result;
  }
  function pow2(x, power, modulo) {
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
    if (modulo <= _0n2)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
    while (a !== _0n2) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n2)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function assertIsSquare(Fp, root, n) {
    if (!Fp.eql(Fp.sqr(root), n))
      throw new Error("Cannot find square root");
  }
  function sqrt3mod4(Fp, n) {
    const p1div4 = (Fp.ORDER + _1n2) / _4n;
    const root = Fp.pow(n, p1div4);
    assertIsSquare(Fp, root, n);
    return root;
  }
  function sqrt5mod8(Fp, n) {
    const p5div8 = (Fp.ORDER - _5n) / _8n;
    const n2 = Fp.mul(n, _2n);
    const v = Fp.pow(n2, p5div8);
    const nv = Fp.mul(n, v);
    const i = Fp.mul(Fp.mul(nv, _2n), v);
    const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
    assertIsSquare(Fp, root, n);
    return root;
  }
  function sqrt9mod16(P) {
    const Fp_ = Field(P);
    const tn = tonelliShanks(P);
    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
    const c2 = tn(Fp_, c1);
    const c3 = tn(Fp_, Fp_.neg(c1));
    const c4 = (P + _7n) / _16n;
    return (Fp, n) => {
      let tv1 = Fp.pow(n, c4);
      let tv2 = Fp.mul(tv1, c1);
      const tv3 = Fp.mul(tv1, c2);
      const tv4 = Fp.mul(tv1, c3);
      const e1 = Fp.eql(Fp.sqr(tv2), n);
      const e2 = Fp.eql(Fp.sqr(tv3), n);
      tv1 = Fp.cmov(tv1, tv2, e1);
      tv2 = Fp.cmov(tv4, tv3, e2);
      const e3 = Fp.eql(Fp.sqr(tv2), n);
      const root = Fp.cmov(tv1, tv2, e3);
      assertIsSquare(Fp, root, n);
      return root;
    };
  }
  function tonelliShanks(P) {
    if (P < _3n)
      throw new Error("sqrt is not defined for small field");
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
    return function tonelliSlow(Fp, n) {
      if (Fp.is0(n))
        return n;
      if (FpLegendre(Fp, n) !== 1)
        throw new Error("Cannot find square root");
      let M = S;
      let c = Fp.mul(Fp.ONE, cc);
      let t = Fp.pow(n, Q);
      let R = Fp.pow(n, Q1div2);
      while (!Fp.eql(t, Fp.ONE)) {
        if (Fp.is0(t))
          return Fp.ZERO;
        let i = 1;
        let t_tmp = Fp.sqr(t);
        while (!Fp.eql(t_tmp, Fp.ONE)) {
          i++;
          t_tmp = Fp.sqr(t_tmp);
          if (i === M)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n2 << BigInt(M - i - 1);
        const b = Fp.pow(c, exponent);
        M = i;
        c = Fp.sqr(b);
        t = Fp.mul(t, c);
        R = Fp.mul(R, b);
      }
      return R;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n)
      return sqrt3mod4;
    if (P % _8n === _5n)
      return sqrt5mod8;
    if (P % _16n === _9n)
      return sqrt9mod16(P);
    return tonelliShanks(P);
  }
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      BYTES: "number",
      BITS: "number"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    validateObject(field, opts);
    return field;
  }
  function FpPow(Fp, num2, power) {
    if (power < _0n2)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n2)
      return Fp.ONE;
    if (power === _1n2)
      return num2;
    let p = Fp.ONE;
    let d = num2;
    while (power > _0n2) {
      if (power & _1n2)
        p = Fp.mul(p, d);
      d = Fp.sqr(d);
      power >>= _1n2;
    }
    return p;
  }
  function FpInvertBatch(Fp, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num2, i) => {
      if (Fp.is0(num2))
        return acc;
      inverted[i] = acc;
      return Fp.mul(acc, num2);
    }, Fp.ONE);
    const invertedAcc = Fp.inv(multipliedAcc);
    nums.reduceRight((acc, num2, i) => {
      if (Fp.is0(num2))
        return acc;
      inverted[i] = Fp.mul(acc, inverted[i]);
      return Fp.mul(acc, num2);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp, n) {
    const p1mod2 = (Fp.ORDER - _1n2) / _2n;
    const powered = Fp.pow(n, p1mod2);
    const yes = Fp.eql(powered, Fp.ONE);
    const zero = Fp.eql(powered, Fp.ZERO);
    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber(nBitLength);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, opts = {}) {
    return new _Field(ORDER, opts);
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE = false) {
    abytes(key);
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num2 = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num2, fieldOrder - _1n2) + _1n2;
    return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }
  var _0n2, _1n2, _2n, _3n, _4n, _5n, _7n, _8n, _9n, _16n, FIELD_FIELDS, _Field;
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
      _16n = /* @__PURE__ */ BigInt(16);
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
      _Field = class {
        ORDER;
        BITS;
        BYTES;
        isLE;
        ZERO = _0n2;
        ONE = _1n2;
        _lengths;
        _sqrt;
        // cached sqrt
        _mod;
        constructor(ORDER, opts = {}) {
          if (ORDER <= _0n2)
            throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
          let _nbitLength = void 0;
          this.isLE = false;
          if (opts != null && typeof opts === "object") {
            if (typeof opts.BITS === "number")
              _nbitLength = opts.BITS;
            if (typeof opts.sqrt === "function")
              this.sqrt = opts.sqrt;
            if (typeof opts.isLE === "boolean")
              this.isLE = opts.isLE;
            if (opts.allowedLengths)
              this._lengths = opts.allowedLengths?.slice();
            if (typeof opts.modFromBytes === "boolean")
              this._mod = opts.modFromBytes;
          }
          const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
          if (nByteLength > 2048)
            throw new Error("invalid field: expected ORDER of <= 2048 bytes");
          this.ORDER = ORDER;
          this.BITS = nBitLength;
          this.BYTES = nByteLength;
          this._sqrt = void 0;
          Object.preventExtensions(this);
        }
        create(num2) {
          return mod(num2, this.ORDER);
        }
        isValid(num2) {
          if (typeof num2 !== "bigint")
            throw new Error("invalid field element: expected bigint, got " + typeof num2);
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
          return FpPow(this, num2, power);
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
          if (!this._sqrt)
            this._sqrt = FpSqrt(this.ORDER);
          return this._sqrt(this, num2);
        }
        toBytes(num2) {
          return this.isLE ? numberToBytesLE(num2, this.BYTES) : numberToBytesBE(num2, this.BYTES);
        }
        fromBytes(bytes, skipValidation = false) {
          abytes(bytes);
          const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
          if (allowedLengths) {
            if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
              throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
            }
            const padded = new Uint8Array(BYTES);
            padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
            bytes = padded;
          }
          if (bytes.length !== BYTES)
            throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
          let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
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
          return FpInvertBatch(this, lst);
        }
        // We can't move this out because Fp6, Fp12 implement it
        // and it's unclear what to return in there.
        cmov(a, b, condition) {
          return condition ? b : a;
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/curve.js
  function negateCt(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function normalizeZ(c, points) {
    const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
    return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
  }
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1;
    const windowSize = 2 ** (W - 1);
    const maxNumber = 2 ** W;
    const mask = bitMask(W);
    const shiftBy = BigInt(W);
    return { windows, windowSize, mask, maxNumber, shiftBy };
  }
  function calcOffsets(n, window2, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask);
    let nextN = n >> shiftBy;
    if (wbits > windowSize) {
      wbits -= maxNumber;
      nextN += _1n3;
    }
    const offsetStart = window2 * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1;
    const isZero = wbits === 0;
    const isNeg = wbits < 0;
    const isNegF = window2 % 2 !== 0;
    const offsetF = offsetStart;
    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
  }
  function getW(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function assert0(n) {
    if (n !== _0n3)
      throw new Error("invalid wNAF");
  }
  function mulEndoUnsafe(Point, point, k1, k2) {
    let acc = point;
    let p1 = Point.ZERO;
    let p2 = Point.ZERO;
    while (k1 > _0n3 || k2 > _0n3) {
      if (k1 & _1n3)
        p1 = p1.add(acc);
      if (k2 & _1n3)
        p2 = p2.add(acc);
      acc = acc.double();
      k1 >>= _1n3;
      k2 >>= _1n3;
    }
    return { p1, p2 };
  }
  function createField(order, field, isLE) {
    if (field) {
      if (field.ORDER !== order)
        throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      validateField(field);
      return field;
    } else {
      return Field(order, { isLE });
    }
  }
  function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
    if (FpFnLE === void 0)
      FpFnLE = type === "edwards";
    if (!CURVE || typeof CURVE !== "object")
      throw new Error(`expected valid ${type} CURVE object`);
    for (const p of ["p", "n", "h"]) {
      const val = CURVE[p];
      if (!(typeof val === "bigint" && val > _0n3))
        throw new Error(`CURVE.${p} must be positive bigint`);
    }
    const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
    const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
    const _b = type === "weierstrass" ? "b" : "d";
    const params = ["Gx", "Gy", "a", _b];
    for (const p of params) {
      if (!Fp.isValid(CURVE[p]))
        throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
    }
    CURVE = Object.freeze(Object.assign({}, CURVE));
    return { CURVE, Fp, Fn };
  }
  function createKeygen(randomSecretKey, getPublicKey) {
    return function keygen(seed) {
      const secretKey = randomSecretKey(seed);
      return { secretKey, publicKey: getPublicKey(secretKey) };
    };
  }
  var _0n3, _1n3, pointPrecomputes, pointWindowSizes, wNAF;
  var init_curve = __esm({
    "node_modules/@noble/curves/abstract/curve.js"() {
      init_utils2();
      init_modular();
      _0n3 = /* @__PURE__ */ BigInt(0);
      _1n3 = /* @__PURE__ */ BigInt(1);
      pointPrecomputes = /* @__PURE__ */ new WeakMap();
      pointWindowSizes = /* @__PURE__ */ new WeakMap();
      wNAF = class {
        BASE;
        ZERO;
        Fn;
        bits;
        // Parametrized with a given Point class (not individual point)
        constructor(Point, bits) {
          this.BASE = Point.BASE;
          this.ZERO = Point.ZERO;
          this.Fn = Point.Fn;
          this.bits = bits;
        }
        // non-const time multiplication ladder
        _unsafeLadder(elm, n, p = this.ZERO) {
          let d = elm;
          while (n > _0n3) {
            if (n & _1n3)
              p = p.add(d);
            d = d.double();
            n >>= _1n3;
          }
          return p;
        }
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @param point Point instance
         * @param W window size
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(point, W) {
          const { windows, windowSize } = calcWOpts(W, this.bits);
          const points = [];
          let p = point;
          let base = p;
          for (let window2 = 0; window2 < windows; window2++) {
            base = p;
            points.push(base);
            for (let i = 1; i < windowSize; i++) {
              base = base.add(p);
              points.push(base);
            }
            p = base.double();
          }
          return points;
        }
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * More compact implementation:
         * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
          if (!this.Fn.isValid(n))
            throw new Error("invalid scalar");
          let p = this.ZERO;
          let f = this.BASE;
          const wo = calcWOpts(W, this.bits);
          for (let window2 = 0; window2 < wo.windows; window2++) {
            const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
            n = nextN;
            if (isZero) {
              f = f.add(negateCt(isNegF, precomputes[offsetF]));
            } else {
              p = p.add(negateCt(isNeg, precomputes[offset]));
            }
          }
          assert0(n);
          return { p, f };
        }
        /**
         * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
         * @param acc accumulator point to add result of multiplication
         * @returns point
         */
        wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
          const wo = calcWOpts(W, this.bits);
          for (let window2 = 0; window2 < wo.windows; window2++) {
            if (n === _0n3)
              break;
            const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
            n = nextN;
            if (isZero) {
              continue;
            } else {
              const item = precomputes[offset];
              acc = acc.add(isNeg ? item.negate() : item);
            }
          }
          assert0(n);
          return acc;
        }
        getPrecomputes(W, point, transform) {
          let comp = pointPrecomputes.get(point);
          if (!comp) {
            comp = this.precomputeWindow(point, W);
            if (W !== 1) {
              if (typeof transform === "function")
                comp = transform(comp);
              pointPrecomputes.set(point, comp);
            }
          }
          return comp;
        }
        cached(point, scalar, transform) {
          const W = getW(point);
          return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
        }
        unsafe(point, scalar, transform, prev) {
          const W = getW(point);
          if (W === 1)
            return this._unsafeLadder(point, scalar, prev);
          return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
        }
        // We calculate precomputes for elliptic curve point multiplication
        // using windowed method. This specifies window size and
        // stores precomputed values. Usually only base point would be precomputed.
        createCache(P, W) {
          validateW(W, this.bits);
          pointWindowSizes.set(P, W);
          pointPrecomputes.delete(P);
        }
        hasCache(elm) {
          return getW(elm) !== 1;
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/hash-to-curve.js
  function i2osp(value, length) {
    asafenumber(value);
    asafenumber(length);
    if (value < 0 || value >= 1 << 8 * length)
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
    if (!isBytes(DST) && typeof DST !== "string")
      throw new Error("DST must be Uint8Array or ascii string");
    return typeof DST === "string" ? asciiToBytes(DST) : DST;
  }
  function expand_message_xmd(msg, DST, lenInBytes, H) {
    abytes(msg);
    asafenumber(lenInBytes);
    DST = normDST(DST);
    if (DST.length > 255)
      DST = H(concatBytes(asciiToBytes("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b = new Array(ell);
    const b_0 = H(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H(concatBytes(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
      const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
      b[i] = H(concatBytes(...args));
    }
    const pseudo_random_bytes = concatBytes(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k, H) {
    abytes(msg);
    asafenumber(lenInBytes);
    DST = normDST(DST);
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k / 8);
      DST = H.create({ dkLen }).update(asciiToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
      throw new Error("expand_message_xof: invalid lenInBytes");
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
    abytes(msg);
    asafenumber(count);
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
    const coeff = map.map((i) => Array.from(i).reverse());
    return (x, y) => {
      const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
      const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
      x = field.mul(xn, xd_inv);
      y = field.mul(y, field.mul(yn, yd_inv));
      return { x, y };
    };
  }
  function createHasher2(Point, mapToCurve, defaults) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
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
    return {
      defaults: Object.freeze(defaults),
      Point,
      hashToCurve(msg, options) {
        const opts = Object.assign({}, defaults, options);
        const u = hash_to_field(msg, 2, opts);
        const u0 = map(u[0]);
        const u1 = map(u[1]);
        return clear(u0.add(u1));
      },
      encodeToCurve(msg, options) {
        const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
        const opts = Object.assign({}, defaults, optsDst, options);
        const u = hash_to_field(msg, 1, opts);
        const u0 = map(u[0]);
        return clear(u0);
      },
      /** See {@link H2CHasher} */
      mapToCurve(scalars) {
        if (defaults.m === 1) {
          if (typeof scalars !== "bigint")
            throw new Error("expected bigint (m=1)");
          return clear(map([scalars]));
        }
        if (!Array.isArray(scalars))
          throw new Error("expected array of bigints");
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error("expected array of bigints");
        return clear(map(scalars));
      },
      // hash_to_scalar can produce 0: https://www.rfc-editor.org/errata/eid8393
      // RFC 9380, draft-irtf-cfrg-bbs-signatures-08
      hashToScalar(msg, options) {
        const N = Point.Fn.ORDER;
        const opts = Object.assign({}, defaults, { p: N, m: 1, DST: _DST_scalar }, options);
        return hash_to_field(msg, 1, opts)[0][0];
      }
    };
  }
  var os2ip, _DST_scalar;
  var init_hash_to_curve = __esm({
    "node_modules/@noble/curves/abstract/hash-to-curve.js"() {
      init_utils2();
      init_modular();
      os2ip = bytesToNumberBE;
      _DST_scalar = asciiToBytes("HashToScalar-");
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
        finished = false;
        destroyed = false;
        constructor(hash, key) {
          ahash(hash);
          abytes(key, void 0, "key");
          this.iHash = hash.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
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
          abytes(out, this.outputLen, "output");
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to ||= Object.create(Object.getPrototypeOf(this), {});
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
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
      hmac = (hash, key, message) => new _HMAC(hash, key).update(message).digest();
      hmac.create = (hash, key) => new _HMAC(hash, key);
    }
  });

  // node_modules/@noble/curves/abstract/weierstrass.js
  function _splitEndoScalar(k, basis, n) {
    const [[a1, b1], [a2, b2]] = basis;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = k - c1 * a1 - c2 * a2;
    let k2 = -c1 * b1 - c2 * b2;
    const k1neg = k1 < _0n4;
    const k2neg = k2 < _0n4;
    if (k1neg)
      k1 = -k1;
    if (k2neg)
      k2 = -k2;
    const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
    if (k1 < _0n4 || k1 >= MAX_NUM || k2 < _0n4 || k2 >= MAX_NUM) {
      throw new Error("splitScalar (endomorphism): failed, k=" + k);
    }
    return { k1neg, k1, k2neg, k2 };
  }
  function validateSigFormat(format) {
    if (!["compact", "recovered", "der"].includes(format))
      throw new Error('Signature format must be "compact", "recovered", or "der"');
    return format;
  }
  function validateSigOpts(opts, def) {
    const optsn = {};
    for (let optName of Object.keys(def)) {
      optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
    }
    abool(optsn.lowS, "lowS");
    abool(optsn.prehash, "prehash");
    if (optsn.format !== void 0)
      validateSigFormat(optsn.format);
    return optsn;
  }
  function weierstrass(params, extraOpts = {}) {
    const validated = createCurveFields("weierstrass", params, extraOpts);
    const { Fp, Fn } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    validateObject(extraOpts, {}, {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object"
    });
    const { endo } = extraOpts;
    if (endo) {
      if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
        throw new Error('invalid endo: expected "beta": bigint and "basises": array');
      }
    }
    const lengths = getWLengths(Fp, Fn);
    function assertCompressionIsSupported() {
      if (!Fp.isOdd)
        throw new Error("compression is not supported: Field does not have .isOdd()");
    }
    function pointToBytes2(_c, point, isCompressed) {
      const { x, y } = point.toAffine();
      const bx = Fp.toBytes(x);
      abool(isCompressed, "isCompressed");
      if (isCompressed) {
        assertCompressionIsSupported();
        const hasEvenY = !Fp.isOdd(y);
        return concatBytes(pprefix(hasEvenY), bx);
      } else {
        return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
      }
    }
    function pointFromBytes(bytes) {
      abytes(bytes, void 0, "Point");
      const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
      const length = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (length === comp && (head === 2 || head === 3)) {
        const x = Fp.fromBytes(tail);
        if (!Fp.isValid(x))
          throw new Error("bad point: is not on curve, wrong x");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp.sqrt(y2);
        } catch (sqrtError) {
          const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("bad point: is not on curve, sqrt error" + err);
        }
        assertCompressionIsSupported();
        const evenY = Fp.isOdd(y);
        const evenH = (head & 1) === 1;
        if (evenH !== evenY)
          y = Fp.neg(y);
        return { x, y };
      } else if (length === uncomp && head === 4) {
        const L = Fp.BYTES;
        const x = Fp.fromBytes(tail.subarray(0, L));
        const y = Fp.fromBytes(tail.subarray(L, L * 2));
        if (!isValidXY(x, y))
          throw new Error("bad point: is not on curve");
        return { x, y };
      } else {
        throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
      }
    }
    const encodePoint = extraOpts.toBytes || pointToBytes2;
    const decodePoint = extraOpts.fromBytes || pointFromBytes;
    function weierstrassEquation(x) {
      const x2 = Fp.sqr(x);
      const x3 = Fp.mul(x2, x);
      return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
    }
    function isValidXY(x, y) {
      const left = Fp.sqr(y);
      const right = weierstrassEquation(x);
      return Fp.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
    const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
    if (Fp.is0(Fp.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function acoord(title, n, banZero = false) {
      if (!Fp.isValid(n) || banZero && Fp.is0(n))
        throw new Error(`bad point coordinate ${title}`);
      return n;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point))
        throw new Error("Weierstrass Point expected");
    }
    function splitEndoScalarN(k) {
      if (!endo || !endo.basises)
        throw new Error("no endo");
      return _splitEndoScalar(k, endo.basises, Fn.ORDER);
    }
    const toAffineMemo = memoized((p, iz) => {
      const { X, Y, Z } = p;
      if (Fp.eql(Z, Fp.ONE))
        return { x: X, y: Y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(Z);
      const x = Fp.mul(X, iz);
      const y = Fp.mul(Y, iz);
      const zz = Fp.mul(Z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    });
    const assertValidMemo = memoized((p) => {
      if (p.is0()) {
        if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
      k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
      k1p = negateCt(k1neg, k1p);
      k2p = negateCt(k2neg, k2p);
      return k1p.add(k2p);
    }
    class Point {
      // base / generator point
      static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
      // zero / infinity / identity point
      static ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
      // 0, 1, 0
      // math field
      static Fp = Fp;
      // scalar field
      static Fn = Fn;
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
        if (!p || !Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point)
          throw new Error("projective point not allowed");
        if (Fp.is0(x) && Fp.is0(y))
          return Point.ZERO;
        return new Point(x, y, Fp.ONE);
      }
      static fromBytes(bytes) {
        const P = Point.fromAffine(decodePoint(abytes(bytes, void 0, "point")));
        P.assertValidity();
        return P;
      }
      static fromHex(hex) {
        return Point.fromBytes(hexToBytes(hex));
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       *
       * @param windowSize
       * @param isLazy true will defer table computation until the first multiplication
       * @returns
       */
      precompute(windowSize = 8, isLazy = true) {
        wnaf.createCache(this, windowSize);
        if (!isLazy)
          this.multiply(_3n2);
        return this;
      }
      // TODO: return `this`
      /** A point on curve is valid if it conforms to equation. */
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (!Fp.isOdd)
          throw new Error("Field doesn't support isOdd");
        return !Fp.isOdd(y);
      }
      /** Compare one point to another. */
      equals(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
        const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
        return U1 && U2;
      }
      /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
      negate() {
        return new Point(this.X, Fp.neg(this.Y), this.Z);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE;
        const b3 = Fp.mul(b, _3n2);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        let t0 = Fp.mul(X1, X1);
        let t1 = Fp.mul(Y1, Y1);
        let t2 = Fp.mul(Z1, Z1);
        let t3 = Fp.mul(X1, Y1);
        t3 = Fp.add(t3, t3);
        Z3 = Fp.mul(X1, Z1);
        Z3 = Fp.add(Z3, Z3);
        X3 = Fp.mul(a, Z3);
        Y3 = Fp.mul(b3, t2);
        Y3 = Fp.add(X3, Y3);
        X3 = Fp.sub(t1, Y3);
        Y3 = Fp.add(t1, Y3);
        Y3 = Fp.mul(X3, Y3);
        X3 = Fp.mul(t3, X3);
        Z3 = Fp.mul(b3, Z3);
        t2 = Fp.mul(a, t2);
        t3 = Fp.sub(t0, t2);
        t3 = Fp.mul(a, t3);
        t3 = Fp.add(t3, Z3);
        Z3 = Fp.add(t0, t0);
        t0 = Fp.add(Z3, t0);
        t0 = Fp.add(t0, t2);
        t0 = Fp.mul(t0, t3);
        Y3 = Fp.add(Y3, t0);
        t2 = Fp.mul(Y1, Z1);
        t2 = Fp.add(t2, t2);
        t0 = Fp.mul(t2, t3);
        X3 = Fp.sub(X3, t0);
        Z3 = Fp.mul(t2, t1);
        Z3 = Fp.add(Z3, Z3);
        Z3 = Fp.add(Z3, Z3);
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
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        const a = CURVE.a;
        const b3 = Fp.mul(CURVE.b, _3n2);
        let t0 = Fp.mul(X1, X2);
        let t1 = Fp.mul(Y1, Y2);
        let t2 = Fp.mul(Z1, Z2);
        let t3 = Fp.add(X1, Y1);
        let t4 = Fp.add(X2, Y2);
        t3 = Fp.mul(t3, t4);
        t4 = Fp.add(t0, t1);
        t3 = Fp.sub(t3, t4);
        t4 = Fp.add(X1, Z1);
        let t5 = Fp.add(X2, Z2);
        t4 = Fp.mul(t4, t5);
        t5 = Fp.add(t0, t2);
        t4 = Fp.sub(t4, t5);
        t5 = Fp.add(Y1, Z1);
        X3 = Fp.add(Y2, Z2);
        t5 = Fp.mul(t5, X3);
        X3 = Fp.add(t1, t2);
        t5 = Fp.sub(t5, X3);
        Z3 = Fp.mul(a, t4);
        X3 = Fp.mul(b3, t2);
        Z3 = Fp.add(X3, Z3);
        X3 = Fp.sub(t1, Z3);
        Z3 = Fp.add(t1, Z3);
        Y3 = Fp.mul(X3, Z3);
        t1 = Fp.add(t0, t0);
        t1 = Fp.add(t1, t0);
        t2 = Fp.mul(a, t2);
        t4 = Fp.mul(b3, t4);
        t1 = Fp.add(t1, t2);
        t2 = Fp.sub(t0, t2);
        t2 = Fp.mul(a, t2);
        t4 = Fp.add(t4, t2);
        t0 = Fp.mul(t1, t4);
        Y3 = Fp.add(Y3, t0);
        t0 = Fp.mul(t5, t4);
        X3 = Fp.mul(t3, X3);
        X3 = Fp.sub(X3, t0);
        t0 = Fp.mul(t3, t1);
        Z3 = Fp.mul(t5, Z3);
        Z3 = Fp.add(Z3, t0);
        return new Point(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo: endo2 } = extraOpts;
        if (!Fn.isValidNot0(scalar))
          throw new Error("invalid scalar: out of range");
        let point, fake;
        const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
          const { p: k1p, f: k1f } = mul(k1);
          const { p: k2p, f: k2f } = mul(k2);
          fake = k1f.add(k2f);
          point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
        } else {
          const { p, f } = mul(scalar);
          point = p;
          fake = f;
        }
        return normalizeZ(Point, [point, fake])[0];
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed secret key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo: endo2 } = extraOpts;
        const p = this;
        if (!Fn.isValid(sc))
          throw new Error("invalid scalar: out of range");
        if (sc === _0n4 || p.is0())
          return Point.ZERO;
        if (sc === _1n4)
          return p;
        if (wnaf.hasCache(this))
          return this.multiply(sc);
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
          const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
          return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
        } else {
          return wnaf.unsafe(p, sc);
        }
      }
      /**
       * Converts Projective point to affine (x, y) coordinates.
       * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
       */
      toAffine(invertedZ) {
        return toAffineMemo(this, invertedZ);
      }
      /**
       * Checks whether Point is free of torsion elements (is in prime subgroup).
       * Always torsion-free for cofactor=1 curves.
       */
      isTorsionFree() {
        const { isTorsionFree } = extraOpts;
        if (cofactor === _1n4)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point, this);
        return wnaf.unsafe(this, CURVE_ORDER).is0();
      }
      clearCofactor() {
        const { clearCofactor } = extraOpts;
        if (cofactor === _1n4)
          return this;
        if (clearCofactor)
          return clearCofactor(Point, this);
        return this.multiplyUnsafe(cofactor);
      }
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      toBytes(isCompressed = true) {
        abool(isCompressed, "isCompressed");
        this.assertValidity();
        return encodePoint(Point, this, isCompressed);
      }
      toHex(isCompressed = true) {
        return bytesToHex(this.toBytes(isCompressed));
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    }
    const bits = Fn.BITS;
    const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
    Point.BASE.precompute(8);
    return Point;
  }
  function pprefix(hasEvenY) {
    return Uint8Array.of(hasEvenY ? 2 : 3);
  }
  function SWUFpSqrtRatio(Fp, Z) {
    const q = Fp.ORDER;
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
    const c6 = Fp.pow(Z, c2);
    const c7 = Fp.pow(Z, (c2 + _1n4) / _2n2);
    let sqrtRatio = (u, v) => {
      let tv1 = c6;
      let tv2 = Fp.pow(v, c4);
      let tv3 = Fp.sqr(tv2);
      tv3 = Fp.mul(tv3, v);
      let tv5 = Fp.mul(u, tv3);
      tv5 = Fp.pow(tv5, c3);
      tv5 = Fp.mul(tv5, tv2);
      tv2 = Fp.mul(tv5, v);
      tv3 = Fp.mul(tv5, u);
      let tv4 = Fp.mul(tv3, tv2);
      tv5 = Fp.pow(tv4, c5);
      let isQR = Fp.eql(tv5, Fp.ONE);
      tv2 = Fp.mul(tv3, c7);
      tv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, isQR);
      tv4 = Fp.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n4; i--) {
        let tv52 = i - _2n2;
        tv52 = _2n2 << tv52 - _1n4;
        let tvv5 = Fp.pow(tv4, tv52);
        const e1 = Fp.eql(tvv5, Fp.ONE);
        tv2 = Fp.mul(tv3, tv1);
        tv1 = Fp.mul(tv1, tv1);
        tvv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, e1);
        tv4 = Fp.cmov(tvv5, tv4, e1);
      }
      return { isValid: isQR, value: tv3 };
    };
    if (Fp.ORDER % _4n2 === _3n2) {
      const c12 = (Fp.ORDER - _3n2) / _4n2;
      const c22 = Fp.sqrt(Fp.neg(Z));
      sqrtRatio = (u, v) => {
        let tv1 = Fp.sqr(v);
        const tv2 = Fp.mul(u, v);
        tv1 = Fp.mul(tv1, tv2);
        let y1 = Fp.pow(tv1, c12);
        y1 = Fp.mul(y1, tv2);
        const y2 = Fp.mul(y1, c22);
        const tv3 = Fp.mul(Fp.sqr(y1), v);
        const isQR = Fp.eql(tv3, u);
        let y = Fp.cmov(y2, y1, isQR);
        return { isValid: isQR, value: y };
      };
    }
    return sqrtRatio;
  }
  function mapToCurveSimpleSWU(Fp, opts) {
    validateField(Fp);
    const { A, B, Z } = opts;
    if (!Fp.isValid(A) || !Fp.isValid(B) || !Fp.isValid(Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(Fp, Z);
    if (!Fp.isOdd)
      throw new Error("Field does not have .isOdd()");
    return (u) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
      tv1 = Fp.sqr(u);
      tv1 = Fp.mul(tv1, Z);
      tv2 = Fp.sqr(tv1);
      tv2 = Fp.add(tv2, tv1);
      tv3 = Fp.add(tv2, Fp.ONE);
      tv3 = Fp.mul(tv3, B);
      tv4 = Fp.cmov(Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
      tv4 = Fp.mul(tv4, A);
      tv2 = Fp.sqr(tv3);
      tv6 = Fp.sqr(tv4);
      tv5 = Fp.mul(tv6, A);
      tv2 = Fp.add(tv2, tv5);
      tv2 = Fp.mul(tv2, tv3);
      tv6 = Fp.mul(tv6, tv4);
      tv5 = Fp.mul(tv6, B);
      tv2 = Fp.add(tv2, tv5);
      x = Fp.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y = Fp.mul(tv1, u);
      y = Fp.mul(y, value);
      x = Fp.cmov(x, tv3, isValid);
      y = Fp.cmov(y, value, isValid);
      const e1 = Fp.isOdd(u) === Fp.isOdd(y);
      y = Fp.cmov(Fp.neg(y), y, e1);
      const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
      x = Fp.mul(x, tv4_inv);
      return { x, y };
    };
  }
  function getWLengths(Fp, Fn) {
    return {
      secretKey: Fn.BYTES,
      publicKey: 1 + Fp.BYTES,
      publicKeyUncompressed: 1 + 2 * Fp.BYTES,
      publicKeyHasPrefix: true,
      signature: 2 * Fn.BYTES
    };
  }
  function ecdh(Point, ecdhOpts = {}) {
    const { Fn } = Point;
    const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
    const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
    function isValidSecretKey(secretKey) {
      try {
        const num2 = Fn.fromBytes(secretKey);
        return Fn.isValidNot0(num2);
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
        return !!Point.fromBytes(publicKey);
      } catch (error) {
        return false;
      }
    }
    function randomSecretKey(seed = randomBytes_(lengths.seed)) {
      return mapHashToField(abytes(seed, lengths.seed, "seed"), Fn.ORDER);
    }
    function getPublicKey(secretKey, isCompressed = true) {
      return Point.BASE.multiply(Fn.fromBytes(secretKey)).toBytes(isCompressed);
    }
    function isProbPub(item) {
      const { secretKey, publicKey, publicKeyUncompressed } = lengths;
      if (!isBytes(item))
        return void 0;
      if ("_lengths" in Fn && Fn._lengths || secretKey === publicKey)
        return void 0;
      const l = abytes(item, void 0, "key").length;
      return l === publicKey || l === publicKeyUncompressed;
    }
    function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
      if (isProbPub(secretKeyA) === true)
        throw new Error("first arg must be private key");
      if (isProbPub(publicKeyB) === false)
        throw new Error("second arg must be public key");
      const s = Fn.fromBytes(secretKeyA);
      const b = Point.fromBytes(publicKeyB);
      return b.multiply(s).toBytes(isCompressed);
    }
    const utils = {
      isValidSecretKey,
      isValidPublicKey,
      randomSecretKey
    };
    const keygen = createKeygen(randomSecretKey, getPublicKey);
    return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
  }
  function ecdsa(Point, hash, ecdsaOpts = {}) {
    ahash(hash);
    validateObject(ecdsaOpts, {}, {
      hmac: "function",
      lowS: "boolean",
      randomBytes: "function",
      bits2int: "function",
      bits2int_modN: "function"
    });
    ecdsaOpts = Object.assign({}, ecdsaOpts);
    const randomBytes2 = ecdsaOpts.randomBytes || randomBytes;
    const hmac2 = ecdsaOpts.hmac || ((key, msg) => hmac(hash, key, msg));
    const { Fp, Fn } = Point;
    const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
    const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
    const defaultSigOpts = {
      prehash: true,
      lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : true,
      format: "compact",
      extraEntropy: false
    };
    const hasLargeCofactor = CURVE_ORDER * _2n2 < Fp.ORDER;
    function isBiggerThanHalfOrder(number) {
      const HALF = CURVE_ORDER >> _1n4;
      return number > HALF;
    }
    function validateRS(title, num2) {
      if (!Fn.isValidNot0(num2))
        throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
      return num2;
    }
    function assertSmallCofactor() {
      if (hasLargeCofactor)
        throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
    }
    function validateSigLength(bytes, format) {
      validateSigFormat(format);
      const size = lengths.signature;
      const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
      return abytes(bytes, sizer);
    }
    class Signature {
      r;
      s;
      recovery;
      constructor(r, s, recovery) {
        this.r = validateRS("r", r);
        this.s = validateRS("s", s);
        if (recovery != null) {
          assertSmallCofactor();
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
          const { r: r2, s: s2 } = DER.toSig(abytes(bytes));
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
        return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
      }
      static fromHex(hex, format) {
        return this.fromBytes(hexToBytes(hex), format);
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
      recoverPublicKey(messageHash) {
        const { r, s } = this;
        const recovery = this.assertRecovery();
        const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
        if (!Fp.isValid(radj))
          throw new Error("invalid recovery id: sig.r+curve.n != R.x");
        const x = Fp.toBytes(radj);
        const R = Point.fromBytes(concatBytes(pprefix((recovery & 1) === 0), x));
        const ir = Fn.inv(radj);
        const h = bits2int_modN(abytes(messageHash, void 0, "msgHash"));
        const u1 = Fn.create(-h * ir);
        const u2 = Fn.create(s * ir);
        const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
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
          return hexToBytes(DER.hexFromSig(this));
        const { r, s } = this;
        const rb = Fn.toBytes(r);
        const sb = Fn.toBytes(s);
        if (format === "recovered") {
          assertSmallCofactor();
          return concatBytes(Uint8Array.of(this.assertRecovery()), rb, sb);
        }
        return concatBytes(rb, sb);
      }
      toHex(format) {
        return bytesToHex(this.toBytes(format));
      }
    }
    const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num2 = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - fnBits;
      return delta > 0 ? num2 >> BigInt(delta) : num2;
    };
    const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
      return Fn.create(bits2int(bytes));
    };
    const ORDER_MASK = bitMask(fnBits);
    function int2octets(num2) {
      aInRange("num < 2^" + fnBits, num2, _0n4, ORDER_MASK);
      return Fn.toBytes(num2);
    }
    function validateMsgAndHash(message, prehash) {
      abytes(message, void 0, "message");
      return prehash ? abytes(hash(message), void 0, "prehashed message") : message;
    }
    function prepSig(message, secretKey, opts) {
      const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
      message = validateMsgAndHash(message, prehash);
      const h1int = bits2int_modN(message);
      const d = Fn.fromBytes(secretKey);
      if (!Fn.isValidNot0(d))
        throw new Error("invalid private key");
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (extraEntropy != null && extraEntropy !== false) {
        const e = extraEntropy === true ? randomBytes2(lengths.secretKey) : extraEntropy;
        seedArgs.push(abytes(e, void 0, "extraEntropy"));
      }
      const seed = concatBytes(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int(kBytes);
        if (!Fn.isValidNot0(k))
          return;
        const ik = Fn.inv(k);
        const q = Point.BASE.multiply(k).toAffine();
        const r = Fn.create(q.x);
        if (r === _0n4)
          return;
        const s = Fn.create(ik * Fn.create(m + r * d));
        if (s === _0n4)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = Fn.neg(s);
          recovery ^= 1;
        }
        return new Signature(r, normS, hasLargeCofactor ? void 0 : recovery);
      }
      return { seed, k2sig };
    }
    function sign(message, secretKey, opts = {}) {
      const { seed, k2sig } = prepSig(message, secretKey, opts);
      const drbg = createHmacDrbg(hash.outputLen, Fn.BYTES, hmac2);
      const sig = drbg(seed, k2sig);
      return sig.toBytes(opts.format);
    }
    function verify(signature, message, publicKey, opts = {}) {
      const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
      publicKey = abytes(publicKey, void 0, "publicKey");
      message = validateMsgAndHash(message, prehash);
      if (!isBytes(signature)) {
        const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
        throw new Error("verify expects Uint8Array signature" + end);
      }
      validateSigLength(signature, format);
      try {
        const sig = Signature.fromBytes(signature, format);
        const P = Point.fromBytes(publicKey);
        if (lowS && sig.hasHighS())
          return false;
        const { r, s } = sig;
        const h = bits2int_modN(message);
        const is = Fn.inv(s);
        const u1 = Fn.create(h * is);
        const u2 = Fn.create(r * is);
        const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
        if (R.is0())
          return false;
        const v = Fn.create(R.x);
        return v === r;
      } catch (e) {
        return false;
      }
    }
    function recoverPublicKey(signature, message, opts = {}) {
      const { prehash } = validateSigOpts(opts, defaultSigOpts);
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
      hash
    });
  }
  var divNearest, DERErr, DER, _0n4, _1n4, _2n2, _3n2, _4n2;
  var init_weierstrass = __esm({
    "node_modules/@noble/curves/abstract/weierstrass.js"() {
      init_hmac();
      init_utils();
      init_utils2();
      init_curve();
      init_modular();
      divNearest = (num2, den) => (num2 + (num2 >= 0 ? den : -den) / _2n2) / den;
      DERErr = class extends Error {
        constructor(m = "") {
          super(m);
        }
      };
      DER = {
        // asn.1 DER encoding utils
        Err: DERErr,
        // Basic building block is TLV (Tag-Length-Value)
        _tlv: {
          encode: (tag, data) => {
            const { Err: E } = DER;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
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
            const { Err: E } = DER;
            let pos = 0;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
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
            const { Err: E } = DER;
            if (num2 < _0n4)
              throw new E("integer: negative integers are not allowed");
            let hex = numberToHexUnpadded(num2);
            if (Number.parseInt(hex[0], 16) & 8)
              hex = "00" + hex;
            if (hex.length & 1)
              throw new E("unexpected DER parsing assertion: unpadded hex");
            return hex;
          },
          decode(data) {
            const { Err: E } = DER;
            if (data[0] & 128)
              throw new E("invalid signature integer: negative");
            if (data[0] === 0 && !(data[1] & 128))
              throw new E("invalid signature integer: unnecessary leading zero");
            return bytesToNumberBE(data);
          }
        },
        toSig(bytes) {
          const { Err: E, _int: int, _tlv: tlv } = DER;
          const data = abytes(bytes, void 0, "signature");
          const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
          if (seqLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
          const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
          if (sLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          return { r: int.decode(rBytes), s: int.decode(sBytes) };
        },
        hexFromSig(sig) {
          const { _tlv: tlv, _int: int } = DER;
          const rs = tlv.encode(2, int.encode(sig.r));
          const ss = tlv.encode(2, int.encode(sig.s));
          const seq = rs + ss;
          return tlv.encode(48, seq);
        }
      };
      _0n4 = BigInt(0);
      _1n4 = BigInt(1);
      _2n2 = BigInt(2);
      _3n2 = BigInt(3);
      _4n2 = BigInt(4);
    }
  });

  // node_modules/@noble/curves/secp256k1.js
  var secp256k1_exports = {};
  __export(secp256k1_exports, {
    schnorr: () => schnorr,
    secp256k1: () => secp256k1,
    secp256k1_hasher: () => secp256k1_hasher
  });
  function sqrtMod(y) {
    const P = secp256k1_CURVE.p;
    const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n3, P) * b3 % P;
    const b9 = pow2(b6, _3n3, P) * b3 % P;
    const b11 = pow2(b9, _2n3, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b223 = pow2(b220, _3n3, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n3, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  function taggedHash(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = sha256(asciiToBytes(tag));
      tagP = concatBytes(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes(tagP, ...messages));
  }
  function schnorrGetExtPubKey(priv) {
    const { Fn, BASE } = Pointk1;
    const d_ = Fn.fromBytes(priv);
    const p = BASE.multiply(d_);
    const scalar = hasEven(p.y) ? d_ : Fn.neg(d_);
    return { scalar, bytes: pointToBytes(p) };
  }
  function lift_x(x) {
    const Fp = Fpk1;
    if (!Fp.isValidNot0(x))
      throw new Error("invalid x: Fail if x \u2265 p");
    const xx = Fp.create(x * x);
    const c = Fp.create(xx * x + BigInt(7));
    let y = Fp.sqrt(c);
    if (!hasEven(y))
      y = Fp.neg(y);
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
    const { Fn } = Pointk1;
    const m = abytes(message, void 0, "message");
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
    const a = abytes(auxRand, 32, "auxRand");
    const t = Fn.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
    const rand = taggedHash("BIP0340/nonce", t, px, m);
    const { bytes: rx, scalar: k } = schnorrGetExtPubKey(rand);
    const e = challenge(rx, px, m);
    const sig = new Uint8Array(64);
    sig.set(rx, 0);
    sig.set(Fn.toBytes(Fn.create(k + e * d)), 32);
    if (!schnorrVerify(sig, m, px))
      throw new Error("sign: Invalid signature produced");
    return sig;
  }
  function schnorrVerify(signature, message, publicKey) {
    const { Fp, Fn, BASE } = Pointk1;
    const sig = abytes(signature, 64, "signature");
    const m = abytes(message, void 0, "message");
    const pub = abytes(publicKey, 32, "publicKey");
    try {
      const P = lift_x(num(pub));
      const r = num(sig.subarray(0, 32));
      if (!Fp.isValidNot0(r))
        return false;
      const s = num(sig.subarray(32, 64));
      if (!Fn.isValidNot0(s))
        return false;
      const e = challenge(Fn.toBytes(r), pointToBytes(P), m);
      const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn.neg(e)));
      const { x, y } = R.toAffine();
      if (R.is0() || !hasEven(y) || x !== r)
        return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  var secp256k1_CURVE, secp256k1_ENDO, _0n5, _2n3, Fpk1, Pointk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes, hasEven, num, schnorr, isoMap, mapSWU, secp256k1_hasher;
  var init_secp256k1 = __esm({
    "node_modules/@noble/curves/secp256k1.js"() {
      init_sha2();
      init_utils();
      init_curve();
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
      _0n5 = /* @__PURE__ */ BigInt(0);
      _2n3 = /* @__PURE__ */ BigInt(2);
      Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
      Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
        Fp: Fpk1,
        endo: secp256k1_ENDO
      });
      secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
      TAGGED_HASH_PREFIXES = {};
      pointToBytes = (point) => point.toBytes(true).slice(1);
      hasEven = (y) => y % _2n3 === _0n5;
      num = bytesToNumberBE;
      schnorr = /* @__PURE__ */ (() => {
        const size = 32;
        const seedLength = 48;
        const randomSecretKey = (seed = randomBytes(seedLength)) => {
          return mapHashToField(seed, secp256k1_CURVE.n);
        };
        return {
          keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
          getPublicKey: schnorrGetPublicKey,
          sign: schnorrSign,
          verify: schnorrVerify,
          Point: Pointk1,
          utils: {
            randomSecretKey,
            taggedHash,
            lift_x,
            pointToBytes
          },
          lengths: {
            secretKey: size,
            publicKey: size,
            publicKeyHasPrefix: false,
            signature: size * 2,
            seed: seedLength
          }
        };
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
      mapSWU = /* @__PURE__ */ (() => mapToCurveSimpleSWU(Fpk1, {
        A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
        B: BigInt("1771"),
        Z: Fpk1.create(BigInt("-11"))
      }))();
      secp256k1_hasher = /* @__PURE__ */ (() => createHasher2(Pointk1, (scalars) => {
        const { x, y } = mapSWU(Fpk1.create(scalars[0]));
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
    }
  });

  // node_modules/@toruslabs/eccrypto/dist/lib.cjs/index.js
  var require_lib3 = __commonJS({
    "node_modules/@toruslabs/eccrypto/dist/lib.cjs/index.js"(exports) {
      "use strict";
      var secp256k1_js = (init_secp256k1(), __toCommonJS(secp256k1_exports));
      var utils_js = (init_utils2(), __toCommonJS(utils_exports));
      var browserCrypto = globalThis.crypto || globalThis.msCrypto || {};
      var subtle = browserCrypto.subtle || browserCrypto.webkitSubtle;
      var SECP256K1_GROUP_ORDER = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
      function assert(condition, message) {
        if (!condition) {
          throw new Error(message || "Assertion failed");
        }
      }
      function isValidPrivateKey(privateKey) {
        if (privateKey.length !== 32) {
          return false;
        }
        const privateKeyBigInt = utils_js.bytesToNumberBE(privateKey);
        return privateKeyBigInt > 0n && // > 0
        privateKeyBigInt < SECP256K1_GROUP_ORDER;
      }
      function randomBytes2(size) {
        if (typeof browserCrypto.getRandomValues === "undefined") {
          return browserCrypto.randomBytes(size);
        }
        const arr = new Uint8Array(size);
        browserCrypto.getRandomValues(arr);
        return arr;
      }
      async function sha512(msg) {
        if (!browserCrypto.createHash) {
          const hash2 = await subtle.digest("SHA-512", msg);
          const result2 = new Uint8Array(hash2);
          return result2;
        }
        const hash = browserCrypto.createHash("sha512");
        const result = hash.update(msg).digest();
        return new Uint8Array(result);
      }
      function getAes(op) {
        return async function(iv, key, data) {
          if (subtle && subtle[op] && subtle.importKey) {
            const importAlgorithm = {
              name: "AES-CBC"
            };
            const cryptoKey = await subtle.importKey("raw", key, importAlgorithm, false, [op]);
            const encAlgorithm = {
              name: "AES-CBC",
              iv
            };
            const result = await subtle[op](encAlgorithm, cryptoKey, data);
            return new Uint8Array(result);
          } else if (op === "encrypt" && browserCrypto.createCipheriv) {
            const cipher = browserCrypto.createCipheriv("aes-256-cbc", key, iv);
            const firstChunk = cipher.update(data);
            const secondChunk = cipher.final();
            return utils_js.concatBytes(firstChunk, secondChunk);
          } else if (op === "decrypt" && browserCrypto.createDecipheriv) {
            const decipher = browserCrypto.createDecipheriv("aes-256-cbc", key, iv);
            const firstChunk = decipher.update(data);
            const secondChunk = decipher.final();
            return utils_js.concatBytes(firstChunk, secondChunk);
          }
          throw new Error(`Unsupported operation: ${op}`);
        };
      }
      var aesCbcEncrypt = getAes("encrypt");
      var aesCbcDecrypt = getAes("decrypt");
      async function hmacSha256Sign(key, msg) {
        if (!browserCrypto.createHmac) {
          const importAlgorithm = {
            name: "HMAC",
            hash: {
              name: "SHA-256"
            }
          };
          const cryptoKey = await subtle.importKey("raw", key, importAlgorithm, false, ["sign", "verify"]);
          const sig = await subtle.sign("HMAC", cryptoKey, msg);
          const result2 = new Uint8Array(sig);
          return result2;
        }
        const hmac2 = browserCrypto.createHmac("sha256", key);
        hmac2.update(msg);
        const result = hmac2.digest();
        return result;
      }
      async function hmacSha256Verify(key, msg, sig) {
        const expectedSig = await hmacSha256Sign(key, msg);
        return utils_js.equalBytes(expectedSig, sig);
      }
      function assertValidPrivateKey(privateKey) {
        assert(isValidPrivateKey(privateKey), "Bad private key");
      }
      function assertValidPublicKey(publicKey) {
        const isValid = secp256k1_js.secp256k1.utils.isValidPublicKey(publicKey, true) || secp256k1_js.secp256k1.utils.isValidPublicKey(publicKey, false);
        assert(isValid, "Bad public key");
      }
      function assertValidMessage(msg) {
        assert(msg.length > 0, "Message should not be empty");
        assert(msg.length <= 32, "Message is too long");
      }
      var generatePrivate = function() {
        let privateKey = randomBytes2(32);
        while (!isValidPrivateKey(privateKey)) {
          privateKey = randomBytes2(32);
        }
        return privateKey;
      };
      var getPublic = function(privateKey) {
        assertValidPrivateKey(privateKey);
        return secp256k1_js.secp256k1.getPublicKey(privateKey, false);
      };
      var getPublicCompressed = function(privateKey) {
        assertValidPrivateKey(privateKey);
        return secp256k1_js.secp256k1.getPublicKey(privateKey);
      };
      var sign = async function(privateKey, msg) {
        assertValidPrivateKey(privateKey);
        assertValidMessage(msg);
        const sig = secp256k1_js.secp256k1.sign(msg, privateKey, {
          prehash: false,
          format: "der"
        });
        return sig;
      };
      var verify = async function(publicKey, msg, sig) {
        assertValidPublicKey(publicKey);
        assertValidMessage(msg);
        if (secp256k1_js.secp256k1.verify(sig, msg, publicKey, {
          prehash: false,
          format: "der"
        })) return null;
        throw new Error("Bad signature");
      };
      var derive = async function(privateKeyA, publicKeyB) {
        assertValidPrivateKey(privateKeyA);
        assertValidPublicKey(publicKeyB);
        const sharedSecret = secp256k1_js.secp256k1.getSharedSecret(privateKeyA, publicKeyB);
        const Px = sharedSecret.subarray(1);
        const i = Px.findIndex((byte) => byte !== 0);
        return Px.subarray(i);
      };
      var deriveUnpadded = derive;
      var derivePadded = async function(privateKeyA, publicKeyB) {
        assertValidPrivateKey(privateKeyA);
        assertValidPublicKey(publicKeyB);
        const sharedSecret = secp256k1_js.secp256k1.getSharedSecret(privateKeyA, publicKeyB);
        return sharedSecret.subarray(1);
      };
      var encrypt = async function(publicKeyTo, msg, opts) {
        var _opts$padding;
        opts = opts || {};
        const padding = (_opts$padding = opts.padding) !== null && _opts$padding !== void 0 ? _opts$padding : true;
        let ephemPrivateKey = opts.ephemPrivateKey || randomBytes2(32);
        while (!isValidPrivateKey(ephemPrivateKey)) {
          ephemPrivateKey = opts.ephemPrivateKey || randomBytes2(32);
        }
        const ephemPublicKey = getPublic(ephemPrivateKey);
        const deriveLocal = padding ? derivePadded : deriveUnpadded;
        const Px = await deriveLocal(ephemPrivateKey, publicKeyTo);
        const hash = await sha512(Px);
        const iv = opts.iv || randomBytes2(16);
        const encryptionKey = hash.slice(0, 32);
        const macKey = hash.slice(32);
        const ciphertext = await aesCbcEncrypt(iv, encryptionKey, msg);
        const dataToMac = utils_js.concatBytes(iv, ephemPublicKey, ciphertext);
        const mac = await hmacSha256Sign(macKey, dataToMac);
        return {
          iv,
          ephemPublicKey,
          ciphertext,
          mac
        };
      };
      var decrypt = async function(privateKey, opts, _padding) {
        const padding = _padding !== null && _padding !== void 0 ? _padding : false;
        const deriveLocal = padding ? derivePadded : deriveUnpadded;
        const Px = await deriveLocal(privateKey, opts.ephemPublicKey);
        const hash = await sha512(Px);
        const encryptionKey = hash.slice(0, 32);
        const macKey = hash.slice(32);
        const dataToMac = utils_js.concatBytes(opts.iv, opts.ephemPublicKey, opts.ciphertext);
        const macGood = await hmacSha256Verify(macKey, dataToMac, opts.mac);
        if (!macGood && padding === false) {
          return decrypt(privateKey, opts, true);
        } else if (!macGood && padding === true) {
          throw new Error("bad MAC after trying padded");
        }
        const msg = await aesCbcDecrypt(opts.iv, encryptionKey, opts.ciphertext);
        return msg;
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

  // node_modules/ethereum-cryptography/node_modules/@noble/hashes/_u64.js
  var require_u64 = __commonJS({
    "node_modules/ethereum-cryptography/node_modules/@noble/hashes/_u64.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
      exports.add = add;
      exports.fromBig = fromBig;
      exports.split = split;
      var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
      var _32n = /* @__PURE__ */ BigInt(32);
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
      var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
      exports.toBig = toBig;
      var shrSH = (h, _l, s) => h >>> s;
      exports.shrSH = shrSH;
      var shrSL = (h, l, s) => h << 32 - s | l >>> s;
      exports.shrSL = shrSL;
      var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
      exports.rotrSH = rotrSH;
      var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
      exports.rotrSL = rotrSL;
      var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
      exports.rotrBH = rotrBH;
      var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
      exports.rotrBL = rotrBL;
      var rotr32H = (_h, l) => l;
      exports.rotr32H = rotr32H;
      var rotr32L = (h, _l) => h;
      exports.rotr32L = rotr32L;
      var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
      exports.rotlSH = rotlSH;
      var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
      exports.rotlSL = rotlSL;
      var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
      exports.rotlBH = rotlBH;
      var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
      exports.rotlBL = rotlBL;
      function add(Ah, Al, Bh, Bl) {
        const l = (Al >>> 0) + (Bl >>> 0);
        return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
      }
      var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
      exports.add3L = add3L;
      var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
      exports.add3H = add3H;
      var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
      exports.add4L = add4L;
      var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
      exports.add4H = add4H;
      var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
      exports.add5L = add5L;
      var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
      exports.add5H = add5H;
      var u64 = {
        fromBig,
        split,
        toBig,
        shrSH,
        shrSL,
        rotrSH,
        rotrSL,
        rotrBH,
        rotrBL,
        rotr32H,
        rotr32L,
        rotlSH,
        rotlSL,
        rotlBH,
        rotlBL,
        add,
        add3L,
        add3H,
        add4L,
        add4H,
        add5H,
        add5L
      };
      exports.default = u64;
    }
  });

  // node_modules/ethereum-cryptography/node_modules/@noble/hashes/crypto.js
  var require_crypto = __commonJS({
    "node_modules/ethereum-cryptography/node_modules/@noble/hashes/crypto.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.crypto = void 0;
      exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    }
  });

  // node_modules/ethereum-cryptography/node_modules/@noble/hashes/utils.js
  var require_utils = __commonJS({
    "node_modules/ethereum-cryptography/node_modules/@noble/hashes/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
      exports.isBytes = isBytes2;
      exports.anumber = anumber2;
      exports.abytes = abytes2;
      exports.ahash = ahash2;
      exports.aexists = aexists2;
      exports.aoutput = aoutput2;
      exports.u8 = u8;
      exports.u32 = u32;
      exports.clean = clean2;
      exports.createView = createView2;
      exports.rotr = rotr2;
      exports.rotl = rotl;
      exports.byteSwap = byteSwap;
      exports.byteSwap32 = byteSwap32;
      exports.bytesToHex = bytesToHex2;
      exports.hexToBytes = hexToBytes2;
      exports.asyncLoop = asyncLoop;
      exports.utf8ToBytes = utf8ToBytes;
      exports.bytesToUtf8 = bytesToUtf8;
      exports.toBytes = toBytes;
      exports.kdfInputToBytes = kdfInputToBytes;
      exports.concatBytes = concatBytes2;
      exports.checkOpts = checkOpts;
      exports.createHasher = createHasher3;
      exports.createOptHasher = createOptHasher;
      exports.createXOFer = createXOFer;
      exports.randomBytes = randomBytes2;
      var crypto_1 = require_crypto();
      function isBytes2(a) {
        return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
      }
      function anumber2(n) {
        if (!Number.isSafeInteger(n) || n < 0)
          throw new Error("positive integer expected, got " + n);
      }
      function abytes2(b, ...lengths) {
        if (!isBytes2(b))
          throw new Error("Uint8Array expected");
        if (lengths.length > 0 && !lengths.includes(b.length))
          throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
      }
      function ahash2(h) {
        if (typeof h !== "function" || typeof h.create !== "function")
          throw new Error("Hash should be wrapped by utils.createHasher");
        anumber2(h.outputLen);
        anumber2(h.blockLen);
      }
      function aexists2(instance, checkFinished = true) {
        if (instance.destroyed)
          throw new Error("Hash instance has been destroyed");
        if (checkFinished && instance.finished)
          throw new Error("Hash#digest() has already been called");
      }
      function aoutput2(out, instance) {
        abytes2(out);
        const min = instance.outputLen;
        if (out.length < min) {
          throw new Error("digestInto() expects output buffer of length at least " + min);
        }
      }
      function u8(arr) {
        return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      function u32(arr) {
        return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
      }
      function clean2(...arrays) {
        for (let i = 0; i < arrays.length; i++) {
          arrays[i].fill(0);
        }
      }
      function createView2(arr) {
        return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
      }
      function rotr2(word, shift) {
        return word << 32 - shift | word >>> shift;
      }
      function rotl(word, shift) {
        return word << shift | word >>> 32 - shift >>> 0;
      }
      exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      function byteSwap(word) {
        return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
      }
      exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
      exports.byteSwapIfBE = exports.swap8IfBE;
      function byteSwap32(arr) {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = byteSwap(arr[i]);
        }
        return arr;
      }
      exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
      var hasHexBuiltin2 = /* @__PURE__ */ (() => (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      var hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex2(bytes) {
        abytes2(bytes);
        if (hasHexBuiltin2)
          return bytes.toHex();
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
          hex += hexes2[bytes[i]];
        }
        return hex;
      }
      var asciis2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      function asciiToBase162(ch) {
        if (ch >= asciis2._0 && ch <= asciis2._9)
          return ch - asciis2._0;
        if (ch >= asciis2.A && ch <= asciis2.F)
          return ch - (asciis2.A - 10);
        if (ch >= asciis2.a && ch <= asciis2.f)
          return ch - (asciis2.a - 10);
        return;
      }
      function hexToBytes2(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        if (hasHexBuiltin2)
          return Uint8Array.fromHex(hex);
        const hl = hex.length;
        const al = hl / 2;
        if (hl % 2)
          throw new Error("hex string expected, got unpadded hex of length " + hl);
        const array = new Uint8Array(al);
        for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
          const n1 = asciiToBase162(hex.charCodeAt(hi));
          const n2 = asciiToBase162(hex.charCodeAt(hi + 1));
          if (n1 === void 0 || n2 === void 0) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
          }
          array[ai] = n1 * 16 + n2;
        }
        return array;
      }
      var nextTick = async () => {
      };
      exports.nextTick = nextTick;
      async function asyncLoop(iters, tick, cb) {
        let ts = Date.now();
        for (let i = 0; i < iters; i++) {
          cb(i);
          const diff = Date.now() - ts;
          if (diff >= 0 && diff < tick)
            continue;
          await (0, exports.nextTick)();
          ts += diff;
        }
      }
      function utf8ToBytes(str) {
        if (typeof str !== "string")
          throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(str));
      }
      function bytesToUtf8(bytes) {
        return new TextDecoder().decode(bytes);
      }
      function toBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        abytes2(data);
        return data;
      }
      function kdfInputToBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        abytes2(data);
        return data;
      }
      function concatBytes2(...arrays) {
        let sum = 0;
        for (let i = 0; i < arrays.length; i++) {
          const a = arrays[i];
          abytes2(a);
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
      function checkOpts(defaults, opts) {
        if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
          throw new Error("options should be object or undefined");
        const merged = Object.assign(defaults, opts);
        return merged;
      }
      var Hash = class {
      };
      exports.Hash = Hash;
      function createHasher3(hashCons) {
        const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
        const tmp = hashCons();
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = () => hashCons();
        return hashC;
      }
      function createOptHasher(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      function createXOFer(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      exports.wrapConstructor = createHasher3;
      exports.wrapConstructorWithOpts = createOptHasher;
      exports.wrapXOFConstructorWithOpts = createXOFer;
      function randomBytes2(bytesLength = 32) {
        if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
          return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
        }
        if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
          return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
        }
        throw new Error("crypto.getRandomValues must be defined");
      }
    }
  });

  // node_modules/ethereum-cryptography/node_modules/@noble/hashes/sha3.js
  var require_sha3 = __commonJS({
    "node_modules/ethereum-cryptography/node_modules/@noble/hashes/sha3.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.shake256 = exports.shake128 = exports.keccak_512 = exports.keccak_384 = exports.keccak_256 = exports.keccak_224 = exports.sha3_512 = exports.sha3_384 = exports.sha3_256 = exports.sha3_224 = exports.Keccak = void 0;
      exports.keccakP = keccakP;
      var _u64_ts_1 = require_u64();
      var utils_ts_1 = require_utils();
      var _0n6 = BigInt(0);
      var _1n5 = BigInt(1);
      var _2n4 = BigInt(2);
      var _7n2 = BigInt(7);
      var _256n = BigInt(256);
      var _0x71n = BigInt(113);
      var SHA3_PI = [];
      var SHA3_ROTL = [];
      var _SHA3_IOTA = [];
      for (let round = 0, R = _1n5, x = 1, y = 0; round < 24; round++) {
        [x, y] = [y, (2 * x + 3 * y) % 5];
        SHA3_PI.push(2 * (5 * y + x));
        SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
        let t = _0n6;
        for (let j = 0; j < 7; j++) {
          R = (R << _1n5 ^ (R >> _7n2) * _0x71n) % _256n;
          if (R & _2n4)
            t ^= _1n5 << (_1n5 << /* @__PURE__ */ BigInt(j)) - _1n5;
        }
        _SHA3_IOTA.push(t);
      }
      var IOTAS = (0, _u64_ts_1.split)(_SHA3_IOTA, true);
      var SHA3_IOTA_H = IOTAS[0];
      var SHA3_IOTA_L = IOTAS[1];
      var rotlH = (h, l, s) => s > 32 ? (0, _u64_ts_1.rotlBH)(h, l, s) : (0, _u64_ts_1.rotlSH)(h, l, s);
      var rotlL = (h, l, s) => s > 32 ? (0, _u64_ts_1.rotlBL)(h, l, s) : (0, _u64_ts_1.rotlSL)(h, l, s);
      function keccakP(s, rounds = 24) {
        const B = new Uint32Array(5 * 2);
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
            for (let x = 0; x < 10; x++)
              B[x] = s[y + x];
            for (let x = 0; x < 10; x++)
              s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
          }
          s[0] ^= SHA3_IOTA_H[round];
          s[1] ^= SHA3_IOTA_L[round];
        }
        (0, utils_ts_1.clean)(B);
      }
      var Keccak = class _Keccak extends utils_ts_1.Hash {
        // NOTE: we accept arguments in bytes instead of bits here.
        constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
          super();
          this.pos = 0;
          this.posOut = 0;
          this.finished = false;
          this.destroyed = false;
          this.enableXOF = false;
          this.blockLen = blockLen;
          this.suffix = suffix;
          this.outputLen = outputLen;
          this.enableXOF = enableXOF;
          this.rounds = rounds;
          (0, utils_ts_1.anumber)(outputLen);
          if (!(0 < blockLen && blockLen < 200))
            throw new Error("only keccak-f1600 function is supported");
          this.state = new Uint8Array(200);
          this.state32 = (0, utils_ts_1.u32)(this.state);
        }
        clone() {
          return this._cloneInto();
        }
        keccak() {
          (0, utils_ts_1.swap32IfBE)(this.state32);
          keccakP(this.state32, this.rounds);
          (0, utils_ts_1.swap32IfBE)(this.state32);
          this.posOut = 0;
          this.pos = 0;
        }
        update(data) {
          (0, utils_ts_1.aexists)(this);
          data = (0, utils_ts_1.toBytes)(data);
          (0, utils_ts_1.abytes)(data);
          const { blockLen, state } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
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
          (0, utils_ts_1.aexists)(this, false);
          (0, utils_ts_1.abytes)(out);
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
            throw new Error("XOF is not possible for this instance");
          return this.writeInto(out);
        }
        xof(bytes) {
          (0, utils_ts_1.anumber)(bytes);
          return this.xofInto(new Uint8Array(bytes));
        }
        digestInto(out) {
          (0, utils_ts_1.aoutput)(out, this);
          if (this.finished)
            throw new Error("digest() was already called");
          this.writeInto(out);
          this.destroy();
          return out;
        }
        digest() {
          return this.digestInto(new Uint8Array(this.outputLen));
        }
        destroy() {
          this.destroyed = true;
          (0, utils_ts_1.clean)(this.state);
        }
        _cloneInto(to) {
          const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
          to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
          to.state32.set(this.state32);
          to.pos = this.pos;
          to.posOut = this.posOut;
          to.finished = this.finished;
          to.rounds = rounds;
          to.suffix = suffix;
          to.outputLen = outputLen;
          to.enableXOF = enableXOF;
          to.destroyed = this.destroyed;
          return to;
        }
      };
      exports.Keccak = Keccak;
      var gen = (suffix, blockLen, outputLen) => (0, utils_ts_1.createHasher)(() => new Keccak(blockLen, suffix, outputLen));
      exports.sha3_224 = (() => gen(6, 144, 224 / 8))();
      exports.sha3_256 = (() => gen(6, 136, 256 / 8))();
      exports.sha3_384 = (() => gen(6, 104, 384 / 8))();
      exports.sha3_512 = (() => gen(6, 72, 512 / 8))();
      exports.keccak_224 = (() => gen(1, 144, 224 / 8))();
      exports.keccak_256 = (() => gen(1, 136, 256 / 8))();
      exports.keccak_384 = (() => gen(1, 104, 384 / 8))();
      exports.keccak_512 = (() => gen(1, 72, 512 / 8))();
      var genShake = (suffix, blockLen, outputLen) => (0, utils_ts_1.createXOFer)((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
      exports.shake128 = (() => genShake(31, 168, 128 / 8))();
      exports.shake256 = (() => genShake(31, 136, 256 / 8))();
    }
  });

  // node_modules/ethereum-cryptography/node_modules/@noble/curves/abstract/utils.js
  var require_utils2 = __commonJS({
    "node_modules/ethereum-cryptography/node_modules/@noble/curves/abstract/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.notImplemented = exports.bitMask = void 0;
      exports.isBytes = isBytes2;
      exports.abytes = abytes2;
      exports.abool = abool2;
      exports.numberToHexUnpadded = numberToHexUnpadded2;
      exports.hexToNumber = hexToNumber2;
      exports.bytesToHex = bytesToHex2;
      exports.hexToBytes = hexToBytes2;
      exports.bytesToNumberBE = bytesToNumberBE2;
      exports.bytesToNumberLE = bytesToNumberLE2;
      exports.numberToBytesBE = numberToBytesBE2;
      exports.numberToBytesLE = numberToBytesLE2;
      exports.numberToVarBytesBE = numberToVarBytesBE2;
      exports.ensureBytes = ensureBytes;
      exports.concatBytes = concatBytes2;
      exports.equalBytes = equalBytes2;
      exports.utf8ToBytes = utf8ToBytes;
      exports.inRange = inRange2;
      exports.aInRange = aInRange2;
      exports.bitLen = bitLen2;
      exports.bitGet = bitGet2;
      exports.bitSet = bitSet2;
      exports.createHmacDrbg = createHmacDrbg2;
      exports.validateObject = validateObject2;
      exports.memoized = memoized2;
      var _0n6 = /* @__PURE__ */ BigInt(0);
      var _1n5 = /* @__PURE__ */ BigInt(1);
      function isBytes2(a) {
        return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
      }
      function abytes2(item) {
        if (!isBytes2(item))
          throw new Error("Uint8Array expected");
      }
      function abool2(title, value) {
        if (typeof value !== "boolean")
          throw new Error(title + " boolean expected, got " + value);
      }
      function numberToHexUnpadded2(num2) {
        const hex = num2.toString(16);
        return hex.length & 1 ? "0" + hex : hex;
      }
      function hexToNumber2(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        return hex === "" ? _0n6 : BigInt("0x" + hex);
      }
      var hasHexBuiltin2 = (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      );
      var hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex2(bytes) {
        abytes2(bytes);
        if (hasHexBuiltin2)
          return bytes.toHex();
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
          hex += hexes2[bytes[i]];
        }
        return hex;
      }
      var asciis2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      function asciiToBase162(ch) {
        if (ch >= asciis2._0 && ch <= asciis2._9)
          return ch - asciis2._0;
        if (ch >= asciis2.A && ch <= asciis2.F)
          return ch - (asciis2.A - 10);
        if (ch >= asciis2.a && ch <= asciis2.f)
          return ch - (asciis2.a - 10);
        return;
      }
      function hexToBytes2(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        if (hasHexBuiltin2)
          return Uint8Array.fromHex(hex);
        const hl = hex.length;
        const al = hl / 2;
        if (hl % 2)
          throw new Error("hex string expected, got unpadded hex of length " + hl);
        const array = new Uint8Array(al);
        for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
          const n1 = asciiToBase162(hex.charCodeAt(hi));
          const n2 = asciiToBase162(hex.charCodeAt(hi + 1));
          if (n1 === void 0 || n2 === void 0) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
          }
          array[ai] = n1 * 16 + n2;
        }
        return array;
      }
      function bytesToNumberBE2(bytes) {
        return hexToNumber2(bytesToHex2(bytes));
      }
      function bytesToNumberLE2(bytes) {
        abytes2(bytes);
        return hexToNumber2(bytesToHex2(Uint8Array.from(bytes).reverse()));
      }
      function numberToBytesBE2(n, len) {
        return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
      }
      function numberToBytesLE2(n, len) {
        return numberToBytesBE2(n, len).reverse();
      }
      function numberToVarBytesBE2(n) {
        return hexToBytes2(numberToHexUnpadded2(n));
      }
      function ensureBytes(title, hex, expectedLength) {
        let res;
        if (typeof hex === "string") {
          try {
            res = hexToBytes2(hex);
          } catch (e) {
            throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
          }
        } else if (isBytes2(hex)) {
          res = Uint8Array.from(hex);
        } else {
          throw new Error(title + " must be hex string or Uint8Array");
        }
        const len = res.length;
        if (typeof expectedLength === "number" && len !== expectedLength)
          throw new Error(title + " of length " + expectedLength + " expected, got " + len);
        return res;
      }
      function concatBytes2(...arrays) {
        let sum = 0;
        for (let i = 0; i < arrays.length; i++) {
          const a = arrays[i];
          abytes2(a);
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
      function equalBytes2(a, b) {
        if (a.length !== b.length)
          return false;
        let diff = 0;
        for (let i = 0; i < a.length; i++)
          diff |= a[i] ^ b[i];
        return diff === 0;
      }
      function utf8ToBytes(str) {
        if (typeof str !== "string")
          throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(str));
      }
      var isPosBig2 = (n) => typeof n === "bigint" && _0n6 <= n;
      function inRange2(n, min, max) {
        return isPosBig2(n) && isPosBig2(min) && isPosBig2(max) && min <= n && n < max;
      }
      function aInRange2(title, n, min, max) {
        if (!inRange2(n, min, max))
          throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
      }
      function bitLen2(n) {
        let len;
        for (len = 0; n > _0n6; n >>= _1n5, len += 1)
          ;
        return len;
      }
      function bitGet2(n, pos) {
        return n >> BigInt(pos) & _1n5;
      }
      function bitSet2(n, pos, value) {
        return n | (value ? _1n5 : _0n6) << BigInt(pos);
      }
      var bitMask2 = (n) => (_1n5 << BigInt(n)) - _1n5;
      exports.bitMask = bitMask2;
      var u8n = (len) => new Uint8Array(len);
      var u8fr = (arr) => Uint8Array.from(arr);
      function createHmacDrbg2(hashLen, qByteLen, hmacFn) {
        if (typeof hashLen !== "number" || hashLen < 2)
          throw new Error("hashLen must be a number");
        if (typeof qByteLen !== "number" || qByteLen < 2)
          throw new Error("qByteLen must be a number");
        if (typeof hmacFn !== "function")
          throw new Error("hmacFn must be a function");
        let v = u8n(hashLen);
        let k = u8n(hashLen);
        let i = 0;
        const reset = () => {
          v.fill(1);
          k.fill(0);
          i = 0;
        };
        const h = (...b) => hmacFn(k, v, ...b);
        const reseed = (seed = u8n(0)) => {
          k = h(u8fr([0]), seed);
          v = h();
          if (seed.length === 0)
            return;
          k = h(u8fr([1]), seed);
          v = h();
        };
        const gen = () => {
          if (i++ >= 1e3)
            throw new Error("drbg: tried 1000 values");
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
          while (!(res = pred(gen())))
            reseed();
          reset();
          return res;
        };
        return genUntil;
      }
      var validatorFns = {
        bigint: (val) => typeof val === "bigint",
        function: (val) => typeof val === "function",
        boolean: (val) => typeof val === "boolean",
        string: (val) => typeof val === "string",
        stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
        isSafeInteger: (val) => Number.isSafeInteger(val),
        array: (val) => Array.isArray(val),
        field: (val, object) => object.Fp.isValid(val),
        hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
      };
      function validateObject2(object, validators, optValidators = {}) {
        const checkField = (fieldName, type, isOptional) => {
          const checkVal = validatorFns[type];
          if (typeof checkVal !== "function")
            throw new Error("invalid validator function");
          const val = object[fieldName];
          if (isOptional && val === void 0)
            return;
          if (!checkVal(val, object)) {
            throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
          }
        };
        for (const [fieldName, type] of Object.entries(validators))
          checkField(fieldName, type, false);
        for (const [fieldName, type] of Object.entries(optValidators))
          checkField(fieldName, type, true);
        return object;
      }
      var notImplemented2 = () => {
        throw new Error("not implemented");
      };
      exports.notImplemented = notImplemented2;
      function memoized2(fn) {
        const map = /* @__PURE__ */ new WeakMap();
        return (arg, ...args) => {
          const val = map.get(arg);
          if (val !== void 0)
            return val;
          const computed = fn(arg, ...args);
          map.set(arg, computed);
          return computed;
        };
      }
    }
  });

  // node_modules/ethereum-cryptography/node_modules/@noble/hashes/_assert.js
  var require_assert = __commonJS({
    "node_modules/ethereum-cryptography/node_modules/@noble/hashes/_assert.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.aoutput = exports.anumber = exports.aexists = exports.abytes = void 0;
      var utils_ts_1 = require_utils();
      exports.abytes = utils_ts_1.abytes;
      exports.aexists = utils_ts_1.aexists;
      exports.anumber = utils_ts_1.anumber;
      exports.aoutput = utils_ts_1.aoutput;
    }
  });

  // node_modules/ethereum-cryptography/utils.js
  var require_utils3 = __commonJS({
    "node_modules/ethereum-cryptography/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.assertBytes = exports.assertBool = exports.utf8ToBytes = exports.toHex = exports.createView = exports.concatBytes = exports.bytesToHex = void 0;
      exports.bytesToUtf8 = bytesToUtf8;
      exports.hexToBytes = hexToBytes2;
      exports.equalsBytes = equalsBytes;
      exports.wrapHash = wrapHash;
      var utils_1 = require_utils2();
      Object.defineProperty(exports, "assertBool", { enumerable: true, get: function() {
        return utils_1.abool;
      } });
      var _assert_1 = require_assert();
      Object.defineProperty(exports, "assertBytes", { enumerable: true, get: function() {
        return _assert_1.abytes;
      } });
      var utils_2 = require_utils();
      var utils_3 = require_utils();
      Object.defineProperty(exports, "bytesToHex", { enumerable: true, get: function() {
        return utils_3.bytesToHex;
      } });
      Object.defineProperty(exports, "concatBytes", { enumerable: true, get: function() {
        return utils_3.concatBytes;
      } });
      Object.defineProperty(exports, "createView", { enumerable: true, get: function() {
        return utils_3.createView;
      } });
      Object.defineProperty(exports, "toHex", { enumerable: true, get: function() {
        return utils_3.bytesToHex;
      } });
      Object.defineProperty(exports, "utf8ToBytes", { enumerable: true, get: function() {
        return utils_3.utf8ToBytes;
      } });
      function bytesToUtf8(data) {
        if (!(data instanceof Uint8Array)) {
          throw new TypeError(`bytesToUtf8 expected Uint8Array, got ${typeof data}`);
        }
        return new TextDecoder().decode(data);
      }
      function hexToBytes2(data) {
        const sliced = data.startsWith("0x") ? data.substring(2) : data;
        return (0, utils_2.hexToBytes)(sliced);
      }
      function equalsBytes(a, b) {
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      }
      function wrapHash(hash) {
        return (msg) => {
          (0, _assert_1.abytes)(msg);
          return hash(msg);
        };
      }
    }
  });

  // node_modules/ethereum-cryptography/keccak.js
  var require_keccak = __commonJS({
    "node_modules/ethereum-cryptography/keccak.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.keccak512 = exports.keccak384 = exports.keccak256 = exports.keccak224 = void 0;
      var sha3_1 = require_sha3();
      var utils_js_1 = require_utils3();
      exports.keccak224 = (0, utils_js_1.wrapHash)(sha3_1.keccak_224);
      exports.keccak256 = (() => {
        const k = (0, utils_js_1.wrapHash)(sha3_1.keccak_256);
        k.create = sha3_1.keccak_256.create;
        return k;
      })();
      exports.keccak384 = (0, utils_js_1.wrapHash)(sha3_1.keccak_384);
      exports.keccak512 = (0, utils_js_1.wrapHash)(sha3_1.keccak_512);
    }
  });

  // node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/utils.js
  var require_utils4 = __commonJS({
    "node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/utils.js"(exports) {
      "use strict";
      var secp256k1_js = (init_secp256k1(), __toCommonJS(secp256k1_exports));
      var utils_js = (init_utils2(), __toCommonJS(utils_exports));
      var keccak = require_keccak();
      function keccak256(data) {
        return keccak.keccak256(data);
      }
      function utf8ToBytes(str) {
        return new TextEncoder().encode(str);
      }
      function bytesToUtf8(bytes) {
        return new TextDecoder().decode(bytes);
      }
      function bytesToBase64(bytes) {
        const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
        return btoa(binString);
      }
      function base64ToBytes(base64) {
        const binString = atob(base64);
        return Uint8Array.from(binString, (ch) => ch.codePointAt(0));
      }
      function toEthereumSignature(recoveredSig) {
        const ethSig = new Uint8Array(65);
        ethSig.set(recoveredSig.slice(1, 65), 0);
        ethSig[64] = recoveredSig[0];
        return ethSig;
      }
      function getPublicKeyCoords(privateKeyHex) {
        const privKeyBytes = utils_js.hexToBytes(privateKeyHex.padStart(64, "0"));
        const pubKeyUncompressed = secp256k1_js.secp256k1.getPublicKey(privKeyBytes, false);
        const x = utils_js.bytesToHex(pubKeyUncompressed.slice(1, 33));
        const y = utils_js.bytesToHex(pubKeyUncompressed.slice(33, 65));
        return {
          x,
          y
        };
      }
      function coordsToPublicKey(x, y) {
        const xBytes = utils_js.hexToBytes(x.padStart(64, "0"));
        const yBytes = utils_js.hexToBytes(y.padStart(64, "0"));
        const pubKey = new Uint8Array(65);
        pubKey[0] = 4;
        pubKey.set(xBytes, 1);
        pubKey.set(yBytes, 33);
        return pubKey;
      }
      Object.defineProperty(exports, "secp256k1", {
        enumerable: true,
        get: function() {
          return secp256k1_js.secp256k1;
        }
      });
      Object.defineProperty(exports, "bytesToHex", {
        enumerable: true,
        get: function() {
          return utils_js.bytesToHex;
        }
      });
      Object.defineProperty(exports, "hexToBytes", {
        enumerable: true,
        get: function() {
          return utils_js.hexToBytes;
        }
      });
      exports.base64ToBytes = base64ToBytes;
      exports.bytesToBase64 = bytesToBase64;
      exports.bytesToUtf8 = bytesToUtf8;
      exports.coordsToPublicKey = coordsToPublicKey;
      exports.getPublicKeyCoords = getPublicKeyCoords;
      exports.keccak256 = keccak256;
      exports.toEthereumSignature = toEthereumSignature;
      exports.utf8ToBytes = utf8ToBytes;
    }
  });

  // node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/base64url.js
  var require_base64url = __commonJS({
    "node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/base64url.js"(exports) {
      "use strict";
      var utils = require_utils4();
      function padString(input) {
        const segmentLength = 4;
        const diff = input.length % segmentLength;
        if (!diff) {
          return input;
        }
        return input + "=".repeat(segmentLength - diff);
      }
      function encodeBase64Url(input) {
        const bytes = typeof input === "string" ? utils.utf8ToBytes(input) : input;
        return fromBase64(utils.bytesToBase64(bytes));
      }
      function decodeBase64Url(base64url) {
        return utils.bytesToUtf8(utils.base64ToBytes(toBase64(base64url)));
      }
      function toBase64(base64url) {
        const urlString = base64url instanceof Uint8Array ? utils.bytesToUtf8(base64url) : base64url;
        return padString(urlString).replace(/-/g, "+").replace(/_/g, "/");
      }
      function fromBase64(base64) {
        return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      function toBufferLike(base64url) {
        return utils.base64ToBytes(toBase64(base64url));
      }
      exports.decodeBase64Url = decodeBase64Url;
      exports.encodeBase64Url = encodeBase64Url;
      exports.fromBase64 = fromBase64;
      exports.toBase64 = toBase64;
      exports.toBufferLike = toBufferLike;
    }
  });

  // node_modules/@babel/runtime/helpers/typeof.js
  var require_typeof = __commonJS({
    "node_modules/@babel/runtime/helpers/typeof.js"(exports, module) {
      function _typeof(o) {
        "@babel/helpers - typeof";
        return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
      }
      module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/toPrimitive.js
  var require_toPrimitive = __commonJS({
    "node_modules/@babel/runtime/helpers/toPrimitive.js"(exports, module) {
      var _typeof = require_typeof()["default"];
      function toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t) return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i)) return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/toPropertyKey.js
  var require_toPropertyKey = __commonJS({
    "node_modules/@babel/runtime/helpers/toPropertyKey.js"(exports, module) {
      var _typeof = require_typeof()["default"];
      var toPrimitive = require_toPrimitive();
      function toPropertyKey(t) {
        var i = toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/defineProperty.js
  var require_defineProperty = __commonJS({
    "node_modules/@babel/runtime/helpers/defineProperty.js"(exports, module) {
      var toPropertyKey = require_toPropertyKey();
      function _defineProperty(e, r, t) {
        return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
          value: t,
          enumerable: true,
          configurable: true,
          writable: true
        }) : e[r] = t, e;
      }
      module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/objectSpread2.js
  var require_objectSpread2 = __commonJS({
    "node_modules/@babel/runtime/helpers/objectSpread2.js"(exports, module) {
      var defineProperty = require_defineProperty();
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread2(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/deepmerge/dist/cjs.js
  var require_cjs = __commonJS({
    "node_modules/deepmerge/dist/cjs.js"(exports, module) {
      "use strict";
      var isMergeableObject = function isMergeableObject2(value) {
        return isNonNullObject(value) && !isSpecial(value);
      };
      function isNonNullObject(value) {
        return !!value && typeof value === "object";
      }
      function isSpecial(value) {
        var stringValue = Object.prototype.toString.call(value);
        return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
      }
      var canUseSymbol = typeof Symbol === "function" && Symbol.for;
      var REACT_ELEMENT_TYPE = canUseSymbol ? /* @__PURE__ */ Symbol.for("react.element") : 60103;
      function isReactElement(value) {
        return value.$$typeof === REACT_ELEMENT_TYPE;
      }
      function emptyTarget(val) {
        return Array.isArray(val) ? [] : {};
      }
      function cloneUnlessOtherwiseSpecified(value, options) {
        return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
      }
      function defaultArrayMerge(target, source, options) {
        return target.concat(source).map(function(element) {
          return cloneUnlessOtherwiseSpecified(element, options);
        });
      }
      function getMergeFunction(key, options) {
        if (!options.customMerge) {
          return deepmerge;
        }
        var customMerge = options.customMerge(key);
        return typeof customMerge === "function" ? customMerge : deepmerge;
      }
      function getEnumerableOwnPropertySymbols(target) {
        return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
          return Object.propertyIsEnumerable.call(target, symbol);
        }) : [];
      }
      function getKeys(target) {
        return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
      }
      function propertyIsOnObject(object, property) {
        try {
          return property in object;
        } catch (_) {
          return false;
        }
      }
      function propertyIsUnsafe(target, key) {
        return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
      }
      function mergeObject(target, source, options) {
        var destination = {};
        if (options.isMergeableObject(target)) {
          getKeys(target).forEach(function(key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
          });
        }
        getKeys(source).forEach(function(key) {
          if (propertyIsUnsafe(target, key)) {
            return;
          }
          if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
          } else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
          }
        });
        return destination;
      }
      function deepmerge(target, source, options) {
        options = options || {};
        options.arrayMerge = options.arrayMerge || defaultArrayMerge;
        options.isMergeableObject = options.isMergeableObject || isMergeableObject;
        options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
        var sourceIsArray = Array.isArray(source);
        var targetIsArray = Array.isArray(target);
        var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
        if (!sourceAndTargetTypesMatch) {
          return cloneUnlessOtherwiseSpecified(source, options);
        } else if (sourceIsArray) {
          return options.arrayMerge(target, source, options);
        } else {
          return mergeObject(target, source, options);
        }
      }
      deepmerge.all = function deepmergeAll(array, options) {
        if (!Array.isArray(array)) {
          throw new Error("first argument should be an array");
        }
        return array.reduce(function(prev, next) {
          return deepmerge(prev, next, options);
        }, {});
      };
      var deepmerge_1 = deepmerge;
      module.exports = deepmerge_1;
    }
  });

  // node_modules/@toruslabs/http-helpers/dist/lib.cjs/index.js
  var require_lib4 = __commonJS({
    "node_modules/@toruslabs/http-helpers/dist/lib.cjs/index.js"(exports) {
      "use strict";
      var _objectSpread = require_objectSpread2();
      var merge = require_cjs();
      var logLevel = require_loglevel();
      var log = logLevel.getLogger("http-helpers");
      log.setLevel(logLevel.levels.INFO);
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
        if (sentry && _url && (tracingOrigins.includes(_url.origin) || tracingPaths.includes(_url.pathname))) {
          const result = await sentry.startSpan({
            name: url,
            op: "http.client"
          }, async () => {
            const response = await fetch(url, init);
            return response;
          });
          return result;
        }
        return fetch(url, init);
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
              reject(new Error(`Timed out in ${ms}ms`));
            }, ms);
          });
          const result = await Promise.race([promise, timeout]);
          if (timeoutFunc != null) {
            clearTimeout(timeoutFunc);
          }
          return result;
        } catch (err) {
          if (timeoutFunc != null) {
            clearTimeout(timeoutFunc);
          }
          throw err;
        }
      };
      var get = async (url, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: {}
        };
        if (customOptions.useAPIKey) {
          defaultOptions.headers = _objectSpread(_objectSpread({}, defaultOptions.headers), getApiKeyHeaders());
        }
        options_.method = "GET";
        const options = merge(defaultOptions, options_);
        const response = await fetchAndTrace(url, options);
        if (response.ok) {
          const responseContentType = response.headers.get("content-type");
          if (responseContentType !== null && responseContentType !== void 0 && responseContentType.includes("application/json")) {
            return response.json();
          }
          return response.text();
        }
        debugLogResponse(response);
        throw response;
      };
      var post = (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        };
        if (customOptions.useAPIKey) {
          defaultOptions.headers = _objectSpread(_objectSpread({}, defaultOptions.headers), getApiKeyHeaders());
        }
        options_.method = "POST";
        const options = merge(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          if (options.headers["Content-Type"] === "application/json; charset=utf-8") delete options.headers["Content-Type"];
        } else {
          options.body = JSON.stringify(data);
        }
        return promiseTimeout(customOptions.timeout || 6e4, fetchAndTrace(url, options).then((response) => {
          if (customOptions.logTracingHeader) {
            logTracingHeader(response);
          }
          if (response.ok) {
            const responseContentType = response.headers.get("content-type");
            if (responseContentType !== null && responseContentType !== void 0 && responseContentType.includes("application/json")) {
              return response.json();
            }
            return response.text();
          }
          debugLogResponse(response);
          throw response;
        }));
      };
      var patch = async (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        };
        if (customOptions.useAPIKey) {
          defaultOptions.headers = _objectSpread(_objectSpread({}, defaultOptions.headers), getApiKeyHeaders());
        }
        options_.method = "PATCH";
        const options = merge(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          if (options.headers["Content-Type"] === "application/json; charset=utf-8") delete options.headers["Content-Type"];
        } else {
          options.body = JSON.stringify(data);
        }
        const response = await fetchAndTrace(url, options);
        if (response.ok) {
          const responseContentType = response.headers.get("content-type");
          if (responseContentType !== null && responseContentType !== void 0 && responseContentType.includes("application/json")) {
            return response.json();
          }
          return response.text();
        }
        debugLogResponse(response);
        throw response;
      };
      var put = async (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        };
        if (customOptions.useAPIKey) {
          defaultOptions.headers = _objectSpread(_objectSpread({}, defaultOptions.headers), getApiKeyHeaders());
        }
        options_.method = "PUT";
        const options = merge(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          if (options.headers["Content-Type"] === "application/json; charset=utf-8") delete options.headers["Content-Type"];
        } else {
          options.body = JSON.stringify(data);
        }
        const response = await fetchAndTrace(url, options);
        if (response.ok) {
          const responseContentType = response.headers.get("content-type");
          if (responseContentType !== null && responseContentType !== void 0 && responseContentType.includes("application/json")) {
            return response.json();
          }
          return response.text();
        }
        debugLogResponse(response);
        throw response;
      };
      var remove = async (url, data = {}, options_ = {}, customOptions = {}) => {
        const defaultOptions = {
          mode: "cors",
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        };
        if (customOptions.useAPIKey) {
          defaultOptions.headers = _objectSpread(_objectSpread({}, defaultOptions.headers), getApiKeyHeaders());
        }
        options_.method = "DELETE";
        const options = merge(defaultOptions, options_);
        if (customOptions.isUrlEncodedData) {
          options.body = data;
          if (options.headers["Content-Type"] === "application/json; charset=utf-8") delete options.headers["Content-Type"];
        } else {
          options.body = JSON.stringify(data);
        }
        const response = await fetchAndTrace(url, options);
        if (response.ok) {
          const responseContentType = response.headers.get("content-type");
          if (responseContentType !== null && responseContentType !== void 0 && responseContentType.includes("application/json")) {
            return response.json();
          }
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
          reject(new Error("timed out"));
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
        var hex;
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
                  hex = parseInt(next(), 16);
                  if (!isFinite(hex)) {
                    break;
                  }
                  uffff = uffff * 16 + hex;
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
  var require_object_keys2 = __commonJS({
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
      var pow = require_pow();
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
        "%Math.pow%": pow,
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
      var objectKeys = require_object_keys2();
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

  // node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/MetadataStorageLayer.js
  var require_MetadataStorageLayer = __commonJS({
    "node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/MetadataStorageLayer.js"(exports) {
      "use strict";
      var _objectSpread = require_objectSpread2();
      var _defineProperty = require_defineProperty();
      var httpHelpers = require_lib4();
      var stringify = require_json_stable_stringify();
      var utils = require_utils4();
      var utils_js = (init_utils2(), __toCommonJS(utils_exports));
      var secp256k1_js = (init_secp256k1(), __toCommonJS(secp256k1_exports));
      var MetadataStorageLayer = class {
        // ms
        constructor(metadataHost = "https://metadata.tor.us", serverTimeOffset = 0) {
          _defineProperty(this, "metadataHost", void 0);
          _defineProperty(this, "serverTimeOffset", void 0);
          this.metadataHost = metadataHost;
          this.serverTimeOffset = serverTimeOffset;
        }
        static setAPIKey(apiKey) {
          httpHelpers.setAPIKey(apiKey);
        }
        static setEmbedHost(embedHost) {
          httpHelpers.setEmbedHost(embedHost);
        }
        generateMetadataParams(message, privateKeyHex) {
          const privKeyBytes = utils_js.hexToBytes(privateKeyHex.padStart(64, "0"));
          const {
            x,
            y
          } = utils.getPublicKeyCoords(privateKeyHex);
          const setData = {
            data: message,
            timestamp: Math.floor(this.serverTimeOffset + Date.now() / 1e3).toString(16)
          };
          const msgHash = utils.keccak256(utils.utf8ToBytes(stringify(setData)));
          const sigBytes = secp256k1_js.secp256k1.sign(msgHash, privKeyBytes, {
            prehash: false,
            format: "recovered"
          });
          return {
            pub_key_X: x,
            pub_key_Y: y,
            set_data: setData,
            signature: utils.bytesToBase64(utils.toEthereumSignature(sigBytes))
          };
        }
        generatePubKeyParams(privateKeyHex) {
          const {
            x,
            y
          } = utils.getPublicKeyCoords(privateKeyHex);
          return {
            pub_key_X: x,
            pub_key_Y: y
          };
        }
        async setMetadata(data, namespace, options) {
          const params = namespace !== null ? _objectSpread(_objectSpread({}, data), {}, {
            namespace
          }) : data;
          const metadataResponse = await httpHelpers.post(`${this.metadataHost}/set`, params, options, {
            useAPIKey: true
          });
          return metadataResponse.message;
        }
        async getMetadata(pubKey, namespace, options) {
          const params = namespace !== null ? _objectSpread(_objectSpread({}, pubKey), {}, {
            namespace
          }) : pubKey;
          const metadataResponse = await httpHelpers.post(`${this.metadataHost}/get`, params, options, {
            useAPIKey: true
          });
          return metadataResponse.message;
        }
      };
      exports.MetadataStorageLayer = MetadataStorageLayer;
    }
  });

  // node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/webAuthnShareResolver.js
  var require_webAuthnShareResolver = __commonJS({
    "node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/webAuthnShareResolver.js"(exports) {
      "use strict";
      var eccrypto = require_lib3();
      var utils = require_utils4();
      var utils_js = (init_utils2(), __toCommonJS(utils_exports));
      var WEBAUTHN_TORUS_SHARE = "webauthn_torus_share";
      var WEBAUTHN_DEVICE_SHARE = "webauthn_device_share";
      function encParamsHexToBuf(encParamsHex) {
        return {
          iv: utils_js.hexToBytes(encParamsHex.iv),
          ephemPublicKey: utils_js.hexToBytes(encParamsHex.ephemPublicKey),
          ciphertext: utils_js.hexToBytes(encParamsHex.ciphertext),
          mac: utils_js.hexToBytes(encParamsHex.mac)
        };
      }
      function encParamsBufToHex(encParams) {
        return {
          iv: utils_js.bytesToHex(encParams.iv),
          ephemPublicKey: utils_js.bytesToHex(encParams.ephemPublicKey),
          ciphertext: utils_js.bytesToHex(encParams.ciphertext),
          mac: utils_js.bytesToHex(encParams.mac)
        };
      }
      async function encryptData(privKeyHex, d) {
        const serializedData = utils.utf8ToBytes(JSON.stringify(d));
        const privKeyBytes = utils_js.hexToBytes(privKeyHex.padStart(64, "0"));
        const encParams = await eccrypto.encrypt(eccrypto.getPublic(privKeyBytes), serializedData);
        const encParamsHex = encParamsBufToHex(encParams);
        return JSON.stringify(encParamsHex);
      }
      async function decryptData(privKeyHex, d) {
        const encParamsHex = JSON.parse(d);
        const encParams = encParamsHexToBuf(encParamsHex);
        const privKeyBytes = utils_js.hexToBytes(privKeyHex.padStart(64, "0"));
        const serializedBytes = await eccrypto.decrypt(privKeyBytes, encParams);
        const data = JSON.parse(utils.bytesToUtf8(serializedBytes));
        return data;
      }
      async function getAndDecryptData(m, privKeyHex, namespace) {
        const {
          x,
          y
        } = utils.getPublicKeyCoords(privKeyHex);
        const serializedData = await m.getMetadata({
          pub_key_X: x,
          pub_key_Y: y
        }, namespace);
        if (!serializedData) {
          return null;
        }
        const data = await decryptData(privKeyHex, serializedData);
        return data;
      }
      async function encryptAndSetData(m, privKeyHex, d, namespace) {
        const sData = await encryptData(privKeyHex, d);
        const metadataParams = m.generateMetadataParams(sData, privKeyHex);
        await m.setMetadata(metadataParams, namespace);
      }
      async function setTorusShare(m, webAuthnPubKey, webAuthnRefHex, subspace, subspaceData) {
        const pubKeyBytes = utils.coordsToPublicKey(webAuthnPubKey.pub_key_X, webAuthnPubKey.pub_key_Y);
        const data = await getAndDecryptData(m, webAuthnRefHex, WEBAUTHN_TORUS_SHARE);
        let d = {};
        if (data) d = data;
        const serializedSubspaceData = utils.utf8ToBytes(JSON.stringify(subspaceData));
        const encSubspaceData = await eccrypto.encrypt(pubKeyBytes, serializedSubspaceData);
        const encSubspaceDataHex = encParamsBufToHex(encSubspaceData);
        d[subspace] = encSubspaceDataHex;
        await encryptAndSetData(m, webAuthnRefHex, d, WEBAUTHN_TORUS_SHARE);
      }
      async function setDeviceShare(m, webAuthnRefHex, subspace, subspaceData) {
        const data = await getAndDecryptData(m, webAuthnRefHex, WEBAUTHN_DEVICE_SHARE);
        let d = {};
        if (data) d = data;
        d[subspace] = subspaceData;
        await encryptAndSetData(m, webAuthnRefHex, d, WEBAUTHN_DEVICE_SHARE);
      }
      async function getTorusShare(m, webAuthnKeyHex, webAuthnRefHex, subspace) {
        const data = await getAndDecryptData(m, webAuthnRefHex, WEBAUTHN_TORUS_SHARE);
        if (!data) return null;
        const encParamsHex = data[subspace];
        if (!encParamsHex) return null;
        const encParams = encParamsHexToBuf(encParamsHex);
        const privKeyBytes = utils_js.hexToBytes(webAuthnKeyHex.padStart(64, "0"));
        const serializedBytes = await eccrypto.decrypt(privKeyBytes, encParams);
        const subspaceData = JSON.parse(utils.bytesToUtf8(serializedBytes));
        return subspaceData;
      }
      async function getDeviceShare(m, webAuthnRefHex, subspace) {
        const data = await getAndDecryptData(m, webAuthnRefHex, WEBAUTHN_DEVICE_SHARE);
        if (data) return data[subspace];
        return null;
      }
      exports.decryptData = decryptData;
      exports.encParamsBufToHex = encParamsBufToHex;
      exports.encParamsHexToBuf = encParamsHexToBuf;
      exports.encryptAndSetData = encryptAndSetData;
      exports.encryptData = encryptData;
      exports.getAndDecryptData = getAndDecryptData;
      exports.getDeviceShare = getDeviceShare;
      exports.getTorusShare = getTorusShare;
      exports.setDeviceShare = setDeviceShare;
      exports.setTorusShare = setTorusShare;
    }
  });

  // node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/index.js
  var require_lib5 = __commonJS({
    "node_modules/@toruslabs/metadata-helpers/dist/lib.cjs/index.js"(exports) {
      "use strict";
      var base64url = require_base64url();
      var MetadataStorageLayer = require_MetadataStorageLayer();
      var utils = require_utils4();
      var webAuthnShareResolver = require_webAuthnShareResolver();
      var utils_js = (init_utils2(), __toCommonJS(utils_exports));
      var secp256k1_js = (init_secp256k1(), __toCommonJS(secp256k1_exports));
      exports.decodeBase64Url = base64url.decodeBase64Url;
      exports.encodeBase64Url = base64url.encodeBase64Url;
      exports.fromBase64 = base64url.fromBase64;
      exports.toBase64 = base64url.toBase64;
      exports.toBufferLike = base64url.toBufferLike;
      exports.MetadataStorageLayer = MetadataStorageLayer.MetadataStorageLayer;
      exports.base64ToBytes = utils.base64ToBytes;
      exports.bytesToBase64 = utils.bytesToBase64;
      exports.bytesToUtf8 = utils.bytesToUtf8;
      exports.coordsToPublicKey = utils.coordsToPublicKey;
      exports.getPublicKeyCoords = utils.getPublicKeyCoords;
      exports.keccak256 = utils.keccak256;
      exports.toEthereumSignature = utils.toEthereumSignature;
      exports.utf8ToBytes = utils.utf8ToBytes;
      exports.decryptData = webAuthnShareResolver.decryptData;
      exports.encParamsBufToHex = webAuthnShareResolver.encParamsBufToHex;
      exports.encParamsHexToBuf = webAuthnShareResolver.encParamsHexToBuf;
      exports.encryptAndSetData = webAuthnShareResolver.encryptAndSetData;
      exports.encryptData = webAuthnShareResolver.encryptData;
      exports.getAndDecryptData = webAuthnShareResolver.getAndDecryptData;
      exports.getDeviceShare = webAuthnShareResolver.getDeviceShare;
      exports.getTorusShare = webAuthnShareResolver.getTorusShare;
      exports.setDeviceShare = webAuthnShareResolver.setDeviceShare;
      exports.setTorusShare = webAuthnShareResolver.setTorusShare;
      Object.defineProperty(exports, "bytesToHex", {
        enumerable: true,
        get: function() {
          return utils_js.bytesToHex;
        }
      });
      Object.defineProperty(exports, "hexToBytes", {
        enumerable: true,
        get: function() {
          return utils_js.hexToBytes;
        }
      });
      Object.defineProperty(exports, "secp256k1", {
        enumerable: true,
        get: function() {
          return secp256k1_js.secp256k1;
        }
      });
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
        let bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = "";
        for (i = 0; i < len; i += 3) {
          base64 += chars[bytes[i] >> 2];
          base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
          base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
          base64 += chars[bytes[i + 2] & 63];
        }
        if (len % 3 === 2) {
          base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + "==";
        }
        return base64;
      };
      exports.encode = encode;
      var decode = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === "=") {
          bufferLength--;
          if (base64[base64.length - 2] === "=") {
            bufferLength--;
          }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
          encoded1 = lookup[base64.charCodeAt(i)];
          encoded2 = lookup[base64.charCodeAt(i + 1)];
          encoded3 = lookup[base64.charCodeAt(i + 2)];
          encoded4 = lookup[base64.charCodeAt(i + 3)];
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
  var require_cjs2 = __commonJS({
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
  var require_cjs3 = __commonJS({
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
  var require_util3 = __commonJS({
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

  // node_modules/engine.io-client/node_modules/debug/src/common.js
  var require_common = __commonJS({
    "node_modules/engine.io-client/node_modules/debug/src/common.js"(exports, module) {
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
          let i;
          const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
          const len = split.length;
          for (i = 0; i < len; i++) {
            if (!split[i]) {
              continue;
            }
            namespaces = split[i].replace(/\*/g, ".*?");
            if (namespaces[0] === "-") {
              createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
            } else {
              createDebug.names.push(new RegExp("^" + namespaces + "$"));
            }
          }
        }
        function disable() {
          const namespaces = [
            ...createDebug.names.map(toNamespace),
            ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
          ].join(",");
          createDebug.enable("");
          return namespaces;
        }
        function enabled(name) {
          if (name[name.length - 1] === "*") {
            return true;
          }
          let i;
          let len;
          for (i = 0, len = createDebug.skips.length; i < len; i++) {
            if (createDebug.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = createDebug.names.length; i < len; i++) {
            if (createDebug.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }
        function toNamespace(regexp) {
          return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
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

  // node_modules/engine.io-client/node_modules/debug/src/browser.js
  var require_browser = __commonJS({
    "node_modules/engine.io-client/node_modules/debug/src/browser.js"(exports, module) {
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
          r = exports.storage.getItem("debug");
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
      var engine_io_parser_1 = require_cjs2();
      var component_emitter_1 = require_cjs3();
      var util_js_1 = require_util3();
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
          if (this.opts.port && (this.opts.secure && Number(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80)) {
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
      var util_js_1 = require_util3();
      var engine_io_parser_1 = require_cjs2();
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
      var component_emitter_1 = require_cjs3();
      var util_js_1 = require_util3();
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
         * @param {String} data to send.
         * @param {Function} called upon flush.
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
      var util_js_1 = require_util3();
      var engine_io_parser_1 = require_cjs2();
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
      var engine_io_parser_1 = require_cjs2();
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
      exports.Socket = exports.SocketWithUpgrade = exports.SocketWithoutUpgrade = void 0;
      var index_js_1 = require_transports();
      var util_js_1 = require_util3();
      var parseqs_js_1 = require_parseqs();
      var parseuri_js_1 = require_parseuri();
      var component_emitter_1 = require_cjs3();
      var engine_io_parser_1 = require_cjs2();
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
      var SocketWithoutUpgrade = class _SocketWithoutUpgrade extends component_emitter_1.Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri - uri or options
         * @param {Object} opts - options
         */
        constructor(uri, opts) {
          super();
          this.binaryType = globals_node_js_1.defaultBinaryType;
          this.writeBuffer = [];
          this._prevBufferLen = 0;
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
          this.transports = [];
          this._transportsByName = {};
          opts.transports.forEach((t) => {
            const transportName = t.prototype.name;
            this.transports.push(transportName);
            this._transportsByName[transportName] = t;
          });
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
          const transportName = this.opts.rememberUpgrade && _SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
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
         * Called when connection is deemed open.
         *
         * @private
         */
        onOpen() {
          debug("socket open");
          this.readyState = "open";
          _SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
          this.emitReserved("open");
          this.flush();
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
         * @param {String} type: packet type.
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
          _SocketWithoutUpgrade.priorWebsocketSuccess = false;
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
      };
      exports.SocketWithoutUpgrade = SocketWithoutUpgrade;
      SocketWithoutUpgrade.protocol = engine_io_parser_1.protocol;
      var SocketWithUpgrade = class extends SocketWithoutUpgrade {
        constructor() {
          super(...arguments);
          this._upgrades = [];
        }
        onOpen() {
          super.onOpen();
          if ("open" === this.readyState && this.opts.upgrade) {
            debug("starting upgrade probes");
            for (let i = 0; i < this._upgrades.length; i++) {
              this._probe(this._upgrades[i]);
            }
          }
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
          SocketWithoutUpgrade.priorWebsocketSuccess = false;
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
                SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
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
        onHandshake(data) {
          this._upgrades = this._filterUpgrades(data.upgrades);
          super.onHandshake(data);
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
      exports.SocketWithUpgrade = SocketWithUpgrade;
      var Socket = class extends SocketWithUpgrade {
        constructor(uri, opts = {}) {
          const o = typeof uri === "object" ? uri : opts;
          if (!o.transports || o.transports && typeof o.transports[0] === "string") {
            o.transports = (o.transports || ["polling", "websocket", "webtransport"]).map((transportName) => index_js_1.transports[transportName]).filter((t) => !!t);
          }
          super(uri, o);
        }
      };
      exports.Socket = Socket;
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
  var require_cjs4 = __commonJS({
    "node_modules/engine.io-client/build/cjs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WebTransport = exports.WebSocket = exports.NodeWebSocket = exports.XHR = exports.NodeXHR = exports.Fetch = exports.nextTick = exports.parse = exports.installTimerFunctions = exports.transports = exports.TransportError = exports.Transport = exports.protocol = exports.SocketWithUpgrade = exports.SocketWithoutUpgrade = exports.Socket = void 0;
      var socket_js_1 = require_socket();
      Object.defineProperty(exports, "Socket", { enumerable: true, get: function() {
        return socket_js_1.Socket;
      } });
      var socket_js_2 = require_socket();
      Object.defineProperty(exports, "SocketWithoutUpgrade", { enumerable: true, get: function() {
        return socket_js_2.SocketWithoutUpgrade;
      } });
      Object.defineProperty(exports, "SocketWithUpgrade", { enumerable: true, get: function() {
        return socket_js_2.SocketWithUpgrade;
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
      var util_js_1 = require_util3();
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

  // node_modules/debug/src/common.js
  var require_common2 = __commonJS({
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
          const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
          for (const ns of split) {
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
  var require_browser2 = __commonJS({
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
      module.exports = require_common2()(exports);
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

  // node_modules/socket.io-client/build/cjs/url.js
  var require_url = __commonJS({
    "node_modules/socket.io-client/build/cjs/url.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.url = url;
      var engine_io_client_1 = require_cjs4();
      var debug_1 = __importDefault(require_browser2());
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
      exports.hasBinary = exports.isBinary = void 0;
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
      exports.isBinary = isBinary;
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
      exports.hasBinary = hasBinary;
    }
  });

  // node_modules/socket.io-parser/build/cjs/binary.js
  var require_binary = __commonJS({
    "node_modules/socket.io-parser/build/cjs/binary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reconstructPacket = exports.deconstructPacket = void 0;
      var is_binary_js_1 = require_is_binary();
      function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length;
        return { packet: pack, buffers };
      }
      exports.deconstructPacket = deconstructPacket;
      function _deconstructPacket(data, buffers) {
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
      exports.reconstructPacket = reconstructPacket;
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

  // node_modules/socket.io-parser/node_modules/debug/src/common.js
  var require_common3 = __commonJS({
    "node_modules/socket.io-parser/node_modules/debug/src/common.js"(exports, module) {
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
          let i;
          const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
          const len = split.length;
          for (i = 0; i < len; i++) {
            if (!split[i]) {
              continue;
            }
            namespaces = split[i].replace(/\*/g, ".*?");
            if (namespaces[0] === "-") {
              createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
            } else {
              createDebug.names.push(new RegExp("^" + namespaces + "$"));
            }
          }
        }
        function disable() {
          const namespaces = [
            ...createDebug.names.map(toNamespace),
            ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
          ].join(",");
          createDebug.enable("");
          return namespaces;
        }
        function enabled(name) {
          if (name[name.length - 1] === "*") {
            return true;
          }
          let i;
          let len;
          for (i = 0, len = createDebug.skips.length; i < len; i++) {
            if (createDebug.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = createDebug.names.length; i < len; i++) {
            if (createDebug.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }
        function toNamespace(regexp) {
          return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
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

  // node_modules/socket.io-parser/node_modules/debug/src/browser.js
  var require_browser3 = __commonJS({
    "node_modules/socket.io-parser/node_modules/debug/src/browser.js"(exports, module) {
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
          r = exports.storage.getItem("debug");
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
      module.exports = require_common3()(exports);
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

  // node_modules/socket.io-parser/build/cjs/index.js
  var require_cjs5 = __commonJS({
    "node_modules/socket.io-parser/build/cjs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
      var component_emitter_1 = require_cjs3();
      var binary_js_1 = require_binary();
      var is_binary_js_1 = require_is_binary();
      var debug_1 = require_browser3();
      var debug = (0, debug_1.default)("socket.io-parser");
      var RESERVED_EVENTS = [
        "connect",
        "connect_error",
        "disconnect",
        "disconnecting",
        "newListener",
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
      })(PacketType = exports.PacketType || (exports.PacketType = {}));
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
      function isObject(value) {
        return Object.prototype.toString.call(value) === "[object Object]";
      }
      var Decoder = class _Decoder extends component_emitter_1.Emitter {
        /**
         * Decoder constructor
         *
         * @param {function} reviver - custom reviver to pass down to JSON.stringify
         */
        constructor(reviver) {
          super();
          this.reviver = reviver;
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
              if (packet.attachments === 0) {
                super.emitReserved("decoded", packet);
              }
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
            p.attachments = Number(buf);
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
            return JSON.parse(str, this.reviver);
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
      var socket_io_parser_1 = require_cjs5();
      var on_js_1 = require_on();
      var component_emitter_1 = require_cjs3();
      var debug_1 = __importDefault(require_browser2());
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
      var __importStar = exports && exports.__importStar || function(mod2) {
        if (mod2 && mod2.__esModule) return mod2;
        var result = {};
        if (mod2 != null) {
          for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding(result, mod2, k);
        }
        __setModuleDefault(result, mod2);
        return result;
      };
      var __importDefault = exports && exports.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Manager = void 0;
      var engine_io_client_1 = require_cjs4();
      var socket_js_1 = require_socket2();
      var parser = __importStar(require_cjs5());
      var on_js_1 = require_on();
      var backo2_js_1 = require_backo2();
      var component_emitter_1 = require_cjs3();
      var debug_1 = __importDefault(require_browser2());
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
  var require_cjs6 = __commonJS({
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
      var debug_1 = __importDefault(require_browser2());
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
      var socket_io_parser_1 = require_cjs5();
      Object.defineProperty(exports, "protocol", { enumerable: true, get: function() {
        return socket_io_parser_1.protocol;
      } });
      var engine_io_client_1 = require_cjs4();
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

  // dist/lib.cjs/methods/server.js
  var require_server = __commonJS({
    "dist/lib.cjs/methods/server.js"(exports) {
      "use strict";
      var eccrypto = require_lib3();
      var metadataHelpers = require_lib5();
      var obliviousSet = require_index_es5();
      var socket_ioClient = require_cjs6();
      var options = require_options();
      var util = require_util2();
      var microSeconds = util.microSeconds;
      var KEY_PREFIX = "pubkey.broadcastChannel-";
      var type = "server";
      var SOCKET_CONN_INSTANCE = null;
      var runningChannels = /* @__PURE__ */ new Set();
      function storageKey(channelName2) {
        return KEY_PREFIX + channelName2;
      }
      function postMessage2(channelState, messageJson) {
        return new Promise((resolve, reject) => {
          util.sleep().then(async () => {
            const key = storageKey(channelState.channelName);
            const channelEncPrivKey = metadataHelpers.keccak256(metadataHelpers.utf8ToBytes(key));
            const encData = await metadataHelpers.encryptData(metadataHelpers.bytesToHex(channelEncPrivKey), {
              token: util.generateRandomId(),
              time: Date.now(),
              data: messageJson,
              uuid: channelState.uuid
            });
            const body = {
              allowedOrigin: channelState.server.allowed_origin,
              sameIpCheck: true,
              key: metadataHelpers.bytesToHex(eccrypto.getPublic(channelEncPrivKey)),
              data: encData,
              signature: metadataHelpers.bytesToHex(await eccrypto.sign(channelEncPrivKey, metadataHelpers.keccak256(metadataHelpers.utf8ToBytes(encData))))
            };
            if (channelState.timeout) body.timeout = channelState.timeout;
            return fetch(`${channelState.server.api_url}/channel/set`, {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            }).then(resolve).catch(reject);
          }).catch(reject);
        });
      }
      function getSocketInstance(socketUrl) {
        if (SOCKET_CONN_INSTANCE) {
          return SOCKET_CONN_INSTANCE;
        }
        const SOCKET_CONN = socket_ioClient.io(socketUrl, {
          transports: ["websocket", "polling"],
          // use WebSocket first, if available
          withCredentials: true,
          reconnectionDelayMax: 1e4,
          reconnectionAttempts: 10
        });
        SOCKET_CONN.on("connect_error", (err) => {
          SOCKET_CONN.io.opts.transports = ["polling", "websocket"];
          util.log.error("connect error", err);
        });
        SOCKET_CONN.on("connect", async () => {
          const {
            engine
          } = SOCKET_CONN.io;
          util.log.debug("initially connected to", engine.transport.name);
          engine.once("upgrade", () => {
            util.log.debug("upgraded", engine.transport.name);
          });
          engine.once("close", (reason) => {
            util.log.debug("connection closed", reason);
          });
        });
        SOCKET_CONN.on("error", (err) => {
          util.log.error("socket errored", err);
          SOCKET_CONN.disconnect();
        });
        SOCKET_CONN_INSTANCE = SOCKET_CONN;
        return SOCKET_CONN;
      }
      function setupSocketConnection(socketUrl, channelState, fn) {
        const socketConn = getSocketInstance(socketUrl);
        const key = storageKey(channelState.channelName);
        const channelEncPrivKey = metadataHelpers.keccak256(metadataHelpers.utf8ToBytes(key));
        const channelPubKey = metadataHelpers.bytesToHex(eccrypto.getPublic(channelEncPrivKey));
        if (socketConn.connected) {
          socketConn.emit("v2:check_auth_status", channelPubKey, {
            sameIpCheck: true,
            allowedOrigin: channelState.server.allowed_origin
          });
        } else {
          socketConn.once("connect", () => {
            util.log.debug("connected with socket");
            socketConn.emit("v2:check_auth_status", channelPubKey, {
              sameIpCheck: true,
              allowedOrigin: channelState.server.allowed_origin
            });
          });
        }
        const reconnect = () => {
          socketConn.once("connect", async () => {
            if (runningChannels.has(channelState.channelName)) {
              socketConn.emit("v2:check_auth_status", channelPubKey, {
                sameIpCheck: true,
                allowedOrigin: channelState.server.allowed_origin
              });
            }
          });
        };
        const visibilityListener = () => {
          if (!socketConn || !runningChannels.has(channelState.channelName)) {
            document.removeEventListener("visibilitychange", visibilityListener);
            return;
          }
          if (!socketConn.connected && document.visibilityState === "visible") {
            reconnect();
          }
        };
        const listener = async (ev) => {
          try {
            const decData = await metadataHelpers.decryptData(metadataHelpers.bytesToHex(channelEncPrivKey), ev);
            util.log.info(decData);
            fn(decData);
          } catch (error) {
            util.log.error(error);
          }
        };
        socketConn.on("disconnect", () => {
          util.log.debug("socket disconnected");
          if (runningChannels.has(channelState.channelName)) {
            util.log.error("socket disconnected unexpectedly, reconnecting socket");
            reconnect();
          }
        });
        socketConn.on(`${channelPubKey}_success`, listener);
        if (typeof document !== "undefined") document.addEventListener("visibilitychange", visibilityListener);
        return socketConn;
      }
      function removeStorageEventListener() {
        if (SOCKET_CONN_INSTANCE) {
          SOCKET_CONN_INSTANCE.disconnect();
        }
      }
      function canBeUsed() {
        return true;
      }
      function create(channelName2, options$1) {
        options$1 = options.fillOptionsWithDefaults(options$1);
        const uuid = util.generateRandomId();
        const eMIs = new obliviousSet.ObliviousSet(options$1.server.removeTimeout);
        const state = {
          channelName: channelName2,
          uuid,
          eMIs,
          // emittedMessagesIds
          server: {
            api_url: options$1.server.api_url,
            socket_url: options$1.server.socket_url,
            allowed_origin: options$1.server.allowed_origin
          },
          time: util.microSeconds()
        };
        if (options$1.server.timeout) state.timeout = options$1.server.timeout;
        setupSocketConnection(options$1.server.socket_url, state, (msgObj) => {
          if (!state.messagesCallback) return;
          if (msgObj.uuid === state.uuid) return;
          if (!msgObj.token || state.eMIs.has(msgObj.token)) return;
          state.eMIs.add(msgObj.token);
          state.messagesCallback(msgObj.data);
        });
        runningChannels.add(channelName2);
        return state;
      }
      function close(channelState) {
        runningChannels.delete(channelState.channelName);
      }
      function onMessage(channelState, fn, time) {
        channelState.messagesCallbackTime = time;
        channelState.messagesCallback = fn;
      }
      function averageResponseTime() {
        const defaultTime = 500;
        return defaultTime;
      }
      exports.averageResponseTime = averageResponseTime;
      exports.canBeUsed = canBeUsed;
      exports.close = close;
      exports.create = create;
      exports.getSocketInstance = getSocketInstance;
      exports.microSeconds = microSeconds;
      exports.onMessage = onMessage;
      exports.postMessage = postMessage2;
      exports.removeStorageEventListener = removeStorageEventListener;
      exports.setupSocketConnection = setupSocketConnection;
      exports.storageKey = storageKey;
      exports.type = type;
    }
  });

  // dist/lib.cjs/methods/simulate.js
  var require_simulate = __commonJS({
    "dist/lib.cjs/methods/simulate.js"(exports) {
      "use strict";
      var util = require_util2();
      var microSeconds = util.microSeconds;
      var type = "simulate";
      var SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
      var SIMULATE_DELAY_TIME = 5;
      function create(channelName2) {
        const state = {
          time: util.microSeconds(),
          name: channelName2,
          messagesCallback: null
        };
        SIMULATE_CHANNELS.add(state);
        return state;
      }
      function close(channelState) {
        SIMULATE_CHANNELS.delete(channelState);
      }
      function postMessage2(channelState, messageJson) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const channelArray = Array.from(SIMULATE_CHANNELS);
            channelArray.forEach((channel2) => {
              if (channel2.name === channelState.name && // has same name
              channel2 !== channelState && // not own channel
              !!channel2.messagesCallback && // has subscribers
              channel2.time < messageJson.time) {
                channel2.messagesCallback(messageJson);
              }
            });
            resolve();
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
      exports.SIMULATE_DELAY_TIME = SIMULATE_DELAY_TIME;
      exports.averageResponseTime = averageResponseTime;
      exports.canBeUsed = canBeUsed;
      exports.close = close;
      exports.create = create;
      exports.microSeconds = microSeconds;
      exports.onMessage = onMessage;
      exports.postMessage = postMessage2;
      exports.type = type;
    }
  });

  // dist/lib.cjs/method-chooser.js
  var require_method_chooser = __commonJS({
    "dist/lib.cjs/method-chooser.js"(exports) {
      "use strict";
      var indexedDb = require_indexed_db();
      var localstorage = require_localstorage();
      var native = require_native();
      var server = require_server();
      var simulate = require_simulate();
      var METHODS = [
        native,
        // fastest
        indexedDb,
        localstorage,
        server
      ];
      function chooseMethod(options) {
        let chooseMethods = [].concat(options.methods || [], METHODS).filter(Boolean);
        if (options.type) {
          if (options.type === "simulate") {
            return simulate;
          }
          const ret = chooseMethods.find((m) => m.type === options.type);
          if (!ret) throw new Error(`method-type ${options.type} not found`);
          else return ret;
        }
        if (!options.webWorkerSupport) {
          chooseMethods = chooseMethods.filter((m) => m.type !== "idb");
        }
        const useMethod = chooseMethods.find((method) => method.canBeUsed(options));
        if (!useMethod) throw new Error(`No useable method found in ${JSON.stringify(METHODS.map((m) => m.type))}`);
        else return useMethod;
      }
      exports.chooseMethod = chooseMethod;
    }
  });

  // dist/lib.cjs/broadcast-channel.js
  var require_broadcast_channel = __commonJS({
    "dist/lib.cjs/broadcast-channel.js"(exports) {
      "use strict";
      var _defineProperty = require_defineProperty();
      var methodChooser = require_method_chooser();
      var options = require_options();
      var util = require_util2();
      var ENFORCED_OPTIONS;
      function enforceOptions(options2) {
        ENFORCED_OPTIONS = options2;
      }
      var OPEN_BROADCAST_CHANNELS = /* @__PURE__ */ new Set();
      var lastId = 0;
      var BroadcastChannel3 = class {
        // beforeClose
        constructor(name, options$1) {
          _defineProperty(this, "id", void 0);
          _defineProperty(this, "name", void 0);
          _defineProperty(this, "options", void 0);
          _defineProperty(this, "method", void 0);
          _defineProperty(this, "closed", void 0);
          _defineProperty(this, "_addEL", void 0);
          _defineProperty(this, "_prepP", void 0);
          _defineProperty(this, "_state", void 0);
          _defineProperty(this, "_uMP", void 0);
          _defineProperty(this, "_iL", void 0);
          _defineProperty(this, "_onML", void 0);
          _defineProperty(this, "_befC", void 0);
          this.id = lastId++;
          OPEN_BROADCAST_CHANNELS.add(this);
          this.name = name;
          if (ENFORCED_OPTIONS) {
            options$1 = ENFORCED_OPTIONS;
          }
          this.options = options.fillOptionsWithDefaults(options$1 || {});
          this.method = methodChooser.chooseMethod(this.options);
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
          const time = this.method.microSeconds();
          const listenObj = {
            time,
            fn
          };
          _removeListenerObject(this, "message", this._onML);
          if (fn && typeof fn === "function") {
            this._onML = listenObj;
            _addListenerObject(this, "message", listenObj);
          } else {
            this._onML = null;
          }
        }
        postMessage(msg) {
          if (this.closed) {
            throw new Error(`BroadcastChannel.postMessage(): Cannot post message after channel has closed ${JSON.stringify(msg)}`);
          }
          return _post(this, "message", msg);
        }
        postInternal(msg) {
          return _post(this, "internal", msg);
        }
        addEventListener(type, fn) {
          const time = this.method.microSeconds();
          const listenObj = {
            time,
            fn
          };
          _addListenerObject(this, type, listenObj);
        }
        removeEventListener(type, fn) {
          const obj = this._addEL[type].find((o) => o.fn === fn);
          _removeListenerObject(this, type, obj);
        }
        close() {
          if (this.closed) {
            return Promise.resolve();
          }
          OPEN_BROADCAST_CHANNELS.delete(this);
          this.closed = true;
          const awaitPrepare = this._prepP ? this._prepP : util.PROMISE_RESOLVED_VOID;
          this._onML = null;
          this._addEL.message = [];
          return awaitPrepare.then(() => Promise.all(Array.from(this._uMP))).then(() => Promise.all(this._befC.map((fn) => fn()))).then(() => this.method.close ? this.method.close(this._state) : util.PROMISE_RESOLVED_VOID);
        }
      };
      _defineProperty(BroadcastChannel3, "_pubkey", true);
      function _post(broadcastChannel, type, msg) {
        const time = broadcastChannel.method.microSeconds();
        const msgObj = {
          time,
          type,
          data: msg
        };
        const awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : util.PROMISE_RESOLVED_VOID;
        return awaitPrepare.then(() => {
          const sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
          broadcastChannel._uMP.add(sendPromise);
          sendPromise.catch(() => {
          }).then(() => broadcastChannel._uMP.delete(sendPromise));
          return sendPromise;
        });
      }
      function _prepareChannel(channel2) {
        const maybePromise = channel2.method.create(channel2.name, channel2.options);
        if (util.isPromise(maybePromise)) {
          const promise = maybePromise;
          channel2._prepP = promise;
          promise.then((s) => {
            channel2._state = s;
            return s;
          }).catch((err) => {
            throw err;
          });
        } else {
          channel2._state = maybePromise;
        }
      }
      function _hasMessageListeners(channel2) {
        if (channel2._addEL.message.length > 0) return true;
        if (channel2._addEL.internal.length > 0) return true;
        return false;
      }
      function _startListening(channel2) {
        if (!channel2._iL && _hasMessageListeners(channel2)) {
          const listenerFn = (msgObj) => {
            channel2._addEL[msgObj.type].forEach((listenerObject) => {
              if (msgObj.time >= listenerObject.time) {
                listenerObject.fn(msgObj.data);
              } else if (channel2.method.type === "server") {
                listenerObject.fn(msgObj.data);
              }
            });
          };
          const time = channel2.method.microSeconds();
          if (channel2._prepP) {
            channel2._prepP.then(() => {
              channel2._iL = true;
              channel2.method.onMessage(channel2._state, listenerFn, time);
              return true;
            }).catch((err) => {
              throw err;
            });
          } else {
            channel2._iL = true;
            channel2.method.onMessage(channel2._state, listenerFn, time);
          }
        }
      }
      function _stopListening(channel2) {
        if (channel2._iL && !_hasMessageListeners(channel2)) {
          channel2._iL = false;
          const time = channel2.method.microSeconds();
          channel2.method.onMessage(channel2._state, null, time);
        }
      }
      function _addListenerObject(channel2, type, obj) {
        channel2._addEL[type].push(obj);
        _startListening(channel2);
      }
      function _removeListenerObject(channel2, type, obj) {
        if (obj) {
          channel2._addEL[type] = channel2._addEL[type].filter((o) => o !== obj);
          _stopListening(channel2);
        }
      }
      exports.BroadcastChannel = BroadcastChannel3;
      exports.OPEN_BROADCAST_CHANNELS = OPEN_BROADCAST_CHANNELS;
      exports.enforceOptions = enforceOptions;
    }
  });

  // dist/lib.cjs/redundant-adaptive-broadcast-channel.js
  var require_redundant_adaptive_broadcast_channel = __commonJS({
    "dist/lib.cjs/redundant-adaptive-broadcast-channel.js"(exports) {
      "use strict";
      var _objectSpread = require_objectSpread2();
      var _defineProperty = require_defineProperty();
      var broadcastChannel = require_broadcast_channel();
      var localstorage = require_localstorage();
      var native = require_native();
      var server = require_server();
      var simulate = require_simulate();
      var util = require_util2();
      var RedundantAdaptiveBroadcastChannel = class {
        constructor(name, options = {}) {
          _defineProperty(this, "name", void 0);
          _defineProperty(this, "options", void 0);
          _defineProperty(this, "closed", void 0);
          _defineProperty(this, "onML", void 0);
          _defineProperty(this, "methodPriority", void 0);
          _defineProperty(this, "channels", void 0);
          _defineProperty(this, "listeners", void 0);
          _defineProperty(this, "processedNonces", void 0);
          _defineProperty(this, "nonce", void 0);
          this.name = name;
          this.options = options;
          this.closed = false;
          this.onML = null;
          this.methodPriority = [native.type, localstorage.type, server.type];
          this.channels = /* @__PURE__ */ new Map();
          this.listeners = /* @__PURE__ */ new Set();
          this.processedNonces = /* @__PURE__ */ new Set();
          this.nonce = 0;
          this.initChannels();
        }
        set onmessage(fn) {
          this.removeEventListener("message", this.onML);
          if (fn && typeof fn === "function") {
            this.onML = fn;
            this.addEventListener("message", fn);
          } else {
            this.onML = null;
          }
        }
        initChannels() {
          if (this.options.type === simulate.type) {
            this.methodPriority = [simulate.type];
          }
          this.methodPriority.forEach((method) => {
            try {
              const channel2 = new broadcastChannel.BroadcastChannel(this.name, _objectSpread(_objectSpread({}, this.options), {}, {
                type: method
              }));
              this.channels.set(method, channel2);
              util.log.debug(`Succeeded to initialize ${method} method in channel ${this.name}`);
              channel2.onmessage = (event) => this.handleMessage(event);
            } catch (error) {
              util.log.warn(`Failed to initialize ${method} method in channel ${this.name}: ${error instanceof Error ? error.message : String(error)}`);
            }
          });
          if (this.channels.size === 0) {
            throw new Error("Failed to initialize any communication method");
          }
        }
        allChannels() {
          return Array.from(this.channels.keys());
        }
        hasChannel(method) {
          return this.channels.has(method);
        }
        handleMessage(event) {
          if (event && event.nonce) {
            if (this.processedNonces.has(event.nonce)) {
              return;
            }
            this.processedNonces.add(event.nonce);
            if (this.processedNonces.size > 1e3) {
              const nonces = Array.from(this.processedNonces);
              const oldestNonce = nonces.sort()[0];
              this.processedNonces.delete(oldestNonce);
            }
            this.listeners.forEach((listener) => {
              listener(event.message);
            });
          }
        }
        async postMessage(message) {
          if (this.closed) {
            throw new Error(`AdaptiveBroadcastChannel.postMessage(): Cannot post message after channel has closed ${/**
             * In the past when this error appeared, it was realy hard to debug.
             * So now we log the msg together with the error so it at least
             * gives some clue about where in your application this happens.
             */
            JSON.stringify(message)}`);
          }
          const nonce = this.generateNonce();
          const wrappedMessage = {
            nonce,
            message
          };
          const postPromises = Array.from(this.channels.entries()).map(([method, channel2]) => channel2.postMessage(wrappedMessage).catch((error) => {
            util.log.warn(`Failed to send via ${method}: ${error.message}`);
            throw error;
          }));
          const result = await Promise.allSettled(postPromises);
          const anySuccessful = result.some((p) => p.status === "fulfilled");
          if (!anySuccessful) {
            throw new Error("Failed to send message through any method");
          }
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
          if (this.closed) {
            return;
          }
          this.onML = null;
          const promises = [];
          for (const c of this.channels.values()) {
            promises.push(c.close());
          }
          await Promise.all(promises);
          this.channels.clear();
          this.listeners.clear();
          this.closed = true;
        }
      };
      exports.RedundantAdaptiveBroadcastChannel = RedundantAdaptiveBroadcastChannel;
    }
  });

  // dist/lib.cjs/index.js
  var require_lib6 = __commonJS({
    "dist/lib.cjs/index.js"(exports) {
      "use strict";
      var indexedDb = require_indexed_db();
      var localstorage = require_localstorage();
      var native = require_native();
      var server = require_server();
      var broadcastChannel = require_broadcast_channel();
      var methodChooser = require_method_chooser();
      var redundantAdaptiveBroadcastChannel = require_redundant_adaptive_broadcast_channel();
      var metadataHelpers = require_lib5();
      exports.IndexedDbMethod = indexedDb;
      exports.LocalstorageMethod = localstorage;
      exports.NativeMethod = native;
      exports.ServerMethod = server;
      exports.BroadcastChannel = broadcastChannel.BroadcastChannel;
      exports.OPEN_BROADCAST_CHANNELS = broadcastChannel.OPEN_BROADCAST_CHANNELS;
      exports.enforceOptions = broadcastChannel.enforceOptions;
      exports.chooseMethod = methodChooser.chooseMethod;
      exports.RedundantAdaptiveBroadcastChannel = redundantAdaptiveBroadcastChannel.RedundantAdaptiveBroadcastChannel;
      Object.defineProperty(exports, "decodeBase64Url", {
        enumerable: true,
        get: function() {
          return metadataHelpers.decodeBase64Url;
        }
      });
      Object.defineProperty(exports, "encodeBase64Url", {
        enumerable: true,
        get: function() {
          return metadataHelpers.encodeBase64Url;
        }
      });
      Object.defineProperty(exports, "fromBase64", {
        enumerable: true,
        get: function() {
          return metadataHelpers.fromBase64;
        }
      });
      Object.defineProperty(exports, "toBase64", {
        enumerable: true,
        get: function() {
          return metadataHelpers.toBase64;
        }
      });
      Object.defineProperty(exports, "toBufferLike", {
        enumerable: true,
        get: function() {
          return metadataHelpers.toBufferLike;
        }
      });
    }
  });

  // test_tmp/scripts/iframe.js
  require_lib();
  var _require = require_util();
  var getParameterByName = _require.getParameterByName;
  var msgContainer = document.getElementById("messages");
  var _require2 = require_lib6();
  var BroadcastChannel2 = _require2.BroadcastChannel;
  var channelName = getParameterByName("channelName");
  var methodType = getParameterByName("methodType");
  var logBefore = console.log;
  console.log = function(str) {
    logBefore("iframe: " + str);
  };
  function logToDom(str) {
    var textnode = document.createTextNode(str);
    var lineBreak = document.createElement("br");
    msgContainer.appendChild(textnode);
    msgContainer.appendChild(lineBreak);
  }
  var channel = new BroadcastChannel2(channelName, {
    type: methodType
  });
  logToDom("created channel with type " + methodType);
  channel.onmessage = function(msg) {
    logToDom("message:");
    logToDom("recieved message(" + msg.step + ") from " + msg.from + ": ");
    logToDom(JSON.stringify(msg));
    if (!msg.answer) {
      logToDom("answer back(" + msg.step + ")");
      channel.postMessage({
        answer: true,
        from: "iframe",
        original: msg
      });
    }
  };
})();
/*! Bundled license information:

@noble/hashes/utils.js:
@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/secp256k1.js:
@noble/curves/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
