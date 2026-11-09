import { describe, it } from "vite-plus/test";

import { BroadcastChannel } from "../src/index.js";
import { randomString, wait } from "./test-util";

const benchmark = {
  openClose: {},
  sendRecieve: {} as { parallel?: number; series?: number },
};

const options = {
  node: {
    useFastPath: false,
  },
  type: "simulate" as const,
};

const elapsedTime = (before: number) => {
  return performance.now() - before;
};

describe("performance.test.js", () => {
  // oxlint-disable-next-line vitest/expect-expect
  it("wait a bit for jit etc..", async () => {
    await wait(2000);
  });

  // oxlint-disable-next-line vitest/expect-expect
  it("open/close channels", async () => {
    const channelName = randomString(10);

    const amount = 110;
    const channels = [];

    const startTime = performance.now();
    for (let i = 0; i < amount; i++) {
      const channel = new BroadcastChannel(channelName, options);
      channels.push(channel);
    }
    await Promise.all(channels.map((c) => c.close()));

    const elapsed = elapsedTime(startTime);
    benchmark.openClose = elapsed;
  });

  // oxlint-disable-next-line vitest/expect-expect
  it("sendRecieve.parallel", async () => {
    const channelName = randomString(10);
    const channelSender = new BroadcastChannel(channelName, options);
    const channelReciever = new BroadcastChannel(channelName, options);
    const msgAmount = 2000;
    let emittedCount = 0;
    const waitPromise = new Promise<void>((resolve) => {
      channelReciever.onmessage = () => {
        emittedCount++;
        if (emittedCount === msgAmount) {
          resolve();
        }
      };
    });

    const startTime = performance.now();
    for (let i = 0; i < msgAmount; i++) {
      channelSender.postMessage("foobar");
    }
    await waitPromise;

    channelSender.close();
    channelReciever.close();

    const elapsed = elapsedTime(startTime);
    benchmark.sendRecieve.parallel = elapsed;
  });

  // oxlint-disable-next-line vitest/expect-expect
  it("sendRecieve.series", { timeout: 10000 }, async () => {
    const channelName = randomString(10);
    const channelSender = new BroadcastChannel(channelName, options);
    const channelReciever = new BroadcastChannel(channelName, options);
    const msgAmount = 600;
    let emittedCount = 0;

    channelReciever.onmessage = () => {
      channelReciever.postMessage("pong");
    };

    const waitPromise = new Promise<void>((resolve) => {
      channelSender.onmessage = () => {
        emittedCount++;
        if (emittedCount === msgAmount) {
          resolve();
        } else {
          channelSender.postMessage("ping");
        }
      };
    });

    const startTime = performance.now();
    channelSender.postMessage("ping");
    await waitPromise;

    channelSender.close();
    channelReciever.close();

    const elapsed = elapsedTime(startTime);
    benchmark.sendRecieve.series = elapsed;
  });

  // oxlint-disable-next-line vitest/expect-expect
  it("show result", () => {
    console.log("benchmark result:");
    console.log(JSON.stringify(benchmark, null, 2));
  });
});
