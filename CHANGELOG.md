# CHANGELOG


## X.X.X (comming soon)

## 4.11.0 (12 April 2022)

- Replaced `nano-time` with `microtime`.
- Improve IndexedDB method performance.

## 4.10.0 (3 February 2022)

- Improve error message when calling `postMessage` to a closed channel.

## 4.9.0 (23 December 2021)

Bugfixes:
  - When listening to messages directly, responses that where send directly after `addEventListener()` where missing because of inaccurate JavaScript timing.

## 4.8.0 (15 December 2021)

Changes:
  - Better determine the correct `responseTime` to use to make it less likely to elect duplicate leaders.

## 4.7.1 (13 December 2021)

Bugfixes:
  - Remove useless log at leader election fallback interval.

## 4.7.0 (3 December 2021)

Bugfixes:
  - Prevent `EMFILE, too many open files` error when writing many messages at once.

## 4.6.0 (2 December 2021)

Other:
  - Added `broadcastChannel.id()` for debugging

Bugfixes:
  - Refactor `applyOnce()` queue to ensure we do not run more often then needed.

## 4.5.0 (5 November 2021)

Bugfixes:
  - Running `applyOnce()` in a loop must not fully block the JavaScript process.

## 4.4.0 (2 November 2021)

Other:
  - Replaced `js-sha` with node's `crypto` module.

## 4.3.1 (30 October 2021)

Bugfixes:
  - Fixed broken promise rejection.

## 4.3.0 (30 October 2021)

Features:
  - Added `LeaderElector.hasLeader`
  - Added `LeaderElector.broadcastChannel`

## 4.2.0 (3 August 2021)

Bugfixes:
  - Fixed Webpack 5 Relative Import Support. Thanks [catrielmuller](https://github.com/catrielmuller)
## 4.1.0 (2 August 2021)

Bugfixes:
  - Fixed various problems with the module loading. Thanks [benmccann](https://github.com/benmccann) and [chbdetta](https://github.com/chbdetta)


## 4.0.0 (15 July 2021)

Other:
  - Changed entrypoints and method-choosing [#679](https://github.com/pubkey/broadcast-channel/pull/679). Thanks [benmccann](https://github.com/benmccann)

## 3.7.0 (13 June 2021)

Other:
  - Moved `ObliviousSet` into [its own npm module](https://www.npmjs.com/package/oblivious-set)

## 3.6.0 (19 May 2021)

Features:
  - Added `BroadcastChannel.isClosed` [#544](https://github.com/pubkey/broadcast-channel/issues/544)

Other:
  - Updated dependencies to work with newer node versions

## 3.5.3 (11 March 2021)

Bugfixes:
  - Fixed broken typings

## 3.5.2 (11 March 2021)

Bugfixes:
  - `BroadcastChannel.close()` waits for all ongoing message sending to be finished before resolving.

## 3.5.0 (11 March 2021)

Features:
  - Added `LeaderElector.onduplicate`

## 3.4.0 (24 January 2021)

Bugfixes:
  - fix cursor error in Safari [#420](https://github.com/pubkey/broadcast-channel/pull/420)

## 3.3.0 (20 October 2020)

Bugfixes:
  - `new BroadcastChannel().close()` should not resolve before all cleanup is done  [#348](https://github.com/pubkey/broadcast-channel/pull/348)
