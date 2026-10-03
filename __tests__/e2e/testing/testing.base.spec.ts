import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { app } from "../../consts/express.const";
import { TESTING_ALL_DATA } from "../../../src/modules/testing/consts/testing-router-path.const";
import { POSTS_ROUTER_PATH } from "../../../src/modules/posts/const/posts-router-path.const";
import { createPost } from "../../utils/posts/crud-post-test.util";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import { createBlog } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { BLOGS_ROUTER_PATH } from "../../../src/modules/blogs/const/blogs-router-path.const";

describe("testing all-data", () => {
  setupDbLifecycle();
  it("should clear all blogs from the DB", async () => {
    await createBlog(collectBlogToCreate());

    const listBeforeRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listBeforeRes.body.items).toHaveLength(1);

    const deleteRes = await request(app).delete(TESTING_ALL_DATA);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listAfterRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listAfterRes.status).toBe(HttpStatus.Ok);
    expect(listAfterRes.body.items).toEqual([]);
  });

  it("should clear all posts and blogs from the DB", async () => {
    const blog = await createBlog(collectBlogToCreate());

    const blogsBeforeRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(blogsBeforeRes.body.items).toHaveLength(1);

    await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);

    const postsBeforeRes = await request(app).get(POSTS_ROUTER_PATH);
    expect(postsBeforeRes.body.items).toHaveLength(1);

    const deleteRes = await request(app).delete(TESTING_ALL_DATA);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listBlogsAfterRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listBlogsAfterRes.status).toBe(HttpStatus.Ok);
    expect(listBlogsAfterRes.body.items).toEqual([]);

    const listPostsAfterRes = await request(app).get(POSTS_ROUTER_PATH);
    expect(listPostsAfterRes.status).toBe(HttpStatus.Ok);
    expect(listPostsAfterRes.body.items).toEqual([]);
  });

  it("should be idempotent when the DB is already empty", async () => {
    await request(app).delete(TESTING_ALL_DATA);

    const deleteRes = await request(app).delete(TESTING_ALL_DATA);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const listRes = await request(app).get(BLOGS_ROUTER_PATH);
    expect(listRes.body.items).toEqual([]);
  });
});
