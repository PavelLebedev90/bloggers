import { config } from "../../../core/config/setup.config";
import { AuthInputModel } from "../types/auth-input.type";
import { JWTAdapter } from "../../../core/adapters/jwt.adapter";

import { ERROR_MESSAGES } from "../../../core/consts/error.messages.const";
import {
  failResult,
  isError,
  isSuccess,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";
import { JWEAdapter } from "../../../core/adapters/jwe.adapter";
import { usersService } from "../../users/service/users.service";
import { hashAdapter } from "../../../core/adapters/hash.adapter";
import { UserInputModel } from "../../users/types/users-input.type";
import { userEmailConfirmationToDBMapper } from "../../users/mappers/user-email-confirmation.mapper";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";

export const authService = {
  async login(
    bodyAuth: AuthInputModel,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<{ token: string }>> {
    const result = await usersService.getUserByLoginOrEmail(bodyAuth.loginOrEmail);
    if (isSuccess(result)) {
      try {
        const passwordVerify = await hashAdapter.verify(
          result.data.passwordHash,
          bodyAuth.password,
          {
            secret: config.secretPepper,
          },
        );
        if (!passwordVerify) {
          return failResult({
            status: ResultErrorStatus.Unauthorized,
            extensions: [ERROR_MESSAGES.Unauthorized("loginOrEmail", bodyAuth.loginOrEmail)],
          });
        }
      } catch {
        return failResult({
          status: ResultErrorStatus.InternalServerError,
          extensions: [ERROR_MESSAGES.InternalServerError("passwordVerify")],
        });
      }
      if (mode === "jwt") {
        const token = await JWTAdapter.createToken({
          userId: result.data._id.toString(),
          isEmailConfirmed: result.data.emailConfirmationIsConfirmed,
        });
        return okResult({
          status: ResultSuccessStatus.Ok,
          data: { token },
        });
      } else {
        const token = await JWEAdapter.encryptSession({
          user: result.data,
          sub: result.data._id.toString(),
        });
        return okResult({
          status: ResultSuccessStatus.Ok,
          data: { token },
        });
      }
    } else {
      return result;
    }
  },
  async createUser(bodyUser: UserInputModel): Promise<Result<string>> {
    const user = await usersService.createUser(bodyUser, { isConfirmed: false });
    if (isSuccess(user)) {
      try {
        // const smtp = true;
      } catch (__e) {}
      return user;
    }
    return user;
  },
  async registrationConfirmAuth(emailConfirmationCode: string): Promise<Result<true>> {
    const user = await usersService.getUserByEmailConfirmationCode(emailConfirmationCode);
    if (isError(user)) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("emailConfirmationCode", emailConfirmationCode)],
      });
    }
    const isUpdatedUser = await usersService.updateUser(user.data._id.toString(), {
      ...userEmailConfirmationToDBMapper({ isConfirmed: true }),
      login: user.data.login,
      email: user.data.email,
    });
    return isUpdatedUser;
  },
  async registrationEmailResendingAuth(email: string): Promise<Result<true>> {
    const user = await usersService.getUserByLoginOrEmail({ email, login: "" });
    if (isError(user)) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("email", email)],
      });
    }
    if (
      user.data.emailConfirmationExpirationDate &&
      user.data.emailConfirmationExpirationDate > new Date()
    ) {
      return failResult({
        status: ResultErrorStatus.Forbidden,
        extensions: [ERROR_MESSAGES.Forbidden("emailConfirmationExpirationDate")],
      });
    }
    if (user.data.emailConfirmationIsConfirmed) {
      return failResult({
        status: ResultErrorStatus.Forbidden,
        extensions: [ERROR_MESSAGES.Forbidden("emailConfirmationIsConfirmed")],
      });
    }
    const isUpdatedUser = await usersService.updateUser(user.data._id.toString(), {
      ...userEmailConfirmationToDBMapper({ isConfirmed: false }),
      login: user.data.login,
      email: user.data.email,
    });

    try {
      // const smtp = true;
    } catch (__e) {}

    return isUpdatedUser;
  },
};
