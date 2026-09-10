import express, { Express } from "express";
import { videosRouter } from "./routers/videos/videos.router";
import { testingRouter } from "./routers/testing/testing.router";
import { getFullProuterPath, ROUTER_PATH } from "./core/types/routes-path";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(getFullProuterPath(ROUTER_PATH.VIDEOS), videosRouter);
  app.use(getFullProuterPath(ROUTER_PATH.TESTING), testingRouter);
  return app;
};
