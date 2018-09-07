const AsyncTestUtil = require('async-test-util');
const assert = require('assert');

const ObliviousSet = require('../../dist/lib/oblivious-set.js').default;
const ObliviousSetAll = require('../../dist/lib/oblivious-set.js');

describe('unit/oblivious-set.test.js', () => {
    it('create, add, has, get, clear', () => {
        const set = new ObliviousSet(100);
        set.add('foobar');
        const has = set.has('foobar');
        assert.ok(has);

        set.clear();
        const hasAfter = set.has('foobar');
        assert.equal(false, hasAfter);
    });
    it('.removeTooOldValues() should clear the old values', async () => {
        const set = new ObliviousSet(100);
        set.add('foobar');
        assert.ok(set.has('foobar'));

        await AsyncTestUtil.wait(200);
        ObliviousSetAll._removeTooOldValues(set);
        const has = set.has('foobar');
        assert.equal(false, has);
    });
    it('.removeTooOldValues() should NOT clear to young values', async () => {
        const set = new ObliviousSet(500);
        set.add('foobar');
        assert.ok(set.has('foobar'));

        await AsyncTestUtil.wait(50);
        ObliviousSetAll._removeTooOldValues(set);
        assert.ok(set.has('foobar'));
    });
    it('should clear the value after its ttl', async () => {
        const set = new ObliviousSet(100);
        set.add('foobar');

        await AsyncTestUtil.wait(200);
        set.add('foobar2');

        const has = set.has('foobar');
        assert.equal(false, has);
    });
});
