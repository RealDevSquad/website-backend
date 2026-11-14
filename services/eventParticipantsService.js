const { EVENT_ROLES, PARTICIPANTS_COUNT_CACHE_TTL_MS, PARTICIPANTS_COUNT_TIMEOUT_MS } = require("../constants/events");
const { EventAPIService } = require("./EventAPIService");
const { EventTokenService } = require("./EventTokenService");

const apiService = new EventAPIService(new EventTokenService());

// Stored in this process's memory only. If the backend runs as multiple instances,
// each keeps its own cache, so their counts can differ by up to PARTICIPANTS_COUNT_CACHE_TTL_MS.
const participantsCountCache = new Map();
const participantsCountInFlight = new Map();

/**
 * Asks 100ms who is connected right now and counts them by role.
 * @param {string} roomId - The event / 100ms room id.
 * @returns {Promise<{total: number, countsByRole: Object}>}
 */
const fetchParticipantsCountFrom100ms = async (roomId) => {
  if (!/^[a-f0-9]{24}$/i.test(roomId)) {
    throw new Error("Invalid room id");
  }
  const data = await apiService.get(
    `/active-rooms/${encodeURIComponent(roomId)}/peers`,
    {},
    {
      timeout: PARTICIPANTS_COUNT_TIMEOUT_MS,
    },
  );
  // 100ms returns peers as an object keyed by peer id; an empty room is `peers: {}`.
  // Anything else is an unexpected response, so fail instead of reporting 0 participants.
  const rawPeers = data?.peers;
  if (rawPeers === null || typeof rawPeers !== "object" || Array.isArray(rawPeers)) {
    const error = new Error("Unexpected response shape from 100ms active-rooms peers API");
    error.code = "INVALID_100MS_RESPONSE";
    throw error;
  }
  const peers = Object.values(rawPeers);

  const countsByRole = Object.fromEntries(Object.values(EVENT_ROLES).map((role) => [role, 0]));
  peers.forEach((peer) => {
    if (peer.role in countsByRole) countsByRole[peer.role] += 1;
  });

  return { total: peers.length, countsByRole };
};

/**
 * Returns the cached count if it is still fresh, otherwise fetches it from 100ms.
 * Concurrent requests for the same event share one 100ms call. Failures are not cached.
 * @param {string} roomId - The event / 100ms room id.
 * @returns {Promise<{counts: Object, expiresAt: number}>}
 */
const getParticipantsCountWithCache = async (roomId) => {
  const cached = participantsCountCache.get(roomId);
  if (cached && cached.expiresAt > Date.now()) return cached;

  const inFlight = participantsCountInFlight.get(roomId);
  if (inFlight) return inFlight;

  const request = fetchParticipantsCountFrom100ms(roomId)
    .then((counts) => {
      const entry = { counts, expiresAt: Date.now() + PARTICIPANTS_COUNT_CACHE_TTL_MS };
      participantsCountCache.set(roomId, entry);
      setTimeout(() => {
        if (participantsCountCache.get(roomId) === entry) participantsCountCache.delete(roomId);
      }, PARTICIPANTS_COUNT_CACHE_TTL_MS).unref();
      return entry;
    })
    .finally(() => {
      participantsCountInFlight.delete(roomId);
    });

  participantsCountInFlight.set(roomId, request);
  return request;
};

module.exports = { getParticipantsCountWithCache };
