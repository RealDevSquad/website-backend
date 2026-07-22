const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;
const cleanDb = require("../../utils/cleanDb");
const {
  addUserDetailsToProgressDocs,
  getPaginatedProgressDocument,
  createProgressDocument,
} = require("../../../models/progresses");
const fireStore = require("../../../utils/firestore");
const progressesCollection = fireStore.collection("progresses");
const { stubbedModelTaskProgressData, stubbedModelProgressData } = require("../../fixtures/progress/progresses");
const addUser = require("../../utils/addUser");
const userDataArray = require("../../fixtures/user/user")();
const { removeSensitiveInfo } = require("../../../services/dataAccessLayer");
const {
  PROGRESSES_RESPONSE_MESSAGES: { PROGRESS_DOCUMENT_NOT_FOUND },
} = require("../../../constants/progresses");
const users = require("../../../models/users");
describe("progressModel", function () {
  afterEach(async function () {
    await cleanDb();
    sinon.restore();
  });

  describe("getPaginatedProgressDocument", function () {
    let userId;
    let userId2;
    let userId3;
    const taskId = "taskId1";
    const taskId2 = "taskId2";

    beforeEach(async function () {
      userId = await addUser(userDataArray[0]);
      userId2 = await addUser(userDataArray[1]);
      userId3 = await addUser(userDataArray[2]);
      const progressData = stubbedModelTaskProgressData(userId, taskId, 1683072000000, 1682985600000);
      const progressData2 = stubbedModelTaskProgressData(userId2, taskId2, 1683072000000, 1682985600000);
      const progressData3 = stubbedModelProgressData(userId, 1683072000000, 1682985600000);
      const progressData4 = stubbedModelProgressData(userId2, 1683072000000, 1682985600000);
      await progressesCollection.add(progressData);
      await progressesCollection.add(progressData2);
      await progressesCollection.add(progressData3);
      await progressesCollection.add(progressData4);
    });

    afterEach(async function () {
      await cleanDb();
    });

    it("should return progress documents for type=task", async function () {
      const size = 1;
      const { progressDocs, totalProgressCount } = await getPaginatedProgressDocument({ type: "task", size });

      expect(progressDocs).to.have.lengthOf(size);
      expect(totalProgressCount).to.equal(2);
      expect(progressDocs[0].type).to.equal("task");
    });

    it("should return paginated progress documents and total count", async function () {
      const size = 1;
      const { progressDocs, totalProgressCount } = await getPaginatedProgressDocument({ type: "user", size });

      expect(progressDocs).to.have.lengthOf(size);
      expect(totalProgressCount).to.equal(2);
    });

    it("should throw error when no progress documents match the query", async function () {
      try {
        await getPaginatedProgressDocument({
          size: 1,
          userId: userId3,
        });
        throw new Error("Test failed: expected a NotFound error to be thrown.");
      } catch (err) {
        expect(err.message).to.equal(PROGRESS_DOCUMENT_NOT_FOUND);
      }
    });

    it("should paginate results correctly when a specific page is requested", async function () {
      const page = 1;
      const size = 1;
      const { progressDocs, totalProgressCount } = await getPaginatedProgressDocument({ type: "user", page, size });

      expect(progressDocs).to.have.lengthOf(size);
      expect(totalProgressCount).to.equal(2);
    });

    it("should use default page value when page is not provided", async function () {
      const size = 2;
      const { progressDocs, totalProgressCount } = await getPaginatedProgressDocument({ type: "user", size });

      expect(progressDocs).to.have.lengthOf(size);
      expect(totalProgressCount).to.equal(2);
    });

    it("should filter progress documents by userId", async function () {
      const size = 1;
      const { progressDocs, totalProgressCount } = await getPaginatedProgressDocument({
        size,
        userId,
      });

      expect(totalProgressCount).to.equal(1);
      expect(progressDocs).to.have.lengthOf(size);
    });
  });

  describe("addUserDetailsToProgressDocs", function () {
    afterEach(function () {
      cleanDb();
      sinon.restore();
    });

    it("should add userData to progress documents correctly", async function () {
      const userData = userDataArray[0];
      const userData2 = userDataArray[1];
      const { userId } = await users.addOrUpdate(userData);
      const { userId: userId2 } = await users.addOrUpdate(userData2);
      const updatedUserData = { ...userData, id: userId };
      const updatedUserData2 = { ...userData2, id: userId2 };
      removeSensitiveInfo(updatedUserData);
      removeSensitiveInfo(updatedUserData2);
      const mockProgressDocs = [
        { userId: userId, taskId: 101 },
        { userId: userId2, taskId: 102 },
      ];

      const result = await addUserDetailsToProgressDocs(mockProgressDocs);

      expect(result).to.deep.equal([
        { userId, taskId: 101, userData: updatedUserData },
        { userId: userId2, taskId: 102, userData: updatedUserData2 },
      ]);
    });

    it("should handle errors and set userData as null", async function () {
      const userData = userDataArray[0];
      await addUser(userData);

      const mockProgressDocs = [{ userId: "userIdNotExists", taskId: 101 }];

      const result = await addUserDetailsToProgressDocs(mockProgressDocs);

      expect(result).to.deep.equal([{ userId: "userIdNotExists", taskId: 101, userData: null }]);
    });
  });

  describe("createProgressDocument", function () {
    const buildUserProgress = (userId) => ({
      type: "user",
      userId,
      completed: "Implemented the fix",
      planned: "Write regression tests",
      blockers: "None",
    });

    it("stores exactly one progress document when two requests race for the same day", async function () {
      const userId = "raceConditionUserId";

      const results = await Promise.allSettled([
        createProgressDocument(buildUserProgress(userId)),
        createProgressDocument(buildUserProgress(userId)),
      ]);

      const fulfilled = results.filter((result) => result.status === "fulfilled");
      const rejected = results.filter((result) => result.status === "rejected");

      expect(fulfilled).to.have.lengthOf(1);
      expect(rejected).to.have.lengthOf(1);
      expect(rejected[0].reason.status).to.equal(409);
      expect(rejected[0].reason.message).to.equal("User Progress for the day has already been created.");

      const snapshot = await progressesCollection.where("type", "==", "user").where("userId", "==", userId).get();
      expect(snapshot.size).to.equal(1);
    });

    it("throws a Conflict when a progress document already exists for the user on the same day", async function () {
      const userId = "sequentialUserId";

      const { data } = await createProgressDocument(buildUserProgress(userId));
      expect(data.userId).to.equal(userId);

      try {
        await createProgressDocument(buildUserProgress(userId));
        throw new Error("Test failed: expected a Conflict error to be thrown.");
      } catch (err) {
        expect(err.status).to.equal(409);
        expect(err.message).to.equal("User Progress for the day has already been created.");
      }

      const snapshot = await progressesCollection.where("type", "==", "user").where("userId", "==", userId).get();
      expect(snapshot.size).to.equal(1);
    });
  });
});
