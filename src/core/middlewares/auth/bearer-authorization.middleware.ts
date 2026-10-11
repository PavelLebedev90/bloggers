import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../services/jwt.service";
import { failUnauthorized } from "../../utils/formatters/result/send-result.formatter";

export const bearerAuthorizationMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return failUnauthorized(res);
  }

  const [title, token] = authHeader.split(" ");
  if (title !== "Bearer" || !token) {
    return failUnauthorized(res);
  }
  try {
    const userId = await JWTService.getPayloadByToken(token);
    res.locals.userId = userId;
  } catch (__e) {
    return failUnauthorized(res);
  }

  next();
};
