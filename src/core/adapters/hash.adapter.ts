import { hash, HashOptions, verify, VerifyOptions } from "argon2";

export const hashAdapter = {
  async hash(
    field: string | Buffer<ArrayBufferLike>,
    options?: HashOptions & {
      raw?: boolean;
    },
  ): Promise<string> {
    const passwordHash = await hash(field, options);
    return passwordHash.toString();
  },
  async verify(
    digest: string,
    field: string | Buffer<ArrayBufferLike>,
    options?: VerifyOptions,
  ): Promise<boolean> {
    const isVerify = await verify(digest, field, options);
    return isVerify;
  },
};
