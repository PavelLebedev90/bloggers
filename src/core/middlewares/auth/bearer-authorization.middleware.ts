import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../adapters/jwt.adapter";
import { failUnauthorized, sendError } from "../../utils/formatters/result/send-result.formatter";
import { HttpStatus } from "../../types/http-statuses.type";
import { ERROR_MESSAGES } from "../../consts/message/error.message.const";

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
    const user = await JWTAdapter.getPayloadByToken(token);

    if (!user.isEmailConfirmed) {
      return sendError({
        res,
        httpStatus: HttpStatus.Forbidden,
        errors: [ERROR_MESSAGES.Forbidden("emailConfirmationIsConfirmed", "false")],
      });
    }

    res.locals.user = user;
  } catch (__e) {
    return failUnauthorized(res);
  }

  next();
};
