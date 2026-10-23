import { Response, Request } from "express";
import { BlogOutputModel, BlogOutputModelWithMeta } from "../types/blogs-output.type";
import { BlogQueryInputModel } from "../types/blogs-query-input.type";
import { blogsQueryRepository } from "../repository/blogs-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";

export const getAllBlogsHandler = async (
  _req: Request,
  res: Response<
    BlogOutputModelWithMeta | ValidationErrorMessages,
    {
      query: BlogQueryInputModel;
    }
  >,
) => {
  const result = await blogsQueryRepository.getAll(res.locals.query);
  sendResult({
    res,
    result,
    mapper: (data: { items: BlogOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / res.locals.query.pageSize),
    }),
  });
};
