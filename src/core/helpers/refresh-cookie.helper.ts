import { CookieOptions, Request, Response } from "express";
import { cookieEnv } from "../config/cookie.config";

function cookieOptions(__req: Request): CookieOptions {
  return {
    httpOnly: true,
    // secure: isProduction,
    // path: "/api/auth",
    secure: true,
    sameSite: "strict",
  };
}

export function setRefreshCookie(req: Request, res: Response, token: string, exp: Date) {
  res.cookie(cookieEnv.REFRESH_NAME, token, {
    ...cookieOptions(req),
    maxAge: exp.getTime() - Date.now(),
  });
}

export function clearRefreshCookie(req: Request, res: Response) {
  res.clearCookie(cookieEnv.REFRESH_NAME, cookieOptions(req));
}
