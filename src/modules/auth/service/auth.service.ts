import { hashEnv } from "../../../core/config/hash.config";
import { AuthInputModel } from "../types/auth-input.type";
import { JWTAdapter, JWTType } from "../../../core/adapters/jwt.adapter";

import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import {
  failResult,
  isError,
  isSuccess,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";
import { JWEAdapter, JWEType } from "../../../core/adapters/jwe.adapter";
import { usersService } from "../../users/service/users.service";
import { hashAdapter } from "../../../core/adapters/hash.adapter";
import { UserInputModel } from "../../users/types/users-input.type";
import { userEmailConfirmationToDBMapper } from "../../users/mappers/user-email-confirmation.mapper";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { smtpAdapter } from "../../../core/adapters/smtp.adapter";
import { emailTemplates } from "../../../core/mailer/email-templates";
import { Tokens } from "../mappers/auth-to-output.mapper";
import { securityDevicesService } from "../../securityDevices/service/securityDevices.service";
import { WithId } from "mongodb";
import { UserDBModel } from "../../users/types/users-db.type";
import { randomUUID } from "node:crypto";
import { userToOutputMapper } from "../../users/mappers/user-to-output.mapper";
import { MetaRequest } from "../../../core/helpers/collect-meta-request.helper";

export const authService = {
  async login(
    bodyAuth: AuthInputModel,
    meta: MetaRequest,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<Tokens>> {
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
      const deviceId = randomUUID();
      const tokens = await this.composeTokens(result.data, deviceId, mode);
      if (isSuccess(tokens)) {
        const session = securityDevicesService.collectSessionInfo({
          ip: meta.ip,
          userAgent: meta.userAgent,
          userId: result.data._id.toString(),
          exp: tokens.data.refreshToken.exp,
          deviceId,
        });
        await securityDevicesService.createSession(session);
      }
      return tokens;
    } else {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("loginOrEmail", bodyAuth.loginOrEmail)],
      });
    }
  },
  async logout(deviceId: string, userId: string): Promise<Result<true>> {
    const isDeleted = await securityDevicesService.deleteSessionByDeviceId(deviceId, userId);
    if (isError(isDeleted)) {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("deviceId")],
      });
    }
    return isDeleted;
  },
  async refreshToken(
    deviceId: string,
    userId: string,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<Tokens>> {
    const userFromDB = await usersService.getUser(userId);
    const currentSession = await securityDevicesService.getSessionByDeviceId(deviceId);
    if (isError(userFromDB) || isError(currentSession)) {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("userId | deviceId")],
      });
    }

    const tokens = await this.composeTokens(userFromDB.data, currentSession.data.deviceId, mode);
    if (isSuccess(tokens)) {
      const session = securityDevicesService.collectSessionInfo({
        deviceId: currentSession.data.deviceId,
        ip: currentSession.data.ip,
        userAgent: currentSession.data.title,
        userId: userFromDB.data._id.toString(),
        exp: tokens.data.refreshToken.exp,
      });
      const updatedResult = await securityDevicesService.updateSession(session);
      if (!updatedResult.data) {
        return failResult({
          status: ResultErrorStatus.Unauthorized,
          extensions: [ERROR_MESSAGES.Unauthorized("device id", session.deviceId)],
        });
      }
    }

    return tokens;
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
    deviceId: string,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<Tokens>> {
    if (mode === "jwt") {
      const accessToken = await JWTAdapter.createToken(
        {
          userId: user._id.toString(),
          isEmailConfirmed: user.emailConfirmationIsConfirmed,
        },
        JWTType.ACCESS,
      );
      const refreshToken = await JWTAdapter.createToken(
        {
          userId: user._id.toString(),
          deviceId,
        },
        JWTType.REFRESH,
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
          user: userToOutputMapper(user),
          sub: user._id.toString(),
        },
        JWEType.ACCESS,
      );
      const refreshToken = await JWEAdapter.encryptSession(
        {
          user: userToOutputMapper(user),
          sub: user._id.toString(),
        },
        JWEType.REFRESH,
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
