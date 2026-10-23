import { z } from "zod";

const DEFAULT_JWE_USSUER = "myapp";
const DEFAULT_ACCESS_TTL_SEC = 10; //sec
const DEFAULT_REFRESH_TTL_SEC = 20; //sec

const secret32 = z
  .string()
  .regex(/^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/, "секрет: ожидается 32 байта в base64url")
  .transform((s) => new Uint8Array(Buffer.from(s, "base64url")));

const kid = z.string().regex(/^[A-Za-z0-9._-]{1,32}$/, "kid: латиница, цифры, . _ -");

const keyEntry = z
  .string()
  .transform((pair) => {
    const i = pair.indexOf(":");
    return { kid: pair.slice(0, i), secret: pair.slice(i + 1) };
  })
  .pipe(z.object({ kid, secret: secret32 }));

const jweKeys = z
  .string()
  .transform((s) =>
    s
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean),
  )
  .pipe(z.array(keyEntry).min(1, "нужен хотя бы один ключ"))
  .refine(
    (list) => new Set(list.map((k) => k.kid)).size === list.length,
    "kid должны быть уникальными",
  )
  .transform((list) => ({
    currentKid: list[0]!.kid,
    keys: new Map(list.map((k) => [k.kid, k.secret])),
  }));

export const jweEnv = z
  .object({
    JWE_KEYS: jweKeys,
    JWE_ISSUER: z.string().default(DEFAULT_JWE_USSUER),
    ACCESS_TTL_SEC: z.number().default(DEFAULT_ACCESS_TTL_SEC),
    REFRESH_TTL_SEC: z.number().default(DEFAULT_REFRESH_TTL_SEC),
  })
  .parse(process.env);
