import { Request } from "express";
export type MetaRequest = ReturnType<typeof collectMetaRequest>;

export const collectMetaRequest = (req: Request) => {
  return {
    ip: req.ip?.toString() || "",
    userAgent: req.headers["user-agent"]?.toString() || "",
    originalUrl: req.originalUrl?.toString() || "",
    method: req.method?.toString() || "",
  };
};
