import { UsersRepository } from "../repository/users.repository";
import { UserDBModel, UserModel } from "../types/users-db.type";
import { hashEnv } from "../../../core/config/hash.config";
import { MongoServerError, WithId } from "mongodb";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
  SuccessResult,
} from "../../../core/types/result.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { hashAdapter } from "../../../core/adapters/hash.adapter";
import { userEmailConfirmationToDBMapper } from "../mappers/user-email-confirmation.mapper";
import { inject, injectable } from "inversify";
@injectable()
export class UsersService {
  constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {}
  async getUser(userId: string): Promise<Result<WithId<UserDBModel>>> {
    const user = await this.usersRepository.getUser(userId);

    if (!user) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("user id", userId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: user,
    });
  }
  async getUserByLoginOrEmail(
    loginOrEmail: string | { login?: string; email?: string },
  ): Promise<Result<WithId<UserDBModel>>> {
    const user = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("loginOrEmail", JSON.stringify(loginOrEmail))],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: user,
    });
  }
  async getUserByEmailConfirmationCode(
    emailConfirmationCode: string,
  ): Promise<Result<WithId<UserDBModel>>> {
    const user = await this.usersRepository.getUserByEmailConfirmationCode(emailConfirmationCode);
    if (!user) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.BadRequest("code", emailConfirmationCode)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: user,
    });
  }
  async createUser(
    bodyUser: UserModel & { password: string },
    options: { isConfirmed: boolean },
  ): Promise<Result<{ userId: string; emailConfirmationCode: string | null }>> {
    const passwordHash = await this.getPasswordHash(bodyUser.password);
    try {
      const emailConfirmationFields = userEmailConfirmationToDBMapper({
        isConfirmed: options.isConfirmed,
      });
      const userId = await this.usersRepository.createUser({
        ...emailConfirmationFields,
        login: bodyUser.login,
        email: bodyUser.email,
        createdAt: new Date(),
        passwordHash: passwordHash.data,
      });
      return okResult({
        status: ResultSuccessStatus.Created,
        data: { userId, emailConfirmationCode: emailConfirmationFields.emailConfirmationCode },
      });
    } catch (e) {
      if (e instanceof MongoServerError && e.code === 11000) {
        const keyPattern = e.keyPattern as Record<string, string>;
        if (keyPattern?.email as string)
          return failResult({
            status: ResultErrorStatus.BadRequest,
            extensions: [ERROR_MESSAGES.BadRequest("email", bodyUser.email)],
          });
        if (keyPattern?.login as string)
          return failResult({
            status: ResultErrorStatus.BadRequest,
            extensions: [ERROR_MESSAGES.BadRequest("login", bodyUser.login)],
          });
      }
      throw e;
    }
  }
  async updateUser<T extends keyof UserDBModel = "createdAt" | "passwordHash">(
    userId: string,
    bodyUser: Omit<UserDBModel, T>,
  ): Promise<Result<true>> {
    const isUpdated = await this.usersRepository.updateUser(userId, bodyUser);
    if (!isUpdated) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("user id", userId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isUpdated,
    });
  }
  async deleteUser(userId: string): Promise<Result<true>> {
    const isDeleted = await this.usersRepository.deleteUser(userId);
    if (!isDeleted) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("user id ", userId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isDeleted,
    });
  }
  async getPasswordHash(password: string): Promise<SuccessResult<string>> {
    const passwordHash = await hashAdapter.hash(password, {
      secret: hashEnv.PEPPER,
    });
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: passwordHash,
    });
  }
}
