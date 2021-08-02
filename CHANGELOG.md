# CHANGELOG

## X.X.X (comming soon)

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
