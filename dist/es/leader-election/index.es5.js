/**
 * because babel can only export on default-attribute,
 * we use this for the non-module-build
 */
import LeaderElection from './index.js';
module.exports = LeaderElection;