import { injectable } from "inversify";
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  rateLimitsCollection,
  securityDevicesCollection,
  usersCollection,
} from "../../../db/collections";
@injectable()
export class TestingRepository {
  async clearDB() {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await securityDevicesCollection.deleteMany({});
    await rateLimitsCollection.deleteMany({});
  }
}
