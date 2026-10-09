import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { createBlog } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import { createPost } from "../../utils/posts/crud-post-test.util";
import {
  createCommentByPostId,
  updateCommentById,
} from "../../utils/comments/crud-comment-test.util";
import { createAuthorizedUser } from "../../utils/auth/create-authorized-user.util";
import { collectCommentToCreate } from "../../utils/comments/collect-comment-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

describe("comments validation", () => {
  setupDbLifecycle();

  describe("POST /posts/:postId/comments", () => {
    it("should return 400 when content is missing", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const post = await createPost(collectPostToCreate(blog.body.id));
      const { accessToken } = await createAuthorizedUser();

      const res = await createCommentByPostId(post.body.id, { content: undefined }, accessToken);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });

    it("should return 400 when content is empty", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const post = await createPost(collectPostToCreate(blog.body.id));
      const { accessToken } = await createAuthorizedUser();

      const res = await createCommentByPostId(post.body.id, { content: "    " }, accessToken);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });

    it("should return 400 when content is shorter than minLength (20)", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const post = await createPost(collectPostToCreate(blog.body.id));
      const { accessToken } = await createAuthorizedUser();

      const res = await createCommentByPostId(post.body.id, { content: "short" }, accessToken);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });

    it("should return 400 when content exceeds maxLength (300)", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const post = await createPost(collectPostToCreate(blog.body.id));
      const { accessToken } = await createAuthorizedUser();

      const res = await createCommentByPostId(
        post.body.id,
        { content: "a".repeat(301) },
        accessToken,
      );

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });

    it("should return 400 when content is not a string", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const post = await createPost(collectPostToCreate(blog.body.id));
      const { accessToken } = await createAuthorizedUser();

      const res = await createCommentByPostId(post.body.id, { content: 123 }, accessToken);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });

    it("should not create a comment when validation fails", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const post = await createPost(collectPostToCreate(blog.body.id));
      const { accessToken } = await createAuthorizedUser();

      await createCommentByPostId(post.body.id, { content: "short" }, accessToken);

      const res = await createCommentByPostId(post.body.id, collectCommentToCreate(), accessToken);
      expect(res.status).toBe(HttpStatus.Created);
    });
  });

  describe("PUT /comments/:commentId", () => {
    it("should return 400 when fields are not valid", async () => {
      const blog = await createBlog(collectBlogToCreate());
      const post = await createPost(collectPostToCreate(blog.body.id));
      const { accessToken } = await createAuthorizedUser();
      const comment = await createCommentByPostId(
        post.body.id,
        collectCommentToCreate(),
        accessToken,
      );

      const res = await updateCommentById(comment.body.id, { content: null }, accessToken);

      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "content" })]),
      );
    });
  });
});
