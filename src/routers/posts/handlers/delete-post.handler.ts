import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { postsService } from "../service/posts.service";

export const deletePostHandler = async (
  _req: Request,
  res: Response<unknown, { params: { id: string } }>,
) => {
  await postsService.deletePost(res.locals.params.id);
  res.sendStatus(HttpStatus.NoContent);
};
