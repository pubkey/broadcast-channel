/* oxlint-disable vitest/expect-expect */
import isNode from "detect-node";
import { describe, expect, it } from "vite-plus/test";

import { BroadcastChannel } from "../src/index.js";
import { randomString } from "./test-util";

describe("issues.test.js", () => {
  it("#4 should throw when window.BroadcastChannel is overwritten", async () => {
    if (isNode) return; // only on browsers
    const bcBefore = window.BroadcastChannel;
    window.BroadcastChannel = BroadcastChannel as unknown as typeof window.BroadcastChannel;

    let bc: BroadcastChannel | undefined;
    await expect(async () => {
      // @ts-expect-error -- intentionally called without a channel name
      bc = new BroadcastChannel();
    }).rejects.toThrow("polyfill");

    if (bc) bc.close();

    // reset
    window.BroadcastChannel = bcBefore;
  });
  it("https://github.com/pubkey/rxdb/issues/852 if cleanup did not remove the info-file, it should not crash even if socket-file not exists", async () => {
    if (!isNode) return; // only on node
    const channelName = randomString(12);

    const channel1 = new BroadcastChannel(channelName);
    await channel1._prepP;

    // remove socket-file
    // we dont have socketEE in state.
    // fs.unlinkSync(channel1._state.socketEE.path);

    // send message over other channel
    const channel2 = new BroadcastChannel(channelName);
    await channel2.postMessage({
      foo: "bar",
    });

    await channel1.close();
    await channel2.close();
  });
  it("write many messages and then close", async () => {
    const channelName = randomString(12);
    const channel = new BroadcastChannel(channelName, { type: "simulate" });
    new Array(5000)
      .fill(0)
      .map((_i, idx) => ({
        foo: "bar",
        idx,
        longString: randomString(40),
      }))
      .map((msg) => channel.postMessage(msg));

    await channel.close();
  });
});
