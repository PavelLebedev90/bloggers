import { WithId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";
import { postsRepository } from "../repository/posts.repository";
import { PostInputModel } from "../types/posts-input.type";
import { blogsService } from "../../blogs/service/blogs.service";
import { postToDBMapper } from "../mappers/post-to-db.mapper";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";
import { PostQueryInputModel } from "../types/posts-query-input.type";

export const postsService = {
  async getAll(query: PostQueryInputModel) {
    return await postsRepository.getAll(query);
  },
  async getPost(postId: string) {
    const post = await postsRepository.getPost(postId);
    if (!post) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("post id", postId));
    }
    return post;
  },
  async createPost(bodyPost: PostInputModel): Promise<WithId<PostDBModel>> {
    const blog = await blogsService.getBlog(bodyPost.blogId);
    const post = postToDBMapper(bodyPost, blog);

    const { insertedId } = await postsRepository.createPost({ ...post, createdAt: new Date() });
    const newPost = await this.getPost(insertedId.toString());
    return newPost;
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
