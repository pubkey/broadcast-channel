/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable vitest/expect-expect */
import clone from "clone";
import isNode from "detect-node";
import * as unload from "unload";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { BroadcastChannel, enforceOptions, OPEN_BROADCAST_CHANNELS, Options, RedundantAdaptiveBroadcastChannel } from "../src";
import { randomString, wait, waitUntil } from "./test-util";

if (isNode) {
  process.on("uncaughtException", (err, origin) => {
    console.error("uncaughtException!");
    console.dir(err);
    console.dir(origin);
    process.exit(1);
  });
} else {
  window.addEventListener("unhandledrejection", (event) => {
    console.error("unhandledRejection!");
    console.dir(event);
  });
}

/**
 * we run this test once per method
 */
function runTest(channelOptions: Options) {
  describe(`integration.test.js (${JSON.stringify(channelOptions)})`, () => {
    describe("BroadcastChannel", () => {
      describe(".constructor()", () => {
        it("log options", () => {
          console.log("Started: " + JSON.stringify(channelOptions));
          expect(true).toBe(true);
        });
        it("should create a channel", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          await channel.close();
          expect(channel.closed).toBe(true);
        });
      });
      describe(".postMessage()", () => {
        it("should post a message", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          await channel.postMessage("foobar");
          channel.close();
        });
        it("should throw if channel is already closed", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          channel.close();
          try {
            channel.postMessage("foobar");
            expect.fail("should have thrown");
          } catch (e) {
            // oxlint-disable-next-line vitest/no-conditional-expect
            expect((e as Error).message).toContain("closed");
          }
        });
      });
      describe(".close()", () => {
        it("should have resolved all processed message promises when close() resolves", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);

          channel.postMessage({});
          channel.postMessage({});
          channel.postMessage({});
          try {
            await channel.close();
          } catch (error) {
            console.error(error);
          }
          expect(channel.isClosed).toBe(true);
          expect(channel._uMP.size).toBe(0);
        });
      });
      describe(".onmessage", () => {
        /**
         * the window.BroadcastChannel
         * does not emit postMessage to own subscribers,
         * if you want to do that, you have to create another channel
         */
        it("should NOT recieve the message on own", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);

          const emitted = [];
          channel.onmessage = (msg) => emitted.push(msg);
          await channel.postMessage({
            foo: "bar",
          });

          await wait(100);
          expect(emitted.length).toBe(0);

          channel.close();
        });
        it("should recieve the message on other channel", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          const otherChannel = new BroadcastChannel(channelName, channelOptions);

          const emitted: any[] = [];
          otherChannel.onmessage = (msg) => emitted.push(msg);
          await channel.postMessage({
            foo: "bar",
          });
          await waitUntil(() => emitted.length >= 1);
          expect(emitted[0].foo).toBe("bar");
          channel.close();
          otherChannel.close();
        });
        it("should work with strange channelName", async () => {
          const channelName = "  asdf  / " + randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          const otherChannel = new BroadcastChannel(channelName, channelOptions);

          const emitted: any[] = [];
          otherChannel.onmessage = (msg) => emitted.push(msg);
          await channel.postMessage({
            foo: "bar",
          });
          await waitUntil(() => emitted.length === 1);
          expect(emitted[0].foo).toBe("bar");
          channel.close();
          otherChannel.close();
        });
        it("should have the same message-data", async () => {
          const channelName = randomString(12);
          const channel1 = new BroadcastChannel(channelName, channelOptions);
          const channel2 = new BroadcastChannel(channelName, channelOptions);

          const emitted: any[] = [];
          channel2.onmessage = (msg) => emitted.push(msg);

          const msgJson = {
            foo: "bar",
          };
          await channel1.postMessage(msgJson);

          await waitUntil(() => emitted.length === 1);
          expect(emitted[0]).toEqual(msgJson);

          channel1.close();
          channel2.close();
        });
        it("should work with big message-data", async () => {
          const channelName = randomString(12);
          const channel1 = new BroadcastChannel(channelName, channelOptions);
          const channel2 = new BroadcastChannel(channelName, channelOptions);

          const emitted: any[] = [];
          channel2.onmessage = (msg) => emitted.push(msg);

          const msgJson = {
            one: randomString(1000),
            two: randomString(1000),
            three: randomString(1000),
          };
          await channel1.postMessage(msgJson);

          await waitUntil(() => emitted.length === 1);
          expect(emitted[0]).toEqual(msgJson);

          channel1.close();
          channel2.close();
        });
        it("should not loose the message if _prepare() takes a while", async () => {
          const channelName = randomString(12);
          const slowerOptions = clone(channelOptions);
          slowerOptions.prepareDelay = 300;
          const channel1 = new BroadcastChannel(channelName, channelOptions);
          const channel2 = new BroadcastChannel(channelName, slowerOptions);

          const emitted: any[] = [];
          channel2.onmessage = (msg) => emitted.push(msg);

          const msgJson = {
            foo: "bar",
          };
          await channel1.postMessage(msgJson);

          await waitUntil(() => emitted.length === 1);
          expect(emitted[0]).toEqual(msgJson);

          channel1.close();
          channel2.close();
        });
        it("should NOT emit all events if subscribed directly after postMessage", async () => {
          const channelName = randomString(12);
          const channel1 = new BroadcastChannel(channelName, channelOptions);
          const channel2 = new BroadcastChannel(channelName, channelOptions);

          channel1.postMessage("foo1");
          channel1.postMessage("foo2");

          /**
           * We have to wait 200ms here because only 'too old' messages should be filtered out.
           * Becuase the JavaScript time precision is not good enough, we also emit messages that are only a bit off.
           * This ensures we do not miss out messages which would be way more critical then getting additionals.
           */
          await wait(200);

          const emitted = [];
          channel2.onmessage = (msg) => emitted.push(msg);

          channel1.postMessage("foo3");

          await waitUntil(() => emitted.length >= 1);
          await wait(100);
          expect(emitted.length).toBe(1);

          channel1.close();
          channel2.close();
        });
        it("should not emit messages, send before onmessage was set, when one tick was done", async () => {
          const channelName = randomString(12);

          const channel1 = new BroadcastChannel(channelName, channelOptions);
          const channel2 = new BroadcastChannel(channelName, channelOptions);

          channel1.postMessage("foo1");
          channel1.postMessage("foo2");

          await wait(500);

          const emitted: any[] = [];
          channel2.onmessage = (msg) => emitted.push(msg);

          const msgJson = {
            foo: "bar",
          };
          channel1.postMessage(msgJson);

          await waitUntil(() => emitted.length >= 1);
          expect(emitted.length).toBe(1);
          expect(emitted[0]).toEqual(msgJson);

          channel1.close();
          channel2.close();
        });
        it("should not confuse messages between different channels", async () => {
          const channel = new BroadcastChannel(randomString(12), channelOptions);
          const otherChannel = new BroadcastChannel(randomString(12), channelOptions);

          const emitted = [];
          otherChannel.onmessage = (msg) => emitted.push(msg);
          await channel.postMessage({
            foo: "bar",
          });
          await wait(100);
          expect(emitted.length).toBe(0);

          channel.close();
          otherChannel.close();
        });
        it("should not read messages created before the channel was created", async () => {
          if (isNode) return;
          await wait(100);

          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);

          await channel.postMessage("foo1");
          await wait(50);

          const otherChannel = new BroadcastChannel(channelName, channelOptions);
          const emittedOther = [];
          otherChannel.onmessage = (msg) => emittedOther.push(msg);

          await channel.postMessage("foo2");
          await channel.postMessage("foo3");

          await waitUntil(() => emittedOther.length >= 2);
          await wait(100);

          expect(emittedOther.length).toBe(2);

          channel.close();
          otherChannel.close();
        });
        it("should only run the last onmessage-callback", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          const channel2 = new BroadcastChannel(channelName, channelOptions);

          const emitted1 = [];
          const emitted2 = [];

          channel2.onmessage = (msg) => {
            emitted1.push(msg);
          };
          channel2.onmessage = (msg) => {
            emitted2.push(msg);
          };

          await channel.postMessage("foobar");

          await waitUntil(() => emitted2.length >= 1);
          await wait(100);

          expect(emitted1.length).toBe(0);
          expect(emitted2.length).toBe(1);

          channel.close();
          channel2.close();
        });
      });
      describe(".addEventListener()", () => {
        it("should emit events to all subscribers", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          const otherChannel = new BroadcastChannel(channelName, channelOptions);

          const emitted1: any[] = [];
          const emitted2: any[] = [];

          otherChannel.addEventListener("message", (msg) => emitted1.push(msg));
          otherChannel.addEventListener("message", (msg) => emitted2.push(msg));

          const msg = {
            foo: "bar",
          };
          await channel.postMessage(msg);

          await waitUntil(() => emitted1.length === 1);
          await waitUntil(() => emitted2.length === 1);

          expect(emitted1[0]).toEqual(msg);
          expect(emitted2[0]).toEqual(msg);

          channel.close();
          otherChannel.close();
        });
      });
      describe(".removeEventListener()", () => {
        it("should no longer emit the message", async () => {
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          const otherChannel = new BroadcastChannel(channelName, channelOptions);

          const emitted = [];
          const fn = (msg: any) => emitted.push(msg);
          otherChannel.addEventListener("message", fn);

          const msg = {
            foo: "bar",
          };
          await channel.postMessage(msg);

          await waitUntil(() => emitted.length === 1);

          otherChannel.removeEventListener("message", fn);

          await channel.postMessage(msg);
          await wait(100);

          expect(emitted.length).toBe(1);

          channel.close();
          otherChannel.close();
        });
      });
      describe(".type", () => {
        it.runIf(channelOptions.methods)("should get a type", async () => {
          const channel = new BroadcastChannel(randomString(12), channelOptions);
          const type = channel.method.type;

          expect(typeof type).toBe("string");
          expect(type).not.toBe("");
          expect(type).toBe(channelOptions.methods!.type);

          channel.close();
        });
      });
      describe(".enforceOptions()", () => {
        it("should enforce the simulate method, even when " + channelOptions.type + " is set", async () => {
          enforceOptions({
            type: "simulate",
          });
          const channel = new BroadcastChannel(randomString(12), channelOptions);

          expect(channel.type).toBe("simulate");

          channel.close();
        });
        it.runIf(channelOptions.methods)("should redo the enforcement when null is given", async () => {
          // @ts-expect-error -- null intentionally resets the enforced options
          enforceOptions(null);
          const channel = new BroadcastChannel(randomString(12), channelOptions);
          expect(channel.type).toBe(channelOptions.methods!.type);

          channel.close();
        });
      });
      describe("other", () => {
        it.runIf(!isNode)("should prefer localstorage if webWorkerSupport: false", async () => {
          // disable BroadcastChannel
          // @ts-expect-error -- null intentionally resets the enforced options
          enforceOptions(null);
          const broadcastChannelBefore = window.BroadcastChannel;
          Object.defineProperty(window, "BroadcastChannel", {
            enumerable: false,
            configurable: false,
            writable: true,
            value: false,
          });

          const options = {
            webWorkerSupport: false,
          };
          const channel = new BroadcastChannel(randomString(12), options);
          expect(channel.type).toBe("localstorage");

          window.BroadcastChannel = broadcastChannelBefore;
        });
        it("should always emit in the correct order", async () => {
          if (isNode) return;
          const channelName = randomString(12);
          const channel = new BroadcastChannel(channelName, channelOptions);
          const otherChannel = new BroadcastChannel(channelName, channelOptions);

          const emitted: any[] = [];
          otherChannel.onmessage = (msg) => emitted.push(msg);

          const amount = 300;
          let nr = 0;
          new Array(amount).fill(0).forEach(() => {
            channel.postMessage({
              nr,
              long: randomString(512),
            });
            nr++;
          });

          await waitUntil(() => emitted.length === amount);

          let checkNr = 0;
          emitted.forEach((msg) => {
            expect(checkNr).toBe(msg.nr);
            checkNr++;
          });

          channel.close();
          otherChannel.close();
        });
      });
      describe("ISSUES", () => {
        it("#6 premature closing of the channel should not throw", async () => {
          const channels = [];
          for (let i = 0; i < 10; i++) {
            const channel = new BroadcastChannel(randomString(12), channelOptions);
            unload.runAll();
            channels.push(channel);
          }
          channels.forEach((channel) => channel.close());
        });
      });
    });
  });
  describe("final", () => {
    it.runIf(isNode)("should have closed all channels", () => {
      expect(OPEN_BROADCAST_CHANNELS.size).toBe(0);
    });
  });
}

