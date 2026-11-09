/* oxlint-disable vitest/expect-expect */
/**
 * checks if the typings are correct
 * run via 'npm run test:typings'
 */
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

import { describe, expect, it } from "vite-plus/test";

describe("typings.test.ts", () => {
  // Use the built types folder
  const mainPath = path.join(__dirname, "../dist/lib.cjs");
  const codeBase = `
        import { 
            BroadcastChannel
        } from '${mainPath}';
        declare type Message = {
            foo: string;
        };
    `;

  const checkTypes = (code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const tempFile = path.join(os.tmpdir(), `typing-test-${Date.now()}-${Math.random().toString(36).slice(2)}.ts`);
      const fullCode = codeBase + "\n" + code;

      fs.writeFileSync(tempFile, fullCode);

      const stdout: string[] = [];
      const stderr: string[] = [];

      const child = spawn("tsc", ["--noEmit", "--strict", "--target", "es6", "--module", "commonjs", "--skipLibCheck", "--ignoreConfig", tempFile]);

      child.stdout.on("data", (data: Buffer) => {
        stdout.push(data.toString());
      });
      child.stderr.on("data", (data: Buffer) => {
        stderr.push(data.toString());
      });

      child.on("close", (exitCode) => {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }

        if (exitCode === 0) {
          resolve();
        } else {
          reject(
            new Error(`Type check failed
                # Exit code: ${exitCode}
                # Output: ${stdout.join("")}
                # ErrOut: ${stderr.join("")}
                `)
          );
        }
      });

      child.on("error", (err) => {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
        reject(err);
      });
    });
  };

  describe("basic", () => {
    it("should sucess on basic test", async () => {
      await checkTypes('console.log("Hello, world!")');
    });

    it("should fail on broken code", async () => {
      const brokenCode = `
                let x: string = 'foo';
                x = 1337;
            `;
      await expect(checkTypes(brokenCode)).rejects.toThrow();
    });
  });

  describe("non-typed channel", () => {
    it("should be ok to create post and recieve", async () => {
      const code = `
                (async() => {
                    const channel = new BroadcastChannel('foobar', { type: 'simulate' });
                    const emitted: any[] = [];
                    channel.onmessage = msg => emitted.push(msg);
                    await channel.postMessage({foo: 'bar'});
                    channel.close();
                })();
            `;
      await checkTypes(code);
    });

    it("should not allow to set wrong onmessage", async () => {
      const code = `
                (async() => {
                    const channel = new BroadcastChannel('foobar');

                    const emitted: any[] = [];
                    channel.onmessage = {};
                    await channel.postMessage({foo: 'bar'});
                    channel.close();
                })();
            `;
      await expect(checkTypes(code)).rejects.toThrow();
    });
  });

  describe("typed channel", () => {
    it("should be ok to create and post", async () => {
      const code = `
                (async() => {
                    const channel = new BroadcastChannel<Message>('foobar', { type: 'simulate' });
                    await channel.postMessage({foo: 'bar'});
                    channel.close();
                })();
            `;
      await checkTypes(code);
    });

    it("should be ok to recieve", async () => {
      const code = `
                (async() => {
                    const channel: BroadcastChannel<Message> = new BroadcastChannel('foobar', { type: 'simulate' });
                    const emitted: Message[] = [];
                    channel.onmessage = msg => {
                        const f: string = msg.foo;
                        emitted.push(msg);
                    };
                    channel.close();
                })();
            `;
      await checkTypes(code);
    });

    it("should not allow to post wrong message", async () => {
      const code = `
          (async() => {
              const channel = new BroadcastChannel<Message>('foobar');
              await channel.postMessage({x: 42});
              channel.close();
          })();
      `;
      await expect(checkTypes(code)).rejects.toThrow();
    });
  });
});
