import request, { Test } from "supertest";
import { AuthInputModel } from "../../../src/modules/auth/types/auth-input.type";
import {
  AUTH_ROUTER_PATH,
  AUTH_ROUTER,
} from "../../../src/modules/auth/const/auth-router-path.const";
import { app } from "../../consts/express.const";

type AuthInputModelTestDto = {
  [K in keyof AuthInputModel]?: unknown;
};

export const login = (credentials: AuthInputModelTestDto): Test => {
  return request(app).post(`${AUTH_ROUTER_PATH}${AUTH_ROUTER.LOGIN}`).send(credentials);
};
