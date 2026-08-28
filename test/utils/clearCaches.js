const { pool: userCache } = require("../../utils/userCache");
const { pool: cachePool, cachedKeys } = require("../../utils/cache");

/**
 * Reset all process-local caches used by the application.
 */
module.exports = () => {
  userCache.clear();
  cachePool.clear();
  cachedKeys.clear();
};
