module.exports = {
  port: 3000,
  enableFileLogs: false,
  enableConsoleLogs: true,

  githubOauth: {
    clientId: "<clientId>",
    clientSecret: "<clientSecret>",
  },

  firestore: `{
  "type": "service_account",
  "project_id": "rds-web-backend",
  "private_key_id": "<private_key_id>",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRZQTjE8wazoVn\\njtxwZgBDnrBo24+dK4m2v3GYGze8oYiXMr3pzipK2ufzFlWPtSIeelYBDJrS80nX\\np9Ux9hSWH1fL/mRkq01bCWaKcmDa5QTfmAabB9sHj0+It2FFov/SPSwGWj+yWZPQ\\nTkG65J9/i1FU8786ZkW6SrieFSDp1DIqSf4bSa22juqycPjwBGzJt9AG3q5eHU+c\\n5vMBVD1ZFhjblhfsdafFTAXDIsYjuzQbBUkqVCxhvYfILiNWOQGkW1j1F/gPGSgxIG0u/u9\\nEAmVE2QK+7yVSK7XQc9QSHLA8ki2gMAgw6EcrXXZxbFYE5V8HIbkH7WcB/CQ7Uco\\nPArBc3rLAgMBAAECggEAFNBwWGwm3UFLJHygb/HLs+0JxxqQH4Ts5wQHtCF8fF0o\\nOTNbimqqbI9vAAxny+Wq8xGhC/CnUTHK1MuDlzhJWpTaAtaSPymCAnsgPMHa29dp\\nERrJCU8SGCHIO6RS4Huv50OaZTVCYKWj2lB1GzFPo3uDRakHCLSS2M5FpL0f7O4zkjgasdvlfjIt7gLPPyL/EkAw5OVlL5awrRiiZbImdp80mSMFyI85ennQB1Be09BCSIiZ2WSl7j\\nEpN2sXMV8UsbIzqvg1oIwBKowcJHZFkjfSPNOt0eKhvg/2kVYEabAPN2hh9iCf89\\n5PBOTiqzM3/APxYvY1RopaIR1aW7SIUbl/5FA8PT3QKBgQD+yBJM3QlXV4+W/M8+\\nilcbWq6BCJOAs0QnfeXGXP72ctufZqkDgBKQL4I7pxlEFpyKrpr7SxW/zEIn71cP\\nY1MOeAi0p5S/VpWzBic3v29iYr0VnM/YqwQ4aDARrOb5igzfFBKc/nD4lGqNTUOw\\nm4T4szX3FdVfoH+9fKa6mH4hFQKBgQDSZWFnfVFyGXfaQSmpFO3fnAWmlmWJFN6a\\n5kxZstMsDfNQh8mP+e+CfVCmJwUNOF2hEt/70Gqk9VADQ5Tg0e+4AdY+9WSbk6Gp\\nyWMi9ONA+a+bbPHrPdOiR+cK+a35AAk7P6bZJeEcBdWZoAZ6f/gCvoLYr/y7aMdx\\n2jHfMxVkXwKBgQCI2ulRlk2FOAhuPyAHZQIDNIOV1gh9Uk3itLKvCZb+xJWKGvfg\\nZHQUNSDMcCaXN1og+EdRgnSNUOecUei+4Ehl9j4e5AF3gcfpoP2B6XeoLoeIy3Gt\\n3bbnobdoVyq+kdP2I+8Xm2kNbZOKkR0yCWe0u3baYUT7F9hl7UYV5wGhPQKBgC07\\n0qc3UC1hwFzSKazKbSHoH2bjas0ACaPv43Zddf1AupETwIgNyiqZ2p7+QJ3JAohA\\n0JsJAgSZISyyeO2k9Q7whilfBNRV9ynTvFalo74ycEjQMWrMDhYTs16us3KXSWTN\\nmIeTF0S5FGVE/F+V57JfVy5TF9kK++ZEbPh5uR2tAoGAGo8tIVMq1ax+FL5tPrtB\\nfeLcQqX7wNc3+xFnkEgfpglyEnvLs43MjBuFuSW7XPDWL5ho8yNHLfgWFlyiPiDO\\n4B9RP2hxJqEhO1SK/dvh3tToZS+Ue1PwMAK1IxKMZMUlcEwhNc2xRRVnR8oK/jkc\\nPQXjxD20fHb85HZAeMphW50=\\n-----END PRIVATE KEY-----\\n",
  "client_email": "firebase-adminsdk-fbsvc@rds-web-backend.iam.gserviceaccount.com",
  "client_id": "107801362739833356543",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbfhvc%40rds-web-backend-263d3.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}`,
};
