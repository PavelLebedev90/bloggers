import { Response } from "express";
import { UserOutputModel, UserOutputModelWithMeta } from "../types/users-output.type";
import { UserQueryInputModel } from "../types/users-query-input.type";
import { usersQueryRepository } from "../repository/users-query.repository";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const getAllUsersHandler = async (
  req: SanitizedRequest<unknown, UserQueryInputModel>,
  res: Response<UserOutputModelWithMeta>,
) => {
  const result = await usersQueryRepository.getAll(req.validData.query);
  sendResult({
    res,
    result,
    mapper: (data: { items: UserOutputModel[]; totalCount: number }) => ({
      items: data.items,
      page: req.validData.query.pageNumber,
      pageSize: req.validData.query.pageSize,
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / req.validData.query.pageSize),
    }),
  });
};
