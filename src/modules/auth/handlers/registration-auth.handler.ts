import { Response, Request } from "express";
import {
  ResultSuccessStatus,
  ValidationErrorMessages,
} from "../../../core/types/validation-error.type";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { UserInputModel } from "../../users/types/users-input.type";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { authService } from "../service/auth.service";

export const registrationAuthHandler = async (
  _req: Request,
  res: Response<
    ValidationErrorMessages | undefined,
    {
      body: UserInputModel;
    }
  >,
) => {
  const result = await authService.createUser(res.locals.body);
  if (isError(result)) return sendResult(res, result);
  sendResult<ResultSuccessStatus.NoContent>(res, {
    ...result,
    status: ResultSuccessStatus.NoContent,
  });
};
