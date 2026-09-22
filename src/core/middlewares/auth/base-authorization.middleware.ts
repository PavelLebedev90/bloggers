import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-statuses.type";
import { AUTH_LOGIN, AUTH_PASSWORD } from "../../config/setup.config";

export const baseAuthorizationMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [title, token] = authHeader.split(" ");
  if (title !== "Basic" || !token) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const tokenToText = Buffer.from(token, "base64").toString("utf-8");

  const [login, password] = tokenToText.split(":");

  if (login !== AUTH_LOGIN) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  if (password !== AUTH_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  next();
};
