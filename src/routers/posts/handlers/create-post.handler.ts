import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostCreateModel } from "../types/posts-input.type";
import { PostResponseModel } from "../types/posts-output.type";
import { postsRepository } from "../repository/posts.repository";
import { blogsRepository } from "../../blogs/repository/blogs.repository";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../consts/error-messages.const";

export const createPostHandler = (
  req: Request<unknown, unknown, PostCreateModel>,
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
  const newPost = postsRepository.createPost(req.body, blog);
  res.status(HttpStatus.Created).send(newPost);
};
