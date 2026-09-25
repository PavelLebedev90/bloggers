import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../types/posts-input.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postsRepository } from "../repository/posts.repository";
import { blogsRepository } from "../../blogs/repository/blogs.repository";
import { errorMessage } from "../../../core/utils/error-formatter/error-messages.formatter";
import { ERROR_MESSAGES } from "../../../core/consts/error-messages.const";
import { postToDBMapper } from "../mappers/post-to-db.mapper";
import { postToOutputMapper } from "../mappers/post-to-output.mapper";

export const createPostHandler = async (
  req: Request<unknown, unknown, PostInputModel>,
  res: Response<PostOutputModel | ValidationErrorMessages>,
) => {
  const blog = await blogsRepository.getBlog(req.body.blogId);
  if (!blog) {
    return errorMessage({
      res,
      httpStatus: HttpStatus.NotFound,
      errors: [ERROR_MESSAGES.notFoundMessage("blogId", "blog")],
    });
  }
  const bodyPost = postToDBMapper(req.body, blog);

  const newPost = await postsRepository.createPost({ ...bodyPost, createdAt: new Date() });
  res.status(HttpStatus.Created).send(postToOutputMapper(newPost));
};
