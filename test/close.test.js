import BroadcastChannel from 'broadcast-channel';

class Foo {
    constructor() {
        this.bc = new BroadcastChannel.BroadcastChannel('test');
        this.bc.addEventListener('message', this.cb);
    }

    cb() {}
}

describe('Broadcast Channel', () => {
    test('local', async () => {
        const foo = new Foo();

        const result = await new Promise((a) => {
            setTimeout(() => {
                a(true);
            }, 1000);
        });

        expect(result).toBe(true);

        // Cleanup
        await foo.bc.close();
    });
});
