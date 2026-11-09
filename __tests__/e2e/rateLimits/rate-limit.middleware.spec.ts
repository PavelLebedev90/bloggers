import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { rateLimitsCollection } from "../../../src/db/collections";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { login } from "../../utils/auth/crud-auth-test.util";

describe("Rate limit middleware", () => {
  setupDbLifecycle();

  const invalidLogin = () => login({ loginOrEmail: "unknown", password: "password" });

  it("should allow five requests and return 429 for the sixth request with the same IP, method, and URL", async () => {
    const responses = [];
    for (let attempt = 0; attempt < 5; attempt += 1) {
      responses.push(await invalidLogin());
    }

    expect(responses.map((response) => response.status)).toEqual(
      Array(5).fill(HttpStatus.Unauthorized),
    );

    const sixthResponse = await invalidLogin();

    expect(sixthResponse.status).toBe(HttpStatus.TooManyRequests);
    expect(await rateLimitsCollection.countDocuments({})).toBe(5);
  });

  it("should persist the request metadata and validated payload for allowed attempts", async () => {
    await invalidLogin();

    const [record] = await rateLimitsCollection.find({}).toArray();

    expect(record).toEqual(
      expect.objectContaining({
        ip: expect.any(String),
        method: "POST",
        url: expect.stringContaining("/auth/login"),
        payload: { loginOrEmail: "unknown", password: "password" },
        expiresAt: expect.any(Date),
      }),
    );
    expect(record!.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("should ignore expired request records", async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await invalidLogin();
    }
    await rateLimitsCollection.updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });

    const response = await invalidLogin();

    expect(response.status).toBe(HttpStatus.Unauthorized);
  });
});
