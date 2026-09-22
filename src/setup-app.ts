import express, { Express } from "express";
import { testingRouter } from "./routers/testing/testing.router";
import { TESTING_ROUTER_PATH } from "./routers/testing/consts/testing-router-path.const";
import { POSTS_ROUTER_PATH } from "./routers/posts/const/posts-router-path.const";
import { postsRouter } from "./routers/posts/posts.router";
import { blogsRouter } from "./routers/blogs/blogs.router";
import { BLOGS_ROUTER_PATH } from "./routers/blogs/const/blogs-router-path.const";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { globalErrorMiddleware } from "./core/middlewares/errors/global-error.middleware";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(TESTING_ROUTER_PATH, testingRouter);
  app.use(POSTS_ROUTER_PATH, postsRouter);
  app.use(BLOGS_ROUTER_PATH, blogsRouter);

  setupSwagger(app);

  app.use(globalErrorMiddleware);

  return app;
};
