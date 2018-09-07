/**
 *
 *
 */

const ObliviousSet = function(ttl) {
    this.ttl = ttl;
    this.set = new Set();
    this.timeMap = new Map();

    this.has = this.set.has.bind(this.set);
};

ObliviousSet.prototype = {
    add: function(value) {
        this.timeMap.set(value, now());
        this.set.add(value);
        _removeTooOldValues(this);
    },
    clear: function() {
        this.set.clear();
        this.timeMap.clear();
    }
};

export function _removeTooOldValues(obliviousSet) {
    const olderThen = now() - obliviousSet.ttl;
    const iterator = obliviousSet.set[Symbol.iterator]();

    while (true) {
        const value = iterator.next().value;
        if (!value) return; // no more elements
        const time = obliviousSet.timeMap.get(value);
        if (time < olderThen) {
            obliviousSet.timeMap.delete(value);
            obliviousSet.set.delete(value);
        } else {
            // we reached a value that is not old enough
            return;
        }
    }
}

function now() {
    return new Date().getTime();
}

export default ObliviousSet;
