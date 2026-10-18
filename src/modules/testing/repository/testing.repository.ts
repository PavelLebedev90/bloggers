import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  tokenBlackListCollection,
  usersCollection,
} from "../../../db/collections";

export const testingRepository = {
  async clearDB() {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await tokenBlackListCollection.deleteMany({});
  },
};
