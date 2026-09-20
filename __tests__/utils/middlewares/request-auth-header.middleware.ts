import { Express } from "express";
import request from "supertest";
import { AUTH_LOGIN, AUTH_PASSWORD } from "../../../src/core/consts/auth-basic.const";

const AUTH_CREDENTIALS = Buffer.from(`${AUTH_LOGIN}:${AUTH_PASSWORD}`, "utf-8").toString("base64");
export const AUTH_HEADER = `Basic ${AUTH_CREDENTIALS}`;

export const requestWithAuthHeader = (app: Express) => {
  return {
    post(url: string) {
      return request(app).post(url).set("authorization", AUTH_HEADER);
    },
    put(url: string) {
      return request(app).put(url).set("authorization", AUTH_HEADER);
    },
    delete(url: string) {
      return request(app).delete(url).set("authorization", AUTH_HEADER);
    },
  };
};
