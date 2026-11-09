import * as IndexeDbMethod from "./methods/indexed-db";
import * as LocalstorageMethod from "./methods/localstorage";
import * as NativeMethod from "./methods/native";
import * as ServerMethod from "./methods/server";
import * as SimulateMethod from "./methods/simulate";
import { Method, Options } from "./types";

// order is important
const METHODS: Method[] = [
  NativeMethod as Method, // fastest
  IndexeDbMethod as Method,
  LocalstorageMethod as Method,
  ServerMethod as Method,
];

export function chooseMethod(options: Options): Method {
  let chooseMethods: Method[] = ([] as Method[]).concat(options.methods || [], METHODS).filter(Boolean);

  // directly chosen
  if (options.type) {
    if (options.type === "simulate") {
      // only use simulate-method if directly chosen
      return SimulateMethod as Method;
    }
    const ret = chooseMethods.find((m) => m.type === options.type);
    if (!ret) throw new Error(`method-type ${options.type} not found`);
    else return ret;
  }

  /**
   * if no webworker support is needed,
   * remove idb from the list so that localstorage is been chosen
   */
  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter((m) => m.type !== "idb");
  }

  const useMethod = chooseMethods.find((method) => method.canBeUsed(options));
  if (!useMethod) throw new Error(`No useable method found in ${JSON.stringify(METHODS.map((m) => m.type))}`);
  else return useMethod;
}
