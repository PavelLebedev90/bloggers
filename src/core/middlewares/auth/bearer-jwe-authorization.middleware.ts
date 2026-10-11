import type { Request, Response, NextFunction } from "express";
import { JweKidError, JWEService } from "../../services/jwe.service";
import { errors } from "jose";
import { failUnauthorized } from "../../utils/formatters/result/send-result.formatter";

export const SESSION_COOKIE = "session";

export async function bearerJWEAuthorizationMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return failUnauthorized(res);
  }

  const [title, token] = authHeader.split(" ");
  if (title !== "Bearer" || !token) {
    return failUnauthorized(res);
  }

  try {
    const { payload, kidStatus } = await JWEService.decryptSession(token);

    if (kidStatus === "deprecated") {
      const freshToken = await JWEService.reencrypt(payload);
      res.setHeader("X-Access-Token", freshToken);
    }
    res.locals.user = payload.user;
    next();
  } catch (err) {
    if (err instanceof JweKidError) {
      return failUnauthorized(res);
    }
    if (err instanceof errors.JOSEError) {
      return failUnauthorized(res);
    }
    return failUnauthorized(res);
  }
}
