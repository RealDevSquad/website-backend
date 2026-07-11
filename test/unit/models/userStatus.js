const { userFutureStatusData } = require("../../fixtures/userFutureStatus/userFutureStatusData");
const chai = require("chai");
const sinon = require("sinon");
const admin = require("firebase-admin");
const { NotFound, Forbidden } = require("http-errors");
const { expect } = chai;
const firestore = require("../../../utils/firestore");
const logger = require("../../../utils/logger");
global.logger = logger;

const userStatusModel = firestore.collection("usersStatus");
const tasksModel = firestore.collection("tasks");
const discordRoleModel = firestore.collection("discord-roles");
const memberRoleModel = firestore.collection("member-group-roles");
const {
  deleteUserStatus,
  getUserStatus,
  getAllUserStatus,
  updateUserStatus,
  updateAllUserStatus,
  getGroupRole,
  cancelOooStatus,
  addFutureStatus,
} = require("../../../models/userStatus");
const cleanDb = require("../../utils/cleanDb");
const addUser = require("../../utils/addUser");
const userData = require("../../fixtures/user/user");
const allTasks = require("../../fixtures/tasks/tasks");
const { userState } = require("../../../constants/userStatus");
const { TASK_STATUS } = require("../../../constants/tasks");
const { ONE_DAY_IN_MS } = require("../../../constants/users");
const { generateStatusDataForCancelOOO, generateDefaultFutureStatus } = require("../../fixtures/userStatus/userStatus");

const now = () => Date.now();

const buildCurrentStatus = (state, overrides = {}) => ({
  message: "",
  from: now() - ONE_DAY_IN_MS,
  until: "",
  updatedAt: now() - ONE_DAY_IN_MS,
  state,
  ...overrides,
});

const buildUserStatus = (userId, state = userState.ACTIVE, overrides = {}) => {
  const { currentStatus, ...statusOverrides } = overrides;
  return {
    userId,
    currentStatus: buildCurrentStatus(state, currentStatus),
    monthlyHours: {
      committed: 40,
      updatedAt: now() - ONE_DAY_IN_MS,
    },
    ...statusOverrides,
  };
};

const seedGroupIdleRole = async () => {
  await discordRoleModel.doc("group-idle-doc").set({
    rolename: "group-idle",
    roleid: "group-idle-role-id",
  });
};

const getGroupIdleMemberRolesForUser = (discordId) => {
  return memberRoleModel.where("roleid", "==", "group-idle-role-id").where("userid", "==", discordId).get();
};

const addLiveTaskForUser = async (userId) => {
  const [task] = allTasks();
  await tasksModel.doc().set({
    ...task,
    assignee: userId,
    status: TASK_STATUS.ASSIGNED,
  });
};

