import express from "express";

import { authZodValidation } from "./Auth.ZodValidation";
import { authController } from "./Auth.controller";
import { UserZodValidation } from "../User/User.ZodValidation";
import validationMiddleWare from "../../middleware/validationMiddleWare";


const router = express.Router();

router.post(
  "/signup",
  validationMiddleWare(UserZodValidation.userCreateValidationSchemaZod),
  authController.singUp
);

router.post(
  "/signin",
  validationMiddleWare(authZodValidation.signInValidationSchemaZod),
  authController.signIn
);
// router.post(
//   "/password-change",
//   validationMiddleWare(authZodValidation.changePasswordValidationSchemaZod),
//   authController.changePassword
// );
// router.post(
//   "/forget-password",
//   validationMiddleWare(authZodValidation.forgetPasswordSchemaZod),
//   authController.forgetPassword
// );
// router.post(
//   "/refresh-token",
//   validationMiddleWare(authZodValidation.refreshTokenValidationSchemaZod),
//   authController.refreshToken
// );

export const authRoutes = router;
