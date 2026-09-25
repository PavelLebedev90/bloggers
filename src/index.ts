import "dotenv/config";
import express from "express";
import { setupApp } from "./setup-app";
import { runDB } from "./db/mongo.db";
import { config } from "./core/config/setup.config";

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  await runDB(config.mongodbUrl);

  app.listen(config.port, () => {
    console.log("Server is running", config.port);
  });
  return app;
};

void bootstrap();
