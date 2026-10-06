import "dotenv/config";
import express, { Express } from "express";
import { setupApp } from "./setup-app";
import { runDB } from "./db/mongo.db";
import { config } from "./core/config/setup.config";

const app: Express = express();

const bootstrap = async () => {
  setupApp(app);

  await runDB(config.mongodbUrl);

  app.listen(config.port, () => {
    console.log("Server is running", config.port);
  });
  return app;
};

void bootstrap();
export default app;
