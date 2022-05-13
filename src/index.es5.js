/**
 * because babel can only export on default-attribute,
 * we use this for the non-module-build
 * this ensures that users do not have to use
 * var BroadcastChannel = require('broadcast-channel').default;
 * but
 * var BroadcastChannel = require('broadcast-channel');
 */

import { BroadcastChannel, enforceOptions } from './index.js';

module.exports = {
    BroadcastChannel,
    enforceOptions,
};
