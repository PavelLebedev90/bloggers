import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { login } from "../../utils/auth/crud-auth-test.util";
import { createUser } from "../../utils/users/crud-user-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

describe("Auth login", () => {
  setupDbLifecycle();

  it("should return 204 when logging in with a valid login and password", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);

    const res = await login({ loginOrEmail: user.login, password: user.password });

    expect(res.status).toBe(HttpStatus.NoContent);
  });
  it("should return 401 when the user does not exist", async () => {
    const res = await login({ loginOrEmail: "unknown1", password: "qwerty1" });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 401 when the password is incorrect", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);

    const res = await login({ loginOrEmail: user.login, password: "wrongPassword1" });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 204 when loginOrEmail has a different case (input is lowercased)", async () => {
    const user = collectUserToCreate();
    await createUser(user).expect(HttpStatus.Created);

    const res = await login({
      loginOrEmail: user.login.toUpperCase(),
      password: user.password,
    });

    expect(res.status).toBe(HttpStatus.NoContent);
  });
});
