import { expect } from "chai";
import sinon from "sinon";
import { CustomRequest, CustomResponse } from "../../../types/global";
const applicationsController = require("../../../controllers/applications");
const ApplicationModel = require("../../../models/applications");
const logsModel = require("../../../models/logs");
const { API_RESPONSE_MESSAGES, APPLICATION_ERROR_MESSAGES } = require("../../../constants/application");
const { APPLICATION_STATUS } = require("../../../constants/application");

describe("updateApplication", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<CustomResponse> & {
    json: sinon.SinonSpy;
    boom: {
      notFound: sinon.SinonSpy;
      unauthorized: sinon.SinonSpy;
      conflict: sinon.SinonSpy;
      badImplementation: sinon.SinonSpy;
    };
  };
  let jsonSpy: sinon.SinonSpy;
  let boomNotFound: sinon.SinonSpy;
  let boomUnauthorized: sinon.SinonSpy;
  let boomConflict: sinon.SinonSpy;
  let boomBadImplementation: sinon.SinonSpy;
  let updateApplicationStub: sinon.SinonStub;
  let addLogStub: sinon.SinonStub;

  const mockApplicationId = "app-id-123";
  const mockUserId = "user-id-456";
  const mockUsername = "testuser";

  beforeEach(() => {
    jsonSpy = sinon.spy();
    boomNotFound = sinon.spy();
    boomUnauthorized = sinon.spy();
    boomConflict = sinon.spy();
    boomBadImplementation = sinon.spy();

    req = {
      params: { applicationId: mockApplicationId },
      body: { introduction: "Updated introduction text" },
      userData: { id: mockUserId, username: mockUsername },
    };

    res = {
      json: jsonSpy,
      boom: {
        notFound: boomNotFound,
        unauthorized: boomUnauthorized,
        conflict: boomConflict,
        badImplementation: boomBadImplementation,
      },
    };

    updateApplicationStub = sinon.stub(ApplicationModel, "updateApplication");
    addLogStub = sinon.stub(logsModel, "addLog").resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Success cases", () => {
    it("should return 200 and log when update succeeds", async () => {
      updateApplicationStub.resolves({ status: APPLICATION_STATUS.success });

      await applicationsController.updateApplication(req as CustomRequest, res as CustomResponse);

      expect(updateApplicationStub.calledOnce).to.be.true;
      expect(updateApplicationStub.firstCall.args[0]).to.deep.include({ "intro.introduction": "Updated introduction text" });
      expect(updateApplicationStub.firstCall.args[1]).to.equal(mockApplicationId);
      expect(updateApplicationStub.firstCall.args[2]).to.equal(mockUserId);

      expect(addLogStub.calledOnce).to.be.true;
      expect(addLogStub.firstCall.args[1]).to.deep.include({ applicationId: mockApplicationId, userId: mockUserId, username: mockUsername });

      expect(jsonSpy.calledOnce).to.be.true;
      expect(jsonSpy.firstCall.args[0].message).to.equal("Application updated successfully!");
    });

    it("should build payload with professional and intro fields correctly", async () => {
      req.body = {
        professional: { institution: "MIT", skills: "React, Node" },
        whyRds: "one ".repeat(100).trim(),
      };
      updateApplicationStub.resolves({ status: APPLICATION_STATUS.success });

      await applicationsController.updateApplication(req as CustomRequest, res as CustomResponse);

      const payload = updateApplicationStub.firstCall.args[0];
      expect(payload).to.have.property("professional.institution", "MIT");
      expect(payload).to.have.property("professional.skills", "React, Node");
      expect(payload).to.have.property("intro.whyRds");
      expect(jsonSpy.calledOnce).to.be.true;
    });
  });

  describe("Error cases", () => {
    it("should return 404 when application is not found", async () => {
      updateApplicationStub.resolves({ status: APPLICATION_STATUS.notFound });

      await applicationsController.updateApplication(req as CustomRequest, res as CustomResponse);

      expect(boomNotFound.calledOnce).to.be.true;
      expect(boomNotFound.firstCall.args[0]).to.equal("Application not found");
      expect(addLogStub.called).to.be.false;
      expect(jsonSpy.called).to.be.false;
    });

    it("should return 401 when user is not the owner", async () => {
      updateApplicationStub.resolves({ status: APPLICATION_STATUS.unauthorized });

      await applicationsController.updateApplication(req as CustomRequest, res as CustomResponse);

      expect(boomUnauthorized.calledOnce).to.be.true;
      expect(boomUnauthorized.firstCall.args[0]).to.equal("You are not authorized to edit this application");
      expect(addLogStub.called).to.be.false;
      expect(jsonSpy.called).to.be.false;
    });

    it("should return 409 when edit is attempted within 24 hours", async () => {
      updateApplicationStub.resolves({ status: APPLICATION_STATUS.tooSoon });

      await applicationsController.updateApplication(req as CustomRequest, res as CustomResponse);

      expect(boomConflict.calledOnce).to.be.true;
      expect(boomConflict.firstCall.args[0]).to.equal(APPLICATION_ERROR_MESSAGES.EDIT_TOO_SOON);
      expect(addLogStub.called).to.be.false;
      expect(jsonSpy.called).to.be.false;
    });

    it("should return 500 when model returns unexpected status", async () => {
      updateApplicationStub.resolves({ status: "unknown" });

      await applicationsController.updateApplication(req as CustomRequest, res as CustomResponse);

      expect(boomBadImplementation.calledOnce).to.be.true;
      expect(jsonSpy.called).to.be.false;
    });

    it("should return 500 when model throws", async () => {
      updateApplicationStub.rejects(new Error("DB error"));

      await applicationsController.updateApplication(req as CustomRequest, res as CustomResponse);

      expect(boomBadImplementation.calledOnce).to.be.true;
      expect(jsonSpy.called).to.be.false;
    });
  });
});

