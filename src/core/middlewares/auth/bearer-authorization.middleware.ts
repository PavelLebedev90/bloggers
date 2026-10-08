import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-statuses.type";
import { JWTService } from "../../services/jwt.service";

export const bearerAuthorizationMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [title, token] = authHeader.split(" ");
  if (title !== "Bearer" || !token) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  const userId = await JWTService.getPayloadByToken(token);

  res.locals.userId = userId;
  next();
};
