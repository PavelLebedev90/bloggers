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

/** Создать токен текущим ключом */
export const JWEService = {
  async encryptSession(claims: JWTPayload & { sub: string }, expiresIn = "15m") {
    return new EncryptJWT(claims)
      .setProtectedHeader({ alg: ALG, enc: ENC, kid: currentKid })
      .setIssuer(ISSUER)
      .setAudience(ISSUER)
      .setIssuedAt()
      .setJti(randomUUID())
      .setExpirationTime(expiresIn)
      .encrypt(keys.get(currentKid)!);
  },
  /** Проверить kid, расшифровать, проверить claims */
  async decryptSession(token: string) {
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
      issuer: ISSUER,
      audience: ISSUER,
      requiredClaims: ["sub", "jti", "exp"],
      clockTolerance: 5,
    });

    const kidStatus: KidStatus = header.kid === currentKid ? "current" : "deprecated";
    return { payload, kid: header.kid, kidStatus };
  },
  /** Перешифровать текущим ключом, не меняя claims (exp остаётся прежним) */
  async reencrypt(payload: JWTPayload) {
    return new EncryptJWT(payload)
      .setProtectedHeader({ alg: ALG, enc: ENC, kid: currentKid })
      .encrypt(keys.get(currentKid)!);
  },
};
