import { BlogDBModel } from "../types/blogs-db.type";
import { blogsRepository } from "../repository/blogs.repository";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { postsService } from "../../posts/service/posts.service";
import { PostInputModel } from "../../posts/types/posts-input.type";

export const blogsService = {
  // async getAll(query: BlogQueryInputModel) {
  //   return await blogsRepository.getAll(query);
  // },
  async getBlog(blogId: string) {
    const blog = await blogsRepository.getBlog(blogId);

    if (!blog) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("blog id", blogId));
    }
    return blog;
  },
  // async getAllPostsByBlogId(query: Required<PostQueryInputModel>) {
  //   await this.getBlog(query.blogId);
  //   return await postsService.getAll(query);
  // },
  async createBlog(bodyBlog: BlogDBModel) {
    const { insertedId } = await blogsRepository.createBlog(bodyBlog);
    return insertedId.toString();
  },
  async createPostByBlogId(bodyPost: PostInputModel) {
    return await postsService.createPost(bodyPost);
  },
  async updateBlog(blogId: string, bodyBlog: Omit<BlogDBModel, "createdAt" | "isMembership">) {
    const isUpdated = await blogsRepository.updateBlog(blogId, bodyBlog);
    if (!isUpdated) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("blog id", blogId));
    }
    return isUpdated;
  },
  async deleteBlog(blogId: string) {
    const isDeleted = await blogsRepository.deleteBlog(blogId);
    if (!isDeleted) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("blog id ", blogId));
    }
    return isDeleted;
  },
};
