import { verify } from "argon2";
import { config } from "../../../core/config/setup.config";
import { AuthInputModel } from "../types/auth-input.type";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { authQueryRepository } from "../repository/auth-query.repository";
import { JWTService } from "../../../core/services/jwt.service";

export const authService = {
  async getUserByLoginOrEmail(loginOrEmail: string) {
    const user = await authQueryRepository.getUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.unauthorized("credentials", loginOrEmail));
    }
    return user;
  },
  async login(bodyAuth: AuthInputModel) {
    const user = await this.getUserByLoginOrEmail(bodyAuth.loginOrEmail);
    let passwordVerify = false;
    try {
      passwordVerify = await verify(user.passwordHash, bodyAuth.password, {
        secret: config.secretPepper,
      });
    } catch {
      throw new Error("password hash is crashed");
    }
    if (!passwordVerify) {
      throw new AppError(ERROR_MESSAGES.unauthorized("credentials", bodyAuth.loginOrEmail));
    }
    const token = await JWTService.createToken({ userId: user._id.toString() });
    return token;
  },
};
