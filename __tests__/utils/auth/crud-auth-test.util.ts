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

export const getMe = (accessToken?: string): Test => {
  const req = request(app).get(`${AUTH_ROUTER_PATH}${AUTH_ROUTER.ME}`);
  if (accessToken !== undefined) {
    req.set("authorization", `Bearer ${accessToken}`);
  }
  return req;
};
