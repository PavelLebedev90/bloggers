import { ObjectId } from "mongodb";
import { commentsCollection } from "../../../db/collections";
import { CommentInputModel } from "../types/comments-input.type";
import { CommentDBModel } from "../types/comments-db.type";

export const commentsRepository = {
  async getComment(commentId: string) {
    return await commentsCollection.findOne({ _id: new ObjectId(commentId) });
  },
  async createComment(bodyComment: CommentDBModel) {
    return await commentsCollection.insertOne(bodyComment);
  },
  async updateComment(commentId: string, bodyComment: CommentInputModel) {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: bodyComment },
    );
    return result.matchedCount === 1;
  },
  async deleteComment(commentId: string) {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(commentId) });
    return result.deletedCount === 1;
  },
};
