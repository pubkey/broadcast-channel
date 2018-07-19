/**
 * 
 * 
 */

const ObliviousSet = function (ttl) {
    this.ttl = ttl;
    this.set = new Set();
    this.timeMap = new Map();

    this.has = this.set.has.bind(this.set);
};

ObliviousSet.prototype = {
    _removeTooOldValues: function () {
        const olderThen = now() - this.ttl;
        const iterator = this.set[Symbol.iterator]();

        while (true) {
            const value = iterator.next().value;
            if (!value) return; // no more elements
            const time = this.timeMap.get(value);
            if (time < olderThen) {
                this.timeMap.delete(value);
                this.set.delete(value);
            } else {
                // we reached a value that is not old enough
                return;
            }
        }

    },
    add: function (value) {
        this.timeMap.set(value, now());
        this.set.add(value);
        this._removeTooOldValues();
    },
    clear: function () {
        this.set.clear();
        this.timeMap.clear();
    }
};

function now() {
    return new Date().getTime();
}

export default ObliviousSet;