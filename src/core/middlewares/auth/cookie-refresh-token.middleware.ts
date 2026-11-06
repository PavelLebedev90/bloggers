import { NextFunction, Request, Response } from "express";
import { JWTAdapter, JWTType } from "../../adapters/jwt.adapter";
import { failUnauthorized } from "../../utils/formatters/result/send-result.formatter";
import { cookieEnv } from "../../config/cookie.config";
import { securityDevicesCollection } from "../../../db/collections";

export const cookieRefreshTokenMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshCookie = req.cookies[cookieEnv.REFRESH_NAME] as string;
  if (!refreshCookie) {
    return failUnauthorized(res);
  }
  try {
    const payload = await JWTAdapter.getPayloadByToken(refreshCookie, JWTType.REFRESH);

    const session = await securityDevicesCollection.findOne({
      deviceId: payload.deviceId,
      userId: payload.userId,
    });

    if (!session) {
      return failUnauthorized(res);
    }

    const lastActiveDate = session.issuedAt;
    lastActiveDate.setMilliseconds(0);
    const issuedAt = new Date((payload.iat ?? 0) * 1000);
    if (lastActiveDate.toISOString() !== issuedAt.toISOString()) {
      return failUnauthorized(res);
    }

    res.locals.cookie = {
      userId: payload.userId,
      exp: payload.exp,
      deviceId: payload.deviceId,
      issuedAt: payload.iat,
    };
  } catch (__e) {
    return failUnauthorized(res);
  }

  next();
};
