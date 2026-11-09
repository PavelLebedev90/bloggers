import request, { Test } from "supertest";
import {
  SECURITY_DEVICES_ROUTER,
  SECURITY_DEVICES_ROUTER_PATH,
} from "../../../src/modules/securityDevices/const/securityDevices-router-path.const";
import { app } from "../../consts/express.const";
import { JWTType, JWTUserInfo } from "../../../src/core/adapters/jwt.adapter";

const withRefreshCookie = (req: Test, cookie?: string): Test => {
  if (cookie !== undefined) req.set("Cookie", cookie);
  return req;
};

export const getSecurityDevices = (cookie?: string): Test =>
  withRefreshCookie(
    request(app).get(`${SECURITY_DEVICES_ROUTER_PATH}${SECURITY_DEVICES_ROUTER.BASE}`),
    cookie,
  );

export const deleteSecurityDevice = (deviceId: string, cookie?: string): Test =>
  withRefreshCookie(request(app).delete(`${SECURITY_DEVICES_ROUTER_PATH}/${deviceId}`), cookie);

export const deleteOtherSecurityDevices = (cookie?: string): Test =>
  withRefreshCookie(
    request(app).delete(`${SECURITY_DEVICES_ROUTER_PATH}${SECURITY_DEVICES_ROUTER.BASE}`),
    cookie,
  );

export const extractDeviceId = (cookie: string): string => {
  const token = cookie.replace(/^refreshToken=/, "");
  const payload = token.split(".")[1];
  if (payload) {
    return (
      JSON.parse(Buffer.from(payload, "base64url").toString()) as JWTUserInfo<JWTType.REFRESH>
    ).deviceId;
  }
  return "";
};
