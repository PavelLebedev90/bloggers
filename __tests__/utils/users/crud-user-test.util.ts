import { Test } from "supertest";
import { requestWithAuthHeader } from "../middlewares/request-auth-header.middleware";
import { UserInputModel } from "../../../src/modules/users/types/users-input.type";
import { USERS_ROUTER_PATH } from "../../../src/modules/users/const/users-router-path.const";
import { app } from "../../consts/express.const";

type UserInputModelTestDto = {
  [K in keyof UserInputModel]?: unknown;
};

export const getAllUsers = (query?: Record<string, unknown>): Test => {
  return requestWithAuthHeader(app)
    .get(USERS_ROUTER_PATH)
    .query(query ?? {});
};
export const createUser = (user: UserInputModelTestDto): Test => {
  return requestWithAuthHeader(app).post(USERS_ROUTER_PATH).send(user);
};
export const deleteUserById = (id: string): Test => {
  return requestWithAuthHeader(app).delete(`${USERS_ROUTER_PATH}/${id}`);
};
