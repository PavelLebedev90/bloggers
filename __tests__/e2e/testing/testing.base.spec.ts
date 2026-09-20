import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { app } from "../../consts/express.const";
import { BLOGS_ROUTER_PATH } from "../../../src/routers/blogs/const/blogs-router-path.const";
import { BlogCreateModel } from "../../../src/routers/blogs/types/blogs-input.type";
import { TESTING_ALL_DATA } from "../../../src/routers/testing/consts/testing-router-path.const";
import { POSTS_ROUTER_PATH } from "../../../src/routers/posts/const/posts-router-path.const";
import { PostCreateModel } from "../../../src/routers/posts/types/posts-input.type";

describe("testing all-data", () => {
  beforeEach(async () => {
    await request(app).delete(TESTING_ALL_DATA);
  });
  it("should clear all blogs from the DB", async () => {
    await request(app)
      .post(BLOGS_ROUTER_PATH)
      .send({
        name: "Test",
        description: "Test description",
        websiteUrl: "www.google.com",
      } satisfies BlogCreateModel);

    const listBeforeRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listBeforeRes.body).toHaveLength(1);

    const deleteRes = await request(app).delete(TESTING_ALL_DATA);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listAfterRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listAfterRes.status).toBe(HttpStatus.Ok);
    expect(listAfterRes.body).toEqual([]);
  });

  it("should clear all posts and blogs from the DB", async () => {
    const blog = await request(app)
      .post(BLOGS_ROUTER_PATH)
      .send({
        name: "Test",
        description: "Test description",
        websiteUrl: "www.google.com",
      } satisfies BlogCreateModel);

    const blogsBeforeRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(blogsBeforeRes.body).toHaveLength(1);

    await request(app)
      .post(POSTS_ROUTER_PATH)
      .send({
        title: "Title",
        shortDescription: "shortDescription",
        content: "content",
        blogId: blog.body.id,
      } satisfies PostCreateModel);

    const postsBeforeRes = await request(app).get(POSTS_ROUTER_PATH);
    expect(postsBeforeRes.body).toHaveLength(1);

    const deleteRes = await request(app).delete(TESTING_ALL_DATA);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listBlogsAfterRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listBlogsAfterRes.status).toBe(HttpStatus.Ok);
    expect(listBlogsAfterRes.body).toEqual([]);

    const listPostsAfterRes = await request(app).get(POSTS_ROUTER_PATH);
    expect(listPostsAfterRes.status).toBe(HttpStatus.Ok);
    expect(listPostsAfterRes.body).toEqual([]);
  });

  it("should be idempotent when the DB is already empty", async () => {
    await request(app).delete(TESTING_ALL_DATA);

    const deleteRes = await request(app).delete(TESTING_ALL_DATA);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listRes.body).toEqual([]);
  });
});
