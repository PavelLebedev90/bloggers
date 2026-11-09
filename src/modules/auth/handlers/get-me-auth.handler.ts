import { Response } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { AuthOutputModel } from "../types/auth-output.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { authToOutputMapper } from "../mappers/auth-to-output.mapper";
import { SessionRequest } from "../../../core/types/express.type";
import { JWTUserInfo } from "../../../core/adapters/jwt.adapter";

export const getMeHandler = async (
  req: SessionRequest<JWTUserInfo>,
  res: Response<AuthOutputModel | ValidationErrorMessages>,
) => {
  const user = await usersQueryRepository.getUser(req.userSession.userId);
  sendResult({ res, result: user, mapper: authToOutputMapper });
};
