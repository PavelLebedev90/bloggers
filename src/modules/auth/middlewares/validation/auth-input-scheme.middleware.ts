import { z } from "zod";
import { loginScheme } from "../../../../core/utils/schemes/login-scheme";
import { emailScheme } from "../../../../core/utils/schemes/email.scheme";

export const authScheme = z.object({
  body: z.object({
    loginOrEmail: loginScheme.or(emailScheme),
    password: z.string().trim().min(6).max(20),
  }),
});
