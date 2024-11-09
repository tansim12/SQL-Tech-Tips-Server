import { z } from "zod";

const signInValidationSchemaZod = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: "Email must be a valid email" })
      .nonempty({ message: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const changePasswordValidationSchemaZod = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: "Email must be a valid email" })
      .nonempty({ message: "Email is required" }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});
const forgetPasswordSchemaZod = z.object({
  body: z.object({
    id: z.string({ required_error: "Id should be string" }),
  }),
});

const refreshTokenValidationSchemaZod = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const authZodValidation = {
  signInValidationSchemaZod,
  refreshTokenValidationSchemaZod,
  changePasswordValidationSchemaZod,
  forgetPasswordSchemaZod,
};
