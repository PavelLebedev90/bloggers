import type { Request, Response, NextFunction } from "express";
import { JweKidError, JWEAdapter } from "../../adapters/jwe.adapter";
import { errors } from "jose";
import { failUnauthorized } from "../../utils/formatters/result/send-result.formatter";
import { WithId } from "mongodb";
import { UserDBModel } from "../../../modules/users/types/users-db.type";

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
    const { payload, kidStatus } = await JWEAdapter.decryptSession(token);

    if (kidStatus === "deprecated") {
      const freshToken = await JWEAdapter.reencrypt(payload);
      res.setHeader("X-Access-Token", freshToken);
    }
    res.locals.user = payload.user as WithId<UserDBModel>;
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
