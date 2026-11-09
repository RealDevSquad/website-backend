const API_100MS_BASE_URL = "https://api.100ms.live/v2";
const GET_ALL_EVENTS_LIMIT_MIN = 10;
const UNWANTED_PROPERTIES_FROM_100MS = [
  "customer_id",
  "app_id",
  "recording_info",
  "template_id",
  "template",
  "customer",
];

const EVENT_ROLES = {
  HOST: "host",
  MODERATOR: "moderator",
  MAVEN: "maven",
  GUEST: "guest",
};

const PARTICIPANTS_COUNT_CACHE_TTL_MS = 5000;
const PARTICIPANTS_COUNT_TIMEOUT_MS = 5000;

const EVENT_LIVE_STATUS = {
  LIVE: "live",
  NOT_LIVE: "not_live",
  INACTIVE: "inactive",
};

module.exports = {
  API_100MS_BASE_URL,
  GET_ALL_EVENTS_LIMIT_MIN,
  UNWANTED_PROPERTIES_FROM_100MS,
  EVENT_ROLES,
  PARTICIPANTS_COUNT_CACHE_TTL_MS,
  PARTICIPANTS_COUNT_TIMEOUT_MS,
  EVENT_LIVE_STATUS,
};
