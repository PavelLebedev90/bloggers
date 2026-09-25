import request, { Test } from "supertest";
import { app } from "../../consts/express.const";
import { BlogInputModel } from "../../../src/routers/blogs/types/blogs-input.type";
import { BLOGS_ROUTER_PATH } from "../../../src/routers/blogs/const/blogs-router-path.const";
import { requestWithAuthHeader } from "../middlewares/request-auth-header.middleware";

type BlogInputModelTestDto = {
  [K in keyof BlogInputModel]?: unknown;
};

export const createBlog = (blog: BlogInputModelTestDto): Test => {
  return requestWithAuthHeader(app).post(BLOGS_ROUTER_PATH).send(blog);
};
export const getBlogById = (id: string): Test => {
  return request(app).get(`${BLOGS_ROUTER_PATH}/${id}`);
};
export const updateBlogById = (id: string, blog: BlogInputModelTestDto): Test => {
  return requestWithAuthHeader(app).put(`${BLOGS_ROUTER_PATH}/${id}`).send(blog);
};
export const deleteBlogById = (id: string): Test => {
  return requestWithAuthHeader(app).delete(`${BLOGS_ROUTER_PATH}/${id}`);
};
