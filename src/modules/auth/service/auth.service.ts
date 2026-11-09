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
import { UserDBModel, UserEmailConfirmation } from "../../users/types/users-db.type";
import { randomUUID } from "node:crypto";
import { userToOutputMapper } from "../../users/mappers/user-to-output.mapper";
import { MetaRequest } from "../../../core/helpers/collect-meta-request.helper";

enum EmailConfirmationType {
  CODE = "code",
  RECOVERY_CODE = "recoveryCode",
}

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
    const userResult = await this.checkUserEmailConfirmationCode(
      emailConfirmationCode,
      EmailConfirmationType.CODE,
    );
    if (isError(userResult)) {
      return userResult;
    }
    const isUpdatedUser = await usersService.updateUser(userResult.data._id.toString(), {
      ...userEmailConfirmationToDBMapper({ isConfirmed: true }),
      login: userResult.data.login,
      email: userResult.data.email,
    });
    return isUpdatedUser;
  },
  async registrationEmailResendingAuth(email: string): Promise<Result<true>> {
    const userResult = await this.getUserByLoginOrEmail(email);
    if (isError(userResult)) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.NotFound("email", email)],
      });
    }

    if (userResult.data.emailConfirmationIsConfirmed) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.BadRequest("email")],
      });
    }
    const emailConfirmationFields = userEmailConfirmationToDBMapper({ isConfirmed: false });
    const updatedResult = await this.updateUserEmailConfirmationFields(
      userResult.data,
      emailConfirmationFields,
    );

    if (isSuccess(updatedResult) && emailConfirmationFields.emailConfirmationCode) {
      smtpAdapter
        .sendMail({
          to: userResult.data.email,
          ...emailTemplates.registrationConfirmation({
            login: userResult.data.login,
            code: emailConfirmationFields.emailConfirmationCode,
          }),
        })
        .catch((error: unknown) =>
          console.error("Failed to send registration confirmation email (resend)", {
            userId: userResult.data._id.toString(),
            email: userResult.data.email,
            error,
          }),
        );
    }

    return updatedResult;
  },
  async passwordRecoveryAuth(email: string): Promise<Result<true>> {
    const userResult = await this.getUserByLoginOrEmail(email);
    if (isError(userResult)) {
      return okResult({
        status: ResultSuccessStatus.NoContent,
        data: true,
      });
    }
    const emailConfirmationFields = userEmailConfirmationToDBMapper({ isConfirmed: false });

    const updatedResult = await this.updateUserEmailConfirmationFields(
      userResult.data,
      emailConfirmationFields,
    );

    if (isSuccess(updatedResult) && emailConfirmationFields.emailConfirmationCode) {
      smtpAdapter
        .sendMail({
          to: userResult.data.email,
          ...emailTemplates.passwordRecovery({
            login: userResult.data.login,
            code: emailConfirmationFields.emailConfirmationCode,
          }),
        })
        .catch((error: unknown) =>
          console.error("Failed to send password recovery email (resend)", {
            userId: userResult.data._id.toString(),
            email: userResult.data.email,
            error,
          }),
        );
    }

    return updatedResult;
  },
  async updatePassword(emailConfirmationCode: string, newPassword: string): Promise<Result<true>> {
    const userResult = await this.checkUserEmailConfirmationCode(
      emailConfirmationCode,
      EmailConfirmationType.RECOVERY_CODE,
    );
    if (isError(userResult)) {
      return userResult;
    }
    const passwordHash = await usersService.getPasswordHash(newPassword);
    const isUpdatedUser = await usersService.updateUser<"createdAt">(
      userResult.data._id.toString(),
      {
        ...userEmailConfirmationToDBMapper({ isConfirmed: true }),
        login: userResult.data.login,
        email: userResult.data.email,
        passwordHash: passwordHash.data,
      },
    );
    return isUpdatedUser;
  },
  async composeTokens(
    user: WithId<UserDBModel>,
    deviceId: string,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<Tokens>> {
    try {
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
    } catch (__e) {
      return failResult({
        status: ResultErrorStatus.InternalServerError,
        extensions: [ERROR_MESSAGES.InternalServerError("composeTokens")],
      });
    }
  },
  async getUserByLoginOrEmail(email: string): Promise<Result<WithId<UserDBModel>>> {
    const user = await usersService.getUserByLoginOrEmail({ email });
    if (isError(user)) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("email", email)],
      });
    }
    return user;
  },
  async updateUserEmailConfirmationFields(
    user: WithId<UserDBModel>,
    emailConfirmationFields: UserEmailConfirmation,
  ): Promise<Result<true>> {
    const result = await usersService.updateUser(user._id.toString(), {
      ...emailConfirmationFields,
      login: user.login,
      email: user.email,
    });
    return result;
  },
  async checkUserEmailConfirmationCode(
    emailConfirmationCode: string,
    confirmationType: EmailConfirmationType,
  ): Promise<Result<WithId<UserDBModel>>> {
    const user = await usersService.getUserByEmailConfirmationCode(emailConfirmationCode);
    if (isError(user)) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.BadRequest(confirmationType, emailConfirmationCode)],
      });
    }
    if (user.data.emailConfirmationIsConfirmed) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.NotFound(confirmationType, emailConfirmationCode)],
      });
    }
    const now = new Date();
    if (
      user.data.emailConfirmationExpirationDate &&
      user.data.emailConfirmationExpirationDate.getTime() < now.getTime()
    ) {
      return failResult({
        status: ResultErrorStatus.BadRequest,
        extensions: [ERROR_MESSAGES.NotFound(confirmationType, emailConfirmationCode)],
      });
    }
    return user;
  },
};
