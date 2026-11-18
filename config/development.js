/**
 * Set the environment specific config in this file.
 * Defaults set from default.js
 */

const port = 3000;
const localUrl = `http://localhost:${port}`;

module.exports = {
  port,
  enableFileLogs: false,
  enableConsoleLogs: true,
  discordNewComersChannelId: "709080951824842783",

  services: {
    rdsApi: {
      baseUrl: localUrl,
    },

    rdsUi: {
      baseUrl: localUrl,
      newSignupUrl: "https://staging-www.realdevsquad.com/new-signup",
      routes: {
        authRedirection: "/healthcheck",
      },
    },

    goalAPI: {
      baseUrl: "https://staging-goals-api.realdevsquad.com",
      secretKey: "123456789",
    },
  },

  userToken: {
    publicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr4eFyB0jHDP2ZR2Q4bVE\n" +
      "GFh0UnMrWqUYcdScEbwuAC6wDjh64jms3ikmWGk2zZyu5gQZg18Um8nVC0rCFL0D\n" +
      "7mlf/STSbd0NMWrGmKREPh/0HBV9argTuM5MhovI3cnuSb3QUId/0UbWEZvHehSR\n" +
      "5AajXKnaCl8dR5ax1V5pIg8wfL9c8oxZ+P9zcA9pMbgj45nzOP4781773FNgg0JF\n" +
      "p+Q0OvPA7GBYmvK1GO0QXg38G7PCd7PfIA0ZyadEsIp+XOj9dZ3vvVV5JiZ3hGSc\n" +
      "HXB+GK/AKpgxr8Qsm+YY67sQBJ9sMlDhPQBT4REup8XS3VOrTFdD7ZgM+hPcd6LV\n" +
      "KwIDAQAB\n" +
      "-----END PUBLIC KEY-----",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\n" +
      "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCvh4XIHSMcM/Zl\n" +
      "HZDhtUQYWHRScytapRhx1JwRvC4ALrAOOHriOazeKSZYaTbNnK7mBBmDXxSbydUL\n" +
      "SsIUvQPuaV/9JNJt3Q0xasaYpEQ+H/QcFX1quBO4zkyGi8jdye5JvdBQh3/RRtYR\n" +
      "m8d6FJHkBqNcqdoKXx1HlrHVXmkiDzB8v1zyjFn4/3NwD2kxuCPjmfM4/jvzXvvc\n" +
      "U2CDQkWn5DQ688DsYFia8rUY7RBeDfwbs8J3s98gDRnJp0Swin5c6P11ne+9VXkm\n" +
      "JneEZJwdcH4Yr8AqmDGvxCyb5hjruxAEn2wyUOE9AFPhES6nxdLdU6tMV0PtmAz6\n" +
      "E9x3otUrAgMBAAECggEABqqCeF4xIdLXXf+zOcK2xRl6beAORXE4iqhdtsB8/r2q\n" +
      "uRhsBA7zyNFx6nfbjrqPPy0FIFums9IhGndYyxt+/ICupIrsHZVVwEOU8eG87p8P\n" +
      "JjrHJP9Kax3cWFwvi8r0wbu6yf7NIvrU0Q9EIIlujywjJIxrO2thTbpAsVm53UoY\n" +
      "Ap/D/LppnzvbudmzXIFg8wLEk+DboUlYOgpR3ZTiCrf3qxuiPDbRql3Xjau2KKez\n" +
      "wMlPP0GEQZ8zStLUTC9SnLiLcm11/S7tQrzFDIboi9WwoPDAW2DT2l6Fy2OXvhXh\n" +
      "Qt5kyLsLcccb5C1inrlqeBJQdIAjRMrKGt7vAcPkAQKBgQDltHm97YujPCRN3U6W\n" +
      "pwugd42A8lXGe0oUV50tnPCSOgepisA8VpXbDCgco00Ntd1XWltWsCmLkSTujDDx\n" +
      "kJDFLckCXugzp0vRpcLWcP7pup41vC1Dh9igFR/A1MyfrJuxptKH4wn7XW/Cz+bY\n" +
      "RZhdxQZglUtxpjYlL9TbW8niZQKBgQDDn20rcuG01MuS4hqGv8NzD987SKixOcOm\n" +
      "zfVXBixv0B+WcMagHuq1Y97gyKwM/xWVnon4y6rhIe8pHKZS3E/KOySgXDGT3B1s\n" +
      "/7kjC5Wh1F/P6G+ztUclHYGpS56jIY+1yVsZVj49bEjxjUkW925XIt9uleNXn4lV\n" +
      "Sa6g2qKYTwKBgQCB/Rqzx1yxGFS3F5jkmk1zFpSmNv0hYB2w20/gQyLErUAuyo00\n" +
      "2A7fscZ1RlhRfOxwBXsQ2In6KD4NHJqJ6TRz0RAiXlDrAi5eyn4y2ij3XZswb3fx\n" +
      "8ks9dBbPCd1uMsC8zNnw+iNo8xxO01YgZ2ntDpUoTPQvsU6Mxr+fDxd1HQKBgQCj\n" +
      "6rvsc1gDUWe/jWxSyu64RG12XJzV3CRAakYRBKBJlOhTA+67jwx2r9e7HQtl3Hy2\n" +
      "oWDVM7vc57ViCpqnxemp+ELpiDcWwZN6mREF95gLQUyDhy3KNLUHuaDDPhUQdnfY\n" +
      "CIAoS+bdSxYYKZ47+1re8t6r6DbWXl0SNSp5qJoj6wKBgQDLv92QiO7GCyp4vlGc\n" +
      "3sDR35fBb62HFGHycBB541t9Q/krO3I7+3N+maXdyKU0QDHyMMa2/0b9QY/jtvEU\n" +
      "hTwaG4nDfhUEo3pf60v1Pe/hdbCgZ+3g7F/IxiN52phHj65GJkxqpKrivejWHiLU\n" +
      "WseulHUGM2m+a3ABQjlH5XceKw==\n" +
      "-----END PRIVATE KEY-----",
  },

  botToken: {
    botPublicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBK3CkprcpAYxme7vtdjpWO\n" +
      "gFFjoYsqU3OmhMEty/s1gnW5tgbK4ief4xk+cU+mu3YvjzWudT/SV17tAWxL4Y+G\n" +
      "incJwL5gpQwlnw9qOAdRGkpBriQLec7kNVIydZXbUitziy+iSimxNzdDmjvlK9ZG\n" +
      "miVLZm+MePbUtgaIpfgd+4bRWzudlITiNmWY7HppLzyBw+037iEICM4kwPPFI+SO\n" +
      "GJhpAAmD6vk0MeZk1NeQmyQp/uOPpWmVRzgyK+XVc6AwZHV+/n6xAIT91/DjJlD1\n" +
      "N+nS7Sqo3RJ04+KlNRUclzINOC7JBYkKtG7YQ0U9nNLkRrRlON+O6tY4OT86T1O1\n" +
      "AgMBAAE=\n" +
      "-----END PUBLIC KEY-----",
  },

  integrations: {
    newrelic: {
      appName: "RDS_API_development",
    },
  },
};
