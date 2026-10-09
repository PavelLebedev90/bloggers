import request, { Test } from "supertest";
import { POSTS_ROUTER_PATH } from "../../../src/modules/posts/const/posts-router-path.const";
import { COMMENTS_ROUTER_PATH } from "../../../src/modules/comments/const/comments-router-path.const";
import { CommentInputModel } from "../../../src/modules/comments/types/comments-input.type";
import { app } from "../../consts/express.const";

type CommentInputModelTestDto = {
  [K in keyof CommentInputModel]?: unknown;
};

export const createCommentByPostId = (
  postId: string,
  comment: CommentInputModelTestDto,
  accessToken?: string,
): Test => {
  const req = request(app).post(`${POSTS_ROUTER_PATH}/${postId}/comments`).send(comment);
  if (accessToken !== undefined) {
    req.set("authorization", `Bearer ${accessToken}`);
  }
  return req;
};

export const getCommentsByPostId = (postId: string, query?: Record<string, unknown>): Test => {
  return request(app)
    .get(`${POSTS_ROUTER_PATH}/${postId}/comments`)
    .query(query ?? {});
};

export const getCommentById = (commentId: string): Test => {
  return request(app).get(`${COMMENTS_ROUTER_PATH}/${commentId}`);
};

export const updateCommentById = (
  commentId: string,
  comment: CommentInputModelTestDto,
  accessToken?: string,
): Test => {
  const req = request(app).put(`${COMMENTS_ROUTER_PATH}/${commentId}`).send(comment);
  if (accessToken !== undefined) {
    req.set("authorization", `Bearer ${accessToken}`);
  }
  return req;
};

export const deleteCommentById = (commentId: string, accessToken?: string): Test => {
  const req = request(app).delete(`${COMMENTS_ROUTER_PATH}/${commentId}`);
  if (accessToken !== undefined) {
    req.set("authorization", `Bearer ${accessToken}`);
  }
  return req;
};
