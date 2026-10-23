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

export const refreshToken = (cookie?: string): Test => {
  const req = request(app).post(`${AUTH_ROUTER_PATH}${AUTH_ROUTER.REFRESH_TOKEN}`);
  if (cookie !== undefined) {
    req.set("Cookie", cookie);
  }
  return req;
};

export const logout = (cookie?: string): Test => {
  const req = request(app).post(`${AUTH_ROUTER_PATH}${AUTH_ROUTER.LOGOUT}`);
  if (cookie !== undefined) {
    req.set("Cookie", cookie);
  }
  return req;
};

export const extractRefreshCookie = (res: { headers: Record<string, unknown> }): string => {
  const rawCookies = res.headers["set-cookie"] as string[] | undefined;
  const refreshCookie = rawCookies?.find((c) => c.startsWith("refreshToken="));
  if (!refreshCookie) throw new Error("refreshToken cookie not found in response");
  const nameValuePair = refreshCookie.split(";").at(0);
  if (!nameValuePair) throw new Error("refreshToken cookie is empty");
  return nameValuePair;
};
