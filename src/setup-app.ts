import express, { Express } from "express";
import { testingRouter } from "./routers/testing.router";
import { TESTING_ROUTER_PATH } from "./modules/testing/consts/testing-router-path.const";
import { POSTS_ROUTER_PATH } from "./modules/posts/const/posts-router-path.const";
import { postsRouter } from "./routers/posts.router";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { globalErrorMiddleware } from "./core/middlewares/errors/global-error.middleware";
import { isProduction } from "./core/config/setup.config";
import { BLOGS_ROUTER_PATH } from "./modules/blogs/const/blogs-router-path.const";
import { blogsRouter } from "./routers/blogs.router";

export const setupApp = (app: Express) => {
  app.use(express.json());

  if (!isProduction) {
    app.use(TESTING_ROUTER_PATH, testingRouter);
  }
  app.use(POSTS_ROUTER_PATH, postsRouter);
  app.use(BLOGS_ROUTER_PATH, blogsRouter);

  setupSwagger(app);

  app.use(globalErrorMiddleware);

  return app;
};
