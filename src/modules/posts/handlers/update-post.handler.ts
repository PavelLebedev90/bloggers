import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../types/posts-input.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postsService } from "../service/posts.service";

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
  await postsService.updatePost(res.locals.params.id, res.locals.body);
  res.sendStatus(HttpStatus.NoContent);
};
