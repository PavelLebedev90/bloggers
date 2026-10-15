import { jwtVerify, SignJWT } from "jose";
import { config } from "../config/setup.config";

export type JWTPayload = {
  isEmailConfirmed: boolean;
  userId: string;
};

export const JWTAdapter = {
  async createToken(user: JWTPayload) {
    const token = await new SignJWT(user)
      //Алгоритм и мета данные
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      //Строка: о ком токен, обычно id пользователя
      .setSubject(user.userId)
      //С какого момента токен действителен
      .setNotBefore(0)
      //Когда токен истекает
      .setExpirationTime("1d")
      //Без аргумента — текущее время создания токена
      .setIssuedAt()
      .sign(config.secretJWT);
    return token;
  },
  async getPayloadByToken(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify<JWTPayload>(token, config.secretJWT, {
      algorithms: ["HS256"],
      typ: "JWT",
    });
    return payload;
  },
};
