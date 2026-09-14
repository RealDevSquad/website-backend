/**
 * Default config to be used if environment specific config for the specific key is absent
 * Every config key to be added to `default.js` to keep a track of all config keys used in the project.
 * Use placeholders as values wherever required.
 *
 * Documentation: https://github.com/lorenwest/node-config/wiki/Configuration-Files
 */

const NODE_ENV = process.env.NODE_ENV;
module.exports = {
  port: 3000,
  enableFileLogs: true,
  enableConsoleLogs: false,
  discordUnverifiedRoleId: "<discordUnverifiedRoleId>",
  discordDeveloperRoleId: "<discordDeveloperRoleId>",
  discordNewRoleId: "<discordNewRoleId>",
  discordMavenRoleId: "<discordMavenRoleId>",
  discordMissedUpdatesRoleId: "<discordMissedUpdatesRoleId>",
  githubApi: {
    baseUrl: "https://api.github.com",
    org: "RealDevSquad",
  },

  aws: {
    region: "<aws-region>",
    access_key: "<aws-access-key>",
    secret_key: "<aws-secret-key>",
    identity_store_id: "<identity-store-id>",
  },

  githubOauth: {
    clientId: "<clientId>",
    clientSecret: "<clientSecret>",
  },

  googleOauth: {
    clientId: "<clientId>",
    clientSecret: "<clientSecret>",
  },

  emailServiceConfig: {
    email: "<RDS_EMAIL>",
    password: "<EMAIL PASSWORD GENERATED AFTER 2FA>",
    host: "<smtp host>",
    port: "<number>",
  },

  firestore: `{
    "type": "service_account",
    "project_id": "<project-name>",
    "private_key_id": "<private-key-id>",
    "private_key": "<private-key>",
    "client_email": "<client-email>",
    "client_id": "<client-id>",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "<client-x509-cert-url>"
  }`,

  services: {
    rdsApi: {
      baseUrl: "https://api.realdevsquad.com",
    },

    rdsUi: {
      baseUrl: "https://realdevsquad.com",
      newSignupUrl: "https://www.realdevsquad.com/new-signup",
      routes: {
        authRedirection: "/goto",
      },
      goalAPI: {
        baseUrl: "https://goals-api.realdevsquad.com",
        cookieName: `goals-session-${NODE_ENV}`,
      },
    },
    discordBot: {
      baseUrl: "<DISCORD_BOT_BASE_URL>",
    },
  },

  cors: {
    // eslint-disable-next-line security/detect-unsafe-regex
    allowedOrigins: [/https:\/\/([a-zA-Z0-9-]+\.)?realdevsquad\.com$/], // Allow realdevsquad.com, *.realdevsquad.com
  },

  userToken: {
    cookieName: `rds-session-${NODE_ENV}`,
    cookieV2Name: `rds-session-v2-${NODE_ENV}`,
    ttl: 30 * 24 * 60 * 60, // in seconds
    refreshTtl: 180 * 24 * 60 * 60, // in seconds
    impersonationTtl: 15 * 60, // in seconds
    publicKey: "<publicKey>",
    privateKey: "<privateKey>",
  },

  botToken: {
    botPublicKey: "<botpublicKey>",
  },

  discordService: {
    publicKey: "DISCORD_SERVICE_PUBLIC_KEY",
  },

  // Cloudinary keys
  cloudinary: {
    cloud_name: "Cloud_name",
    api_key: "API_KEY",
    api_secret: "api_secret_key",
  },

  // Cloudflare
  cloudflare: {
    CLOUDFLARE_ZONE_ID: "Cloudflare_Zone_ID_or_ID",
    CLOUDFLARE_X_AUTH_KEY: "Cloudflare_API_Auth_Key",
    CLOUDFLARE_X_AUTH_EMAIL: "Cloudflare_User_Email",
  },

  rdsServerlessBot: {
    rdsServerLessPrivateKey: "RDS_SERVERLESS_PRIVATE_KEY",
    ttl: 60,
  },

  cronJobHandler: {
    publicKey: "CRON_JOB_PUBLIC_KEY",
  },

  integrations: {
    newrelic: {
      appName: "RDS_API_production",
      licenseKey: "<newrelicLicenseKey>",
    },
  },

  routesCacheTTL: {},

  Event100ms: {
    APP_ACCESS_KEY: "EVENT_100MS_APP_ACCESS_KEY",
    APP_SECRET: "EVENT_100MS_APP_SECRET",
  },
  githubAccessToken: "GITHUB_PERSONAL_ACCESS_TOKEN",

  externalServices: {
    EXTERNAL_SERVICE_PUBLIC_KEY: "EXTERNAL_SERVICE_PUBLIC_KEY",
  },
};
