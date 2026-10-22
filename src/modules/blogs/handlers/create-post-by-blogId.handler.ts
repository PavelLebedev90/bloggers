import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../../posts/types/posts-input.type";
import { PostOutputModel } from "../../posts/types/posts-output.type";
import { blogsService } from "../service/blogs.service";
import { postsQueryRepository } from "../../posts/repository/posts-query.repository";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const createPostByBlogIdHandler = async (
  _req: Request,
  res: Response<
    PostOutputModel | ValidationErrorMessages,
    {
      body: Omit<PostInputModel, "blogId">;
      params: { blogId: string };
    }
  >,
) => {
  const resultWithPostId = await blogsService.createPostByBlogId({
    ...res.locals.body,
    blogId: res.locals.params.blogId,
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
