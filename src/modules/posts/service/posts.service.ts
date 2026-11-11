import { PostsRepository } from "../repository/posts.repository";
import { PostInputModel } from "../types/posts-input.type";
import { postToDBMapper } from "../mappers/post-to-db.mapper";
import {
  failResult,
  isError,
  okResult,
} from "../../../core/utils/formatters/result/result.formatter";
import { Result, ResultErrorStatus, ResultSuccessStatus } from "../../../core/types/result.type";
import { ERROR_MESSAGES } from "../../../core/consts/message/error.message.const";
import { inject, injectable, LazyServiceIdentifier } from "inversify";
import { PostDBModel } from "../types/posts-db.type";
import { WithId } from "mongodb";
import { BlogsService } from "../../blogs/service/blogs.service";
@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(new LazyServiceIdentifier(() => BlogsService)) protected blogsService: BlogsService,
  ) {}
  async getPost(postId: string): Promise<Result<WithId<PostDBModel>>> {
    const post = await this.postsRepository.getPost(postId);
    if (!post) {
      return failResult({
        status: ResultErrorStatus.NotFound,
        extensions: [ERROR_MESSAGES.NotFound("post id", postId)],
      });
    }
    return okResult({
      status: ResultSuccessStatus.Ok,
      data: post,
    });
  }
  async createPost(bodyPost: PostInputModel): Promise<Result<string>> {
    const blog = await this.blogsService.getBlog(bodyPost.blogId);
    if (isError(blog)) {
      return blog;
    }
    const post = postToDBMapper(bodyPost, blog.data);

    const { insertedId } = await this.postsRepository.createPost({
      ...post,
      createdAt: new Date(),
    });
    return okResult({
      status: ResultSuccessStatus.Created,
      data: insertedId.toString(),
    });
  }
  async updatePost(postId: string, bodyPost: PostInputModel): Promise<Result<true>> {
    const blog = await this.blogsService.getBlog(bodyPost.blogId);
    if (isError(blog)) {
      return blog;
    }
    const post = postToDBMapper(bodyPost, blog.data);

    const isUpdated = await this.postsRepository.updatePost(postId, post);
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
  }
  async deletePost(postId: string): Promise<Result<true>> {
    const isDeleted = await this.postsRepository.deletePost(postId);
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
  }
}
