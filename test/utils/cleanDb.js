const config = require("config");
const { fetch } = require("../../utils/fetch");
const firebaseConfig = require("../../firebase.json");
const clearCaches = require("./clearCaches");

/**
 * Deletes all data from firestore emulator running locally.
 * To be used during tests for deleting the data as required.
 */
module.exports = async () => {
  // Clear first so cleanup never reads cached data, then clear again after the
  // asynchronous DB deletion so late responses cannot repopulate stale entries.
  clearCaches();

  const credentialsObject = JSON.parse(config.firestore);
  const projectId = credentialsObject.project_id;

  const firestoreCleanUrl =
    `http://localhost:${firebaseConfig.emulators.firestore.port}` +
    `/emulator/v1/projects/${projectId}/databases/(default)/documents`;

  try {
    return await fetch(firestoreCleanUrl, "delete");
  } finally {
    clearCaches();
  }
};
