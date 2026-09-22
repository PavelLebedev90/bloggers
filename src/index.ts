import express from "express";
import { setupApp } from "./setup-app";
import { runDB } from "./db/mongo.db";
import { MONGO_PATH, PORT } from "./core/config/setup.config";

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  await runDB(MONGO_PATH);

  app.listen(PORT, () => {
    console.log("Server is running", PORT);
  });
  return app;
};

bootstrap();
