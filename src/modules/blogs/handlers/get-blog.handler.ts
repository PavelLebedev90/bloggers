import { Response } from "express";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getBlogHandler = async (
  req: SanitizedRequest<unknown, unknown, { id: string }>,
  res: Response<BlogOutputModel | ValidationErrorMessages>,
) => {
  const result = await blogsQueryRepository.getBlog(req.validData.params.id);
  sendResult({ res, result });
};
