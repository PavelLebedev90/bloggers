import express, { Express } from "express";
import { videosRouter } from "./routers/videos/videos.router";
import { testingRouter } from "./routers/testing/testing.router";
import { ROUTER_PATH } from "./core/consts/routers-path";
import { getFullRouterPath } from "./core/utils/router/getFullRouterPath";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(getFullRouterPath(ROUTER_PATH.VIDEOS.ROOT), videosRouter);
  app.use(getFullRouterPath(ROUTER_PATH.TESTING.ROOT), testingRouter);
  return app;
};
