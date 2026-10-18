import { randomUUID } from "node:crypto";
import { decodeProtectedHeader, EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";
import { jweEnv } from "../config/jwe.config";

const ALG = "dir";
const ENC = "A256GCM";
const { currentKid, keys } = jweEnv.JWE_KEYS;
const ISSUER = jweEnv.JWE_ISSUER;

export type KidStatus = "current" | "deprecated";

export class JweKidError extends Error {
  constructor(public readonly reason: "malformed" | "missing" | "unknown") {
    super(`JWE kid: ${reason}`);
  }
}
type Typ = "access_token" | "refresh_token";
/** Создать токен текущим ключом */
export const JWEAdapter = {
  async encryptSession(claims: JWTPayload & { sub: string }, typ: Typ) {
    const ttlTime = typ === "access_token" ? jweEnv.ACCESS_TTL_SEC : jweEnv.REFRESH_TTL_SEC;
    const exp = new Date(Date.now() + ttlTime * 1000);
    const token = await new EncryptJWT(claims)
      .setProtectedHeader({ alg: ALG, enc: ENC, kid: currentKid, typ })
      .setIssuer(ISSUER)
      .setAudience(ISSUER)
      .setIssuedAt()
      .setJti(randomUUID())
      .setExpirationTime(exp)
      .encrypt(keys.get(currentKid)!);
    return {
      token,
      exp,
    };
  },
  /** Проверить kid, расшифровать, проверить claims */
  async decryptSession(token: string, typ: Typ) {
    // 1. Прочитать заголовок без ключа
    let header;
    try {
      header = decodeProtectedHeader(token);
    } catch {
      throw new JweKidError("malformed");
    }

    // 2. Проверить kid
    if (typeof header.kid !== "string") throw new JweKidError("missing");
    const key = keys.get(header.kid);
    if (!key) throw new JweKidError("unknown");

    // 3. Расшифровать именно этим ключом.
    // Если kid в заголовке подменили, расшифровка упадёт: заголовок защищён как AAD.
    const { payload } = await jwtDecrypt(token, key, {
      keyManagementAlgorithms: [ALG],
      contentEncryptionAlgorithms: [ENC],
      typ,
      issuer: ISSUER,
      audience: ISSUER,
      requiredClaims: ["sub", "jti", "exp"],
      // clockTolerance: 5,
    });

    const kidStatus: KidStatus = header.kid === currentKid ? "current" : "deprecated";
    return { payload, kid: header.kid, kidStatus };
  },
  /** Перешифровать текущим ключом, не меняя claims (exp остаётся прежним) */
  async reencrypt(payload: JWTPayload, typ: Typ) {
    return new EncryptJWT(payload)
      .setProtectedHeader({ alg: ALG, enc: ENC, kid: currentKid, typ })
      .encrypt(keys.get(currentKid)!);
  },
};
