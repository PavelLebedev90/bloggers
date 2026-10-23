import { Response, Request } from "express";
import { UserOutputModel, UserOutputModelWithMeta } from "../types/users-output.type";
import { UserQueryInputModel } from "../types/users-query-input.type";
import { usersQueryRepository } from "../repository/users-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const getAllUsersHandler = async (
  _req: Request,
  res: Response<
    UserOutputModelWithMeta,
    {
      query: UserQueryInputModel;
    }
  >,
) => {
  const result = await usersQueryRepository.getAll(res.locals.query);
  sendResult({
    res,
    result,
    mapper: (data: { items: UserOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / res.locals.query.pageSize),
    }),
  });
};
