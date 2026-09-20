import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostUpdateModel } from "../types/posts-input.type";
import { PostResponseModel } from "../types/posts-output.type";
import { postsRepository } from "../repository/posts.repository";
import { blogsRepository } from "../../blogs/repository/blogs.repository";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../consts/error-messages.const";

export const updatePostHandler = (
  req: Request<{ id: string }, unknown, PostUpdateModel>,
  res: Response<PostResponseModel | ValidationErrorMessages>,
) => {
  const blog = blogsRepository.getBlog(req.body.blogId);
  if (!blog) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("blogId", "blog")],
    });
  }

  const isUpdated = postsRepository.updatePost(req.params.id, req.body, blog);

  if (!isUpdated) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("id", "post")],
    });
  }

  res.sendStatus(HttpStatus.NoContent);
};
