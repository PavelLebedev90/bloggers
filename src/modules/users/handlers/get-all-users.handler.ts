import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { UserOutputModelWithMeta } from "../types/users-output.type";
import { UserQueryInputModel } from "../types/users-query-input.type";
import { usersQueryRepository } from "../repository/users-query.repository";
import { usersToOutputMapper } from "../mappers/user-to-output.mapper";

export const getAllUsersHandler = async (
  _req: Request,
  res: Response<
    UserOutputModelWithMeta,
    {
      query: UserQueryInputModel;
    }
  >,
) => {
  const { items, totalCount } = await usersQueryRepository.getAll(res.locals.query);
  res.status(HttpStatus.Ok).send({
    items: usersToOutputMapper(items),
    page: res.locals.query.pageNumber,
    pageSize: res.locals.query.pageSize,
    totalCount: totalCount,
    pagesCount: Math.ceil(totalCount / res.locals.query.pageSize),
  });
};
