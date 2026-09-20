import { db } from "../../../db/db-bloggers";

export const testingRepository = {
  clearDB() {
    db.blogs = [];
    db.posts = [];
  },
};
