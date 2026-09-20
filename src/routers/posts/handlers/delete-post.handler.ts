import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { postsRepository } from "../repository/posts.repository";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error-messages.const";

export const deletePostHandler = (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = postsRepository.deletePost(req.params.id);
  if (!isDeleted) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("id", "post")],
    });
  }

  res.sendStatus(HttpStatus.NoContent);
};
