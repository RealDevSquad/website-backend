import chai from "chai";
import sinon from "sinon";
const Sinon = sinon;
const { expect } = chai;
const applicationValidator = require("../../../middlewares/validators/application");
const applicationsData = require("../../fixtures/applications/applications")();

describe("application validator test", function () {
  describe("validateApplicationData", function () {
    it("should call next function if everything is according to the validator", async function () {
      const rawData = {
        ...applicationsData[6],
        imageUrl: "https://example.com/image.jpg",
      };

      const req = {
        body: rawData,
      };

      const nextSpy = Sinon.spy();
      await applicationValidator.validateApplicationData(req, {}, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should not call the next function if a required field is missed", async function () {
      const rawData = {
        ...applicationsData[6],
        imageUrl: "https://example.com/image.jpg",
      };
      delete rawData.numberOfHours;

      const req = {
        body: rawData,
      };

      const res = {
        boom: {
          badRequest: () => {},
        },
      };

      const nextSpy = Sinon.spy();
      await applicationValidator.validateApplicationData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });

    it("should not call the next function if any of the values which have a wordCount restriction doesn't contain the expected number of words", async function () {
      const rawData = {
        ...applicationsData[6],
        imageUrl: "https://example.com/image.jpg",
        whyRds: "jfaskdfjsd",
      };

      const req = {
        body: rawData,
      };

      const res = {
        boom: {
          badRequest: () => {},
        },
      };

      const nextSpy = Sinon.spy();
      await applicationValidator.validateApplicationData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });

    it("should not call the next function if number of hours is not a number", async function () {
      const rawData = {
        ...applicationsData[6],
        imageUrl: "https://example.com/image.jpg",
        numberOfHours: "10",
      };

      const req = {
        body: rawData,
      };

      const res = {
        boom: {
          badRequest: () => {},
        },
      };

      const nextSpy = Sinon.spy();
      await applicationValidator.validateApplicationData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });
  });

  describe("validateApplicationUpdateData", function () {
    let req: any;
    let res: any;
    let nextSpy: sinon.SinonSpy;

    beforeEach(function () {
      req = {
        body: {},
      };
      res = {
        boom: {
          badRequest: () => {},
        },
      };
      nextSpy = Sinon.spy();
    });

    it("should call next function if only status and feedback is passed, and status has any of the allowed values", async function () {
      req.body = {
        status: "accepted",
        feedback: "some feedback",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should not call next function if any value other than status and feedback is passed", async function () {
      req.body = {
        batman: true,
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });

    it("should not call the next function if any value which is not allowed is sent in status", async function () {
      req.body = {
        status: "something",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });

    it("should call next function when status is accepted with optional feedback", async function () {
      req.body = {
        status: "accepted",
        feedback: "Great work!",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should call next function when status is rejected with optional feedback", async function () {
      req.body = {
        status: "rejected",
        feedback: "Not a good fit",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should call next function when status is changes_requested with feedback", async function () {
      req.body = {
        status: "changes_requested",
        feedback: "Please update your skills section",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should not call next function when status is changes_requested without feedback", async function () {
      req.body = {
        status: "changes_requested",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });

    it("should not call next function when status is changes_requested with empty feedback string", async function () {
      req.body = {
        status: "changes_requested",
        feedback: "",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });

    it("should call next function when status is accepted with empty feedback string", async function () {
      req.body = {
        status: "accepted",
        feedback: "",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should call next function when status is rejected with empty feedback string", async function () {
      req.body = {
        status: "rejected",
        feedback: "",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should not call next function when status is missing", async function () {
      req.body = {
        feedback: "Some feedback",
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });

    it("should not call next function when status is null", async function () {
      req.body = {
        status: null,
      };
      await applicationValidator.validateApplicationFeedbackData(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });
  });

  describe("validateApplicationQueryParam", function () {
    let req: any;
    let res: any;
    let nextSpy: sinon.SinonSpy;

    beforeEach(function () {
      req = {
        query: {},
      };
      res = {
        boom: {
          badRequest: () => {},
        },
      };
      nextSpy = Sinon.spy();
    });

    it("should call the next function if allowed query params are passed", async function () {
      req.query = {
        userId: "kfjadskfj",
        status: "accepted",
        size: "4",
        next: "kfsdfksdfjksd",
        dev: "true",
      };
      await applicationValidator.validateApplicationQueryParam(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(1);
    });

    it("should not call next function if any value that is not allowed is passed in query params", async function () {
      req.query = {
        hello: "true",
      };
      await applicationValidator.validateApplicationQueryParam(req, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
    });
  });
});
