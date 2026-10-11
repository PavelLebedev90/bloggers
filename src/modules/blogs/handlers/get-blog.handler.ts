import { Response, Request } from "express";
import { BlogOutputModel } from "../types/blogs-output.type";
import { blogToOutputMapper } from "../mappers/blog-to-output.mapper";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";

export const getBlogHandler = async (
  _req: Request,
  res: Response<
    BlogOutputModel | ValidationErrorMessages,
    {
      params: { id: string };
    }
  >,
) => {
  const result = await blogsQueryRepository.getBlog(res.locals.params.id);
  sendResult(res, result, blogToOutputMapper);
};
