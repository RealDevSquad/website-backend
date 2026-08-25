const CACHE_EXPIRY_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours
const EXPIRY_CLEANUP_BATCH_SIZE = 25;

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
  const cacheStore = new Map(); // lookupKey -> { user, userId, expiry }
  const userIndex = new Map(); // userId -> Set<lookupKey>
  let cleanupIterator = null;

  /**
   * Remove one alias from the cache and its owning user's index group.
   */
  const evictKey = (key, userId) => {
    if (cacheStore.get(key)?.userId === userId) {
      cacheStore.delete(key);
    }
    const group = userIndex.get(userId);
    group?.delete(key);
    if (group?.size === 0) {
      userIndex.delete(userId);
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
      if (cacheStore.get(key)?.userId === userId) {
        cacheStore.delete(key);
      }
    }
    userIndex.delete(userId);
  };

  /**
   * Opportunistically scan a bounded number of entries so expired users are
   * eventually removed even when none of their aliases are requested.
   */
  const cleanupExpiredEntries = (now) => {
    cleanupIterator ??= cacheStore.entries();

    for (let scanned = 0; scanned < EXPIRY_CLEANUP_BATCH_SIZE; scanned++) {
      const { value, done } = cleanupIterator.next();
      if (done) {
        cleanupIterator = null;
        break;
      }
      const [key, entry] = value;
      if (now > entry.expiry) {
        evictKey(key, entry.userId);
      }
    }
  };

  /**
   * Get a cached value for a lookup key.
   * @param {string} key
   * @returns {object | null} deep copy of the cached user, or null on miss/expiry.
   */
  const get = (key) => {
    const now = new Date().getTime();
    cleanupExpiredEntries(now);
    const entry = cacheStore.get(key);

    if (!entry) {
      return null;
    }

    if (now > entry.expiry) {
      evictKey(key, entry.userId);
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
    const now = new Date().getTime();
    cleanupExpiredEntries(now);
    const expiry = now + CACHE_EXPIRY_TIME_MS;
    const clonedUser = structuredClone(user);

    let group = userIndex.get(userId);
    if (!group) {
      group = new Set();
      userIndex.set(userId, group);
    }

    for (const key of keys) {
      const previousUserId = cacheStore.get(key)?.userId;
      if (previousUserId && previousUserId !== userId) {
        evictKey(key, previousUserId);
      }
      cacheStore.set(key, { user: clonedUser, userId, expiry });
      group.add(key);
    }
  };

  /**
   * Remove all cached entries (used in tests).
   */
  const clear = () => {
    cacheStore.clear();
    userIndex.clear();
    cleanupIterator = null;
  };

  return { get, set, invalidateUser, clear };
};

// Module-level singleton cache pool.
const pool = userCacheStore();

module.exports = { pool, userCacheStore };
