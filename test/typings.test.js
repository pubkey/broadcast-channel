/**
 * checks if the typings are correct
 * run via 'npm run test:typings'
 */
const assert = require('assert');
const path = require('path');
const AsyncTestUtil = require('async-test-util');

describe('typings.test.ts', () => {
    const mainPath = path.join(__dirname, '../');
    const codeBase = `
        import { 
            BroadcastChannel
        } from '${mainPath}';
        declare type Message = {
            foo: string;
        };
    `;
    const transpileCode = async (code) => {
        const spawn = require('child-process-promise').spawn;
        const stdout = [];
        const stderr = [];

        const tsConfig = {
            target: 'es6',
            strict: true,
            isolatedModules: false,
        };
        const promise = spawn('ts-node', ['--compiler-options', JSON.stringify(tsConfig), '-e', codeBase + '\n' + code]);
        const childProcess = promise.childProcess;
        childProcess.stdout.on('data', (data) => {
            // console.dir(data.toString());
            stdout.push(data.toString());
        });
        childProcess.stderr.on('data', (data) => {
            // console.log('err:');
            // console.dir(data.toString());
            stderr.push(data.toString());
        });
        try {
            await promise;
        } catch (err) {
            throw new Error(`could not run
                # Error: ${err}
                # Output: ${stdout}
                # ErrOut: ${stderr}
                `);
        }
    };
    describe('basic', () => {
        it('should sucess on basic test', async () => {
            await transpileCode('console.log("Hello, world!")');
        });
        it('should fail on broken code', async () => {
            const brokenCode = `
                let x: string = 'foo';
                x = 1337;
            `;
            let thrown = false;
            try {
                await transpileCode(brokenCode);
            } catch (err) {
                thrown = true;
            }
            assert.ok(thrown);
        });
    });
    describe('non-typed channel', () => {
        it('should be ok to create post and recieve', async () => {
            const code = `
                (async() => {
                    const channel = new BroadcastChannel('foobar');
                    const emitted: any[] = [];
                    channel.onmessage = msg => emitted.push(msg);
                    await channel.postMessage({foo: 'bar'});
                    channel.close();
                })();
            `;
            await transpileCode(code);
        });
        it('should not allow to set wrong onmessage', async () => {
            const code = `
                (async() => {
                    const channel = new BroadcastChannel('foobar');

                    const emitted: any[] = [];
                    channel.onmessage = {};
                    await channel.postMessage({foo: 'bar'});
                    channel.close();
                })();
            `;
            await AsyncTestUtil.assertThrows(() => transpileCode(code));
        });
    });
    describe('typed channel', () => {
        it('should be ok to create and post', async () => {
            const code = `
                (async() => {
                    const channel = new BroadcastChannel<Message>('foobar');
                    await channel.postMessage({foo: 'bar'});
                    channel.close();
                })();
            `;
            await transpileCode(code);
        });
        it('should be ok to recieve', async () => {
            const code = `
                (async() => {
                    const channel: BroadcastChannel<Message> = new BroadcastChannel('foobar');
                    const emitted: Message[] = [];
                    channel.onmessage = msg => {
                        const f: string = msg.foo;
                        emitted.push(msg);
                    };
                    channel.close();
                })();
            `;
            await transpileCode(code);
        });
        it('should not allow to post wrong message', async () => {
            const code = `
                (async() => {
                    const channel = new BroadcastChannel<Message>('foobar');
                    await channel.postMessage({x: 42});
                    channel.close();
                })();
            `;
            await AsyncTestUtil.assertThrows(() => transpileCode(code));
        });
    });
});
