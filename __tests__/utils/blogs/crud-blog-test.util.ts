import request, { Test } from "supertest";
import { app } from "../../consts/express.const";
import { requestWithAuthHeader } from "../middlewares/request-auth-header.middleware";
import { PostInputModelTestDto } from "../posts/crud-post-test.util";
import { BlogInputModel } from "../../../src/modules/blogs/types/blogs-input.type";
import { BLOGS_ROUTER_PATH } from "../../../src/modules/blogs/const/blogs-router-path.const";

type BlogInputModelTestDto = {
  [K in keyof BlogInputModel]?: unknown;
};

export const createBlog = (blog: BlogInputModelTestDto): Test => {
  return requestWithAuthHeader(app).post(BLOGS_ROUTER_PATH).send(blog);
};
export const createPostByBlogId = (blogId: string, post: PostInputModelTestDto): Test => {
  return requestWithAuthHeader(app).post(`${BLOGS_ROUTER_PATH}/${blogId}/posts`).send(post);
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
