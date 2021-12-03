"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillOptionsWithDefaults = fillOptionsWithDefaults;

function fillOptionsWithDefaults() {
  var originalOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = JSON.parse(JSON.stringify(originalOptions)); // main

  if (typeof options.webWorkerSupport === 'undefined') options.webWorkerSupport = true; // indexed-db

  if (!options.idb) options.idb = {}; //  after this time the messages get deleted

  if (!options.idb.ttl) options.idb.ttl = 1000 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150; //  handles abrupt db onclose events.

  if (originalOptions.idb && typeof originalOptions.idb.onclose === 'function') options.idb.onclose = originalOptions.idb.onclose; // localstorage

  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1000 * 60; // custom methods

  if (originalOptions.methods) options.methods = originalOptions.methods; // node

  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1000 * 60 * 2; // 2 minutes;

  /**
   * On linux use 'ulimit -Hn' to get the limit of open files.
   * On ubuntu this was 4096 for me, so we use half of that as maxParallelWrites default.
   */

  if (!options.node.maxParallelWrites) options.node.maxParallelWrites = 2048;
  if (typeof options.node.useFastPath === 'undefined') options.node.useFastPath = true;
  return options;
}