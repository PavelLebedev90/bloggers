import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { usersQueryRepository } from "../../users/repository/users-query.repository";
import { AuthOutputModel } from "../types/auth-output.type";

export const getMeHandler = async (
  _req: Request,
  res: Response<
    AuthOutputModel | ValidationErrorMessages,
    {
      userId: string;
    }
  >,
) => {
  const user = await usersQueryRepository.getUser(res.locals.userId);
  res.status(HttpStatus.Ok).send({
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  });
};