const useOptions = [
  {
    // type: "simulate",
  },
];

if (!isNode) {
  if (window.BroadcastChannel) {
    useOptions.push({
      type: "native",
    });
  } else {
    console.log("skip native option since windonw.BroadcastChannel is undefined");
  }
  useOptions.push({
    type: "idb",
  });
  useOptions.push({
    type: "localstorage",
  });
}

useOptions.forEach((o) => runTest(o));

describe("RedundantAdaptiveBroadcastChannel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe(".constructor()", () => {
    it("log options", () => {
      console.log("Started: " + JSON.stringify({}));
    });
    it("should create a channel", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      await channel.close();
    });
  });

  describe(".postMessage()", () => {
    it("should post a message", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      await channel.postMessage("foobar");
      await channel.close();
    });
    it("should throw if channel is already closed", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      await channel.close();
      await expect(channel.postMessage("foobar")).rejects.toThrow("closed");
    });
  });

  // TODO: fix this test
  describe.skip("adaptive post message", () => {
    it("should still receive message if 1 channel post fail with error", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      const otherChannel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      // native channel post message fail
      const nativeChannel = channel.channels.get("native");
      vi.spyOn(nativeChannel!, "postMessage").mockRejectedValue(new Error("test"));

      const emitted: any[] = [];
      otherChannel.onmessage = (msg) => emitted.push(msg);
      await channel.postMessage({
        foo: "bar",
      });
      await waitUntil(() => emitted.length === 1);
      expect(emitted[0].foo).toBe("bar");
      await channel.close();
      await otherChannel.close();
    });

    it("should still receive message if multiple channels post fail with error", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      const otherChannel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      // fail these channels
      const failChannels = ["native", "idb", "localstorage"];
      for (const [type, c] of channel.channels.entries()) {
        if (failChannels.includes(type)) {
          vi.spyOn(c, "postMessage").mockRejectedValue(new Error("test"));
        }
      }

      const emitted: any[] = [];
      otherChannel.onmessage = (msg) => emitted.push(msg);
      await channel.postMessage({
        foo: "bar",
      });
      await waitUntil(() => emitted.length === 1);
      expect(emitted[0].foo).toBe("bar");
      await channel.close();
      await otherChannel.close();
    });

    it("should still receive message if 1 channel post fail silently", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      const otherChannel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      // native channel post message fail
      const nativeChannel = channel.channels.get("native");
      vi.spyOn(nativeChannel!, "postMessage").mockResolvedValue(null);

      const emitted: any[] = [];
      otherChannel.onmessage = (msg) => emitted.push(msg);
      await channel.postMessage({
        foo: "bar",
      });
      await waitUntil(() => emitted.length === 1);
      expect(emitted[0].foo).toBe("bar");
      await channel.close();
      await otherChannel.close();
    });

    it("should still receive message if multiple channels post fail silently", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      const otherChannel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      // fail these channels
      const failChannels = ["native", "idb", "localstorage"];
      for (const [type, c] of channel.channels.entries()) {
        if (failChannels.includes(type)) {
          vi.spyOn(c, "postMessage").mockResolvedValue(null);
        }
      }

      const emitted: any[] = [];
      otherChannel.onmessage = (msg) => emitted.push(msg);
      await channel.postMessage({
        foo: "bar",
      });
      await waitUntil(() => emitted.length === 1);
      expect(emitted[0].foo).toBe("bar");
      await channel.close();
      await otherChannel.close();
    });
  });

  describe(".onmessage", () => {
    /**
     * the window.BroadcastChannel
     * does not emit postMessage to own subscribers,
     * if you want to do that, you have to create another channel
     */
    it("should NOT receive the message on own", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      const emitted = [];
      channel.onmessage = (msg) => emitted.push(msg);
      await channel.postMessage({
        foo: "bar",
      });

      await wait(100);
      expect(emitted.length).toBe(0);

      await channel.close();
    });
    it("should receive the message on other channel", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      const otherChannel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      const emitted: any[] = [];
      otherChannel.onmessage = (msg) => emitted.push(msg);
      await channel.postMessage({
        foo: "bar",
      });
      await waitUntil(() => emitted.length === 1);
      expect(emitted[0].foo).toBe("bar");
      await channel.close();
      await otherChannel.close();
    });
  });

  describe(".close()", () => {
    it("should have resolved all processed message promises when close() resolves", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      channel.postMessage({});
      channel.postMessage({});
      channel.postMessage({});

      await channel.close();
      for (const c in channel.channels.values()) {
        // @ts-expect-error test
        expect(c.isClosed).toBe(true);
        // @ts-expect-error test
        expect(c._uMP.size).toBe(0);
      }
    });
  });

  describe(".addEventListener()", () => {
    it("should emit events to all subscribers", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      const otherChannel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      const emitted1: any[] = [];
      const emitted2: any[] = [];

      otherChannel.addEventListener("message", (msg) => emitted1.push(msg));
      otherChannel.addEventListener("message", (msg) => emitted2.push(msg));

      const msg = {
        foo: "bar",
      };
      await channel.postMessage(msg);

      await waitUntil(() => emitted1.length === 1);
      await waitUntil(() => emitted2.length === 1);

      expect(emitted1[0]).toEqual(msg);
      expect(emitted2[0]).toEqual(msg);

      await channel.close();
      await otherChannel.close();
    });
  });

  describe(".removeEventListener()", () => {
    it("should no longer emit the message", async () => {
      const channelName = randomString(12);
      const channel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });
      const otherChannel = new RedundantAdaptiveBroadcastChannel(channelName, {
        type: "simulate",
      });

      const emitted = [];
      const fn = (msg: any) => emitted.push(msg);
      otherChannel.addEventListener("message", fn);

      const msg = {
        foo: "bar",
      };
      await channel.postMessage(msg);

      await waitUntil(() => emitted.length === 1);

      otherChannel.removeEventListener("message", fn);

      await channel.postMessage(msg);
      await wait(100);

      expect(emitted.length).toBe(1);

      await channel.close();
      await otherChannel.close();
    });
  });
});
