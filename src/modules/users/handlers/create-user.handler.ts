import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { UserOutputModel } from "../types/users-output.type";
import { UserInputModel } from "../types/users-input.type";
import { userToDBMapper } from "../mappers/user-to-db.mapper";
import { usersService } from "../service/users.service";
import { usersQueryRepository } from "../repository/users-query.repository";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const createUserHandler = async (
  req: SanitizedRequest<UserInputModel>,
  res: Response<UserOutputModel | ValidationErrorMessages>,
) => {
  const bodyUser = userToDBMapper(req.validData.body);
  const resultWithUserId = await usersService.createUser(
    {
      ...bodyUser,
      password: req.validData.body.password,
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
