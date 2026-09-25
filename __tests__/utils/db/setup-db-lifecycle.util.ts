import request from "supertest";
import { app } from "../../consts/express.const";
import { client, runDB } from "../../../src/db/mongo.db";
import { config } from "../../../src/core/config/setup.config";
import { TESTING_ALL_DATA } from "../../../src/routers/testing/consts/testing-router-path.const";

export function setupDbLifecycle() {
  beforeAll(async () => {
    await runDB(config.mongodbUrl);
  }, 20000);

  afterEach(async () => {
    await request(app).delete(TESTING_ALL_DATA);
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });
}
