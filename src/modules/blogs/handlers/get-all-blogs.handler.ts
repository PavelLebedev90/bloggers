import { Response } from "express";
import { BlogOutputModel, BlogOutputModelWithMeta } from "../types/blogs-output.type";
import { BlogQueryInputModel } from "../types/blogs-query-input.type";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getAllBlogsHandler = async (
  req: SanitizedRequest<unknown, BlogQueryInputModel>,
  res: Response<BlogOutputModelWithMeta | ValidationErrorMessages>,
) => {
  const result = await blogsQueryRepository.getAll(req.validData.query);
  sendResult({
    res,
    result,
    mapper: (data: { items: BlogOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: req.validData.query.pageNumber,
      pageSize: req.validData.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / req.validData.query.pageSize),
    }),
  });
};
