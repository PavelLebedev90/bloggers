import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-statuses.type";
import { config } from "../../config/setup.config";

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

  if (login !== config.authLogin) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  if (password !== config.authPassword) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  next();
};
