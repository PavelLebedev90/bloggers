import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../types/posts-input.type";
import { PostOutputModel } from "../types/posts-output.type";
import { postToOutputMapper } from "../mappers/post-to-output.mapper";
import { postsService } from "../service/posts.service";

export const createPostHandler = async (
  _req: Request,
  res: Response<
    PostOutputModel | ValidationErrorMessages,
    {
      body: PostInputModel;
    }
  >,
) => {
  const newPost = await postsService.createPost(res.locals.body);
  res.status(HttpStatus.Created).send(postToOutputMapper(newPost));
};
