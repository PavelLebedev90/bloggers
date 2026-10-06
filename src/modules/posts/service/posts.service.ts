import { postsRepository } from "../repository/posts.repository";
import { PostInputModel } from "../types/posts-input.type";
import { blogsService } from "../../blogs/service/blogs.service";
import { postToDBMapper } from "../mappers/post-to-db.mapper";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";

export const postsService = {
  async createPost(bodyPost: PostInputModel) {
    const blog = await blogsService.getBlog(bodyPost.blogId);
    const post = postToDBMapper(bodyPost, blog);

    const { insertedId } = await postsRepository.createPost({ ...post, createdAt: new Date() });
    return insertedId.toString();
  },
  async updatePost(postId: string, bodyPost: PostInputModel) {
    const blog = await blogsService.getBlog(bodyPost.blogId);

    const post = postToDBMapper(bodyPost, blog);

    const isUpdated = await postsRepository.updatePost(postId, post);
    if (!isUpdated) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("post id", postId));
    }

    return isUpdated;
  },
  async deletePost(postId: string) {
    const isDeleted = await postsRepository.deletePost(postId);
    if (!isDeleted) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("post id", postId));
    }
    return isDeleted;
  },
};