describe("nudgeApplication", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<CustomResponse> & {
    json: sinon.SinonSpy;
    boom: {
      notFound: sinon.SinonSpy;
      unauthorized: sinon.SinonSpy;
      badRequest: sinon.SinonSpy;
      tooManyRequests: sinon.SinonSpy;
      badImplementation: sinon.SinonSpy;
    };
  };
  let jsonSpy: sinon.SinonSpy;
  let boomNotFound: sinon.SinonSpy;
  let boomUnauthorized: sinon.SinonSpy;
  let boomBadRequest: sinon.SinonSpy;
  let boomTooManyRequests: sinon.SinonSpy;
  let boomBadImplementation: sinon.SinonSpy;
  let nudgeApplicationStub: sinon.SinonStub;

  const mockApplicationId = "test-application-id-123";
  const mockUserId = "test-user-id-456";

  beforeEach(() => {
    jsonSpy = sinon.spy();
    boomNotFound = sinon.spy();
    boomUnauthorized = sinon.spy();
    boomBadRequest = sinon.spy();
    boomTooManyRequests = sinon.spy();
    boomBadImplementation = sinon.spy();

    req = {
      params: {
        applicationId: mockApplicationId,
      },
      userData: {
        id: mockUserId,
        username: "testuser",
      },
    };

    res = {
      json: jsonSpy,
      boom: {
        notFound: boomNotFound,
        unauthorized: boomUnauthorized,
        badRequest: boomBadRequest,
        tooManyRequests: boomTooManyRequests,
        badImplementation: boomBadImplementation,
      },
    };

    nudgeApplicationStub = sinon.stub(ApplicationModel, "nudgeApplication");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Success cases", () => {
    it("should successfully nudge an application when no previous nudge exists", async () => {
      const mockResult = {
        status: "success",
        nudgeCount: 1,
        lastNudgeAt: new Date().toISOString(),
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(nudgeApplicationStub.calledOnce).to.be.true;
      expect(nudgeApplicationStub.firstCall.args[0]).to.deep.equal({
        applicationId: mockApplicationId,
        userId: mockUserId,
      });

      expect(jsonSpy.calledOnce).to.be.true;
      expect(jsonSpy.firstCall.args[0].message).to.equal(API_RESPONSE_MESSAGES.NUDGE_SUCCESS);
      expect(jsonSpy.firstCall.args[0].nudgeCount).to.equal(1);
      expect(jsonSpy.firstCall.args[0].lastNudgeAt).to.be.a("string");
    });

    it("should successfully nudge an application when 24 hours have passed since last nudge", async () => {
      const mockResult = {
        status: "success",
        nudgeCount: 3,
        lastNudgeAt: new Date().toISOString(),
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(nudgeApplicationStub.calledOnce).to.be.true;
      expect(nudgeApplicationStub.firstCall.args[0]).to.deep.equal({
        applicationId: mockApplicationId,
        userId: mockUserId,
      });

      expect(jsonSpy.calledOnce).to.be.true;
      expect(jsonSpy.firstCall.args[0].message).to.equal(API_RESPONSE_MESSAGES.NUDGE_SUCCESS);
      expect(jsonSpy.firstCall.args[0].nudgeCount).to.equal(3);
      expect(jsonSpy.firstCall.args[0].lastNudgeAt).to.be.a("string");
    });

    it("should increment nudgeCount correctly when nudgeCount is undefined", async () => {
      const mockResult = {
        status: "success",
        nudgeCount: 1,
        lastNudgeAt: new Date().toISOString(),
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(jsonSpy.calledOnce).to.be.true;
      expect(jsonSpy.firstCall.args[0].nudgeCount).to.equal(1);
    });
  });

  describe("Error cases", () => {
    it("should return 404 when application is not found", async () => {
      const mockResult = {
        status: "notFound",
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(boomNotFound.calledOnce).to.be.true;
      expect(boomNotFound.firstCall.args[0]).to.equal("Application not found");
      expect(jsonSpy.notCalled).to.be.true;
    });

    it("should return 401 when user is not authorized (not the owner)", async () => {
      const mockResult = {
        status: "unauthorized",
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(boomUnauthorized.calledOnce).to.be.true;
      expect(boomUnauthorized.firstCall.args[0]).to.equal("You are not authorized to nudge this application");
      expect(jsonSpy.notCalled).to.be.true;
    });

    it("should return 429 when trying to nudge within 24 hours", async () => {
      const mockResult = {
        status: "tooSoon",
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(boomTooManyRequests.calledOnce).to.be.true;
      expect(boomTooManyRequests.firstCall.args[0]).to.equal(APPLICATION_ERROR_MESSAGES.NUDGE_TOO_SOON);
      expect(jsonSpy.notCalled).to.be.true;
    });

    it("should return 429 when trying to nudge exactly at 24 hours", async () => {
      const mockResult = {
        status: "tooSoon",
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(boomTooManyRequests.calledOnce).to.be.true;
      expect(boomTooManyRequests.firstCall.args[0]).to.equal(APPLICATION_ERROR_MESSAGES.NUDGE_TOO_SOON);
      expect(jsonSpy.notCalled).to.be.true;
    });

    it("should return 400 when trying to nudge an application that is not in pending status", async () => {
      const mockResult = {
        status: "notPending",
      };

      nudgeApplicationStub.resolves(mockResult);

      await applicationsController.nudgeApplication(req as CustomRequest, res as CustomResponse);

      expect(boomBadRequest.calledOnce).to.be.true;
      expect(boomBadRequest.firstCall.args[0]).to.equal(APPLICATION_ERROR_MESSAGES.NUDGE_ONLY_PENDING_ALLOWED);
      expect(jsonSpy.notCalled).to.be.true;
    });
  });
});

describe("submitApplicationFeedback", () => {
  let req: Partial<CustomRequest>;
  let res: Partial<CustomResponse> & {
    json: sinon.SinonSpy;
    boom: {
      notFound: sinon.SinonSpy;
      badImplementation: sinon.SinonSpy;
    };
  };
  let jsonSpy: sinon.SinonSpy;
  let boomNotFound: sinon.SinonSpy;
  let boomBadImplementation: sinon.SinonSpy;
  let addApplicationFeedbackStub: sinon.SinonStub;

  const mockApplicationId = "test-application-id-123";
  const mockUsername = "superuser";
  const mockFeedback = "Great application!";
  const mockStatus = "accepted";

  beforeEach(() => {
    jsonSpy = sinon.spy();
    boomNotFound = sinon.spy();
    boomBadImplementation = sinon.spy();

    req = {
      params: {
        applicationId: mockApplicationId,
      },
      body: {
        status: mockStatus,
        feedback: mockFeedback,
      },
      userData: {
        id: "superuser-id",
        username: mockUsername,
      },
    };

    res = {
      json: jsonSpy,
      boom: {
        notFound: boomNotFound,
        badImplementation: boomBadImplementation,
      },
    };

    addApplicationFeedbackStub = sinon.stub(ApplicationModel, "addApplicationFeedback");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Success cases", () => {
    it("should successfully submit application feedback", async () => {
      const mockResult = {
        status: "success",
      };

      addApplicationFeedbackStub.resolves(mockResult);

      await applicationsController.submitApplicationFeedback(req as CustomRequest, res as CustomResponse);

      expect(addApplicationFeedbackStub.calledOnce).to.be.true;
      expect(addApplicationFeedbackStub.firstCall.args[0]).to.deep.equal({
        applicationId: mockApplicationId,
        status: mockStatus,
        feedback: mockFeedback,
        reviewerName: mockUsername,
      });

      expect(jsonSpy.calledOnce).to.be.true;
      expect(jsonSpy.firstCall.args[0].message).to.equal(API_RESPONSE_MESSAGES.FEEDBACK_SUBMITTED_SUCCESS);
    });

    it("should successfully submit application feedback without optional feedback text", async () => {
      req.body = {
        status: mockStatus,
      };

      const mockResult = {
        status: "success",
      };

      addApplicationFeedbackStub.resolves(mockResult);

      await applicationsController.submitApplicationFeedback(req as CustomRequest, res as CustomResponse);

      expect(addApplicationFeedbackStub.calledOnce).to.be.true;
      expect(addApplicationFeedbackStub.firstCall.args[0]).to.deep.equal({
        applicationId: mockApplicationId,
        status: mockStatus,
        feedback: undefined,
        reviewerName: mockUsername,
      });

      expect(jsonSpy.calledOnce).to.be.true;
      expect(jsonSpy.firstCall.args[0].message).to.equal(API_RESPONSE_MESSAGES.FEEDBACK_SUBMITTED_SUCCESS);
    });
  });

  describe("Error cases", () => {
    it("should return application not found error", async () => {
      const mockResult = {
        status: "notFound",
      };

      addApplicationFeedbackStub.resolves(mockResult);

      await applicationsController.submitApplicationFeedback(req as CustomRequest, res as CustomResponse);

      expect(boomNotFound.calledOnce).to.be.true;
      expect(boomNotFound.firstCall.args[0]).to.equal("Application not found");
      expect(jsonSpy.notCalled).to.be.true;
    });

    it("should return internal server error when an unexpected error occurs", async () => {
      addApplicationFeedbackStub.rejects(new Error("Database error"));

      await applicationsController.submitApplicationFeedback(req as CustomRequest, res as CustomResponse);

      expect(boomBadImplementation.calledOnce).to.be.true;
      expect(jsonSpy.notCalled).to.be.true;
    });
  });
});
