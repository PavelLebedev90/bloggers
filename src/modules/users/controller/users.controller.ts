import { Response } from "express";
import { inject, injectable } from "inversify";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { SanitizedRequest } from "../../../core/types/express.type";
import { UserInputModel } from "../types/users-input.type";
import { UserOutputModel, UserOutputModelWithMeta } from "../types/users-output.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { userToDBMapper } from "../mappers/user-to-db.mapper";
import { UsersService } from "../service/users.service";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { UsersQueryRepository } from "../repository/users-query.repository";
import { UserQueryInputModel } from "../types/users-query-input.type";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) private usersService: UsersService,
    @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
  ) {}
  async createUser(
    req: SanitizedRequest<UserInputModel>,
    res: Response<UserOutputModel | ValidationErrorMessages>,
  ) {
    const bodyUser = userToDBMapper(req.validData.body);
    const resultWithUserId = await this.usersService.createUser(
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
    const result = await this.usersQueryRepository.getUser(resultWithUserId.data.userId);
    sendResult({ res, result, overwriteSuccessStatus: resultWithUserId.status });
  }
  async deleteUser(req: SanitizedRequest<unknown, unknown, { id: string }>, res: Response) {
    const result = await this.usersService.deleteUser(req.validData.params.id);
    sendResult({ res, result });
  }
  async getAllUsers(
    req: SanitizedRequest<unknown, UserQueryInputModel>,
    res: Response<UserOutputModelWithMeta>,
  ) {
    const result = await this.usersQueryRepository.getAll(req.validData.query);
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
  }
}
