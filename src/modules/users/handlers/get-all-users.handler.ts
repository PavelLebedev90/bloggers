import { Response, Request } from "express";
import { UserOutputModelWithMeta } from "../types/users-output.type";
import { UserQueryInputModel } from "../types/users-query-input.type";
import { usersQueryRepository } from "../repository/users-query.repository";
import { usersToOutputMapper } from "../mappers/user-to-output.mapper";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { WithId } from "mongodb";
import { UserDBModel } from "../types/users-db.type";

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
  sendResult(res, result, (data: { items: WithId<UserDBModel>[]; totalCount: number }) => ({
    items: usersToOutputMapper(data.items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: data.totalCount,
    pagesCount: Math.ceil(data.totalCount / res.locals.query.pageSize),
  }));
};
