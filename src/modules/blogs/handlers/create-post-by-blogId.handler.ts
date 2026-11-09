import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../../posts/types/posts-input.type";
import { PostOutputModel } from "../../posts/types/posts-output.type";
import { blogsService } from "../service/blogs.service";
import { postsQueryRepository } from "../../posts/repository/posts-query.repository";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";
import { SanitizedRequest } from "../../../core/types/express.type";

export const createPostByBlogIdHandler = async (
  req: SanitizedRequest<Omit<PostInputModel, "blogId">, unknown, { blogId: string }>,
  res: Response<PostOutputModel | ValidationErrorMessages>,
) => {
  const resultWithPostId = await blogsService.createPostByBlogId({
    ...req.validData.body,
    blogId: req.validData.params.blogId,
  });
  if (isError(resultWithPostId)) {
    return sendError({
      res,
      httpStatus: HttpStatus[resultWithPostId.status],
      errors: resultWithPostId.extensions,
    });
  }
  const result = await postsQueryRepository.getPost(resultWithPostId.data);
  sendResult({ res, result, overwriteSuccessStatus: resultWithPostId.status });
};
