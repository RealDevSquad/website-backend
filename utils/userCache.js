const CACHE_EXPIRY_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * TTL key-value store with per-value expiry and per-user invalidation groups.
 *
 * Each cached user is stored under multiple lookup keys (userId, username,
 * githubId, discordId, email) registered in a group indexed by userId.
 * Invalidation by userId evicts every alias key for that user, so username
 * renames / identifier updates self-heal.
 *
 * Lookups whose key already expired are treated as a miss and removed.
 * Negative lookups (user does not exist) are deliberately NOT cached.
 *
 * Cached values are always deep-cloned on read AND write: callers mutate user
 * objects in place (levelSpecificAccess / removeSensitiveInfo) and must never
 * corrupt the shared cache entry.
 */
const userCacheStore = () => {
  const cacheStore = new Map(); // lookupKey -> { user, expiry }
  const userIndex = new Map(); // userId -> Set<lookupKey>

  /**
   * Get a cached value for a lookup key.
   * @param {string} key
   * @returns {object | null} deep copy of the cached user, or null on miss/expiry.
   */
  const get = (key) => {
    const entry = cacheStore.get(key);

    if (!entry) {
      return null;
    }

    if (new Date().getTime() > entry.expiry) {
      cacheStore.delete(key);
      return null;
    }

    return structuredClone(entry.user);
  };

  /**
   * Store a user under one or more lookup keys and register them under the
   * owning userId for group invalidation.
   * @param {string[]} keys alias lookup keys for the same user
   * @param {object} user user object to cache
   * @param {string} userId the resolved id this user belongs to
   */
  const set = (keys, user, userId) => {
    if (!Array.isArray(keys) || keys.length === 0 || !user || !userId) {
      return;
    }
    const expiry = new Date().getTime() + CACHE_EXPIRY_TIME_MS;
    const clonedUser = structuredClone(user);

    let group = userIndex.get(userId);
    if (!group) {
      group = new Set();
      userIndex.set(userId, group);
    }

    for (const key of keys) {
      cacheStore.set(key, { user: clonedUser, expiry });
      group.add(key);
    }
  };

  /**
   * Evict every cached entry belonging to a userId.
   * @param {string} userId
   */
  const invalidateUser = (userId) => {
    if (!userId) return;
    const group = userIndex.get(userId);
    if (!group) return;
    for (const key of group) {
      cacheStore.delete(key);
    }
    userIndex.delete(userId);
  };

  /**
   * Remove all cached entries (used in tests).
   */
  const clear = () => {
    cacheStore.clear();
    userIndex.clear();
  };

  return { get, set, invalidateUser, clear };
};

// Module-level singleton cache pool.
const pool = userCacheStore();

module.exports = { pool, userCacheStore };
