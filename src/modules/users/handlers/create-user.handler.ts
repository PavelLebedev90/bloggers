import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { UserOutputModel } from "../types/users-output.type";
import { UserInputModel } from "../types/users-input.type";
import { userToDBMapper } from "../mappers/user-to-db.mapper";
import { usersService } from "../service/users.service";
import { usersQueryRepository } from "../repository/users-query.repository";
import { userToOutputMapper } from "../mappers/user-to-output.mapper";

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
  const newUserId = await usersService.createUser({
    ...bodyUser,
    createdAt: new Date(),
    password: res.locals.body.password,
  });
  const newUser = await usersQueryRepository.getUser(newUserId);
  res.status(HttpStatus.Created).send(userToOutputMapper(newUser));
};
