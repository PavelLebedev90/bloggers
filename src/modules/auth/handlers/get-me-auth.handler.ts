import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { AuthOutputModel } from "../types/auth-output.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";
import { authToOutputMapper } from "../mappers/auth-to-output.mapper";

export const getMeHandler = async (
  _req: Request,
  res: Response<
    AuthOutputModel | ValidationErrorMessages,
    {
      user: JWTUserInfo;
    }
  >,
) => {
  const user = await usersQueryRepository.getUser(res.locals.user.userId);
  sendResult({ res, result: user, mapper: authToOutputMapper });
};
