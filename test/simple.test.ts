/**
 * a simple test which just checks if the basics work
 */
import { describe, expect, it } from "vite-plus/test";

import { BroadcastChannel } from "../src/index.js";

describe("simple.test.js", () => {
  it("should handle basic message passing between channels", async () => {
    const channelName = "simpleTestChannel";
    const channel = new BroadcastChannel(channelName);
    const channel2 = new BroadcastChannel(channelName);

    const messages: unknown[] = [];
    channel.onmessage = (msg) => messages.push(msg);

    // Send message from channel1
    await channel.postMessage({
      foo: "bar",
    });

    // Send message from channel2
    await channel2.postMessage({
      foo: "bar",
    });

    // Wait a bit for message processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify message was received
    expect(messages).toHaveLength(1);
    expect(messages[0]).toEqual({ foo: "bar" });

    // Cleanup
    await channel.close();
    await channel2.close();
  });
});
