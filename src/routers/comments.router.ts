import { Router } from "express";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { bearerAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-authorization.middleware";
import { COMMENTS_ROUTER } from "../modules/comments/const/comments-router-path.const";
import {
  commentParamsScheme,
  commentUpdateScheme,
} from "../modules/comments/middlewares/validation/comments-input-scheme.middleware";
import { CommentsController } from "../modules/comments/controller/comments.controller";
import { container } from "../composition-root";

export const commentsRouter: Router = Router();
const commentsController = container.get(CommentsController);

commentsRouter.get(
  COMMENTS_ROUTER.BY_ID,
  captureErrorValidation(commentParamsScheme),
  commentsController.getComment.bind(commentsController),
);

commentsRouter.put(
  COMMENTS_ROUTER.BY_ID,
  bearerAuthorizationMiddleWare,
  captureErrorValidation(commentParamsScheme.extend(commentUpdateScheme.shape)),
  commentsController.updateComment.bind(commentsController),
);
commentsRouter.delete(
  COMMENTS_ROUTER.BY_ID,
  bearerAuthorizationMiddleWare,
  captureErrorValidation(commentParamsScheme),
  commentsController.deleteComment.bind(commentsController),
);
