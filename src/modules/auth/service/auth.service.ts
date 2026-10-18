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
import { Tokens } from "../mappers/auth-to-output.mapper";
import { tokenBlackListService } from "../../tokenBlackList/service/tokenBlackList.service";
import { WithId } from "mongodb";
import { UserDBModel } from "../../users/types/users-db.type";
import { TokenBlackList } from "../../tokenBlackList/types/tokenBlackList-db";

export const authService = {
  async login(bodyAuth: AuthInputModel, mode: "jwt" | "jwe" = "jwt"): Promise<Result<Tokens>> {
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
      return await this.composeTokens(result.data, mode);
    } else {
      return result;
    }
  },
  async logout(
    refreshToken: string,
    exp: number,
    user: WithId<UserDBModel>,
  ): Promise<Result<string>> {
    const resultIsBlack = await tokenBlackListService.getBlackTokenByTOken(refreshToken);
    if (!!resultIsBlack.data) {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("jwt")],
      });
    }
    const blackList: TokenBlackList = {
      createdAt: new Date(),
      expiresAt: new Date(exp * 1000),
      token: refreshToken,
      userId: user._id.toString(),
    };
    const result = await tokenBlackListService.create(blackList);
    return result;
  },
  async refreshToken(
    refreshToken: string,
    exp: number,
    user: WithId<UserDBModel>,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<Tokens>> {
    const resultIsBlack = await tokenBlackListService.getBlackTokenByTOken(refreshToken);
    if (!!resultIsBlack.data) {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("token")],
      });
    }

    const blackList: TokenBlackList = {
      createdAt: new Date(),
      expiresAt: new Date(exp * 1000),
      token: refreshToken,
      userId: user._id.toString(),
    };
    const result = await tokenBlackListService.create(blackList);
    if (isError(result)) {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("token")],
      });
    }
    return await this.composeTokens(user, mode);
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
  async composeTokens(
    user: WithId<UserDBModel>,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<Tokens>> {
    if (mode === "jwt") {
      const accessToken = await JWTAdapter.createToken(
        {
          userId: user._id.toString(),
          isEmailConfirmed: user.emailConfirmationIsConfirmed,
        },
        "access_token",
      );
      const refreshToken = await JWTAdapter.createToken(
        {
          userId: user._id.toString(),
        },
        "refresh_token",
      );

      return okResult({
        status: ResultSuccessStatus.Ok,
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      const accessToken = await JWEAdapter.encryptSession(
        {
          user,
          sub: user._id.toString(),
        },
        "access_token",
      );
      const refreshToken = await JWEAdapter.encryptSession(
        {
          user,
          sub: user._id.toString(),
        },
        "refresh_token",
      );
      return okResult({
        status: ResultSuccessStatus.Ok,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
  },
};
