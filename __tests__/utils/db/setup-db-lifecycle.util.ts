import { MongoMemoryServer } from "mongodb-memory-server";
import { Db, MongoClient } from "mongodb";
import { ensureIndexes, initCollections } from "../../../src/db/collections";
import os from "node:os";

export function setupDbLifecycle() {
  let mongod: MongoMemoryServer, client: MongoClient, db: Db;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    client = await MongoClient.connect(mongod.getUri(), {
      runtimeAdapters: { os },
    });
    db = client.db("test");
    initCollections(db);
    await ensureIndexes();
  }, 120_000);

  afterEach(async () => {
    const collections = await db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
    if (mongod) {
      await mongod.stop();
    }
  });
}
