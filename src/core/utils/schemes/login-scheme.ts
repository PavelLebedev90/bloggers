import z from "zod";
import { loginRegex } from "../../consts/regex/regex.const";

export const loginScheme = z.string().trim().min(3).max(10).toLowerCase().regex(loginRegex);
