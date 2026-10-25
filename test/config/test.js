/**
 * Set the environment specific config in this file.
 * Defaults set from default.js
 */

const port = 7337;
const NODE_ENV = process.env.NODE_ENV;
module.exports = {
  port,
  enableFileLogs: false,
  // Console logs are set to avoid the winston error of no defined transports
  enableConsoleLogs: true,
  discordUnverifiedRoleId: "1234567890",
  discordDeveloperRoleId: "9876543210",
  discordNewRoleId: "1111111111",
  discordNewComersChannelId: "709080951824842783",
  discordMavenRoleId: "1212121212",
  discordMissedUpdatesRoleId: "<discordMissedUpdatesRoleId>",
  githubApi: {
    baseUrl: "https://api.github.com",
    org: "Real-Dev-Squad",
  },
  githubOauth: {
    clientId: "clientId",
    clientSecret: "clientSecret",
  },
  aws: {
    region: "us-east-1",
    access_key: "test-access-key",
    secret_key: "test-secret-key",
    identity_store_id: "test-identity-store-id",
  },

  googleOauth: {
    clientId: "cliendId",
    clientSecret: "clientSecret",
  },
  firestore: `{
    "type": "service_account",
    "project_id": "test-project-id-for-emulator",
    "private_key_id": "test-private-key",
    "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaHHM8SL5skUp2\\nmbHnSBbJyk60O+nsq4hV23Ii3HLhe82Rndwji5DvAXv5AFKM9h2pQ3P2iZA7LQ4+\\nJ3BbTR1HgUDEuARlLz9C/CxKOtpM/2Hh5rKZkCxEUTulpJgW4XT16+qXdamaH2xz\\n/Cuec1H43HUuTZTj58yypCOh6SIZGOv4TQtMiz2DNKOktlhBr0GyN8+bsDgmEcoR\\n7DUeC5re2kcOHGqtzRoZhEPHWRcM40IjT0IffALUlqXQ/kYrWbbyPIHfo/ojxfeR\\nbLXLvWaCK+j9k28hvOb3nC0lWS+B/LerFzMF3q4vE1MjwAj2uU2DdhZXvTe8bnYR\\ntshsmRURAgMBAAECggEACZiWl9SF/0IRrf/jWD7/VKu4VHzt1O4zkn50CjVbfxDq\\nuZFB0BUKAH/217zURPQnmCy574L8I+Res+yZiITPKNgWlMkZVWfTn1N3seDevaQ/\\nRth262Nw1SUjTA1+rQQImLDDWpxQRNIE3CIAO8mMVdgCNlIuvquyQXpQAIXArKyr\\njsP8HFKYBb515Hn4NSO9eG8u1Mp+3hTMmwjb6k33ezDh3kJo9u0FTPOSD67GuMJv\\nXHbB96+xYDBa9vCqEHCukqtmTz1Bg3Oe47X/QlJWNOxqSBZ+ikfxWSF7DPt1r+5w\\nWHHlFsUvirHEug8tsLVmKv0hkU1TicE0ktjF8X6HGQKBgQD8/z4K1AkPX1gq/9jc\\nQcErZXBI8eYZOUJywJ5Cw4fiVq1VByqgBqr9sfJdkWi8WrWkDLCEf4h4Fy/yKClh\\nW/A5qHbkC8B9LWPiYJw++8FUpUHDPkxA+Szeq5UDkJH2aumcFwGdMywUvh0sVqwv\\nbvhYDtlanQSEGAvCd+NiQgNDyQKBgQDcszQO7S0EGpABGc6bkGvAlbmHqhUV5TzA\\ndvanSFXQ3f+MhboMUuZiDwpplvvqeAKc3Y3d2Ps6OPVD+ailL8QjN9FQ1sHZeuHy\\nckUYxaenspNdP6AWQxEAzJqHdpzV3EyJvMsDmhhaNwNSJ4vuZ53mVrh+6u4TWyks\\nUko2O2mbCQKBgQD1qov+S8K4cKbWqjVUO21tzERqMKp0l8tUToHe5qtON0h8pkbX\\nuWHUkzR7czU2oQZ8U+4b2xMTOcDO7fywk2wDMPixnE+/vZGeQp218xTaMtZW1mmJ\\nNexCFG7QVVPG6i4J6bUhho0pXypI4ai1LpZsO48HlCzMb+ULYwsjYGJ3MQKBgFZt\\ns2hZB3UA9f4IXjnbr+bme5aeS82cTVNOAz/1eu3l0kr0n6xt1pz2KOy63QKwZs2J\\nkiIb9B6T6bDqF1pBP31PQaB3ychicBOjHl4aIZLxwvYUkZvGPeVjOuzrzXWO5UZX\\nceWCNiE2RA2rQQhm+ZYXxf6mAAAChjg+LaPZVn0JAoGAXBGDDjWORrbD7T7qSTim\\n8sVCMmBX385JhWZGwE1BbdS/eOpnKR4uVRKTsDS8Q0uN3sydaHv1uTQhk2eLKaWZ\\nSzda8nPVduaIiXm79YDpALDHFdjIGcTb/s0MRNLLt6sBNw0Ytma9KHg6tzpPpJwP\\n4TwE9j91+jzusl9988Eke6s=\\n-----END PRIVATE KEY-----\\n",
    "client_email": "firebase-adminsdk-hqc2v@dev-rds.iam.gserviceaccount.com",
    "client_id": "<client-id>",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hqc2v%40dev-rds.iam.gserviceaccount.com"
  }`,

  emailServiceConfig: {
    email: "<RDS_EMAIL>",
    password: "<EMAIL PASSWORD GENERATED AFTER 2FA>",
    host: "<smtp host>",
    port: "<number>",
  },
  services: {
    rdsApi: {
      baseUrl: `http://localhost:${port}`,
    },
    rdsUi: {
      baseUrl: "https://realdevsquad.com",
      newSignupUrl: "https://www.realdevsquad.com/new-signup",
      routes: {
        authRedirection: "/goto",
      },
      goalAPI: {
        baseUrl: "http://goals-api.test", // Dummy URL: real calls are stubbed/mocked in tests; must stay a valid URL for nock()
        secretKey: "<goalSecretKey>",
        cookieName: `goals-session-test`,
      },
    },
    discordBot: {
      baseUrl: "DISCORD_BASE_URL",
    },
    goalAPI: {
      baseUrl: "http://goals-api.test", // Dummy URL: real calls are stubbed/mocked in tests; must stay a valid URL for nock()
      secretKey: "<goalSecretKey>",
      cookieName: `goals-session-test`,
    },
  },

  cors: {
    // Allow realdevsquad.com, *.realdevsquad.com and localhost for non-production envs
    // eslint-disable-next-line security/detect-unsafe-regex
    allowedOrigins: [/https:\/\/([a-zA-Z0-9-]+\.)?realdevsquad\.com$/, /(localhost)/],
  },

  userToken: {
    cookieName: `rds-session-${NODE_ENV}`,
    cookieV2Name: `rds-session-v2-${NODE_ENV}`,
    ttl: 30 * 24 * 60 * 60, // in seconds
    refreshTtl: 180 * 24 * 60 * 60, // in seconds
    impersonationTtl: 15 * 60, // in seconds
    publicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwqSC5JOZyoR/8c9JS5lE\n" +
      "c7x9XghW7vbPbwgeG0WrBbTW6n7knsI4qOo5k5j+CzuEk6b9xHK5MoB51r3VE8Cc\n" +
      "3hSytedZC//9qGG5VHqkWlV4JSSZN9T2OPD45pHi40obBQhcuH9LgAi/4kxbbjsH\n" +
      "57Ut2fRS9f/oAUGJt04UJnOvygfezJ+EatclztlnrHttZzeNQUqnbCQT9t0o2iTe\n" +
      "Ah9Nq/rGqeFhh277N+KCDhHvZWs6AZhNa68Xdasc3LOt4XKQYbDvfVQgoNWJzgV8\n" +
      "hcecNGPwuKKiIjCOmFx43vtY0MUOubZmU8u8rUdZWAfW5vpva31W3a9/NUyykhd1\n" +
      "QQIDAQAB\n" +
      "-----END PUBLIC KEY-----",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\n" +
      "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCpILkk5nKhH/x\n" +
      "z0lLmURzvH1eCFbu9s9vCB4bRasFtNbqfuSewjio6jmTmP4LO4STpv3EcrkygHnW\n" +
      "vdUTwJzeFLK151kL//2oYblUeqRaVXglJJk31PY48PjmkeLjShsFCFy4f0uACL/i\n" +
      "TFtuOwfntS3Z9FL1/+gBQYm3ThQmc6/KB97Mn4Rq1yXO2Wese21nN41BSqdsJBP2\n" +
      "3SjaJN4CH02r+sap4WGHbvs34oIOEe9lazoBmE1rrxd1qxzcs63hcpBhsO99VCCg\n" +
      "1YnOBXyFx5w0Y/C4oqIiMI6YXHje+1jQxQ65tmZTy7ytR1lYB9bm+m9rfVbdr381\n" +
      "TLKSF3VBAgMBAAECggEAAchUSUv7gCP8YLpacEx9GK7+yi0bADVfDxQQxATMYRkP\n" +
      "0I4U0YojbxMVj8cqeO98qmZAq9NV5DsyWnPKuzOD8EH55MHzkiFAGUIbWpVkss3W\n" +
      "c8cg9taewmTdD64BeR3HL3GtGTSzvB6AZN34hqL4YqApdUX4Okfjn9rR/D11IGjB\n" +
      "2fwpuvn2bHfyFofL/Nb5k/1uUKNa+WYWHf8hG+MJtvrkb1z/2R8i/1T3Ehb7fktF\n" +
      "ju05wWfzyBZePJUpTZcGjIRCLHvmjp3u0lWDIR7MUGdkpTJeethra8x0Z5bOpfpY\n" +
      "m6J0Ic3+8AyU7Uo4SlpDc3cLD8Fe4X5HP6uKV0rnwQKBgQDkWg9tSX0mm5c+6EFT\n" +
      "wh2J7azmdouhR3w1p+8W3oVToPsGaBLbetvgbzBkSslY72u8eAX5usoRgfyFODTB\n" +
      "NHrd+5WCv+lxzEQDY13J3ihYOPdUAkCaGAmzPAPv7T9OePkdV40qkhHkbz7Ex9Y7\n" +
      "2qvbnBvwjRCtrTorG7wjZ/lh4QKBgQDaNZv0KJmm2ysVlvYe5M+l6LP5pK91//Kx\n" +
      "CKIn1fjoxNn9vTq1k1EOei0yUiMs5Nj3UIzQd/tJW8IOCSYcouIj07Yaq8w3+P3M\n" +
      "q+CjpjYMdhlU35/WY6VgKEKNiPsaA+iM5XOZS3GKN7dkWAKVBXr9McJpvBc+KSqA\n" +
      "ggx2Y+M/YQKBgGKHkZyAVyXvgMU+BeIUIha/nRkcEYeXhrrIKVvey/yXu3i6M1jM\n" +
      "nE8s6t57foGHXR9HUpy8wi/nvIPnCqxK7rEVux9dm2bk0nv7xh4yY4odmmp/Rky3\n" +
      "Doht3u0Jm4VKoYLNojW6LUo5zgWujHvrELiDlXKoC4hE9JJhNz63wF1BAoGBAJe5\n" +
      "iOvXQyda43VKl23ZyWxiBqpB0WLqCdUA3Md4J2+qWKzu46CXg1feqgiARkcUBKzK\n" +
      "TG8zzf0vGRprUB2/QCCLN+cJp6EPt2GV7Ue87X3yrCBwsZH/jWDz/XquUXLAXvWB\n" +
      "IcToSVVC8niKHZmCywa8j6K3jy3Ar/XU91dmkv9hAoGATyhnjTRoqXAuUzW1urk+\n" +
      "tBj4j7WgLxKStDsGivwEWxClG8pORWMwARjNvw7mjC/aHZPrEmj65uS0rH9Oiomh\n" +
      "E6ZfDxIIftNaZe8dMZzYcv68fB803Ezbu7JGi8j0S7Qxs06zY1rSvejOsnTxtk2g\n" +
      "gfGtBvPbx5RQqQCAf6K2eto=\n" +
      "-----END PRIVATE KEY-----",
  },

  botToken: {
    botPublicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA08lMk0xs8J/5bdALGSpY\n" +
      "15MvboNykrBYPtMF8kJUNN/I2gN0tDi5Nk5FS/6tDqP05XMaZvav4zfa7W9I9gol\n" +
      "z/gnvcPr1NjNPQqDOzcPa9jHnqHJj07Hm/rG1EEnAG2rZkk5QqRqqlHRrB7ickem\n" +
      "R+f7KSQgBEPBskOCWLTAiqFyNkLlXPuQWqgMIV0UGaz0GWR1bc8Nv2q3UMPVQaj4\n" +
      "pyggd2rwyNUwmZyMb5AomMeKEaYZpdpPeZX5dLz6sJ4XBP4Tu624HRccLyH9yKP8\n" +
      "ILUJTG+xB8dHdfQmfhwRKeEFbAcEoKBVjsFQ66LBhrPGP7A9CTWrTyry6kqjaVPB\n" +
      "1QIDAQAB\n" +
      "-----END PUBLIC KEY-----",
    botPrivateKey:
      "-----BEGIN PRIVATE KEY-----\n" +
      "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDTyUyTTGzwn/lt\n" +
      "0AsZKljXky9ug3KSsFg+0wXyQlQ038jaA3S0OLk2TkVL/q0Oo/Tlcxpm9q/jN9rt\n" +
      "b0j2CiXP+Ce9w+vU2M09CoM7Nw9r2MeeocmPTseb+sbUQScAbatmSTlCpGqqUdGs\n" +
      "HuJyR6ZH5/spJCAEQ8GyQ4JYtMCKoXI2QuVc+5BaqAwhXRQZrPQZZHVtzw2/ardQ\n" +
      "w9VBqPinKCB3avDI1TCZnIxvkCiYx4oRphml2k95lfl0vPqwnhcE/hO7rbgdFxwv\n" +
      "If3Io/wgtQlMb7EHx0d19CZ+HBEp4QVsBwSgoFWOwVDrosGGs8Y/sD0JNatPKvLq\n" +
      "SqNpU8HVAgMBAAECggEAGi9uZ1vwsEOnTFuHs8HXoDfTin94IAjrsEDZIF3xGWR9\n" +
      "6e65dDr7M2q0CLRhY0kEU4ZKwmZH0vkp+WdkBv+0MyWEjGL3+qYfoid1mFGzd2sj\n" +
      "K0rnp+9eoLt97+pqTxRAN/JfwQyhH5PkL7rV1rljJsrY8/pCdySFg2vzZtJaaAla\n" +
      "ekPCa4lxQ9+wpy3QHZemoc8JmG+3yfrh19FTm9IZPAAPbD2QWBRnttYnp94dH5aF\n" +
      "W8u/6SIfS3+Snw3x4jJ4s2SFl5rHvPIWCSNrtGM5Aedt+UM0x8vMm6XHWhLB+mpw\n" +
      "wABay6yaOzJEF+UMtrJFrkHq7bBo54n1eRDqG6E3dQKBgQDzTAc2LE6sY7zirg9r\n" +
      "ON/2c8bWaXby27ss6s6k4htyhNOJ1YuMw1Mbh0hnR9CYvuRe63Bj2j50vSypDw12\n" +
      "W93D7T+AnLSE/YuW1WpqsY+zOjD8JznYfPfn9nsVRIumuu8bOG5X8kxT7ySknLQZ\n" +
      "NfQ04XVvAt8SKYS3BUDJKb46ewKBgQDe2BdUmlvsW7vp02Uv9T+6+H7F/PECWdrU\n" +
      "NaV3O3N1Mm8EwcAoesIxBiNJVCz4NoetHSOd0dz8dTxqkXS5TvVfczMnepUBuFXg\n" +
      "TOA1W+xWo7bDKel70OWqQ9ghoF10SPTpNUySpbDMdVsr0EU8PjQad0u7nkqCx9p1\n" +
      "C8qIwJGr7wKBgQC2xzBHx4OXSRq3JVLaF5FR4mrH29WL3/2/Yeu6vU8nepg9XZuI\n" +
      "NZly/fAr/yy8A/UnRjNaILR5GUG7BF71w1BYiB0D7zZDDwPWXiCjZR/y4s24MXPo\n" +
      "qwHHV0nikWtk590IEx36nkIvcGKT9FHs+rarH5IMwxh42Y4lvSGNvvl1jwKBgQCB\n" +
      "tr892+wOFQe4//gyhktmhiclECsp9yvNwrxiPxTh7014M1+rMGnBJ5V6pajXgsZP\n" +
      "GlsVDofX3FYiojCTfUaPHPt1y4DY03gJbDZGWQ+lDv7fc5IZJGvLRFqWmEZN3fnR\n" +
      "ldjQs+nJ2bYMNttWSc8CaNaIi4dLwRGEeCyYlZ81uQKBgQDUk5H174LBdTVATGJL\n" +
      "ZQN9q6HAViqw/hzmWdTVYTn1p+OvdORC4QCmnpc+qgEMODpah71n3uXc6YDNYqYJ\n" +
      "68HM2XOR2g1PMsQ5Y7805gU0BcuhkMNEuUt3f4x0TpnwGRAuQ5/6LNMA1/jge/IP\n" +
      "5a+Jgv4Vf6iIpkXz5N0XaK6S7g==\n" +
      "-----END PRIVATE KEY-----",
  },

  discordService: {
    publicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA08lMk0xs8J/5bdALGSpY\n" +
      "15MvboNykrBYPtMF8kJUNN/I2gN0tDi5Nk5FS/6tDqP05XMaZvav4zfa7W9I9gol\n" +
      "z/gnvcPr1NjNPQqDOzcPa9jHnqHJj07Hm/rG1EEnAG2rZkk5QqRqqlHRrB7ickem\n" +
      "R+f7KSQgBEPBskOCWLTAiqFyNkLlXPuQWqgMIV0UGaz0GWR1bc8Nv2q3UMPVQaj4\n" +
      "pyggd2rwyNUwmZyMb5AomMeKEaYZpdpPeZX5dLz6sJ4XBP4Tu624HRccLyH9yKP8\n" +
      "ILUJTG+xB8dHdfQmfhwRKeEFbAcEoKBVjsFQ66LBhrPGP7A9CTWrTyry6kqjaVPB\n" +
      "1QIDAQAB\n" +
      "-----END PUBLIC KEY-----",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\n" +
      "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDTyUyTTGzwn/lt\n" +
      "0AsZKljXky9ug3KSsFg+0wXyQlQ038jaA3S0OLk2TkVL/q0Oo/Tlcxpm9q/jN9rt\n" +
      "b0j2CiXP+Ce9w+vU2M09CoM7Nw9r2MeeocmPTseb+sbUQScAbatmSTlCpGqqUdGs\n" +
      "HuJyR6ZH5/spJCAEQ8GyQ4JYtMCKoXI2QuVc+5BaqAwhXRQZrPQZZHVtzw2/ardQ\n" +
      "w9VBqPinKCB3avDI1TCZnIxvkCiYx4oRphml2k95lfl0vPqwnhcE/hO7rbgdFxwv\n" +
      "If3Io/wgtQlMb7EHx0d19CZ+HBEp4QVsBwSgoFWOwVDrosGGs8Y/sD0JNatPKvLq\n" +
      "SqNpU8HVAgMBAAECggEAGi9uZ1vwsEOnTFuHs8HXoDfTin94IAjrsEDZIF3xGWR9\n" +
      "6e65dDr7M2q0CLRhY0kEU4ZKwmZH0vkp+WdkBv+0MyWEjGL3+qYfoid1mFGzd2sj\n" +
      "K0rnp+9eoLt97+pqTxRAN/JfwQyhH5PkL7rV1rljJsrY8/pCdySFg2vzZtJaaAla\n" +
      "ekPCa4lxQ9+wpy3QHZemoc8JmG+3yfrh19FTm9IZPAAPbD2QWBRnttYnp94dH5aF\n" +
      "W8u/6SIfS3+Snw3x4jJ4s2SFl5rHvPIWCSNrtGM5Aedt+UM0x8vMm6XHWhLB+mpw\n" +
      "wABay6yaOzJEF+UMtrJFrkHq7bBo54n1eRDqG6E3dQKBgQDzTAc2LE6sY7zirg9r\n" +
      "ON/2c8bWaXby27ss6s6k4htyhNOJ1YuMw1Mbh0hnR9CYvuRe63Bj2j50vSypDw12\n" +
      "W93D7T+AnLSE/YuW1WpqsY+zOjD8JznYfPfn9nsVRIumuu8bOG5X8kxT7ySknLQZ\n" +
      "NfQ04XVvAt8SKYS3BUDJKb46ewKBgQDe2BdUmlvsW7vp02Uv9T+6+H7F/PECWdrU\n" +
      "NaV3O3N1Mm8EwcAoesIxBiNJVCz4NoetHSOd0dz8dTxqkXS5TvVfczMnepUBuFXg\n" +
      "TOA1W+xWo7bDKel70OWqQ9ghoF10SPTpNUySpbDMdVsr0EU8PjQad0u7nkqCx9p1\n" +
      "C8qIwJGr7wKBgQC2xzBHx4OXSRq3JVLaF5FR4mrH29WL3/2/Yeu6vU8nepg9XZuI\n" +
      "NZly/fAr/yy8A/UnRjNaILR5GUG7BF71w1BYiB0D7zZDDwPWXiCjZR/y4s24MXPo\n" +
      "qwHHV0nikWtk590IEx36nkIvcGKT9FHs+rarH5IMwxh42Y4lvSGNvvl1jwKBgQCB\n" +
      "tr892+wOFQe4//gyhktmhiclECsp9yvNwrxiPxTh7014M1+rMGnBJ5V6pajXgsZP\n" +
      "GlsVDofX3FYiojCTfUaPHPt1y4DY03gJbDZGWQ+lDv7fc5IZJGvLRFqWmEZN3fnR\n" +
      "ldjQs+nJ2bYMNttWSc8CaNaIi4dLwRGEeCyYlZ81uQKBgQDUk5H174LBdTVATGJL\n" +
      "ZQN9q6HAViqw/hzmWdTVYTn1p+OvdORC4QCmnpc+qgEMODpah71n3uXc6YDNYqYJ\n" +
      "68HM2XOR2g1PMsQ5Y7805gU0BcuhkMNEuUt3f4x0TpnwGRAuQ5/6LNMA1/jge/IP\n" +
      "5a+Jgv4Vf6iIpkXz5N0XaK6S7g==\n" +
      "-----END PRIVATE KEY-----",
  },

  rdsServerlessBot: {
    rdsServerLessPublicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA08lMk0xs8J/5bdALGSpY\n" +
      "15MvboNykrBYPtMF8kJUNN/I2gN0tDi5Nk5FS/6tDqP05XMaZvav4zfa7W9I9gol\n" +
      "z/gnvcPr1NjNPQqDOzcPa9jHnqHJj07Hm/rG1EEnAG2rZkk5QqRqqlHRrB7ickem\n" +
      "R+f7KSQgBEPBskOCWLTAiqFyNkLlXPuQWqgMIV0UGaz0GWR1bc8Nv2q3UMPVQaj4\n" +
      "pyggd2rwyNUwmZyMb5AomMeKEaYZpdpPeZX5dLz6sJ4XBP4Tu624HRccLyH9yKP8\n" +
      "ILUJTG+xB8dHdfQmfhwRKeEFbAcEoKBVjsFQ66LBhrPGP7A9CTWrTyry6kqjaVPB\n" +
      "1QIDAQAB\n" +
      "-----END PUBLIC KEY-----",
    rdsServerLessPrivateKey:
      "-----BEGIN PRIVATE KEY-----\n" +
      "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDTyUyTTGzwn/lt\n" +
      "0AsZKljXky9ug3KSsFg+0wXyQlQ038jaA3S0OLk2TkVL/q0Oo/Tlcxpm9q/jN9rt\n" +
      "b0j2CiXP+Ce9w+vU2M09CoM7Nw9r2MeeocmPTseb+sbUQScAbatmSTlCpGqqUdGs\n" +
      "HuJyR6ZH5/spJCAEQ8GyQ4JYtMCKoXI2QuVc+5BaqAwhXRQZrPQZZHVtzw2/ardQ\n" +
      "w9VBqPinKCB3avDI1TCZnIxvkCiYx4oRphml2k95lfl0vPqwnhcE/hO7rbgdFxwv\n" +
      "If3Io/wgtQlMb7EHx0d19CZ+HBEp4QVsBwSgoFWOwVDrosGGs8Y/sD0JNatPKvLq\n" +
      "SqNpU8HVAgMBAAECggEAGi9uZ1vwsEOnTFuHs8HXoDfTin94IAjrsEDZIF3xGWR9\n" +
      "6e65dDr7M2q0CLRhY0kEU4ZKwmZH0vkp+WdkBv+0MyWEjGL3+qYfoid1mFGzd2sj\n" +
      "K0rnp+9eoLt97+pqTxRAN/JfwQyhH5PkL7rV1rljJsrY8/pCdySFg2vzZtJaaAla\n" +
      "ekPCa4lxQ9+wpy3QHZemoc8JmG+3yfrh19FTm9IZPAAPbD2QWBRnttYnp94dH5aF\n" +
      "W8u/6SIfS3+Snw3x4jJ4s2SFl5rHvPIWCSNrtGM5Aedt+UM0x8vMm6XHWhLB+mpw\n" +
      "wABay6yaOzJEF+UMtrJFrkHq7bBo54n1eRDqG6E3dQKBgQDzTAc2LE6sY7zirg9r\n" +
      "ON/2c8bWaXby27ss6s6k4htyhNOJ1YuMw1Mbh0hnR9CYvuRe63Bj2j50vSypDw12\n" +
      "W93D7T+AnLSE/YuW1WpqsY+zOjD8JznYfPfn9nsVRIumuu8bOG5X8kxT7ySknLQZ\n" +
      "NfQ04XVvAt8SKYS3BUDJKb46ewKBgQDe2BdUmlvsW7vp02Uv9T+6+H7F/PECWdrU\n" +
      "NaV3O3N1Mm8EwcAoesIxBiNJVCz4NoetHSOd0dz8dTxqkXS5TvVfczMnepUBuFXg\n" +
      "TOA1W+xWo7bDKel70OWqQ9ghoF10SPTpNUySpbDMdVsr0EU8PjQad0u7nkqCx9p1\n" +
      "C8qIwJGr7wKBgQC2xzBHx4OXSRq3JVLaF5FR4mrH29WL3/2/Yeu6vU8nepg9XZuI\n" +
      "NZly/fAr/yy8A/UnRjNaILR5GUG7BF71w1BYiB0D7zZDDwPWXiCjZR/y4s24MXPo\n" +
      "qwHHV0nikWtk590IEx36nkIvcGKT9FHs+rarH5IMwxh42Y4lvSGNvvl1jwKBgQCB\n" +
      "tr892+wOFQe4//gyhktmhiclECsp9yvNwrxiPxTh7014M1+rMGnBJ5V6pajXgsZP\n" +
      "GlsVDofX3FYiojCTfUaPHPt1y4DY03gJbDZGWQ+lDv7fc5IZJGvLRFqWmEZN3fnR\n" +
      "ldjQs+nJ2bYMNttWSc8CaNaIi4dLwRGEeCyYlZ81uQKBgQDUk5H174LBdTVATGJL\n" +
      "ZQN9q6HAViqw/hzmWdTVYTn1p+OvdORC4QCmnpc+qgEMODpah71n3uXc6YDNYqYJ\n" +
      "68HM2XOR2g1PMsQ5Y7805gU0BcuhkMNEuUt3f4x0TpnwGRAuQ5/6LNMA1/jge/IP\n" +
      "5a+Jgv4Vf6iIpkXz5N0XaK6S7g==\n" +
      "-----END PRIVATE KEY-----",
    ttl: 60,
  },

  cronJobHandler: {
    privateKey:
      "-----BEGIN RSA PRIVATE KEY-----\n" +
      "MIIEowIBAAKCAQEAqjkUS3EGyuh64eITS/n5MX7G4z5MIv99DNqZezqCSRD/QIXO\n" +
      "1QtDrj/OKAB5a+4GAJSxIO8HgRFocdiKauxako3UagNSabiI+/H5zXjtnbPKwMBd\n" +
      "CoJ3r1+OzyMT4zL+SVlIMHkxYbRgMYJvNTyie/rIpjcpQhaBJxyBkaT2Imy9luGC\n" +
      "Rhd5wupx9+rhd8xOYu+hqSWfP4zIcEGCs86OXFFmNp6sqcQD1P15HkJtleodzcKg\n" +
      "msqo8RTk8t+urdWIdoLFAugwqFE9jor8UxApwT5xr8c84VDfbPgc10V2XTda4SXa\n" +
      "IRP7QY+9agGmZIYp0LWxUOhB37PNFDhUEw9dVwIDAQABAoIBAH9rJJ7oJz6B0WH+\n" +
      "WZV4s6jyDiySOGnGNzQE+fh9LoNFHtyMjOt6eBoaFtZorHs2+/U5WHGfm01o23bE\n" +
      "sbAh5hZn5kXI4MrUYG2/js7Yo3111OJ92+d/C9oRvJOe3Ucnp6L+GwR145oQbCUD\n" +
      "Tv1ZuwL1EXciOVcIA3tkYjTEd54B8UTfEMpRMdlkPohYL96kizqbe6peG9hlLMXS\n" +
      "AeVr2y0ueDR+fYte6TmejpfxnD16/PksMGH5ALHQ6AonCngvDO3mnGLaFuwHkRnY\n" +
      "1vMkni+6J57MQz+GAWI7p1EKbEzl9Z+1a6NDxALabVxYuQFc5pa7wXr97/9SAC5x\n" +
      "NvZ/EekCgYEA1CcCDXhi6ztK+BhnYCKZKR9GxP9CReNm9FVIB4cVGKduCuaJrcGk\n" +
      "qKPSGkaMaJat23WDxr9GUhR1IThK+/dLg+Ud9GPvWN710LT+Wm9cuwuyPbyAet8J\n" +
      "2G+IKbCsr62okI/XVBnfPrGA2tQZRMgia7lEz/ZKx/7oOpN/FyPpG+UCgYEAzWeV\n" +
      "k12md1YIJcPHfVofsnqpy22PIhLJgN3LgM2aubPQoYg1LBwBwRWLU16zNLFhbsyx\n" +
      "leMA3OsyLFzw7NmsCpXE7SB1nH0xFmTi/ONqiN4Hx0w+72kG3LLcVWDwqGF3zj+x\n" +
      "v/75dYgWW1SeofwgkkDnmnqMuESnprojyRzk2IsCgYAb3lftrw/HeM17U7FYtpLK\n" +
      "DRq9zA5HofynQgCpRHxn9a6F7gzN728S3BpAa14MaybBemlqFTxGkftk9sEa4jxg\n" +
      "QhuyO+J4GSnPVcdH1/Mlev7aD0YNXfksHlKTr2qv1S8cdljB6ngiAy07EbuUBnpH\n" +
      "DlpUuzTNmtWkxDVgs83uZQKBgQCbo+Cv4Gdxx2u3CelQL4kTGWUtct/hJrEvB2Db\n" +
      "QW/7RKhSrb30pWgi4WtICdrqk3nLlij99RtDSqgi+23HWozFHIUyVMUphac7W8iv\n" +
      "bLbd7LeiKUEK8d80Pgc8Xo8cV3aLfrH2VIK7rxmZrL3i6gPYLnwQDsowGj2a1TKm\n" +
      "glFZTwKBgDr/Lf4P8V7s+RyIKea0AKMM9xAqbvZRdKFFNTq5SXUtVFi130F3ozHV\n" +
      "o6x/R8X3QuyNeyZ8SI7eKJ+oo1jF97WgRWBiE66IHGziUZc4+gFAmHzdeZft0xtJ\n" +
      "AIvluPVA3HOHFj4US3LMxbxDsPr+gkTpkVGIfK0rk8Za3dN3mZJw\n" +
      "-----END RSA PRIVATE KEY-----",
    publicKey:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqjkUS3EGyuh64eITS/n5\n" +
      "MX7G4z5MIv99DNqZezqCSRD/QIXO1QtDrj/OKAB5a+4GAJSxIO8HgRFocdiKauxa\n" +
      "ko3UagNSabiI+/H5zXjtnbPKwMBdCoJ3r1+OzyMT4zL+SVlIMHkxYbRgMYJvNTyi\n" +
      "e/rIpjcpQhaBJxyBkaT2Imy9luGCRhd5wupx9+rhd8xOYu+hqSWfP4zIcEGCs86O\n" +
      "XFFmNp6sqcQD1P15HkJtleodzcKgmsqo8RTk8t+urdWIdoLFAugwqFE9jor8UxAp\n" +
      "wT5xr8c84VDfbPgc10V2XTda4SXaIRP7QY+9agGmZIYp0LWxUOhB37PNFDhUEw9d\n" +
      "VwIDAQAB\n" +
      "-----END PUBLIC KEY-----",
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

  integrations: {
    newrelic: {
      appName: "RDS_API_production",
      licenseKey: "<newrelicLicenseKey>",
    },
  },

  routesCacheTTL: {},

  githubAccessToken: "GITHUB_PERSONAL_ACCESS_TOKEN",

  Event100ms: {
    APP_ACCESS_KEY: "EVENT_100MS_APP_ACCESS_KEY",
    APP_SECRET: "EVENT_100MS_APP_SECRET",
  },

  externalServices: {
    EXTERNAL_SERVICE_PUBLIC_KEY: "EXTERNAL_SERVICE_PUBLIC_KEY",
  },
};
