import { verify } from "argon2";
import { config } from "../../../core/config/setup.config";
import { AuthInputModel } from "../types/auth-input.type";
import { authRepository } from "../repository/auth.repository";
import { JWTService } from "../../../core/services/jwt.service";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
} from "../../../core/types/validation-error.type";
import { WithId } from "mongodb";
import { UserDBModel } from "../../users/types/users-db.type";
import { ERROR_MESSAGES } from "../../../core/consts/error.messages.const";
import {
  failResult,
  isSuccess,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";
import { JWEService } from "../../../core/services/jwe.service";
import { userToOutputMapper } from "../../users/mappers/user-to-output.mapper";

export const authService = {
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<Result<WithId<UserDBModel>>> {
    const user = await authRepository.getUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return failResult({
        status: ResultErrorStatus.Unauthorized,
        extensions: [ERROR_MESSAGES.Unauthorized("loginOrEmail", loginOrEmail)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: user,
    });
  },
  async login(
    bodyAuth: AuthInputModel,
    mode: "jwt" | "jwe" = "jwt",
  ): Promise<Result<{ token: string }>> {
    const result = await this.getUserByLoginOrEmail(bodyAuth.loginOrEmail);
    if (isSuccess(result)) {
      try {
        const passwordVerify = await verify(result.data.passwordHash, bodyAuth.password, {
          secret: config.secretPepper,
        });
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
        const token = await JWTService.createToken({ userId: result.data._id.toString() });
        return okResult({
          status: ResultSuccessStatus.Ok,
          data: { token },
        });
      } else {
        const token = await JWEService.encryptSession({
          user: userToOutputMapper(result.data),
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
};
