import { Db, MongoClient } from "mongodb";
import { initCollections } from "./collections";
import { DB_NAME } from "../core/config/setup.config";

export let client: MongoClient;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);

  const db: Db = client.db(DB_NAME);
  initCollections(db);

  try {
    await client.connect();

    await db.command({ ping: 1 });

    console.log("✅ Connected to the database");
  } catch (e) {
    if (client) {
      await client.close();
    }
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
