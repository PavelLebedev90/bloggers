import request from "supertest";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { app } from "../../consts/express.const";
import { TESTING_ALL_DATA } from "../../../src/routers/testing/consts/testing-router-path.const";
import { createBlog, getBlogById } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";

describe("blogs validation", () => {
  beforeEach(async () => {
    await request(app).delete(TESTING_ALL_DATA);
  });

  describe("POST /blogs", () => {
    it("should return 400 when name is missing", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), name: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "name" })]),
      );
    });

    it("should return 400 when name is empty", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), name: "    " });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "name" })]),
      );
    });

    it("should return 400 when name is not a string", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), name: [] });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "name" })]),
      );
    });

    it("should return 400 when name exceeds maxLength (15)", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), name: "a".repeat(16) });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "name" })]),
      );
    });

    it("should return 400 when description is missing", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), description: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "description" })]),
      );
    });
    it("should return 400 when description is empty", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), description: "   " });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "description" })]),
      );
    });

    it("should return 400 when description exceeds maxLength (500)", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), description: "a".repeat(501) });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "description" })]),
      );
    });

    it("should return 400 when websiteUrl is missing", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), websiteUrl: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "websiteUrl" })]),
      );
    });
    it("should return 400 when websiteUrl is empty", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), websiteUrl: "    " });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "websiteUrl" })]),
      );
    });

    it("should return 400 when websiteUrl exceeds maxLength (100)", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), websiteUrl: "a".repeat(101) });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "websiteUrl" })]),
      );
    });
    it("should return 400 when websiteUrl is not a string", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), websiteUrl: {} });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "websiteUrl" })]),
      );
    });
    it("should return 400 when websiteUrl is not valid reqExp", async () => {
      const res = await createBlog({ ...collectBlogToCreate(), websiteUrl: "www.google.com" });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "websiteUrl" })]),
      );
    });

    it("should not create a blog when validation fails", async () => {
      const createdBlog = await createBlog({ ...collectBlogToCreate(), name: null });
      const res = await getBlogById(createdBlog.body.id);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "id" })]),
      );
    });
  });

  describe("PUT /blogs/:id", () => {
    it("should return 400 when fields is not valid", async () => {
      const res = await createBlog({
        ...collectBlogToCreate(),
        name: "   ",
        description: null,
        websiteUrl: "google.com",
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "name" }),
          expect.objectContaining({ field: "description" }),
          expect.objectContaining({ field: "websiteUrl" }),
        ]),
      );
    });
  });
});
