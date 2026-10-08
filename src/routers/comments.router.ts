import { Router } from "express";
import { captureErrorValidation } from "../core/middlewares/validation/capture-error-validation.middleware";
import { bearerAuthorizationMiddleWare } from "../core/middlewares/auth/bearer-authorization.middleware";
import { COMMENTS_ROUTER } from "../modules/comments/const/comments-router-path.const";
import { getCommentHandler } from "../modules/comments/handlers/get-comment.handler";
import {
  commentParamsScheme,
  commentUpdateScheme,
} from "../modules/comments/middlewares/validation/comments-input-scheme.middleware";
import { updateCommentHandler } from "../modules/comments/handlers/update-comment.handler";
import { deleteCommentHandler } from "../modules/comments/handlers/delete-comment.handler";

export const commentsRouter: Router = Router();

commentsRouter.get(
  COMMENTS_ROUTER.BY_ID,
  captureErrorValidation(commentParamsScheme),
  getCommentHandler,
);

commentsRouter.put(
  COMMENTS_ROUTER.BY_ID,
  bearerAuthorizationMiddleWare,
  captureErrorValidation(commentParamsScheme.extend(commentUpdateScheme.shape)),
  updateCommentHandler,
);
commentsRouter.delete(
  COMMENTS_ROUTER.BY_ID,
  bearerAuthorizationMiddleWare,
  captureErrorValidation(commentParamsScheme),
  deleteCommentHandler,
);
