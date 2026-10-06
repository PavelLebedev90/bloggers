import { Router } from "express";
import { baseAuthorizationMiddleWare } from "../core/middlewares/auth/base-authorization.middleware";

import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { getAllUsersHandler } from "../modules/users/handlers/get-all-users.handler";
import { createUserHandler } from "../modules/users/handlers/create-user.handler";
import { deleteUserHandler } from "../modules/users/handlers/delete-user.handler";
import { USERS_ROUTER } from "../modules/users/const/users-router-path.const";
import {
  userCreateScheme,
  userParamsScheme,
  userQueryScheme,
} from "../modules/users/middlewares/validation/users-input-scheme.middleware";

export const usersRouter: Router = Router();

usersRouter.get(
  USERS_ROUTER.BASE,
  baseAuthorizationMiddleWare,
  captureErrorValidation(userQueryScheme),
  getAllUsersHandler,
);

usersRouter.post(
  USERS_ROUTER.BASE,
  baseAuthorizationMiddleWare,
  captureErrorValidation(userCreateScheme),
  createUserHandler,
);

usersRouter.delete(
  USERS_ROUTER.BY_ID,
  baseAuthorizationMiddleWare,
  captureErrorValidation(userParamsScheme),
  deleteUserHandler,
);
