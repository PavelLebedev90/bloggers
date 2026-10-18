import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { AuthOutputModel } from "../types/auth-output.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authToOutputMapper } from "../mappers/auth-to-output.mapper";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";

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
  sendResult(res, user, authToOutputMapper);
};
