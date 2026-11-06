import { NextFunction, Request, Response } from "express";
import { rateLimitsCollection } from "../../../db/collections";
import { RateLimitDBModel } from "../../../modules/rateLimits/types/rateLimit-db";
import { collectMetaRequest } from "../../helpers/collect-meta-request.helper";
import { sendError } from "../../utils/formatters/result/send-result.formatter";
import { HttpStatus } from "../../types/http-statuses.type";
import { ERROR_MESSAGES } from "../../consts/message/error.message.const";

export const rateLimitMiddleware = async (
  req: Request,
  res: Response<
    unknown,
    {
      body: Record<string, unknown>;
    }
  >,
  next: NextFunction,
) => {
  const { ip, method, originalUrl } = collectMetaRequest(req);

  const totalCount = await rateLimitsCollection.countDocuments({
    ip,
    method,
    url: originalUrl,
    expiresAt: { $gt: new Date() },
  });

  if (totalCount >= 5) {
    return sendError({
      res,
      httpStatus: HttpStatus.TooManyRequests,
      errors: [ERROR_MESSAGES.TooManyRequests("too many requests")],
    });
  }

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 10);
  const rateLimitDbData: RateLimitDBModel = {
    ip,
    method,
    url: originalUrl,
    payload: res.locals.body,
    expiresAt,
  };

  await rateLimitsCollection.insertOne(rateLimitDbData);

  next();
};
