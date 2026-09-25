import { Db, MongoClient } from "mongodb";
import os from "node:os";
import { initCollections } from "./collections";
import { config } from "../core/config/setup.config";

export let client: MongoClient;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url, { runtimeAdapters: { os } });
  const db: Db = client.db(config.mongodbName);
  initCollections(db);

  try {
    await client.connect();

    await db.command({ ping: 1 });
    console.log("✅ Environment", url, config.mongodbName);
    console.log("✅ Connected to the database");
  } catch (e: unknown) {
    if (client) {
      await client.close();
    }
    throw new Error(`❌ Database not connected: ${JSON.stringify(e)}`);
  }
}
