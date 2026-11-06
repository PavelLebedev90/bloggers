import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  securityDevicesCollection,
  usersCollection,
} from "../../../db/collections";

export const testingRepository = {
  async clearDB() {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await securityDevicesCollection.deleteMany({});
  },
};
