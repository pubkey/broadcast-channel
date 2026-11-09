import isNode from "detect-node";
import { describe, expect, it } from "vite-plus/test";

import { LocalstorageMethod as LocalStorageMethod, MessageObject } from "../../src/index";
import { randomString, waitUntil } from "../test-util";

type FooMessage = MessageObject & { foo: string };
type ChannelState = Parameters<typeof LocalStorageMethod.postMessage>[0];

describe("unit/localstorage.method.test.js", () => {
  if (isNode) return;

  describe(".getLocalStorage()", () => {
    it("should always get a object", () => {
      const ls = LocalStorageMethod.getLocalStorage();
      expect(ls).toBeTruthy();
      expect(typeof ls!.setItem).toBe("function");
    });
  });

  describe(".postMessage()", () => {
    it("should set the message", async () => {
      const channelState = {
        channelName: randomString(10),
        uuid: randomString(10),
      } as ChannelState;
      const json = { foo: "bar" } as FooMessage;
      await LocalStorageMethod.postMessage(channelState, json);
      const ls = LocalStorageMethod.getLocalStorage();
      const key = LocalStorageMethod.storageKey(channelState.channelName);
      const value = JSON.parse(ls!.getItem(key)!);
      expect(value.data.foo).toBe("bar");
    });

    it("should fire an event", async () => {
      const channelState = {
        channelName: randomString(10),
        uuid: randomString(10),
      } as ChannelState;
      const json = { foo: "bar" } as FooMessage;

      const emitted: { data: MessageObject }[] = [];
      const listener = LocalStorageMethod.addStorageEventListener(channelState.channelName, (ev) => {
        emitted.push(ev);
      });

      LocalStorageMethod.postMessage(channelState, json);

      await waitUntil(() => emitted.length === 1);
      expect((emitted[0]!.data as FooMessage).foo).toBe("bar");

      LocalStorageMethod.removeStorageEventListener(listener);
    });
  });

  describe(".create()", () => {
    it("create an instance", async () => {
      const channelName = randomString(10);
      // @ts-expect-error -- options are optional at runtime
      const state = LocalStorageMethod.create(channelName);
      expect(state.uuid).toBeTruthy();
      LocalStorageMethod.close(state);
    });
  });

  describe(".onMessage()", () => {
    it("should emit to the other channel", async () => {
      const channelName = randomString(12);
      // @ts-expect-error -- options are optional at runtime
      const channelState1 = await LocalStorageMethod.create(channelName);
      // @ts-expect-error -- options are optional at runtime
      const channelState2 = await LocalStorageMethod.create(channelName);

      const emitted: MessageObject[] = [];
      LocalStorageMethod.onMessage(
        channelState2,
        (msg) => {
          emitted.push(msg);
          console.log("was emitted");
        },
        new Date().getTime()
      );
      const json = {
        foo: "bar",
      } as FooMessage;
      LocalStorageMethod.postMessage(channelState1, json);

      await waitUntil(() => emitted.length === 1);

      expect(emitted[0]).toEqual(json);

      LocalStorageMethod.close(channelState1);
      LocalStorageMethod.close(channelState2);
    });
  });
});
