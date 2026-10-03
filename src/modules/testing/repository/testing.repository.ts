import { blogsCollection, postsCollection } from "../../../db/collections";

export const testingRepository = {
  async clearDB() {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
  },
};
