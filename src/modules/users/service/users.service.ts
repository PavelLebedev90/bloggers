import { usersRepository } from "../repository/users.repository";
import { UserDBModel } from "../types/users-db.type";
import { hash } from "argon2";
import { config } from "../../../core/config/setup.config";
import { MongoServerError } from "mongodb";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
} from "../../../core/types/validation-error.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error.messages.const";

export const usersService = {
  async createUser(
    bodyUser: Omit<UserDBModel, "passwordHash"> & { password: string },
  ): Promise<Result<string>> {
    const passwordHash = await hash(bodyUser.password, { secret: config.secretPepper });
    try {
      const userId = await usersRepository.createUser({
        login: bodyUser.login,
        email: bodyUser.email,
        createdAt: bodyUser.createdAt,
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
