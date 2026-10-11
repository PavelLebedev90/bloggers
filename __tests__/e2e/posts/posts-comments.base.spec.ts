import { ObjectId } from "mongodb";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { CommentOutputModel } from "../../../src/modules/comments/types/comments-output.type";
import { createBlog } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import { createPost } from "../../utils/posts/crud-post-test.util";
import { collectCommentToCreate } from "../../utils/comments/collect-comment-test.util";
import {
  createCommentByPostId,
  getCommentsByPostId,
} from "../../utils/comments/crud-comment-test.util";
import { createAuthorizedUser } from "../../utils/auth/create-authorized-user.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

const createPostFixture = async (): Promise<string> => {
  const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
  const post = await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);
  return post.body.id;
};

describe("POST /posts/:postId/comments", () => {
  setupDbLifecycle();

  it("should return 401 when no authorization header is provided", async () => {
    const postId = await createPostFixture();

    const res = await createCommentByPostId(postId, collectCommentToCreate());

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should create a new comment and return it", async () => {
    const postId = await createPostFixture();
    const { accessToken, login: userLogin, userId } = await createAuthorizedUser();

    const res = await createCommentByPostId(postId, collectCommentToCreate(), accessToken).expect(
      HttpStatus.Created,
    );

    expect(res.body).toEqual<CommentOutputModel>({
      id: expect.any(String),
      content: collectCommentToCreate().content,
      commentatorInfo: {
        userId,
        userLogin,
      },
      createdAt: expect.any(String),
    });
  });

  it("should return 404 when the post does not exist", async () => {
    const { accessToken } = await createAuthorizedUser();

    const res = await createCommentByPostId(
      new ObjectId().toString(),
      collectCommentToCreate(),
      accessToken,
    );

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should return 400 when postId has invalid format", async () => {
    const { accessToken } = await createAuthorizedUser();

    const res = await createCommentByPostId(
      "not-a-valid-id",
      collectCommentToCreate(),
      accessToken,
    );

    expect(res.status).toBe(HttpStatus.BadRequest);
  });
});

describe("GET /posts/:postId/comments", () => {
  setupDbLifecycle();

  it("should return an empty array when the post has no comments", async () => {
    const postId = await createPostFixture();

    const res = await getCommentsByPostId(postId).expect(HttpStatus.Ok);

    expect(res.body.items).toEqual([]);
    expect(res.body.totalCount).toBe(0);
  });

  it("should return the list of comments for a post", async () => {
    const postId = await createPostFixture();
    const { accessToken } = await createAuthorizedUser();

    await createCommentByPostId(postId, collectCommentToCreate(), accessToken).expect(
      HttpStatus.Created,
    );
    await createCommentByPostId(
      postId,
      { content: "Второй комментарий, тоже достаточно длинный для валидации." },
      accessToken,
    ).expect(HttpStatus.Created);

    const res = await getCommentsByPostId(postId).expect(HttpStatus.Ok);

    expect(res.body.items).toHaveLength(2);
    expect(res.body.totalCount).toBe(2);
  });

  it("should not return comments created for another post", async () => {
    const postId = await createPostFixture();
    const otherPostId = await createPostFixture();
    const { accessToken } = await createAuthorizedUser();

    await createCommentByPostId(postId, collectCommentToCreate(), accessToken).expect(
      HttpStatus.Created,
    );

    const res = await getCommentsByPostId(otherPostId).expect(HttpStatus.Ok);

    expect(res.body.items).toEqual([]);
  });

  it("should return 404 when the post does not exist", async () => {
    const res = await getCommentsByPostId(new ObjectId().toString());

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should return 400 when postId has invalid format", async () => {
    const res = await getCommentsByPostId("not-a-valid-id");

    expect(res.status).toBe(HttpStatus.BadRequest);
  });

  it("should respect pagination parameters", async () => {
    const postId = await createPostFixture();
    const { accessToken } = await createAuthorizedUser();

    for (let i = 0; i < 3; i++) {
      await createCommentByPostId(postId, collectCommentToCreate(), accessToken).expect(
        HttpStatus.Created,
      );
    }

    const res = await getCommentsByPostId(postId, { pageNumber: 1, pageSize: 2 }).expect(
      HttpStatus.Ok,
    );

    expect(res.body.items).toHaveLength(2);
    expect(res.body.totalCount).toBe(3);
    expect(res.body.pagesCount).toBe(2);
  });
});
