/* oxlint-disable no-console */
/* oxlint-disable @typescript-eslint/no-unused-expressions */

import { Selector } from "testcafe";

const BASE_PAGE = "http://localhost:8080/e2e.html";

fixture`Example page`.page`http://localhost:8080/`;

// TestCafe compiles TypeScript tests with its bundled TypeScript 4.9, which cannot parse the installed @types/node.
async function waitUntil(condition, interval, timeout) {
  const deadline = Date.now() + timeout;
  while (!(await condition())) {
    if (Date.now() > deadline) {
      throw new Error("waitUntil timed out after " + timeout + "ms");
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Checks if there where errors on the browser console.
 * If yes, this will kill the process
 */
async function assertNoErrors(t) {
  const logs = await t.getBrowserConsoleMessages();
  console.log("logs:");
  console.dir(logs);
  if (logs.error.length > 0) {
    console.log("assertNoErrors got " + logs.error.length + " errors:");
    console.dir(logs.error);
    process.kill(process.pid);
  }
}

async function nativeBroadcastChannelExists(t) {
  const prop = await t.eval(() => window.BroadcastChannel);
  const ret = !!prop;
  console.log("nativeBroadcastChannelExists: " + ret);
  return ret;
}

// BroadcastChannel
["native", "idb", "localstorage", "default"].forEach((methodType) => {
  test.page(BASE_PAGE + "?methodType=" + methodType + "&autoStart=startBroadcastChannel")(
    "test(BroadcastChannel) with method: " + methodType,
    async (t) => {
      console.log("##### START BroadcastChannel TEST WITH " + methodType);

      if (methodType === "native" && !(await nativeBroadcastChannelExists(t))) {
        console.log("skipping native method since it is not supported by the browser");
        return;
      }

      await assertNoErrors(t);
      await waitUntil(
        async () => {
          await assertNoErrors(t);
          const stateContainer = Selector("#state");
          const exists = await stateContainer.exists;
          if (!exists) {
            console.log("stateContainer not exists");
            /*
                        const out = await t.getBrowserConsoleMessages();
                        console.log('out:');
                        console.log(JSON.stringify(out));
                        */
            return false;
          } else {
            console.log("stateContainer exists");
          }
          const value = await stateContainer.innerText;
          //       console.log(value);

          // make a console.log so travis does not terminate because of no output
          console.log("BroadcastChannel(" + methodType + ") still no success");

          return value === "SUCCESS";
        },
        500,
        120000
      );
    }
  );
});
