import express from "express";

import { UserZodValidation } from "./User.ZodValidation";
import { USER_ROLE } from "./User.const";

import { userController } from "./User.Controller";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import validationMiddleWare from "../../middleware/validationMiddleWare";
const router = express.Router();

router.put(
  "/profile-update/:userId",
  authMiddleWare(USER_ROLE.admin, USER_ROLE.user),
  validationMiddleWare(UserZodValidation.userUpdateValidationSchemaZod),
  userController.updateProfile
);
router.get(
  "/:userId",
  authMiddleWare(USER_ROLE.admin, USER_ROLE.user),
  userController.getSingleUser
);
router.get("/", authMiddleWare(USER_ROLE.admin), userController.findAllUser);

export const userRoutes = router;
