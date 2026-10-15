import { jwtVerify, SignJWT } from "jose";
import { jwtEnv } from "../config/jwt.config";

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
      .sign(jwtEnv.JWT_SECRET);
    return token;
  },
  async getPayloadByToken(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify<JWTPayload>(token, jwtEnv.JWT_SECRET, {
      algorithms: ["HS256"],
      typ: "JWT",
    });
    return payload;
  },
};
