import { postsCollection } from "../../../db/collections";
import { Filter, ObjectId } from "mongodb";
import { PostDBModel } from "../types/posts-db.type";
import { PostQueryInputModel } from "../types/posts-query-input.type";
import { ERROR_MESSAGES } from "../../../core/utils/error-formatter/error-messages.formatter";
import { AppError } from "../../../core/middlewares/errors/global-error.middleware";

export const postsQueryRepository = {
  async getAll(query: PostQueryInputModel) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const filter: Filter<PostDBModel> = {};
    if (query.blogId) {
      filter.blogId = query.blogId;
    }
    const [items, totalCount] = await Promise.all([
      postsCollection
        .find(filter)
        .sort(query.sortBy, query.sortDirection)
        .skip(skip)
        .limit(query.pageSize)
        .toArray(),
      postsCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },
  async getPost(postId: string) {
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      throw new AppError(ERROR_MESSAGES.notFoundMessage("post id", postId));
    }
    return post;
  },
};
