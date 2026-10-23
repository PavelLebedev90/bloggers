import { Response, Request } from "express";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../types/posts-input.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postsService } from "../service/posts.service";
import { sendResult } from "../../../core/utils/formatters/result/send-result.formatter";

export const updatePostHandler = async (
  _req: Request,
  res: Response<
    PostOutputModel | ValidationErrorMessages,
    {
      params: { id: string };
      body: PostInputModel;
    }
  >,
) => {
  const result = await postsService.updatePost(res.locals.params.id, res.locals.body);
  sendResult({ res, result });
};
