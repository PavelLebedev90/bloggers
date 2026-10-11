import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { UserOutputModel } from "../types/users-output.type";
import { UserInputModel } from "../types/users-input.type";
import { userToDBMapper } from "../mappers/user-to-db.mapper";
import { usersService } from "../service/users.service";
import { usersQueryRepository } from "../repository/users-query.repository";
import { userToOutputMapper } from "../mappers/user-to-output.mapper";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const createUserHandler = async (
  _req: Request,
  res: Response<
    UserOutputModel | ValidationErrorMessages,
    {
      body: UserInputModel;
    }
  >,
) => {
  const bodyUser = userToDBMapper(res.locals.body);
  const resultWithUserId = await usersService.createUser({
    ...bodyUser,
    createdAt: new Date(),
    password: res.locals.body.password,
  });
  if (isError(resultWithUserId)) {
    return sendError({
      res,
      httpStatus: HttpStatus[resultWithUserId.status],
      errors: resultWithUserId.extensions,
    });
  }
  const result = await usersQueryRepository.getUser(resultWithUserId.data);
  if (isError(result)) return sendResult(res, result);
  sendResult(res, { ...result, status: resultWithUserId.status }, userToOutputMapper);
};
