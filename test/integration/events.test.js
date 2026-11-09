const { expect } = require("chai");
const { request } = require("chai-http");

const app = require("../../server");
const authService = require("../../services/authService");
const { EVENT_ROLES } = require("../../constants/events");
const addUser = require("../utils/addUser");
const cleanDb = require("../utils/cleanDb");

const eventData = require("../fixtures/events/events")();
const eventCodeData = require("../fixtures/events/event-codes")();
const eventCodeDataFirst = [...eventCodeData[0].data];
const event1Data = eventData[0];

const userData = require("../fixtures/user/user")();

const eventQuery = require("../../models/events");
const logsModel = require("../../models/logs");

const defaultUser = userData[16];

const config = require("config");
const sinon = require("sinon");

const { EventTokenService, EventAPIService } = require("../../services");
const { eventOnePeerData } = require("../fixtures/events/peers");

const cookieName = config.get("userToken.cookieName");

describe("events", function () {
  let authToken;
  let userId;

  beforeEach(async function () {
    userId = await addUser(defaultUser);
    authToken = authService.generateAuthToken({ userId });
  });

  afterEach(async function () {
    await cleanDb();
  });

  describe("POST events - createEvent", function () {
    let service;

    afterEach(function () {
      service.restore();
    });

    it("returns the created room data when the request is successful", function (done) {
      const eventData = {
        name: "TestingEvent",
        description: "Hello world! How are you",
        region: "in",
        userId,
      };

      service = sinon.stub(EventAPIService.prototype, "post").returns(event1Data);

      request
        .execute(app)
        .post("/events")
        .set("cookie", `${cookieName}=${authToken}`)
        .send(eventData)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(201);
          expect(response.body.name).to.equal(event1Data.name);
          expect(response.body.description).to.equal(event1Data.description);
          expect(response.body.region).to.equal(event1Data.region);
          expect(response.body.enabled).to.be.equal(true);

          return done();
        });
    });

    it("returns an error when the request to the API service fails", function (done) {
      service = sinon.stub(EventAPIService.prototype, "post").rejects({ code: "ERR_BAD_REQUEST" });

      request
        .execute(app)
        .post("/events")
        .set("cookie", `${cookieName}=${authToken}`)
        .send({
          name: "Test Event",
          description: "This is a test event",
          region: "in",
          userId,
        })
        .end((error, response) => {
          if (error) {
            return done(error);
          }
          expect(response).to.have.status(500);
          expect(response.body.error).to.equal("ERR_BAD_REQUEST");
          expect(response.body.message).to.equal("Couldn't create event. Please try again later");

          return done();
        });
    });

    it("should return unauthorized error if user is not authenticated", function (done) {
      const eventData = {
        id: "test-room-id",
        name: "Test Room",
        description: "This is a test room",
        region: "in",
        userId,
      };
      request
        .execute(app)
        .post(`/events`)
        .send(eventData)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal("Unauthorized");
          expect(response.body.message).to.be.equal("Unauthenticated User");

          return done();
        });
    });
  });

  describe("GET /events - getAllEvents", function () {
    let service;

    afterEach(function () {
      service.restore();
    });

    it("should return all events information based on query parameters and enabled as false", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ limit: 10, last: "id", data: eventData });

      request
        .execute(app)
        .get("/events?limit=10&enabled=false")
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body).to.be.a("object");
          expect(response.body).to.have.all.keys("limit", "data", "last");
          if (response.body.data === null) {
            expect(response.body.data).to.be.a("null");
          } else {
            expect(response.body.data).to.be.an("array");
          }

          return done();
        });
    });

    it("should return all events information based on query parameters and enabled as true", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ limit: 10, last: "id", data: eventData });

      request
        .execute(app)
        .get("/events?limit=10&enabled=true")
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body).to.be.a("object");
          expect(response.body).to.have.all.keys("limit", "data", "last");
          expect(response.body.data).to.be.an("array");
          expect(response.body.data.length).to.be.at.most(10);

          return done();
        });
    });

    it("returns an error if there is a problem retrieving events", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").rejects({ code: "ERR_BAD_REQUEST" });

      request
        .execute(app)
        .get("/events?limit=10&enabled=true")
        .end((error, response) => {
          if (error) {
            return done(error);
          }
          expect(response).to.have.status(500);
          expect(response.body.error).to.equal("ERR_BAD_REQUEST");
          expect(response.body.message).to.equal("Couldn't get events. Please try again later");

          return done();
        });
    });
  });

  describe("POST /events/join - joinEvent", function () {
    let tokenService;
    let service;

    afterEach(function () {
      tokenService.restore();
      service.restore();
    });

    it("should return a token when the request is successful", function (done) {
      const eventsData = {
        data: [event1Data],
      };
      service = sinon.stub(EventAPIService.prototype, "get").returns(eventsData);
      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "guest",
      };
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      request
        .execute(app)
        .post("/events/join")
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }
          expect(response).to.have.status(201);
          expect(response.body.token).to.be.a("string");
          expect(response.body.message).to.be.a("string");
          expect(
            tokenService.calledOnceWithExactly({ userId: payload.userId, role: payload.role, roomId: payload.roomId }),
          ).to.be.equal(true);

          return done();
        });
    });

    it("should return a token when a maven joins with a valid event code", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ data: [event1Data] });
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");
      const getEventCodesStub = sinon.stub(eventQuery, "getEventCodes").resolves([{ code: "maven123" }]);

      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "maven",
        eventCode: "maven123",
      };

      request
        .execute(app)
        .post("/events/join")
        .send(payload)
        .end((error, response) => {
          getEventCodesStub.restore();
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(201);
          expect(response.body.token).to.be.equal("test-token");
          expect(response.body.message).to.be.equal("Token generated successfully!");
          expect(
            tokenService.calledOnceWithExactly({ userId: payload.userId, role: payload.role, roomId: payload.roomId }),
          ).to.be.equal(true);

          return done();
        });
    });

    it("should return 400 and no token when a maven joins with an invalid event code", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ data: [event1Data] });
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");
      const getEventCodesStub = sinon.stub(eventQuery, "getEventCodes").resolves([{ code: "maven123" }]);

      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "maven",
        eventCode: "wrong-code",
      };

      request
        .execute(app)
        .post("/events/join")
        .send(payload)
        .end((error, response) => {
          getEventCodesStub.restore();
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(400);
          expect(response.body).to.not.have.property("token");
          expect(response.body.message).to.be.equal("Provided event code is invalid for the role!");
          expect(tokenService.called).to.be.equal(false);

          return done();
        });
    });

    it("should return 401 and no token when a user who is not logged in requests the host role", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ data: [event1Data] });
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "host",
      };

      request
        .execute(app)
        .post("/events/join")
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body).to.not.have.property("token");
          expect(response.body.message).to.be.equal("Unauthorized, please login to perform this action!");
          expect(tokenService.called).to.be.equal(false);

          return done();
        });
    });

    it("should return 401 and no token when a user who is not logged in requests the moderator role", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ data: [event1Data] });
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "moderator",
      };

      request
        .execute(app)
        .post("/events/join")
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body).to.not.have.property("token");
          expect(response.body.message).to.be.equal("Unauthorized, please login to perform this action!");
          expect(tokenService.called).to.be.equal(false);

          return done();
        });
    });
  });

  describe("POST /events/join-admin - joinEvent", function () {
    let tokenService;
    let service;
    let superUserAuthToken;
    let memberAuthToken;

    beforeEach(async function () {
      const superUser = userData[4];
      const member = userData[6];
      const memberUserId = await addUser(member);
      const superUserId = await addUser(superUser);
      superUserAuthToken = authService.generateAuthToken({ userId: superUserId });
      memberAuthToken = authService.generateAuthToken({ userId: memberUserId });
    });

    afterEach(function () {
      service.restore();
      tokenService.restore();
    });

    it("should return a token when the request is successful for host", function (done) {
      const eventsData = {
        data: [event1Data],
      };
      service = sinon.stub(EventAPIService.prototype, "get").returns(eventsData);

      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "host",
      };
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      request
        .execute(app)
        .post("/events/join-admin")
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(201);
          expect(response.body.token).to.be.a("string");
          expect(response.body.message).to.be.a("string");
          expect(
            tokenService.calledOnceWithExactly({ userId: payload.userId, role: payload.role, roomId: payload.roomId }),
          ).to.be.equal(true);

          return done();
        });
    });

    it("should return a token when the request is successful for moderator", function (done) {
      const eventsData = {
        data: [event1Data],
      };
      service = sinon.stub(EventAPIService.prototype, "get").returns(eventsData);
      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "moderator",
      };
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      request
        .execute(app)
        .post("/events/join-admin")
        .set("cookie", `${cookieName}=${memberAuthToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(201);
          expect(response.body.token).to.be.a("string");
          expect(response.body.message).to.be.a("string");
          expect(
            tokenService.calledOnceWithExactly({ userId: payload.userId, role: payload.role, roomId: payload.roomId }),
          ).to.be.equal(true);

          return done();
        });
    });

    it("should return a bad request for the user if they're normal user", function (done) {
      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "host",
      };

      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      request
        .execute(app)
        .post("/events/join-admin")
        .set("cookie", `${cookieName}=${authToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }
          expect(response).to.have.status(401);
          expect(response.body.message).to.be.a("string");
          expect(response.body.error).to.be.equal("Unauthorized");
          expect(response.body.message).to.be.equal("You are not authorized for this action.");

          return done();
        });
    });

    it("should return 403 and no token when a member requests the host role", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ data: [event1Data] });
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      const payload = {
        roomId: event1Data.id,
        userId: "5678",
        role: "host",
      };

      request
        .execute(app)
        .post("/events/join-admin")
        .set("cookie", `${cookieName}=${memberAuthToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(403);
          expect(response.body).to.not.have.property("token");
          expect(response.body.message).to.be.equal("Unauthorized, you don't have permission to join as host!");
          expect(tokenService.called).to.be.equal(false);

          return done();
        });
    });

    it("should return a token when a super user requests the moderator role", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ data: [event1Data] });
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      const payload = { roomId: event1Data.id, userId: "5678", role: "moderator" };

      request
        .execute(app)
        .post("/events/join-admin")
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(201);
          expect(response.body.token).to.be.equal("test-token");
          expect(response.body.message).to.be.equal("Token generated successfully!");
          expect(
            tokenService.calledOnceWithExactly({ userId: payload.userId, role: payload.role, roomId: payload.roomId }),
          ).to.be.equal(true);

          return done();
        });
    });

    it("should return 401 and no token when a user with neither member nor super user role requests the moderator role", function (done) {
      service = sinon.stub(EventAPIService.prototype, "get").returns({ data: [event1Data] });
      tokenService = sinon.stub(EventTokenService.prototype, "getAuthToken").returns("test-token");

      const payload = { roomId: event1Data.id, userId: "5678", role: "moderator" };

      request
        .execute(app)
        .post("/events/join-admin")
        .set("cookie", `${cookieName}=${authToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body).to.not.have.property("token");
          expect(response.body.message).to.be.equal("You are not authorized for this action.");
          expect(tokenService.called).to.be.equal(false);

          return done();
        });
    });
  });

  describe("GET /events/:id - getEventById", function () {
    let service;

    afterEach(function () {
      service.restore();
    });

    it("Should return event information if the event exists", function (done) {
      const roomId = event1Data.room_id;
      service = sinon.stub(EventAPIService.prototype, "get").returns(event1Data);
      request
        .execute(app)
        .get(`/events/${roomId}`)
        .send({ isActiveRoom: false })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body).to.be.an("object");
          expect(response.body.id).to.equal(roomId);
          expect(response.body.name).to.be.a("string");

          return done();
        });
    });

    it("Should return 500 if an error occurs while retrieving the room information", function (done) {
      const roomId = "invalid-room-id";
      const mockError = { code: "ERR_BAD_REQUEST", message: "Unable to retrieve event details" };

      service = sinon.stub(EventAPIService.prototype, "get").rejects(mockError);

      request
        .execute(app)
        .get(`/events/${roomId}`)
        .send({ enabled: true })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(500);
          expect(response.body).to.be.an("object");
          expect(response.body.error).to.equal(mockError.code);
          expect(response.body.message).to.equal(mockError.message);

          return done();
        });
    });
  });

  describe("GET /events/:id/participants - getParticipantsCount", function () {
    // The participants count cache lives in memory for the whole test run,
    // so every test uses its own room id to avoid reading another test's cache.
    let roomCounter = 0;
    const newRoomId = () => {
      roomCounter += 1;
      return roomCounter.toString(16).padStart(24, "b");
    };

    const addEvent = (roomId, fields = {}) =>
      eventQuery.createEvent({ ...event1Data, room_id: roomId, id: roomId, enabled: true, ...fields });

    const peersResponse = (roles) => ({
      peers: Object.fromEntries(roles.map((role, index) => [`peer-${index}`, { id: `peer-${index}`, role }])),
    });

    const getCount = (roomId) => request.execute(app).get(`/events/${roomId}/participants`);

    let clock;

    beforeEach(function () {
      // Freeze Date only, so cache times are exact and Firestore keeps working
      clock = sinon.useFakeTimers({ now: Date.now(), toFake: ["Date"] });
    });

    afterEach(function () {
      sinon.restore();
    });

    it("returns status live with the total and the count for each role", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      const stub = sinon
        .stub(EventAPIService.prototype, "get")
        .resolves(peersResponse([EVENT_ROLES.HOST, EVENT_ROLES.MODERATOR, EVENT_ROLES.GUEST, EVENT_ROLES.GUEST]));

      const res = await getCount(roomId);

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal("Participants count fetched successfully");
      expect(res.body.data).to.deep.equal({
        status: "live",
        total: 4,
        byRole: { host: 1, moderator: 1, maven: 0, guest: 2 },
        refreshAfterMs: 5000,
      });
      expect(stub.calledOnce).to.equal(true);
      expect(stub.firstCall.args[0]).to.equal(`/active-rooms/${roomId}/peers`);
    });

    it("returns 0 for total and every role when nobody is connected", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      const stub = sinon.stub(EventAPIService.prototype, "get").resolves({ peers: {} });

      const res = await getCount(roomId);

      expect(res).to.have.status(200);
      expect(res.body.data.status).to.equal("live");
      expect(res.body.data.total).to.equal(0);
      expect(res.body.data.byRole).to.deep.equal({ host: 0, moderator: 0, maven: 0, guest: 0 });
      expect(stub.calledOnce).to.equal(true);
    });

    it("returns 0 for a role with no participants", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      sinon
        .stub(EventAPIService.prototype, "get")
        .resolves(peersResponse([EVENT_ROLES.HOST, EVENT_ROLES.GUEST, EVENT_ROLES.GUEST]));

      const res = await getCount(roomId);

      expect(res).to.have.status(200);
      expect(res.body.data.byRole.maven).to.equal(0);
      expect(res.body.data.byRole.moderator).to.equal(0);
    });

    it("returns 502 when the 100ms request fails", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      sinon.stub(EventAPIService.prototype, "get").rejects({ code: "ERR_BAD_REQUEST" });

      const res = await getCount(roomId);

      expect(res).to.have.status(502);
      expect(res.body).to.deep.equal({ error: "ERR_BAD_REQUEST", message: "Unable to fetch participants count" });
    });

    it("serves a repeated request within the cache time from the cache", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      const stub = sinon.stub(EventAPIService.prototype, "get").resolves(peersResponse([EVENT_ROLES.GUEST]));

      const first = await getCount(roomId);
      clock.tick(2000);
      const second = await getCount(roomId);

      expect(first.body.data.refreshAfterMs).to.equal(5000);
      expect(second).to.have.status(200);
      expect(second.body.data.total).to.equal(1);
      expect(second.body.data.refreshAfterMs).to.equal(3000);
      expect(stub.calledOnce).to.equal(true);
    });

    it("returns 400 for an invalid event id without calling 100ms", async function () {
      const stub = sinon.stub(EventAPIService.prototype, "get");

      const res = await getCount("invalid-id");

      expect(res).to.have.status(400);
      expect(res.body.message).to.be.a("string");
      expect(stub.called).to.equal(false);
    });

    it("returns 404 for an event id that does not exist without calling 100ms", async function () {
      const stub = sinon.stub(EventAPIService.prototype, "get");

      const res = await getCount(newRoomId());

      expect(res).to.have.status(404);
      expect(res.body.message).to.equal("Event not found");
      expect(stub.called).to.equal(false);
    });

    it("returns the counts without logging in", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      sinon.stub(EventAPIService.prototype, "get").resolves(peersResponse([EVENT_ROLES.GUEST]));

      const res = await request.execute(app).get(`/events/${roomId}/participants`);

      expect(res).to.have.status(200);
      expect(res.body.data.total).to.equal(1);
    });

    it("returns only counts, without names, peer ids or other personal details", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      sinon.stub(EventAPIService.prototype, "get").resolves({
        peers: {
          "peer-1": { id: "peer-1", name: "Some User", user_id: "user-1", role: EVENT_ROLES.HOST },
        },
      });

      const res = await getCount(roomId);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys("message", "data");
      expect(res.body.data).to.have.all.keys("status", "total", "byRole", "refreshAfterMs");
      expect(res.body.data.byRole).to.have.all.keys(...Object.values(EVENT_ROLES));
      expect(JSON.stringify(res.body)).to.not.include("Some User");
      expect(JSON.stringify(res.body)).to.not.include("peer-1");
      expect(JSON.stringify(res.body)).to.not.include("user-1");
    });

    it("calls 100ms again after the cache expires", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      const stub = sinon.stub(EventAPIService.prototype, "get");
      stub.onFirstCall().resolves(peersResponse([EVENT_ROLES.GUEST]));
      stub.onSecondCall().resolves(peersResponse([EVENT_ROLES.GUEST, EVENT_ROLES.GUEST]));

      await getCount(roomId);
      clock.tick(5001);
      const res = await getCount(roomId);

      expect(stub.calledTwice).to.equal(true);
      expect(res.body.data.total).to.equal(2);
      expect(res.body.data.refreshAfterMs).to.equal(5000);
    });

    it("calls 100ms again after a failed call, because failures are not cached", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      const stub = sinon.stub(EventAPIService.prototype, "get");
      stub.onFirstCall().rejects({ code: "ERR_BAD_REQUEST" });
      stub.onSecondCall().resolves(peersResponse([EVENT_ROLES.HOST]));

      const first = await getCount(roomId);
      const second = await getCount(roomId);

      expect(first).to.have.status(502);
      expect(second).to.have.status(200);
      expect(second.body.data.total).to.equal(1);
      expect(stub.calledTwice).to.equal(true);
    });

    it("makes one 100ms call for two requests for the same event at the same time", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      // Delay the 100ms response so both requests arrive while the call is in progress
      const stub = sinon
        .stub(EventAPIService.prototype, "get")
        .callsFake(() => new Promise((resolve) => setTimeout(() => resolve(peersResponse([EVENT_ROLES.GUEST])), 50)));

      const [first, second] = await Promise.all([getCount(roomId), getCount(roomId)]);

      expect(first).to.have.status(200);
      expect(second).to.have.status(200);
      expect(first.body.data).to.deep.equal(second.body.data);
      expect(stub.calledOnce).to.equal(true);
    });

    it("makes one 100ms call per event for requests for two events at the same time", async function () {
      const roomA = newRoomId();
      const roomB = newRoomId();
      await addEvent(roomA);
      await addEvent(roomB);
      const responses = new Map([
        [`/active-rooms/${roomA}/peers`, peersResponse([EVENT_ROLES.HOST])],
        [`/active-rooms/${roomB}/peers`, peersResponse([EVENT_ROLES.GUEST, EVENT_ROLES.GUEST, EVENT_ROLES.GUEST])],
      ]);
      const stub = sinon
        .stub(EventAPIService.prototype, "get")
        .callsFake((path) => new Promise((resolve) => setTimeout(() => resolve(responses.get(path)), 50)));

      const [resA, resB] = await Promise.all([getCount(roomA), getCount(roomB)]);

      expect(stub.calledTwice).to.equal(true);
      expect(resA.body.data.total).to.equal(1);
      expect(resA.body.data.byRole.host).to.equal(1);
      expect(resB.body.data.total).to.equal(3);
      expect(resB.body.data.byRole.guest).to.equal(3);
    });

    it("returns 502 when the 100ms request times out", async function () {
      const roomId = newRoomId();
      await addEvent(roomId);
      const stub = sinon
        .stub(EventAPIService.prototype, "get")
        .rejects({ code: "ECONNABORTED", message: "timeout of 5000ms exceeded" });

      const res = await getCount(roomId);

      expect(stub.firstCall.args[2]).to.deep.equal({ timeout: 5000 });
      expect(res).to.have.status(502);
      expect(res.body).to.deep.equal({ error: "ECONNABORTED", message: "Unable to fetch participants count" });
      expect(res.body).to.not.have.property("data");
    });

    it("returns status not_live with null counts for a disabled event without calling 100ms", async function () {
      const roomId = newRoomId();
      await addEvent(roomId, { enabled: false });
      const stub = sinon.stub(EventAPIService.prototype, "get");

      const res = await getCount(roomId);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({
        message: "Event is not live",
        data: { status: "not_live", total: null, byRole: null },
      });
      expect(stub.called).to.equal(false);
    });

    it("returns status inactive with null counts for an ended event without calling 100ms", async function () {
      const roomId = newRoomId();
      await addEvent(roomId, { enabled: false, status: "inactive" });
      const stub = sinon.stub(EventAPIService.prototype, "get");

      const res = await getCount(roomId);

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({
        message: "Event has ended",
        data: { status: "inactive", total: null, byRole: null },
      });
      expect(stub.called).to.equal(false);
    });

    it("returns 0 counts for an empty live event and null counts for an empty ended event", async function () {
      const liveRoomId = newRoomId();
      const endedRoomId = newRoomId();
      await addEvent(liveRoomId);
      await addEvent(endedRoomId, { enabled: false, status: "inactive" });
      sinon.stub(EventAPIService.prototype, "get").resolves({ peers: {} });

      const live = await getCount(liveRoomId);
      const ended = await getCount(endedRoomId);

      expect(live.body.data.status).to.equal("live");
      expect(live.body.data.total).to.equal(0);
      expect(live.body.data.byRole).to.deep.equal({ host: 0, moderator: 0, maven: 0, guest: 0 });
      expect(ended.body.data.status).to.equal("inactive");
      expect(ended.body.data.total).to.equal(null);
      expect(ended.body.data.byRole).to.equal(null);
    });
  });

  describe("PATCH /events - updateEvent", function () {
    let service;

    afterEach(function () {
      service.restore();
      sinon.restore();
    });

    it("returns the enabled event data when the request is successful", function (done) {
      const payload = {
        enabled: true,
      };
      service = sinon.stub(EventAPIService.prototype, "post").returns(payload);
      sinon.stub(eventQuery, "updateEvent").resolves({ ...event1Data, enabled: true });

      request
        .execute(app)
        .patch("/events")
        .set("cookie", `${cookieName}=${authToken}`)
        .send({ ...payload, id: event1Data.room_id })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a("string");
          expect(response.body.data.enabled).to.equal(true);

          return done();
        });
    });

    it("returns the disabled room data when the request is successful", function (done) {
      const payload = {
        enabled: false,
      };

      service = sinon.stub(EventAPIService.prototype, "post").returns(payload);

      sinon.stub(eventQuery, "updateEvent").resolves({ ...event1Data, enabled: false });

      request
        .execute(app)
        .patch("/events")
        .set("cookie", `${cookieName}=${authToken}`)
        .send({ ...payload, id: event1Data.room_id })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a("string");
          expect(response.body.data.enabled).to.equal(false);

          return done();
        });
    });

    it("should return unauthorized error if user is not authenticated", function (done) {
      request
        .execute(app)
        .patch(`/events`)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal("Unauthorized");
          expect(response.body.message).to.be.equal("Unauthenticated User");

          return done();
        });
    });
  });

  describe("PATCH /events/end - endActiveEvent", function () {
    let service;
    let superUserAuthToken;
    let memberAuthToken;

    beforeEach(async function () {
      const superUser = userData[4];
      const member = userData[6];
      const memberUserId = await addUser(member);
      const superUserId = await addUser(superUser);
      superUserAuthToken = authService.generateAuthToken({ userId: superUserId });
      memberAuthToken = authService.generateAuthToken({ userId: memberUserId });
    });

    afterEach(function () {
      service.restore();
      sinon.restore();
    });

    it("returns a success message when the request is successful", function (done) {
      const payload = {
        reason: "Event ended by user",
        lock: true,
      };
      service = sinon.stub(EventAPIService.prototype, "post").returns({ message: "session is ending" });

      sinon.stub(eventQuery, "endActiveEvent").returns({ message: "Event ended successfully." });

      request
        .execute(app)
        .patch("/events/end")
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .set("cookie", `${cookieName}=${memberAuthToken}`)
        .send({ ...payload, id: event1Data.room_id })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a("string");
          expect(response.body.message).to.equal("Event ended successfully.");

          return done();
        });
    });

    it("should return unauthorized error if user is not authenticated", function (done) {
      const id = event1Data.id;
      const payload = {
        eventCode: "test-code",
        role: "moderator",
      };
      request
        .execute(app)
        .post(`/events/${id}/codes`)
        .send({ ...payload })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal("Unauthorized");
          expect(response.body.message).to.be.equal("Unauthenticated User");

          return done();
        });
    });
  });

  describe("POST /events/:id/codes", function () {
    let service;
    let superUserAuthToken;

    beforeEach(async function () {
      const superUser = userData[4];
      const superUserId = await addUser(superUser);
      superUserAuthToken = authService.generateAuthToken({ userId: superUserId });
    });

    afterEach(function () {
      service.restore();
      sinon.restore();
    });

    it("creates an event code when the request is successful", function (done) {
      const payload = {
        eventCode: "test-code",
        role: EVENT_ROLES.MAVEN,
      };

      service = sinon
        .stub(eventQuery, "createEventCode")
        .returns([
          ...eventCodeDataFirst,
          { code: "test-code", role: "maven", id: "test-id", event_id: event1Data.room_id },
        ]);

      request
        .execute(app)
        .post(`/events/${event1Data.room_id}/codes`)
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .send({ ...payload })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(201);
          expect(response.body.message).to.equal("Event code created succesfully!");
          expect(response.body.data[3].code).to.equal(payload.eventCode);
          expect(response.body.data[3].role).to.equal(payload.role);

          return done();
        });
    });

    it("should return bad request if the role is not maven", function (done) {
      const id = event1Data.id;
      const payload = {
        eventCode: "test-code",
        role: "moderator",
      };
      request
        .execute(app)
        .post(`/events/${id}/codes`)
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .send({ ...payload })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(400);
          expect(response.body).to.be.an("object");
          expect(response.body.message).to.equal("Currently the room codes feature is only for mavens!");
          expect(response.body.message).to.be.a("string");

          return done();
        });
    });

    it("returns an error message when code creation fails", function (done) {
      const payload = {
        eventCode: "test-code",
        role: EVENT_ROLES.MAVEN,
      };

      const errorMessage = "Error creating event code.";

      service = sinon.stub(eventQuery, "createEventCode").throws(new Error(errorMessage));

      request
        .execute(app)
        .post(`/events/${event1Data.room_id}/codes`)
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .send({ ...payload })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(500);
          expect(response.body.message).to.equal("Couldn't create event code. Please try again later");

          return done();
        });
    });

    it("should return unauthorized error if user is not authenticated", function (done) {
      const id = event1Data.id;
      const payload = {
        eventCode: "test-code",
        role: "moderator",
      };
      request
        .execute(app)
        .post(`/events/${id}/codes`)
        .send({ ...payload })
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal("Unauthorized");
          expect(response.body.message).to.be.equal("Unauthenticated User");

          return done();
        });
    });
  });

  describe("GET /events/:id/codes - getEventCodes", function () {
    let service;
    let superUserAuthToken;

    beforeEach(async function () {
      const superUser = userData[4];
      const superUserId = await addUser(superUser);
      superUserAuthToken = authService.generateAuthToken({ userId: superUserId });
    });

    afterEach(function () {
      service.restore();
      sinon.restore();
    });

    it("should return all event codes based on event id", function (done) {
      service = sinon.stub(eventQuery, "getEventCodes").returns([...eventCodeData[1].data]);

      request
        .execute(app)
        .get(`/events/${eventData[1].id}/codes`)
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body).to.be.a("object");
          expect(response.body).to.have.all.keys("message", "data");
          return done();
        });
    });

    it("should return something went wrong while getting the event codes!", function (done) {
      service = sinon.stub(eventQuery, "getEventCodes").throws(new Error());

      request
        .execute(app)
        .get(`/events/${eventData[1].id}/codes`)
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(500);
          expect(response.body).to.be.a("object");
          expect(response.body).to.have.all.keys("message");
          return done();
        });
    });
  });

  describe("PATCH /events/:id/peers/kickout", function () {
    let service;
    let superUserAuthToken;
    let memberAuthToken;

    beforeEach(async function () {
      const superUser = userData[4];
      const member = userData[6];
      const superUserId = await addUser(superUser);
      const memberUserId = await addUser(member);
      superUserAuthToken = authService.generateAuthToken({ userId: superUserId });
      memberAuthToken = authService.generateAuthToken({ userId: memberUserId });
    });

    afterEach(function () {
      service.restore();
      sinon.restore();
    });

    it("returns a success message when the request is successful for super user", function (done) {
      const payload = {
        peerId: "peer123",
        reason: "Kicked out for a reason",
      };

      service = sinon.stub(EventAPIService.prototype, "post").returns({ message: "peer remove request submitted" });

      sinon.stub(eventQuery, "kickoutPeer").returns({ message: "Selected Participant is removed from event." });
      sinon.stub(logsModel, "addLog");
      sinon.stub(eventQuery, "getPeerById").returns(eventOnePeerData);

      request
        .execute(app)
        .patch(`/events/${event1Data.room_id}/peers/kickout`)
        .set("cookie", `${cookieName}=${superUserAuthToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a("string");
          expect(response.body.message).to.equal("Selected Participant is removed from event.");

          return done();
        });
    });

    it("returns a success message when the request is successful for member user", function (done) {
      const payload = {
        peerId: "peer123",
        reason: "Kicked out for a reason",
      };

      service = sinon.stub(EventAPIService.prototype, "post").returns({ message: "peer remove request submitted" });

      sinon.stub(eventQuery, "kickoutPeer").returns({ message: "Selected Participant is removed from event." });
      sinon.stub(logsModel, "addLog");
      sinon.stub(eventQuery, "getPeerById").returns(eventOnePeerData);

      request
        .execute(app)
        .patch(`/events/${event1Data.room_id}/peers/kickout`)
        .set("cookie", `${cookieName}=${memberAuthToken}`)
        .send(payload)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(200);
          expect(response.body.message).to.be.a("string");
          expect(response.body.message).to.equal("Selected Participant is removed from event.");

          return done();
        });
    });

    it("should return unauthorized error if user is not authenticated", function (done) {
      request
        .execute(app)
        .patch(`/events/${event1Data.room_id}/peers/kickout`)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          expect(response).to.have.status(401);
          expect(response.body.error).to.be.equal("Unauthorized");
          expect(response.body.message).to.be.equal("Unauthenticated User");

          return done();
        });
    });
  });
});
