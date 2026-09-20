import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { PostResponseModel } from "../types/posts-output.type";
import { postsRepository } from "../repository/posts.repository";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error-messages.const";

export const getPostHandler = (req: Request<{ id: string }>, res: Response<PostResponseModel>) => {
  const dbPost = postsRepository.getPost(req.params.id);

  if (!dbPost) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("id", "post")],
    });
  }
  res.status(HttpStatus.Ok).send(dbPost);
};
