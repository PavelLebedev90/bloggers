import { BlogDBModel } from "../types/blogs-db.type";
import { blogsRepository } from "../repository/blogs.repository";
import { postsService } from "../../posts/service/posts.service";
import { PostInputModel } from "../../posts/types/posts-input.type";
import { failResult, okResult } from "../../../core/utils/formatters/result/result.formatter";
import {
  Result,
  ResultErrorStatus,
  ResultSuccessStatus,
} from "../../../core/types/validation-error.type";
import { ERROR_MESSAGES } from "../../../core/consts/error.messages.const";
import { WithId } from "mongodb";

export const blogsService = {
  async getBlog(blogId: string): Promise<Result<WithId<BlogDBModel>>> {
    const blog = await blogsRepository.getBlog(blogId);

    if (!blog) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("blog id", blogId)],
      });
    }
    return okResult({ status: ResultSuccessStatus.Ok, data: blog });
  },
  async createBlog(bodyBlog: BlogDBModel): Promise<Result<string>> {
    const { insertedId } = await blogsRepository.createBlog(bodyBlog);
    return okResult({
      status: ResultSuccessStatus.Created,
      data: insertedId.toString(),
    });
  },
  async createPostByBlogId(bodyPost: PostInputModel): Promise<Result<string>> {
    return await postsService.createPost(bodyPost);
  },
  async updateBlog(
    blogId: string,
    bodyBlog: Omit<BlogDBModel, "createdAt" | "isMembership">,
  ): Promise<Result<true>> {
    const isUpdated = await blogsRepository.updateBlog(blogId, bodyBlog);
    if (!isUpdated) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("blog id", blogId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isUpdated,
    });
  },
  async deleteBlog(blogId: string): Promise<Result<true>> {
    const isDeleted = await blogsRepository.deleteBlog(blogId);
    if (!isDeleted) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("blog id", blogId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.NoContent,
      data: isDeleted,
    });
  },
};
