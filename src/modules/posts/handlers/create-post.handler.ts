import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../types/posts-input.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postsService } from "../service/posts.service";
import { postsQueryRepository } from "../repository/posts-query.repository";
import { isError } from "../../../core/utils/formatters/result/result.formatter";
import { sendError, sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const createPostHandler = async (
  _req: Request,
  res: Response<
    PostOutputModel | ValidationErrorMessages,
    {
      body: PostInputModel;
    }
  >,
) => {
  const resultWithPostId = await postsService.createPost(res.locals.body);
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
