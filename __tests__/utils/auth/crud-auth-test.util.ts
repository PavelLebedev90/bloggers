import request, { Test } from "supertest";
import { AuthInputModel } from "../../../src/modules/auth/types/auth-input.type";
import {
  AUTH_ROUTER_PATH,
  AUTH_ROUTER,
} from "../../../src/modules/auth/const/auth-router-path.const";
import { UserInputModel } from "../../../src/modules/users/types/users-input.type";
import { app } from "../../consts/express.const";

type AuthInputModelTestDto = {
  [K in keyof AuthInputModel]?: unknown;
};

type UserInputModelTestDto = {
  [K in keyof UserInputModel]?: unknown;
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

export const registration = (user: UserInputModelTestDto): Test => {
  return request(app).post(`${AUTH_ROUTER_PATH}${AUTH_ROUTER.REGISTRATION}`).send(user);
};

export const registrationConfirmation = (body: { code?: unknown }): Test => {
  return request(app).post(`${AUTH_ROUTER_PATH}${AUTH_ROUTER.REGISTRATION_CONFIRM}`).send(body);
};

export const registrationEmailResending = (body: { email?: unknown }): Test => {
  return request(app)
    .post(`${AUTH_ROUTER_PATH}${AUTH_ROUTER.REGISTRATION_EMAIL_RESENDING}`)
    .send(body);
};
