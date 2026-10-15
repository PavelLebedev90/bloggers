import { hashEnv } from "../../../core/config/hash.config";
import { AuthInputModel } from "../types/auth-input.type";
import { JWTAdapter } from "../../../core/adapters/jwt.adapter";

import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
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
import { smtpAdapter } from "../../../core/adapters/smtp.adapter";
import { emailTemplates } from "../../../core/mailer/email-templates";

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
            secret: hashEnv.PEPPER,
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
  async createUser(
    bodyUser: UserInputModel,
  ): Promise<Result<{ userId: string; emailConfirmationCode: string | null }>> {
    const result = await usersService.createUser(bodyUser, { isConfirmed: false });
    const emailConfirmationCode = result.data?.emailConfirmationCode;
    if (isSuccess(result) && emailConfirmationCode) {
      smtpAdapter
        .sendMail({
          to: bodyUser.email,
          ...emailTemplates.registrationConfirmation({
            login: bodyUser.login,
            code: emailConfirmationCode,
          }),
        })
        .catch((error: unknown) =>
          console.error("Failed to send registration confirmation email", {
            userId: result.data.userId,
            email: bodyUser.email,
            error,
          }),
        );
    }
    return result;
  },
  async registrationConfirmAuth(emailConfirmationCode: string): Promise<Result<true>> {
    const user = await usersService.getUserByEmailConfirmationCode(emailConfirmationCode);
    if (isError(user)) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.BadRequest("code", emailConfirmationCode)],
      });
    }
    if (user.data.emailConfirmationIsConfirmed) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.NotFound("code", emailConfirmationCode)],
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
    const user = await usersService.getUserByLoginOrEmail({ email, login: "null" });
    if (isError(user)) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.BadRequest("email", email)],
      });
    }

    if (user.data.emailConfirmationIsConfirmed) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.BadRequest("email")],
      });
    }
    const emailConfirmationFields = userEmailConfirmationToDBMapper({ isConfirmed: false });
    const result = await usersService.updateUser(user.data._id.toString(), {
      ...emailConfirmationFields,
      login: user.data.login,
      email: user.data.email,
    });

    if (isSuccess(result) && emailConfirmationFields.emailConfirmationCode) {
      smtpAdapter
        .sendMail({
          to: user.data.email,
          ...emailTemplates.registrationConfirmation({
            login: user.data.login,
            code: emailConfirmationFields.emailConfirmationCode,
          }),
        })
        .catch((error: unknown) =>
          console.error("Failed to send registration confirmation email (resend)", {
            userId: user.data._id.toString(),
            email: user.data.email,
            error,
          }),
        );
    }

    return result;
  },
};
