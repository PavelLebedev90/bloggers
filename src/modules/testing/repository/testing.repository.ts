import { blogsCollection, postsCollection, usersCollection } from "../../../db/collections";

export const testingRepository = {
  async clearDB() {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
  },
};
