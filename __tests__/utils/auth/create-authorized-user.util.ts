import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { createUser } from "../users/crud-user-test.util";
import { collectUserToCreate } from "../users/collect-user-test.util";
import { login } from "./crud-auth-test.util";
import { UserInputModel } from "../../../src/modules/users/types/users-input.type";
import { UserOutputModel } from "../../../src/modules/users/types/users-output.type";

export const createAuthorizedUser = async (
  overrides: Partial<UserInputModel> = {},
): Promise<{ userId: string; accessToken: string; login: string }> => {
  const user = { ...collectUserToCreate(), ...overrides };
  const createdUser = await createUser(user).expect(HttpStatus.Created);

  const loginRes = await login({ loginOrEmail: user.login, password: user.password }).expect(
    HttpStatus.Ok,
  );
  const { accessToken } = loginRes.body as { accessToken: string };
  const userId = (createdUser.body as UserOutputModel).id;
  return { userId, accessToken, login: user.login };
};
