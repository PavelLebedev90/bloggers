import { jwtVerify, SignJWT } from "jose";
import { config } from "../config/setup.config";
import { AppError } from "../middlewares/errors/global-error.middleware";
import { ERROR_MESSAGES } from "../utils/error-formatter/error-messages.formatter";

export const JWTService = {
  async createToken(user: { userId: string }) {
    const token = await new SignJWT(user)
      //Алгоритм и мета данные
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      //Строка: о ком токен, обычно id пользователя
      .setSubject(user.userId)
      //С какого момента токен действителен
      .setNotBefore(0)
      //Когда токен истекает
      .setExpirationTime("5min")
      //Без аргумента — текущее время создания токена
      .setIssuedAt()
      .sign(config.secretJWT);
    return token;
  },
  async getPayloadByToken(token: string): Promise<string> {
    try {
      const { payload } = await jwtVerify(token, config.secretJWT, {
        algorithms: ["HS256"],
        typ: "JWT",
      });
      return payload.userId as string;
    } catch (__e) {
      throw new AppError(ERROR_MESSAGES.unauthorized("credentials", "user"));
    }
  },
};
