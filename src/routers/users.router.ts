import { Router } from "express";
import { baseAuthorizationMiddleWare } from "../core/middlewares/auth/base-authorization.middleware";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { USERS_ROUTER } from "../modules/users/const/users-router-path.const";
import {
  userCreateScheme,
  userParamsScheme,
  userQueryScheme,
} from "../modules/users/middlewares/validation/users-input-scheme.middleware";
import { UsersController } from "../modules/users/controller/users.controller";
import { container } from "../composition-root";

export const usersRouter: Router = Router();
const usersController = container.get(UsersController);
usersRouter.use(baseAuthorizationMiddleWare);

usersRouter.get(
  USERS_ROUTER.BASE,
  captureErrorValidation(userQueryScheme),
  usersController.getAllUsers.bind(usersController),
);
usersRouter.post(
  USERS_ROUTER.BASE,
  captureErrorValidation(userCreateScheme),
  usersController.createUser.bind(usersController),
);
usersRouter.delete(
  USERS_ROUTER.BY_ID,
  captureErrorValidation(userParamsScheme),
  usersController.deleteUser.bind(usersController),
);
