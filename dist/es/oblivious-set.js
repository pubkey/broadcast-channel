"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * this is a set which automatically forgets
 * a given entry when a new entry is set and the ttl
 * of the old one is over
 * @constructor
 */
var ObliviousSet = function ObliviousSet(ttl) {
  var set = new Set();
  var timeMap = new Map();
  this.has = set.has.bind(set);

  this.add = function (value) {
    timeMap.set(value, now());
    set.add(value);

    _removeTooOldValues();
  };

  this.clear = function () {
    set.clear();
    timeMap.clear();
  };

  function _removeTooOldValues() {
    var olderThen = now() - ttl;
    var iterator = set[Symbol.iterator]();

    while (true) {
      var value = iterator.next().value;
      if (!value) return; // no more elements

      var time = timeMap.get(value);

      if (time < olderThen) {
        timeMap["delete"](value);
        set["delete"](value);
      } else {
        // we reached a value that is not old enough
        return;
      }
    }
  }
};

function now() {
  return new Date().getTime();
}

var _default = ObliviousSet;
exports["default"] = _default;