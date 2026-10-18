import { decodeJwt, JWTPayload, jwtVerify, SignJWT } from "jose";
import { jwtEnv } from "../config/jwt.config";
import { randomUUID } from "node:crypto";

export type JWTUserInfo = {
  isEmailConfirmed: boolean;
  userId: string;
};
type Typ = "access_token" | "refresh_token";
export const JWTAdapter = {
  async createToken(user: JWTUserInfo | { userId: string }, typ: Typ) {
    const ttlTime = typ === "access_token" ? jwtEnv.ACCESS_TTL_SEC : jwtEnv.REFRESH_TTL_SEC;
    const exp = new Date(Date.now() + ttlTime * 1000);
    const token = await new SignJWT(user)
      //Алгоритм и мета данные
      .setProtectedHeader({ alg: "HS256", typ })
      //Строка: о ком токен, обычно id пользователя
      .setSubject(user.userId)
      //С какого момента токен действителен
      .setNotBefore(0)
      .setJti(randomUUID())
      //Когда токен истекает
      .setExpirationTime(exp)
      //Без аргумента — текущее время создания токена
      .setIssuedAt()
      .sign(jwtEnv.JWT_SECRET);
    return { token, exp };
  },
  async getPayloadByToken(token: string, typ: Typ): Promise<JWTUserInfo & JWTPayload> {
    const { payload } = await jwtVerify<JWTUserInfo & (JWTPayload & { exp: number })>(
      token,
      jwtEnv.JWT_SECRET,
      {
        algorithms: ["HS256"],
        typ,
        requiredClaims: ["exp"],
        // clockTolerance: 5,
      },
    );
    return payload;
  },
  //без проверки подписи, можно использовать только со своим токеном
  decodeToken(token: string): JWTPayload & { exp: number } {
    return decodeJwt(token);
  },
};
