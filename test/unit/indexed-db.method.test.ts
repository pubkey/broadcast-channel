import isNode from "detect-node";
import { describe, expect, it } from "vite-plus/test";

import { IndexedDbMethod, MessageObject } from "../../src/index.js";
import { randomString, wait, waitUntil } from "../test-util";

type FooMessage = MessageObject & { foo: string };

console.log(IndexedDbMethod.getIdb);
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

describe("unit/indexed-db.method.test.js", () => {
  if (isNode) return;

  describe(".getIdb()", () => {
    it("should get an object", () => {
      const idb = IndexedDbMethod.getIdb();
      expect(idb).toBeTruthy();
    });
  });

  describe(".createDatabase()", () => {
    it("should create a database", async () => {
      const channelName = randomString(10);
      const db = await IndexedDbMethod.createDatabase(channelName);
      expect(db).toBeTruthy();
    });

    it("should be able to call twice", async () => {
      const channelName = randomString(10);
      const db1 = await IndexedDbMethod.createDatabase(channelName);
      const db2 = await IndexedDbMethod.createDatabase(channelName);
      expect(db1).toBeTruthy();
      expect(db2).toBeTruthy();
    });
  });

  describe(".writeMessage()", () => {
    // oxlint-disable-next-line vitest/expect-expect
    it("should write the message to the db", async () => {
      const channelName = randomString(10);
      const readerUuid = randomString(10);
      const db = await IndexedDbMethod.createDatabase(channelName);
      await IndexedDbMethod.writeMessage(db, readerUuid, {
        foo: "bar",
      } as FooMessage);
    });
  });

  describe(".getAllMessages()", () => {
    it("should get the message", async () => {
      const channelName = randomString(10);
      const readerUuid = randomString(10);
      const db = await IndexedDbMethod.createDatabase(channelName);
      await IndexedDbMethod.writeMessage(db, readerUuid, {
        foo: "bar",
      } as FooMessage);

      const messages = await IndexedDbMethod.getAllMessages(db);
      expect(messages).toHaveLength(1);
      expect((messages[0]!.data as FooMessage).foo).toBe("bar");
    });

    it("should get the messages", async () => {
      const channelName = randomString(10);
      const readerUuid = randomString(10);
      const db = await IndexedDbMethod.createDatabase(channelName);
      await IndexedDbMethod.writeMessage(db, readerUuid, {
        foo: "bar",
      } as FooMessage);
      await IndexedDbMethod.writeMessage(db, readerUuid, {
        foo: "bar2",
      } as FooMessage);

      const messages = await IndexedDbMethod.getAllMessages(db);
      expect(messages).toHaveLength(2);
    });
  });

  describe(".getOldMessages()", () => {
    it("should only get too old messages", async () => {
      const channelName = randomString(10);
      const readerUuid = randomString(10);
      const db = await IndexedDbMethod.createDatabase(channelName);
      const msgJson = {
        foo: "old",
      } as FooMessage;

      // write 10 messages
      await Promise.all(new Array(10).fill(undefined).map(() => IndexedDbMethod.writeMessage(db, readerUuid, msgJson)));
      await wait(500);

      // write 2 new messages
      await Promise.all(new Array(10).fill(undefined).map(() => IndexedDbMethod.writeMessage(db, readerUuid, msgJson)));

      const tooOld = await IndexedDbMethod.getOldMessages(db, 200);
      expect(tooOld).toHaveLength(10);
      tooOld.forEach((msg) => {
        expect((msg.data as FooMessage).foo).toBe("old");
      });
    });
  });

  describe(".cleanOldMessages()", () => {
    it("should clean up old messages", async () => {
      const channelName = randomString(10);
      const readerUuid = randomString(10);
      const db = await IndexedDbMethod.createDatabase(channelName);
      const msgJson = {
        foo: "bar",
      } as FooMessage;
      await IndexedDbMethod.writeMessage(db, readerUuid, msgJson);

      await wait(500);

      await IndexedDbMethod.cleanOldMessages(db, 200);

      IndexedDbMethod.getAllMessages(db); // call parallel
      const messagesAfter = await IndexedDbMethod.getAllMessages(db);
      expect(messagesAfter).toHaveLength(0);
    });
  });

  describe(".getMessagesHigherThan()", () => {
    it("should only get messages with higher id", async () => {
      const channelName = randomString(10);
      const readerUuid = randomString(10);
      const db = await IndexedDbMethod.createDatabase(channelName);
      const msgJson = {
        foo: "bar",
      } as FooMessage;

      // write 10 messages
      await Promise.all(new Array(10).fill(undefined).map(() => IndexedDbMethod.writeMessage(db, readerUuid, msgJson)));

      // get last 5 messages
      const lastFive = await IndexedDbMethod.getMessagesHigherThan(db, 5);
      expect(lastFive).toHaveLength(5);
      expect(lastFive[0]!.id).toBe(6);
      expect(lastFive[4]!.id).toBe(10);
    });
  });

  describe("core-functions", () => {
    describe(".create()", () => {
      it("should create a channelState", async () => {
        const channelName = randomString(10);
        // @ts-expect-error -- options are optional at runtime
        const channelState = await IndexedDbMethod.create(channelName);
        expect(channelState).toBeTruthy();
        IndexedDbMethod.close(channelState);
      });

      it("should be called twice", async () => {
        const channelName = randomString(12);
        // @ts-expect-error -- options are optional at runtime
        const channelState1 = await IndexedDbMethod.create(channelName);
        // @ts-expect-error -- options are optional at runtime
        const channelState2 = await IndexedDbMethod.create(channelName);
        expect(channelState1).toBeTruthy();
        expect(channelState2).toBeTruthy();

        await IndexedDbMethod.close(channelState1);
        await IndexedDbMethod.close(channelState2);
      });

      it("should handle close events", async () => {
        let callbackCount = 0;
        const channelName = randomString(10);
        const channelState = await IndexedDbMethod.create(channelName, {
          idb: {
            onclose: () => callbackCount++,
          },
        });
        expect(channelState).toBeTruthy();

        // The `onclose` event is not fired if the database connection is closed normally using `IDBDatabase.close()`
        channelState.db.dispatchEvent(new Event("close"));
        expect(callbackCount).toBe(1);
        IndexedDbMethod.close(channelState);
      });
    });

    describe(".postMessage()", () => {
      it("should not crash", async () => {
        const channelName = randomString(10);
        // @ts-expect-error -- options are optional at runtime
        const channelState = await IndexedDbMethod.create(channelName);
        expect(channelState).toBeTruthy();
        await IndexedDbMethod.postMessage(channelState, {
          foo: "bar",
        } as FooMessage);
        IndexedDbMethod.close(channelState);
      });
    });

    describe(".canBeUsed()", () => {
      it("should be true on browsers", async () => {
        const ok = IndexedDbMethod.canBeUsed();
        expect(ok).toBeTruthy();
      });
    });

    describe(".onMessage()", () => {
      it("should emit the message on other", async () => {
        const channelName = randomString(12);
        // @ts-expect-error -- options are optional at runtime
        const channelStateOther = await IndexedDbMethod.create(channelName);
        // @ts-expect-error -- options are optional at runtime
        const channelStateOwn = await IndexedDbMethod.create(channelName);

        const emittedOther: MessageObject[] = [];
        const msgJson = {
          foo: "bar",
        } as FooMessage;

        IndexedDbMethod.onMessage(channelStateOther, (msg) => emittedOther.push(msg), new Date().getTime());
        await IndexedDbMethod.postMessage(channelStateOwn, msgJson);

        await waitUntil(() => emittedOther.length === 1);
        expect(emittedOther[0]).toEqual(msgJson);

        await IndexedDbMethod.close(channelStateOther);
        await IndexedDbMethod.close(channelStateOwn);
      });

      it("should also work if localstorage does not work", async () => {
        const channelName = randomString(12);

        // disable localStorage
        const localStorageBefore = window.localStorage;
        expect(localStorageBefore).toBeTruthy();
        Object.defineProperty(window, "localStorage", {
          enumerable: false,
          configurable: false,
          writable: true,
          value: false,
        });

        const emittedOther: MessageObject[] = [];
        // @ts-expect-error -- options are optional at runtime
        const channelStateOther = await IndexedDbMethod.create(channelName);
        IndexedDbMethod.onMessage(channelStateOther, (msg) => emittedOther.push(msg), new Date().getTime());
        await wait(100);

        // @ts-expect-error -- options are optional at runtime

        const channelStateOwn = await IndexedDbMethod.create(channelName);
        const msgJson = {
          foo: "bar",
        } as FooMessage;
        await IndexedDbMethod.postMessage(channelStateOwn, msgJson);

        await waitUntil(() => emittedOther.length === 1);
        expect(emittedOther[0]).toEqual(msgJson);

        await IndexedDbMethod.close(channelStateOther);
        await IndexedDbMethod.close(channelStateOwn);
        window.localStorage = localStorageBefore;
      });
    });
  });

  describe("other", () => {
    // oxlint-disable-next-line vitest/expect-expect
    it("should have cleaned up the messages", async () => {
      const channelOptions = {
        idb: {
          ttl: 500,
        },
      };
      const channelName = randomString(12);
      const channelStateOther = await IndexedDbMethod.create(channelName, channelOptions);
      const channelStateOwn = await IndexedDbMethod.create(channelName, channelOptions);
      const msgJson = {
        foo: "bar",
      } as FooMessage;

      // send 100 messages
      await Promise.all(new Array(100).fill(0).map(() => IndexedDbMethod.postMessage(channelStateOwn, msgJson)));

      // w8 until ttl has reached
      await wait(channelOptions.idb.ttl);

      // send 100 messages again to trigger cleanup
      for (let x = 0; x < 100; x++) {
        await IndexedDbMethod.postMessage(channelStateOwn, msgJson);
      }

      await wait(channelOptions.idb.ttl);

      // ensure only the last 100 messages are here
      await waitUntil(async () => {
        const messages = await IndexedDbMethod.getAllMessages(channelStateOwn.db);
        return messages.length <= 100;
      });

      await IndexedDbMethod.close(channelStateOther);
      await IndexedDbMethod.close(channelStateOwn);
    });
  });
});
