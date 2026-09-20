import request, { Test } from "supertest";
import { POSTS_ROUTER_PATH } from "../../../src/routers/posts/const/posts-router-path.const";
import {
  PostCreateModel,
  PostUpdateModel,
} from "../../../src/routers/posts/types/posts-input.type";
import { app } from "../../consts/express.const";
import { requestWithAuthHeader } from "../middlewares/request-auth-header.middleware";

type PostCreateModelTestDto = {
  [K in keyof PostCreateModel]?: unknown;
};
type PostUpdateModelTestDto = {
  [K in keyof PostUpdateModel]?: unknown;
};

export const createPost = (post: PostCreateModelTestDto): Test => {
  return requestWithAuthHeader(app).post(POSTS_ROUTER_PATH).send(post);
};
export const getPostById = (id: string): Test => {
  return request(app).get(`${POSTS_ROUTER_PATH}/${id}`);
};
export const updatePostById = (id: string, post: PostUpdateModelTestDto): Test => {
  return requestWithAuthHeader(app).put(`${POSTS_ROUTER_PATH}/${id}`).send(post);
};
export const deletePostById = (id: string): Test => {
  return requestWithAuthHeader(app).delete(`${POSTS_ROUTER_PATH}/${id}`);
};
