import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { ValidationErrorMessages } from "../../../core/types/validation-error.type";
import { PostInputModel } from "../../posts/types/posts-input.type";
import { PostOutputModel } from "../../posts/types/posts-output.type";
import { blogsService } from "../service/blogs.service";
import { postToOutputMapper } from "../../posts/mappers/post-to-output.mapper";

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
  const post = await blogsService.createPostByBlogId({
    ...res.locals.body,
    blogId: res.locals.params.blogId,
  });
  res.status(HttpStatus.Created).send(postToOutputMapper(post));
};
