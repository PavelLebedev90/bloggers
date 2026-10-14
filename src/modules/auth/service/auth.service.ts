import { config } from "../../../core/config/setup.config";
import { AuthInputModel } from "../types/auth-input.type";
import { JWTAdapter } from "../../../core/adapters/jwt.adapter";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
} from "../../../core/types/validation-error.type";
import { ERROR_MESSAGES } from "../../../core/consts/error.messages.const";
import {
  failResult,
  isSuccess,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";
import { JWEAdapter } from "../../../core/adapters/jwe.adapter";
import { userToOutputMapper } from "../../users/mappers/user-to-output.mapper";
import { usersService } from "../../users/service/users.service";
import { hashAdapter } from "../../../core/adapters/hash.adapter";

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
        const token = await JWTAdapter.createToken({ userId: result.data._id.toString() });
        return okResult({
          status: ResultSuccessStatus.Ok,
          data: { token },
        });
      } else {
        const token = await JWEAdapter.encryptSession({
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
