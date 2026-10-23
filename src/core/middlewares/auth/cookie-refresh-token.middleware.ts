import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../adapters/jwt.adapter";
import { failUnauthorized } from "../../utils/formatters/result/send-result.formatter";
import { cookieEnv } from "../../config/cookie.config";

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
    const payload = await JWTAdapter.getPayloadByToken(refreshCookie, "refresh_token");
    res.locals.cookie = {
      userId: payload.userId,
      exp: payload.exp,
    };
  } catch (__e) {
    return failUnauthorized(res);
  }

  next();
};
