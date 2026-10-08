import { SignJWT } from "jose";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { config } from "../../../src/core/config/setup.config";
import { getMe, login } from "../../utils/auth/crud-auth-test.util";
import { createUser, deleteUserById } from "../../utils/users/crud-user-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { AuthOutputModel } from "../../../src/modules/auth/types/auth-output.type";

const createExpiredToken = async (userId: string): Promise<string> => {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuedAt(Math.floor(Date.now() / 1000) - 60)
    .setExpirationTime(Math.floor(Date.now() / 1000) - 1)
    .sign(config.secretJWT);
};

describe("GET /auth/me", () => {
  setupDbLifecycle();

  it("should return 200 and the current user's data for a valid access token", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);

    const loginRes = await login({ loginOrEmail: user.login, password: user.password });
    expect(loginRes.status).toBe(HttpStatus.Ok);
    const { accessToken } = loginRes.body as { accessToken: string };

    const res = await getMe(accessToken);

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toEqual<AuthOutputModel>({
      userId: expect.any(String),
      login: user.login,
      email: user.email,
    });
  });

  it("should return 401 when no authorization header is provided", async () => {
    const res = await getMe();

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when authorization scheme is not Bearer", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password });
    const { accessToken } = loginRes.body as { accessToken: string };

    const res = await getMe().set("authorization", `Basic ${accessToken}`);

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the token is missing after the Bearer scheme", async () => {
    const res = await getMe().set("authorization", "Bearer ");

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the token is malformed", async () => {
    const res = await getMe("not-a-valid-jwt-token");

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the token is signed with a different secret", async () => {
    const user = collectUserToCreate();
    const createdUser = await createUser(user).expect(HttpStatus.Created);

    const wrongSecret = new Uint8Array(32).fill(1);
    const bogusToken = await new SignJWT({ userId: createdUser.body.id })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(createdUser.body.id)
      .setIssuedAt()
      .setExpirationTime("5min")
      .sign(wrongSecret);

    const res = await getMe(bogusToken);

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the token has expired", async () => {
    const user = collectUserToCreate();
    const createdUser = await createUser(user).expect(HttpStatus.Created);

    const expiredToken = await createExpiredToken(createdUser.body.id);

    const res = await getMe(expiredToken);

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 404 when the user from the token no longer exists", async () => {
    const user = collectUserToCreate();
    const createdUser = await createUser(user).expect(HttpStatus.Created);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password });
    const { accessToken } = loginRes.body as { accessToken: string };

    await deleteUserById(createdUser.body.id).expect(HttpStatus.NoContent);

    const res = await getMe(accessToken);

    expect(res.status).toBe(HttpStatus.NotFound);
  });
});
