import request, { Test } from "supertest";
import { app } from "../../consts/express.const";
import {
  BlogCreateModel,
  BlogUpdateModel,
} from "../../../src/routers/blogs/types/blogs-input.type";
import { BLOGS_ROUTER_PATH } from "../../../src/routers/blogs/const/blogs-router-path.const";

type BlogCreateModelTestDto = {
  [K in keyof BlogCreateModel]?: unknown;
};
type BlogUpdateModelTestDto = {
  [K in keyof BlogUpdateModel]?: unknown;
};

export const createBlog = (blog: BlogCreateModelTestDto): Test => {
  return request(app).post(BLOGS_ROUTER_PATH).send(blog);
};
export const getBlogById = (id: string): Test => {
  return request(app).get(`${BLOGS_ROUTER_PATH}/${id}`);
};
export const updateBlogById = (id: string, blog: BlogUpdateModelTestDto): Test => {
  return request(app).put(`${BLOGS_ROUTER_PATH}/${id}`).send(blog);
};
export const deleteBlogById = (id: string): Test => {
  return request(app).delete(`${BLOGS_ROUTER_PATH}/${id}`);
};
