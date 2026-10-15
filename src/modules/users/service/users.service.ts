import { usersRepository } from "../repository/users.repository";
import { UserDBModel, UserModel } from "../types/users-db.type";
import { config } from "../../../core/config/setup.config";
import { MongoServerError, WithId } from "mongodb";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { hashAdapter } from "../../../core/adapters/hash.adapter";
import { userEmailConfirmationToDBMapper } from "../mappers/user-email-confirmation.mapper";

export const usersService = {
  async getUserByLoginOrEmail(
    loginOrEmail: string | { login: string; email: string },
  ): Promise<Result<WithId<UserDBModel>>> {
    const user = await usersRepository.getUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("loginOrEmail", JSON.stringify(loginOrEmail))],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: user,
    });
  },
  async getUserByEmailConfirmationCode(
    emailConfirmationCode: string,
  ): Promise<Result<WithId<UserDBModel>>> {
    const user = await usersRepository.getUserByEmailConfirmationCode(emailConfirmationCode);
    if (!user) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.BadRequest("emailConfirmationCode", emailConfirmationCode)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: user,
    });
  },
  async createUser(
    bodyUser: UserModel & { password: string },
    options: { isConfirmed: boolean },
  ): Promise<Result<string>> {
    const passwordHash = await hashAdapter.hash(bodyUser.password, { secret: config.secretPepper });
    try {
      const userId = await usersRepository.createUser({
        ...userEmailConfirmationToDBMapper({ isConfirmed: options.isConfirmed }),
        login: bodyUser.login,
        email: bodyUser.email,
        createdAt: new Date(),
        passwordHash,
      });
      return okResult({
        status: ResultSuccessStatus.Created,
        data: userId,
      });
    } catch (e) {
      if (e instanceof MongoServerError && e.code === 11000) {
        const keyPattern = e.keyPattern as Record<string, string>;
        if (keyPattern?.email as string)
          return failResult({
            status: ResultErrorStatus.Conflict,
            extensions: [ERROR_MESSAGES.Conflict("email", bodyUser.email)],
          });
        if (keyPattern?.login as string)
          return failResult({
            status: ResultErrorStatus.Conflict,
            extensions: [ERROR_MESSAGES.Conflict("login", bodyUser.login)],
          });
      }
      throw e;
    }
  },
  async updateUser(
    userId: string,
    bodyUser: Omit<UserDBModel, "createdAt" | "passwordHash">,
  ): Promise<Result<true>> {
    const isUpdated = await usersRepository.updateUser(userId, bodyUser);
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
  },
  async deleteUser(userId: string): Promise<Result<true>> {
    const isDeleted = await usersRepository.deleteUser(userId);
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
  },
};
