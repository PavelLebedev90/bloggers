import express, { Express } from "express";
import { testingRouter } from "./routers/testing.router";
import { TESTING_ROUTER_PATH } from "./modules/testing/consts/testing-router-path.const";
import { POSTS_ROUTER_PATH } from "./modules/posts/const/posts-router-path.const";
import { postsRouter } from "./routers/posts.router";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { globalErrorMiddleware } from "./core/middlewares/errors/global-error.middleware";
import { BLOGS_ROUTER_PATH } from "./modules/blogs/const/blogs-router-path.const";
import { blogsRouter } from "./routers/blogs.router";
import { usersRouter } from "./routers/users.router";
import { USERS_ROUTER_PATH } from "./modules/users/const/users-router-path.const";
import { AUTH_ROUTER_PATH } from "./modules/auth/const/auth-router-path.const";
import { authRouter } from "./routers/auth.router";
import { COMMENTS_ROUTER_PATH } from "./modules/comments/const/comments-router-path.const";
import { commentsRouter } from "./routers/comments.router";

export const setupApp = (app: Express) => {
  app.use(express.json());

  // if (!isProduction) {
  app.use(TESTING_ROUTER_PATH, testingRouter);
  // }
  app.use(POSTS_ROUTER_PATH, postsRouter);
  app.use(BLOGS_ROUTER_PATH, blogsRouter);
  app.use(USERS_ROUTER_PATH, usersRouter);
  app.use(COMMENTS_ROUTER_PATH, commentsRouter);
  app.use(AUTH_ROUTER_PATH, authRouter);

  setupSwagger(app);

  app.use(globalErrorMiddleware);

  return app;
};
