import { decodeJwt, JWTPayload, jwtVerify, SignJWT } from "jose";
import { jwtEnv } from "../config/jwt.config";
import { randomUUID } from "node:crypto";

export enum JWTType {
  ACCESS = "access",
  REFRESH = "refresh",
}

export type JWTUserInfo<T extends JWTType = JWTType.ACCESS> = T extends JWTType.ACCESS
  ? {
      isEmailConfirmed: boolean;
      userId: string;
    }
  : {
      userId: string;
      deviceId: string;
      exp?: number;
      issuedAt?: number;
    };

export const JWTAdapter = {
  async createToken<T extends JWTType>(user: JWTUserInfo<T>, typ: JWTType) {
    const ttlTime = typ === JWTType.ACCESS ? jwtEnv.ACCESS_TTL_SEC : jwtEnv.REFRESH_TTL_SEC;
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
  async getPayloadByToken<T extends JWTType>(
    token: string,
    typ: T,
  ): Promise<JWTUserInfo<T> & JWTPayload> {
    const { payload } = await jwtVerify<JWTUserInfo<T> & (JWTPayload & { exp: number })>(
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
