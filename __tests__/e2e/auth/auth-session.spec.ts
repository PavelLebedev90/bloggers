import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import {
  extractRefreshCookie,
  login,
  logout,
  refreshToken,
} from "../../utils/auth/crud-auth-test.util";
import { createUser } from "../../utils/users/crud-user-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { securityDevicesCollection } from "../../../src/db/collections";

describe("POST /auth/refresh-token", () => {
  setupDbLifecycle();

  it("should return 200, a new access token and a new refresh cookie for a valid refresh token", async () => {
    const user = collectUserToCreate();
    const createdUser = await createUser(user).expect(HttpStatus.Created);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password }).expect(
      HttpStatus.Ok,
    );
    const refreshCookie = extractRefreshCookie(loginRes);
    const sessionBeforeRefresh = await securityDevicesCollection.findOne({
      userId: createdUser.body.id,
    });
    expect(sessionBeforeRefresh).toBeDefined();

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const res = await refreshToken(refreshCookie);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toEqual({ accessToken: expect.any(String) });
    expect(res.body.accessToken).not.toBe(loginRes.body.accessToken);
    const newRefreshCookie = extractRefreshCookie(res);
    expect(newRefreshCookie).not.toBe(refreshCookie);

    const sessionAfterRefresh = await securityDevicesCollection.findOne({
      userId: createdUser.body.id,
    });
    expect(sessionAfterRefresh?.deviceId).toBe(sessionBeforeRefresh?.deviceId);
    expect(sessionAfterRefresh?.issuedAt.getTime()).toBeGreaterThan(
      sessionBeforeRefresh!.issuedAt.getTime(),
    );
  });

  it("should return 401 when no refresh cookie is provided", async () => {
    const res = await refreshToken();

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the refresh token is malformed", async () => {
    const res = await refreshToken("refreshToken=not-a-valid-token");

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the same refresh token is used twice", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password }).expect(
      HttpStatus.Ok,
    );
    const refreshCookie = extractRefreshCookie(loginRes);
    //Задержка, чтобы issueAt было разным
    await new Promise((res) => setTimeout(res, 1000)).then(() =>
      refreshToken(refreshCookie).expect(HttpStatus.Ok),
    );

    const res = await refreshToken(refreshCookie);

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});

describe("POST /auth/logout", () => {
  setupDbLifecycle();

  it("should return 204 and clear the refresh cookie for a valid refresh token", async () => {
    const user = collectUserToCreate();
    const createdUser = await createUser(user).expect(HttpStatus.Created);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password }).expect(
      HttpStatus.Ok,
    );
    const refreshCookie = extractRefreshCookie(loginRes);

    const res = await logout(refreshCookie);

    expect(res.status).toBe(HttpStatus.NoContent);
    const rawCookies = res.headers["set-cookie"] as string[] | undefined;
    const clearedCookie = rawCookies?.find((c) => c.startsWith("refreshToken="));
    expect(clearedCookie).toMatch(/^refreshToken=;/);
    expect(await securityDevicesCollection.countDocuments({ userId: createdUser.body.id })).toBe(0);
  });

  it("should return 401 when no refresh cookie is provided", async () => {
    const res = await logout();

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the refresh token is malformed", async () => {
    const res = await logout("refreshToken=not-a-valid-token");

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the same refresh token is used twice", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password }).expect(
      HttpStatus.Ok,
    );
    const refreshCookie = extractRefreshCookie(loginRes);

    await logout(refreshCookie).expect(HttpStatus.NoContent);
    const res = await logout(refreshCookie);

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should invalidate the refresh token so it can no longer be used to refresh", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password }).expect(
      HttpStatus.Ok,
    );
    const refreshCookie = extractRefreshCookie(loginRes);

    await logout(refreshCookie).expect(HttpStatus.NoContent);
    const res = await refreshToken(refreshCookie);

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });
});
