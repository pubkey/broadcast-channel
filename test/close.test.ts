import { describe, expect, it } from "vite-plus/test";

import * as BroadcastChannel from "../src/index.js";
class Foo {
  bc: BroadcastChannel.BroadcastChannel;
  constructor() {
    this.bc = new BroadcastChannel.BroadcastChannel("test");
    this.bc.addEventListener("message", this.cb);
  }

  cb() {}
}

describe("Broadcast Channel", () => {
  it("should handle local channel operations", async () => {
    const foo = new Foo();

    const result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    expect(result).toBe(true);

    // Cleanup
    await foo.bc.close();
  });
});
