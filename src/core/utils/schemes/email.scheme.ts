import z from "zod";
import { emailRegex } from "../../consts/regex/regex.const";

export const emailScheme = z.string().trim().max(100).toLowerCase().regex(emailRegex);
