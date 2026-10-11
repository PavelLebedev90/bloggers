import { NextFunction, Request, Response } from "express";
import { config } from "../../config/setup.config";
import { failUnauthorized } from "../../utils/formatters/result/send-result.formatter";

export const baseAuthorizationMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return failUnauthorized(res);
  }

  const [title, token] = authHeader.split(" ");
  if (title !== "Basic" || !token) {
    return failUnauthorized(res);
  }

  const tokenToText = Buffer.from(token, "base64").toString("utf-8");

  const [login, password] = tokenToText.split(":");

  if (login !== config.authLogin) {
    return failUnauthorized(res);
  }
  if (password !== config.authPassword) {
    return failUnauthorized(res);
  }
  next();
};
