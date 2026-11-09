import { Request } from "express";

export interface SessionRequest<Session> extends Request {
  userSession: Session;
}
export interface SanitizedRequest<
  Body = unknown,
  Query = unknown,
  Params = unknown,
  Cookies = unknown,
  Session = unknown,
> extends SessionRequest<Session> {
  validData: {
    body: Body;
    query: Query;
    params: Params;
    cookies: Cookies;
  };
}
