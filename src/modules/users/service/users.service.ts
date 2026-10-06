import { usersRepository } from "../repository/users.repository";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { UserDBModel } from "../types/users-db.type";
import { hash } from "argon2";
import { config } from "../../../core/config/setup.config";
import { MongoServerError } from "mongodb";

export const usersService = {
  async createUser(bodyUser: Omit<UserDBModel, "passwordHash"> & { password: string }) {
    const passwordHash = await hash(bodyUser.password, { secret: config.secretPepper });
    try {
      const user = await usersRepository.createUser({
        login: bodyUser.login,
        email: bodyUser.email,
        createdAt: bodyUser.createdAt,
        passwordHash,
      });
      return user;
    } catch (e) {
      if (e instanceof MongoServerError && e.code === 11000) {
        const keyPattern = e.keyPattern as Record<string, string>;
        if (keyPattern?.email as string)
          throw new AppError(ERROR_MESSAGES.conflict("email", bodyUser.email));
        if (keyPattern?.login as string)
          throw new AppError(ERROR_MESSAGES.conflict("login", bodyUser.login));
      }
      throw e;
    }
  },
  async deleteUser(userId: string) {
    const isDeleted = await usersRepository.deleteUser(userId);
    if (!isDeleted) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("user id ", userId));
    }
    return isDeleted;
  },
};
