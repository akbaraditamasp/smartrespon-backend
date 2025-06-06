import { password } from "bun";
import { z } from "zod";
import { email } from "zod/v4";
import { entityTransform } from "./general";
import User from "@app-entities/user";
import Admin from "@app-entities/admin";

export const publicRegisterValidation = z.object({
  fullname: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
});

export const publicLoginValidation = z.object({
  email: z
    .string()
    .email()
    .nonempty()
    .transform(entityTransform(User, "email")),
  password: z.string().nonempty(),
});

export const adminLoginValidation = z.object({
  email: z
    .string()
    .email()
    .nonempty()
    .transform(entityTransform(Admin, "email")),
  password: z.string().nonempty(),
});
