import { postsRepository } from "../repository/posts.repository";
import { PostInputModel } from "../types/posts-input.type";
import { blogsService } from "../../blogs/service/blogs.service";
import { postToDBMapper } from "../mappers/post-to-db.mapper";
import {
  failResult,
  isError,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
} from "../../../core/types/validation-error.type";
import { ERROR_MESSAGES } from "../../../core/consts/error.messages.const";

export const postsService = {
  async createPost(bodyPost: PostInputModel): Promise<Result<string>> {
    const blog = await blogsService.getBlog(bodyPost.blogId);
    if (isError(blog)) {
      return blog;
    }
    const post = postToDBMapper(bodyPost, blog.data);

    const { insertedId } = await postsRepository.createPost({ ...post, createdAt: new Date() });
    return okResult({
      status: ResultSuccessStatus.Created,
      data: insertedId.toString(),
    });
  },
  async updatePost(postId: string, bodyPost: PostInputModel): Promise<Result<true>> {
    const blog = await blogsService.getBlog(bodyPost.blogId);
    if (isError(blog)) {
      return blog;
    }
    const post = postToDBMapper(bodyPost, blog.data);

    const isUpdated = await postsRepository.updatePost(postId, post);
    if (!isUpdated) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("post id", postId)],
      });
    }

    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isUpdated,
    });
  },
  async deletePost(postId: string): Promise<Result<true>> {
    const isDeleted = await postsRepository.deletePost(postId);
    if (!isDeleted) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("post id", postId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isDeleted,
    });
  },
};
