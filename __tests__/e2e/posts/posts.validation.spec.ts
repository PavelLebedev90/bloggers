import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { app } from "../../consts/express.const";
import { TESTING_ALL_DATA } from "../../../src/routers/testing/consts/testing-router-path.const";
import { createPost, getPostById } from "../../utils/posts/crud-post-test.util";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import { createBlog } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";

describe("posts validation", () => {
  beforeEach(async () => {
    await request(app).delete(TESTING_ALL_DATA);
  });

  describe("POST /posts", () => {
    it("should return 400 when title is missing", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({ ...collectPostToCreate(blog.body.id), title: undefined });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when title is empty", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({ ...collectPostToCreate(blog.body.id), title: "    " });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when title is not a string", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({ ...collectPostToCreate(blog.body.id), title: { bad: "123" } });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when title exceeds maxLength (30)", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({ ...collectPostToCreate(blog.body.id), title: "a".repeat(31) });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when shortDescription is missing", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        shortDescription: undefined,
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "shortDescription" })]),
      );
    });
    it("should return 400 when shortDescription is empty", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        shortDescription: "    ",
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "shortDescription" })]),
      );
    });

    it("should return 400 when shortDescription exceeds maxLength (100)", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        shortDescription: "a".repeat(101),
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "shortDescription" })]),
      );
    });

    it("should return 400 when content is missing", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        content: undefined,
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });
    it("should return 400 when content is empty", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        content: "   ",
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });

    it("should return 400 when content exceeds maxLength (1000)", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        content: "a".repeat(1001),
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });

    it("should return 400 when blogId is not a string", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        blogId: 123,
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "blogId" })]),
      );
    });

    it("should return 400 when blogId is empty", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        blogId: "   ",
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "blogId" })]),
      );
    });

    it("should not create a post when validation fails", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const createdPost = await createPost({
        ...collectPostToCreate(blog.body.id),
        blogId: "   ",
      });

      const res = await getPostById(createdPost.body.id);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "id" })]),
      );
    });
  });

  describe("PUT /posts/:id", () => {
    it("should return 400 when fields is not valid", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const res = await createPost({
        ...collectPostToCreate(blog.body.id),
        blogId: "   ",
        content: null,
        shortDescription: [],
        title: 123,
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "blogId" }),
          expect.objectContaining({ field: "content" }),
          expect.objectContaining({ field: "shortDescription" }),
          expect.objectContaining({ field: "title" }),
        ]),
      );
    });
  });
});
