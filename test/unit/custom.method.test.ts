import { describe, expect, it } from "vite-plus/test";

import { BroadcastChannel, Method } from "../../src/index.js";
import { randomString } from "../test-util";

describe("unit/custom.method.test.js", () => {
  describe("custom methods", () => {
    it("should select provided method", () => {
      const channelName = randomString(12);
      const method = {
        type: "custom",
        canBeUsed: () => true,
        create: () => ({}),
      } as unknown as Method;
      const channel = new BroadcastChannel(channelName, { methods: method });
      expect(channel.method).toBe(method);
      channel.close();
    });
    it("should select one of the provided methods", () => {
      const channelName = randomString(12);
      const method = {
        type: "custom",
        canBeUsed: () => true,
        create: () => ({}),
        microSeconds: () => 0,
        postMessage: () => Promise.resolve(),
        onMessage: () => {},
        close: () => Promise.resolve(),
      } as unknown as Method;
      const channel = new BroadcastChannel(channelName, { methods: method });

      expect(channel.method).toBe(method);
      channel.close();
    });
  });
});