describe("User Status Model", function () {
  let fetchStub;

  afterEach(async function () {
    sinon.restore();
    if (fetchStub) {
      fetchStub = null;
    }
    await cleanDb();
  });

  describe("deleteUserStatus", function () {
    it("should delete an existing user status document", async function () {
      const userId = "delete-existing-user";
      await userStatusModel.doc("status-to-delete").set(buildUserStatus(userId));

      const response = await deleteUserStatus(userId);
      const deletedDoc = await userStatusModel.doc("status-to-delete").get();

      expect(response).to.deep.equal({
        id: "status-to-delete",
        userStatusExisted: true,
        userStatusDeleted: true,
      });
      expect(deletedDoc.exists).to.equal(false);
    });

    it("should return a not found response when the user status document does not exist", async function () {
      const response = await deleteUserStatus("missing-user");

      expect(response).to.deep.equal({
        id: null,
        userStatusExisted: false,
        userStatusDeleted: false,
      });
    });

    it("should throw an error when the database query fails", async function () {
      sinon.stub(admin.firestore.Query.prototype, "where").throws(new Error("Unable to delete user status"));

      try {
        await deleteUserStatus("user-id");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal("Unable to delete user status");
      }
    });
  });

  describe("getUserStatus", function () {
    it("should fetch an existing user status document", async function () {
      const userId = "get-existing-user";
      const statusData = buildUserStatus(userId, userState.IDLE);
      await userStatusModel.doc("existing-status").set(statusData);

      const response = await getUserStatus(userId);

      expect(response.id).to.equal("existing-status");
      expect(response.userStatusExists).to.equal(true);
      expect(response.data).to.deep.include({
        userId,
      });
      expect(response.data.currentStatus.state).to.equal(userState.IDLE);
    });

    it("should return a not found response when the user status document does not exist", async function () {
      const response = await getUserStatus("missing-user");

      expect(response).to.deep.equal({
        id: null,
        data: null,
        userStatusExists: false,
      });
    });

    it("should throw an error when the database query fails", async function () {
      sinon.stub(admin.firestore.Query.prototype, "where").throws(new Error("Unable to fetch user status"));

      try {
        await getUserStatus("user-id");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal("Unable to fetch user status");
      }
    });
  });

  describe("getAllUserStatus", function () {
    it("should retrieve all user status documents when no state filter is provided", async function () {
      const activeStatus = buildUserStatus("active-user", userState.ACTIVE);
      await userStatusModel.doc("active-status").set(activeStatus);
      await userStatusModel.doc("idle-status").set(buildUserStatus("idle-user", userState.IDLE, { idleFrom: 123 }));

      const response = await getAllUserStatus({});

      expect(response.allUserStatus).to.have.length(2);
      expect(response.allUserStatus).to.deep.include({
        id: "active-status",
        userId: "active-user",
        currentStatus: activeStatus.currentStatus,
        monthlyHours: activeStatus.monthlyHours,
        idleFrom: null,
      });
      expect(response.allUserStatus.find((status) => status.id === "idle-status").idleFrom).to.equal(123);
    });

    it("should filter user status documents by current state", async function () {
      await userStatusModel.doc("active-status").set(
        buildUserStatus("active-user", userState.ACTIVE, {
          currentStatus: { from: now() - ONE_DAY_IN_MS * 2 },
        })
      );
      await userStatusModel.doc("idle-status").set(buildUserStatus("idle-user", userState.IDLE));

      const response = await getAllUserStatus({ state: userState.ACTIVE });

      expect(response.allUserStatus).to.have.length(1);
      expect(response.allUserStatus[0].id).to.equal("active-status");
      expect(response.allUserStatus[0].currentStatus.state).to.equal(userState.ACTIVE);
    });

    it("should throw an error when the database query fails", async function () {
      sinon.stub(admin.firestore.Query.prototype, "get").throws(new Error("Unable to fetch all user status"));

      try {
        await getAllUserStatus({});
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal("Unable to fetch all user status");
      }
    });
  });

  describe("updateUserStatus", function () {
    it("should update an existing user status document", async function () {
      const userId = "update-existing-user";
      await userStatusModel.doc("status-to-update").set(buildUserStatus(userId, userState.ACTIVE));

      const updatedStatusData = {
        currentStatus: buildCurrentStatus(userState.IDLE, {
          message: "Wrapping up",
          from: now(),
          updatedAt: now(),
        }),
      };

      const response = await updateUserStatus(userId, updatedStatusData);
      const updatedDoc = await userStatusModel.doc("status-to-update").get();

      expect(response.id).to.equal("status-to-update");
      expect(response.userStatusExists).to.equal(true);
      expect(response.data.currentStatus.state).to.equal(userState.IDLE);
      expect(updatedDoc.data().currentStatus.state).to.equal(userState.IDLE);
    });

    it("should move tomorrow's OOO status into futureStatus", async function () {
      const userId = "future-ooo-user";
      await userStatusModel.doc("future-ooo-status").set(buildUserStatus(userId, userState.ACTIVE));

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.OOO, {
          from: now() + ONE_DAY_IN_MS,
          until: now() + ONE_DAY_IN_MS * 3,
          message: "OOO tomorrow",
          updatedAt: now(),
        }),
      });
      const updatedDoc = await userStatusModel.doc("future-ooo-status").get();

      expect(response.data.currentStatus).to.equal(undefined);
      expect(response.data.futureStatus.state).to.equal(userState.OOO);
      expect(updatedDoc.data().futureStatus.state).to.equal(userState.OOO);
      expect(updatedDoc.data().currentStatus.state).to.equal(userState.ACTIVE);
    });

    it("should clear futureStatus when OOO starts today", async function () {
      const userId = "current-ooo-user";
      await userStatusModel.doc("current-ooo-status").set(buildUserStatus(userId, userState.ACTIVE));

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.OOO, {
          from: now(),
          until: now() + ONE_DAY_IN_MS,
          message: "OOO today",
          updatedAt: now(),
        }),
      });
      const updatedDoc = await userStatusModel.doc("current-ooo-status").get();

      expect(response.data.currentStatus.state).to.equal(userState.OOO);
      expect(response.data.futureStatus).to.deep.equal({});
      expect(updatedDoc.data().currentStatus.state).to.equal(userState.OOO);
      expect(updatedDoc.data().futureStatus).to.deep.equal({});
      expect(updatedDoc.data().lastOooUntil).to.equal(null);
    });

    it("should clear stale futureStatus and persist lastOooUntil when an OOO user moves to ACTIVE", async function () {
      const userId = "ooo-to-active-user";
      const oooUntil = now() + ONE_DAY_IN_MS;
      await userStatusModel.doc("ooo-to-active-status").set(
        buildUserStatus(userId, userState.OOO, {
          currentStatus: {
            until: oooUntil,
          },
          futureStatus: buildCurrentStatus(userState.IDLE, {
            from: oooUntil,
          }),
        })
      );

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.ACTIVE, {
          from: now(),
          updatedAt: now(),
        }),
      });
      const updatedDoc = await userStatusModel.doc("ooo-to-active-status").get();

      expect(response.data.currentStatus.state).to.equal(userState.ACTIVE);
      expect(response.data.futureStatus).to.deep.equal({});
      expect(response.data.lastOooUntil).to.equal(oooUntil);
      expect(updatedDoc.data().futureStatus).to.deep.equal({});
      expect(updatedDoc.data().lastOooUntil).to.equal(oooUntil);
    });

    it("should remove the group idle Discord role when a user transitions out of IDLE", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      const userId = await addUser(userData()[0]);
      await seedGroupIdleRole();
      await memberRoleModel.doc("member-idle-role").set({
        roleid: "group-idle-role-id",
        userid: userData()[0].discordId,
      });
      await userStatusModel.doc("idle-status").set(buildUserStatus(userId, userState.IDLE));

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.ACTIVE, {
          from: now(),
          updatedAt: now(),
        }),
      });
      const memberRole = await memberRoleModel.doc("member-idle-role").get();

      expect(response.data.currentStatus.state).to.equal(userState.ACTIVE);
      expect(memberRole.exists).to.equal(false);
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.firstCall.args[1].method).to.equal("DELETE");
    });

    it("should not call Discord when the group idle role does not exist", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      const userId = await addUser(userData()[0]);
      await userStatusModel.doc("idle-status-no-role").set(buildUserStatus(userId, userState.IDLE));

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.ACTIVE, {
          from: now(),
          updatedAt: now(),
        }),
      });

      expect(response.data.currentStatus.state).to.equal(userState.ACTIVE);
      expect(fetchStub.notCalled).to.equal(true);
    });

    it("should not call Discord when the user has no discordId", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      const userId = await addUser(userData()[3]);
      await seedGroupIdleRole();
      await userStatusModel.doc("idle-status-no-discord").set(buildUserStatus(userId, userState.IDLE));

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.ACTIVE, {
          from: now(),
          updatedAt: now(),
        }),
      });

      expect(response.data.currentStatus.state).to.equal(userState.ACTIVE);
      expect(fetchStub.notCalled).to.equal(true);
    });

    it("should call Discord DELETE even when the member idle role is not present in Firestore", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      const userId = await addUser(userData()[0]);
      await seedGroupIdleRole();
      await userStatusModel.doc("idle-status-no-member-role").set(buildUserStatus(userId, userState.IDLE));

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.ACTIVE, {
          from: now(),
          updatedAt: now(),
        }),
      });

      expect(response.data.currentStatus.state).to.equal(userState.ACTIVE);
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.firstCall.args[1].method).to.equal("DELETE");
    });

    it("should throw when Discord role removal fails", async function () {
      fetchStub = sinon.stub(global, "fetch").rejects(new Error("Discord remove failed"));
      const userId = await addUser(userData()[0]);
      await seedGroupIdleRole();
      await userStatusModel.doc("idle-status-discord-failure").set(buildUserStatus(userId, userState.IDLE));

      return updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.ACTIVE, {
          from: now(),
          updatedAt: now(),
        }),
      }).catch((err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal("Discord remove failed");
      });
    });

    it("should create a new user status document when one does not exist", async function () {
      const userId = "new-status-user";

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.ACTIVE, {
          from: now(),
          updatedAt: now(),
        }),
      });
      const persistedStatus = await getUserStatus(userId);

      expect(response.userStatusExists).to.equal(false);
      expect(response.id).to.be.a("string");
      expect(response.data.currentStatus.state).to.equal(userState.ACTIVE);
      expect(persistedStatus.userStatusExists).to.equal(true);
      expect(persistedStatus.data.lastOooUntil).to.equal(null);
    });

    it("should create a new user status document with futureStatus for future OOO", async function () {
      const userId = "new-future-ooo-status-user";

      const response = await updateUserStatus(userId, {
        currentStatus: buildCurrentStatus(userState.OOO, {
          from: now() + ONE_DAY_IN_MS,
          until: now() + ONE_DAY_IN_MS * 3,
          message: "Future OOO",
          updatedAt: now(),
        }),
      });
      const persistedStatus = await getUserStatus(userId);

      expect(response.userStatusExists).to.equal(false);
      expect(response.data.currentStatus).to.equal(undefined);
      expect(response.data.futureStatus.state).to.equal(userState.OOO);
      expect(persistedStatus.userStatusExists).to.equal(true);
      expect(persistedStatus.data.currentStatus).to.equal(undefined);
      expect(persistedStatus.data.futureStatus.state).to.equal(userState.OOO);
      expect(persistedStatus.data.lastOooUntil).to.equal(null);
    });

    it("should throw an error when the database update fails", async function () {
      const userId = "update-failure-user";
      await userStatusModel.doc("status-update-failure").set(buildUserStatus(userId, userState.ACTIVE));
      sinon
        .stub(admin.firestore.DocumentReference.prototype, "update")
        .rejects(new Error("Unable to update user status"));

      try {
        await updateUserStatus(userId, {
          currentStatus: buildCurrentStatus(userState.IDLE, {
            from: now(),
            updatedAt: now(),
          }),
        });
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal("Unable to update user status");
      }
    });
  });

  describe("updateAllUserStatus", function () {
    it("should transition a user's future status to current status after the futureStatus from date has passed", async function () {
      const userId = "ooo-to-active-user";
      const oooUntil = now() - ONE_DAY_IN_MS;
      await userStatusModel.doc("ooo-to-active-status").set(
        buildUserStatus(userId, userState.OOO, {
          currentStatus: {
            until: oooUntil,
          },
          futureStatus: buildCurrentStatus(userState.ACTIVE, {
            from: now() - ONE_DAY_IN_MS,
          }),
        })
      );

      const summary = await updateAllUserStatus();
      const updatedDoc = await userStatusModel.doc("ooo-to-active-status").get();

      expect(summary).to.deep.include({
        usersCount: 1,
        oooUsersAltered: 1,
      });
      expect(updatedDoc.data().currentStatus.state).to.equal(userState.ACTIVE);
      expect(updatedDoc.data().futureStatus).to.equal(undefined);
      expect(updatedDoc.data().lastOooUntil).to.equal(oooUntil);
    });

    it("should add the group idle Discord role when a processed transition moves a user into IDLE", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      const userId = await addUser(userData()[0]);
      await seedGroupIdleRole();
      await userStatusModel.doc("ooo-to-idle-status").set(
        buildUserStatus(userId, userState.OOO, {
          currentStatus: {
            until: now() - ONE_DAY_IN_MS,
          },
          futureStatus: buildCurrentStatus(userState.IDLE, {
            from: now() - ONE_DAY_IN_MS,
          }),
        })
      );

      await updateAllUserStatus();
      const memberRoles = await memberRoleModel
        .where("roleid", "==", "group-idle-role-id")
        .where("userid", "==", userData()[0].discordId)
        .get();

      expect(memberRoles.empty).to.equal(false);
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.firstCall.args[1].method).to.equal("PUT");
    });

    it("should not duplicate the group idle Firestore role when the user already has it", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      const userId = await addUser(userData()[0]);
      await seedGroupIdleRole();
      await memberRoleModel.doc("existing-member-idle-role").set({
        roleid: "group-idle-role-id",
        userid: userData()[0].discordId,
      });
      await userStatusModel.doc("ooo-to-idle-existing-member-role").set(
        buildUserStatus(userId, userState.OOO, {
          currentStatus: {
            until: now() - ONE_DAY_IN_MS,
          },
          futureStatus: buildCurrentStatus(userState.IDLE, {
            from: now() - ONE_DAY_IN_MS,
          }),
        })
      );

      await updateAllUserStatus();
      const memberRoles = await getGroupIdleMemberRolesForUser(userData()[0].discordId);

      expect(memberRoles.size).to.equal(1);
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.firstCall.args[1].method).to.equal("PUT");
    });

    it("should remove the group idle Discord role when a processed transition moves a user out of IDLE", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      const userId = await addUser(userData()[0]);
      await seedGroupIdleRole();
      await memberRoleModel.doc("member-idle-role").set({
        roleid: "group-idle-role-id",
        userid: userData()[0].discordId,
      });
      await userStatusModel.doc("idle-to-active-status").set(
        buildUserStatus(userId, userState.IDLE, {
          futureStatus: buildCurrentStatus(userState.ACTIVE, {
            from: now() - ONE_DAY_IN_MS,
          }),
        })
      );

      await updateAllUserStatus();
      const memberRole = await memberRoleModel.doc("member-idle-role").get();

      expect(memberRole.exists).to.equal(false);
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.firstCall.args[1].method).to.equal("DELETE");
    });

    it("should remove an expired future OOO status", async function () {
      await userStatusModel.doc("expired-future-ooo-status").set(
        buildUserStatus("expired-future-ooo-user", userState.ACTIVE, {
          futureStatus: buildCurrentStatus(userState.OOO, {
            from: now() - ONE_DAY_IN_MS * 3,
            until: now() - ONE_DAY_IN_MS,
          }),
        })
      );

      const summary = await updateAllUserStatus();
      const updatedDoc = await userStatusModel.doc("expired-future-ooo-status").get();

      expect(summary.nonOooUsersAltered).to.equal(1);
      expect(updatedDoc.data().currentStatus.state).to.equal(userState.ACTIVE);
      expect(updatedDoc.data().futureStatus).to.equal(undefined);
    });

    it("should swap current and future statuses when today lies within a future OOO range", async function () {
      const until = now() + ONE_DAY_IN_MS;
      await userStatusModel.doc("active-to-ooo-status").set(
        buildUserStatus("active-to-ooo-user", userState.ACTIVE, {
          futureStatus: buildCurrentStatus(userState.OOO, {
            from: now() - ONE_DAY_IN_MS,
            until,
          }),
        })
      );

      const summary = await updateAllUserStatus();
      const updatedDoc = await userStatusModel.doc("active-to-ooo-status").get();

      expect(summary.nonOooUsersAltered).to.equal(1);
      expect(updatedDoc.data().currentStatus.state).to.equal(userState.OOO);
      expect(updatedDoc.data().futureStatus.state).to.equal(userState.ACTIVE);
      expect(updatedDoc.data().futureStatus.from).to.equal(until);
      expect(updatedDoc.data().lastOooUntil).to.equal(null);
    });

    it("should swap future OOO into currentStatus and set an empty futureStatus when no current state exists", async function () {
      const until = now() + ONE_DAY_IN_MS;
      await userStatusModel.doc("missing-current-to-ooo-status").set({
        userId: "missing-current-to-ooo-user",
        futureStatus: buildCurrentStatus(userState.OOO, {
          from: now() - ONE_DAY_IN_MS,
          until,
        }),
      });

      const summary = await updateAllUserStatus();
      const updatedDoc = await userStatusModel.doc("missing-current-to-ooo-status").get();

      expect(summary.nonOooUsersAltered).to.equal(1);
      expect(updatedDoc.data().currentStatus.state).to.equal(userState.OOO);
      expect(updatedDoc.data().futureStatus).to.deep.equal({});
      expect(updatedDoc.data().lastOooUntil).to.equal(null);
    });

    it("should return correct summary statistics for altered and unaltered statuses", async function () {
      await userStatusModel.doc("ooo-altered").set(
        buildUserStatus("ooo-altered-user", userState.OOO, {
          futureStatus: buildCurrentStatus(userState.ACTIVE, {
            from: now() - ONE_DAY_IN_MS,
          }),
        })
      );
      await userStatusModel.doc("ooo-unaltered").set(
        buildUserStatus("ooo-unaltered-user", userState.OOO, {
          futureStatus: buildCurrentStatus(userState.IDLE, {
            from: now() + ONE_DAY_IN_MS,
          }),
        })
      );
      await userStatusModel.doc("non-ooo-altered").set(
        buildUserStatus("non-ooo-altered-user", userState.ACTIVE, {
          futureStatus: buildCurrentStatus(userState.OOO, {
            from: now() - ONE_DAY_IN_MS,
            until: now() + ONE_DAY_IN_MS,
          }),
        })
      );
      await userStatusModel.doc("non-ooo-unaltered").set(
        buildUserStatus("non-ooo-unaltered-user", userState.ACTIVE, {
          futureStatus: buildCurrentStatus(userState.OOO, {
            from: now() + ONE_DAY_IN_MS,
            until: now() + ONE_DAY_IN_MS * 3,
          }),
        })
      );

      const summary = await updateAllUserStatus();

      expect(summary).to.deep.equal({
        usersCount: 2,
        oooUsersAltered: 1,
        oooUsersUnaltered: 0,
        nonOooUsersAltered: 1,
        nonOooUsersUnaltered: 0,
      });
    });

    it("should log a warning when more than 100 user status documents are updated", async function () {
      const loggerInfoStub = sinon.stub(logger, "info");
      const statusPromises = [];
      for (let index = 0; index < 101; index++) {
        statusPromises.push(
          userStatusModel.doc(`status-${index}`).set(
            buildUserStatus(`user-${index}`, userState.ACTIVE, {
              futureStatus: buildCurrentStatus(userState.OOO, {
                from: now() - ONE_DAY_IN_MS,
                until: now() + ONE_DAY_IN_MS,
              }),
            })
          )
        );
      }
      await Promise.all(statusPromises);

      await updateAllUserStatus();

      expect(loggerInfoStub.calledOnce).to.equal(true);
      expect(loggerInfoStub.firstCall.args[0]).to.include("Warning: More than 100 User Status documents to update");
    });

    it("should return an error response when the user status query fails", async function () {
      sinon.stub(admin.firestore.Query.prototype, "where").throws(new Error("Unable to query future statuses"));

      const response = await updateAllUserStatus();

      expect(response).to.deep.equal({
        status: 500,
        message: "User Status couldn't be updated Successfully.",
      });
    });

    it("should return an error response when the batch commit fails", async function () {
      await userStatusModel.doc("batch-failure-status").set(
        buildUserStatus("batch-failure-user", userState.ACTIVE, {
          futureStatus: buildCurrentStatus(userState.OOO, {
            from: now() - ONE_DAY_IN_MS,
            until: now() + ONE_DAY_IN_MS,
          }),
        })
      );
      sinon.stub(firestore, "batch").returns({
        _ops: [],
        set: sinon.stub(),
        commit: sinon.stub().rejects(new Error("Batch operation failed")),
      });

      const response = await updateAllUserStatus();

      expect(response).to.deep.equal({
        status: 500,
        message: "User Status couldn't be updated Successfully.",
      });
    });
  });

  describe("getGroupRole", function () {
    it("should return roleExists false when role name is empty or missing", async function () {
      expect(await getGroupRole()).to.deep.equal({ roleExists: false });
      expect(await getGroupRole("")).to.deep.equal({ roleExists: false });
    });

    it("should return roleExists false when the role does not exist", async function () {
      const response = await getGroupRole("group-idle");

      expect(response).to.deep.equal({ roleExists: false });
    });

    it("should return the role when it exists", async function () {
      await seedGroupIdleRole();

      const response = await getGroupRole("group-idle");

      expect(response.roleExists).to.equal(true);
      expect(response.role).to.deep.equal({
        id: "group-idle-doc",
        rolename: "group-idle",
        roleid: "group-idle-role-id",
      });
    });

    it("should throw an error when the database fetch fails", async function () {
      sinon.stub(admin.firestore.Query.prototype, "where").throws(new Error("Unable to fetch role"));

      try {
        await getGroupRole("group-idle");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal("Unable to fetch role");
      }
    });
  });

  describe("cancelOooStatus and addFutureStatus coverage", function () {
    let userId;
    let docRefUser0;

    beforeEach(async function () {
      userId = await addUser();
      docRefUser0 = userStatusModel.doc();
      const data = generateStatusDataForCancelOOO(userId, userState.OOO);
      await docRefUser0.set(data);
    });

    it("Should cancel the OOO Status of the User", async function () {
      const response = await cancelOooStatus(userId);
      expect(response.userStatusExists).to.equal(true);
      expect(response.data.userId).to.equal(userId);
      expect(response.data.currentStatus).to.not.equal(userState.OOO);
      expect(response.data.futureStatus?.state).to.equal(undefined);
    });

    it("Should clear the future Status if the User cancels OOO", async function () {
      const data = generateStatusDataForCancelOOO(userId, userState.OOO);
      const from = now() + ONE_DAY_IN_MS;
      data.futureStatus = generateDefaultFutureStatus(userState.IDLE, from, "");
      await docRefUser0.set(data);
      const response = await cancelOooStatus(userId);
      expect(response.userStatusExists).to.equal(true);
      expect(response.data.userId).to.equal(userId);
      expect(response.data.futureStatus.state).to.equal(undefined);
    });

    it("should transition to ACTIVE when the OOO user has active tasks", async function () {
      await addLiveTaskForUser(userId);

      const response = await cancelOooStatus(userId);

      expect(response.userStatusExists).to.equal(true);
      expect(response.data.currentStatus.state).to.equal(userState.ACTIVE);
    });

    it("should add the group idle Discord role and persist lastOooUntil when OOO is canceled without active tasks", async function () {
      fetchStub = sinon.stub(global, "fetch").resolves({ ok: true });
      await seedGroupIdleRole();
      const oooUntil = now() + ONE_DAY_IN_MS;
      const data = generateStatusDataForCancelOOO(userId, userState.OOO);
      data.currentStatus.until = oooUntil;
      await docRefUser0.set(data);

      const response = await cancelOooStatus(userId);
      const memberRoles = await getGroupIdleMemberRolesForUser(userData()[0].discordId);

      expect(response.data.currentStatus.state).to.equal(userState.IDLE);
      expect(response.data.lastOooUntil).to.equal(oooUntil);
      expect(memberRoles.size).to.equal(1);
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.firstCall.args[1].method).to.equal("PUT");
    });

    it("should throw an error if unable to fetch the user status document", async function () {
      sinon.stub(admin.firestore.Query.prototype, "where").throws(new Error("Unable to fetch user status document"));
      try {
        await cancelOooStatus(userId);
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.be.equal("Unable to fetch user status document");
      }
    });

    it("Should throw error when no User status document found", async function () {
      await cancelOooStatus("randomUserId").catch((err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.be.an.instanceOf(NotFound);
        expect(err.message).to.be.equal("No User status document found");
      });
    });

    it("Should throw an error if the status is not OOO", async function () {
      const data = generateStatusDataForCancelOOO(userId, userState.ACTIVE);
      await docRefUser0.set(data);
      await cancelOooStatus(userId).catch((err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err).to.be.an.instanceOf(Forbidden);
        expect(err.message).to.be.equal("The OOO Status cannot be canceled because the current status is ACTIVE.");
      });
    });

    it("should throw an error if unable to fetch task assigned to user.", async function () {
      sinon.stub(tasksModel, "where").throws(new Error("Task not found"));
      await cancelOooStatus(userId).catch((err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.be.equal("Task not found");
      });
    });

    it("Should add future status to the User", async function () {
      const response = await addFutureStatus({ ...userFutureStatusData });
      expect(response.userStatusExists).to.equal(true);
      expect(response.data.futureStatus.state).to.equal("UPCOMING");
    });

    it("should create a user status document when adding future status for a new user", async function () {
      const futureStatusData = {
        ...userFutureStatusData,
        userId: "new-future-status-user",
      };

      const response = await addFutureStatus(futureStatusData);
      const persistedStatus = await getUserStatus("new-future-status-user");

      expect(response.userStatusExists).to.equal(true);
      expect(response.data.userId).to.equal("new-future-status-user");
      expect(response.data.futureStatus.state).to.equal("UPCOMING");
      expect(persistedStatus.userStatusExists).to.equal(true);
      expect(persistedStatus.data.futureStatus.state).to.equal("UPCOMING");
    });
  });
});
