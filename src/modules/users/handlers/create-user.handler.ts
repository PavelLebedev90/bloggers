import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { UserOutputModel } from "../types/users-output.type";
import { UserInputModel } from "../types/users-input.type";
import { userToDBMapper } from "../mappers/user-to-db.mapper";
import { usersService } from "../service/users.service";
import { usersQueryRepository } from "../repository/users-query.repository";
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
  const resultWithUserId = await usersService.createUser(
    {
      ...bodyUser,
      password: res.locals.body.password,
    },
    { isConfirmed: true },
  );
  if (isError(resultWithUserId)) {
    return sendError({
      res,
      httpStatus: HttpStatus[resultWithUserId.status],
      errors: resultWithUserId.extensions,
    });
  }
  const result = await usersQueryRepository.getUser(resultWithUserId.data.userId);
  sendResult({ res, result, overwriteSuccessStatus: resultWithUserId.status });
};
