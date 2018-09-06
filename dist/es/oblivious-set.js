/**
 * 
 * 
 */
var ObliviousSet = function ObliviousSet(ttl) {
  this.ttl = ttl;
  this.set = new Set();
  this.timeMap = new Map();
  this.has = this.set.has.bind(this.set);
};

ObliviousSet.prototype = {
  _removeTooOldValues: function _removeTooOldValues() {
    var olderThen = now() - this.ttl;
    var iterator = this.set[Symbol.iterator]();

    while (true) {
      var value = iterator.next().value;
      if (!value) return; // no more elements

      var time = this.timeMap.get(value);

      if (time < olderThen) {
        this.timeMap["delete"](value);
        this.set["delete"](value);
      } else {
        // we reached a value that is not old enough
        return;
      }
    }
  },
  add: function add(value) {
    this.timeMap.set(value, now());
    this.set.add(value);

    this._removeTooOldValues();
  },
  clear: function clear() {
    this.set.clear();
    this.timeMap.clear();
  }
};

function now() {
  return new Date().getTime();
}

export default ObliviousSet;