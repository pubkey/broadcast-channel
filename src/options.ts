import { BUILD_ENV, BUILD_ENV_TYPE, STORAGE_SERVER_MAP, STORAGE_SERVER_SOCKET_URL_MAP } from "@toruslabs/constants";

import { Options } from "./types";

type Filled<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type FilledOptions = Options & {
  webWorkerSupport: boolean;
  idb: Filled<NonNullable<Options["idb"]>, "ttl" | "fallbackInterval">;
  localstorage: Filled<NonNullable<Options["localstorage"]>, "removeTimeout">;
  server: Filled<NonNullable<Options["server"]>, "api_url" | "socket_url" | "removeTimeout"> & { build_env: BUILD_ENV_TYPE };
};

export function fillOptionsWithDefaults(originalOptions: Options = {}): FilledOptions {
  const options: Options = JSON.parse(JSON.stringify(originalOptions));

  // main
  if (typeof options.webWorkerSupport === "undefined") options.webWorkerSupport = true;

  // indexed-db
  if (!options.idb) options.idb = {};
  //  after this time the messages get deleted
  if (!options.idb.ttl) options.idb.ttl = 1000 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
  //  handles abrupt db onclose events.
  if (originalOptions.idb && typeof originalOptions.idb.onclose === "function") options.idb.onclose = originalOptions.idb.onclose;

  // localstorage
  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1000 * 60;

  // server
  if (!options.server) options.server = {};
  if (!options.server.build_env) options.server.build_env = BUILD_ENV.PRODUCTION;
  if (!options.server.api_url) options.server.api_url = `${STORAGE_SERVER_MAP[options.server.build_env]}/v2`;
  if (!options.server.socket_url) options.server.socket_url = `${STORAGE_SERVER_SOCKET_URL_MAP[options.server.build_env]}`;
  if (!options.server.removeTimeout) options.server.removeTimeout = 1000 * 60 * 5; // 5 minutes

  // custom methods
  if (originalOptions.methods) options.methods = originalOptions.methods;

  return options as FilledOptions;
}
