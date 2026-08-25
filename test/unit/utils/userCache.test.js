const { expect } = require("chai");
const sinon = require("sinon");
const { userCacheStore } = require("../../../utils/userCache");

describe("userCacheStore", function () {
  let cache;
  const userId = "user123";
  const user = {
    id: userId,
    username: "ankur",
    github_id: "ankur-gh",
    discordId: "12345",
    email: "abc@gmail.com",
    roles: { member: true },
  };

  beforeEach(function () {
    cache = userCacheStore();
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("get / set", function () {
    it("should return null on a cache miss", function () {
      expect(cache.get("user:userId:nonexistent")).to.equal(null);
    });

    it("should return a deep copy of the cached user", function () {
      cache.set([`user:userId:${userId}`], user, userId);
      const result = cache.get(`user:userId:${userId}`);
      expect(result).to.deep.equal(user);
      expect(result).to.not.equal(user);
    });

    it("should allow multiple alias keys to resolve to the same user", function () {
      cache.set([`user:userId:${userId}`, "user:username:ankur"], user, userId);
      expect(cache.get(`user:userId:${userId}`)).to.deep.equal(user);
      expect(cache.get("user:username:ankur")).to.deep.equal(user);
    });

    it("should not cache when no keys or user are provided", function () {
      cache.set([], user, userId);
      cache.set([`user:userId:${userId}`], null, userId);
      expect(cache.get(`user:userId:${userId}`)).to.equal(null);
    });

    it("should not let caller mutations corrupt the cached entry", function () {
      cache.set([`user:userId:${userId}`], user, userId);
      const first = cache.get(`user:userId:${userId}`);
      first.username = "mutated";
      const second = cache.get(`user:userId:${userId}`);
      expect(second.username).to.equal("ankur");
    });
  });

  describe("invalidateUser", function () {
    it("should evict every alias key for a userId", function () {
      cache.set([`user:userId:${userId}`, "user:username:ankur", "user:github:ankur-gh"], user, userId);
      cache.invalidateUser(userId);
      expect(cache.get(`user:userId:${userId}`)).to.equal(null);
      expect(cache.get("user:username:ankur")).to.equal(null);
      expect(cache.get("user:github:ankur-gh")).to.equal(null);
    });

    it("should not evict other users", function () {
      const otherUser = { id: "other", username: "other" };
      cache.set([`user:userId:${userId}`], user, userId);
      cache.set(["user:userId:other"], otherUser, "other");
      cache.invalidateUser(userId);
      expect(cache.get("user:userId:other")).to.deep.equal(otherUser);
    });

    it("should be a no-op for an unknown userId", function () {
      cache.set([`user:userId:${userId}`], user, userId);
      cache.invalidateUser("unknown");
      expect(cache.get(`user:userId:${userId}`)).to.deep.equal(user);
    });
  });

  describe("expiry", function () {
    const expiryTimeMs = 24 * 60 * 60 * 1000;

    it("should evict an expired alias without evicting a refreshed alias", function () {
      const clock = sinon.useFakeTimers();
      cache.set([`user:userId:${userId}`, "user:username:ankur"], user, userId);

      clock.tick(expiryTimeMs / 2);
      cache.set(["user:username:ankur"], user, userId);

      clock.tick(expiryTimeMs / 2 + 1);
      expect(cache.get(`user:userId:${userId}`)).to.equal(null);
      expect(cache.get("user:username:ankur")).to.deep.equal(user);
    });

    it("should clean untouched expired entries during later cache operations", function () {
      const clock = sinon.useFakeTimers();
      cache.set([`user:userId:${userId}`, "user:username:ankur"], user, userId);

      clock.tick(expiryTimeMs + 1);
      cache.set(["user:userId:active"], { id: "active" }, "active");

      clock.setSystemTime(0);
      expect(cache.get("user:username:ankur")).to.equal(null);
      expect(cache.get("user:userId:active")).to.deep.equal({ id: "active" });
    });
  });

  describe("clear", function () {
    it("should empty the store", function () {
      cache.set([`user:userId:${userId}`], user, userId);
      cache.clear();
      expect(cache.get(`user:userId:${userId}`)).to.equal(null);
    });
  });
});
