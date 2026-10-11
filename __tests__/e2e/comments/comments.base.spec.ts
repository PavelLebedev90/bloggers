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
  deleteCommentById,
  getCommentById,
  updateCommentById,
} from "../../utils/comments/crud-comment-test.util";
import { createAuthorizedUser } from "../../utils/auth/create-authorized-user.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

const createCommentFixture = async (): Promise<{
  commentId: string;
  accessToken: string;
  userId: string;
  userLogin: string;
}> => {
  const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
  const post = await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);
  const { accessToken, userId, login: userLogin } = await createAuthorizedUser();

  const comment = await createCommentByPostId(
    post.body.id,
    collectCommentToCreate(),
    accessToken,
  ).expect(HttpStatus.Created);

  return { commentId: comment.body.id, accessToken, userId, userLogin };
};

describe("GET /comments/:commentId", () => {
  setupDbLifecycle();

  it("should return a comment by id", async () => {
    const { commentId, userId, userLogin } = await createCommentFixture();

    const res = await getCommentById(commentId).expect(HttpStatus.Ok);

    expect(res.body).toEqual<CommentOutputModel>({
      id: commentId,
      content: collectCommentToCreate().content,
      commentatorInfo: { userId, userLogin },
      createdAt: expect.any(String),
    });
  });

  it("should return 404 when the comment does not exist", async () => {
    const res = await getCommentById(new ObjectId().toString());

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should return 400 when commentId has invalid format", async () => {
    const res = await getCommentById("not-a-valid-id");

    expect(res.status).toBe(HttpStatus.BadRequest);
  });
});

describe("PUT /comments/:commentId", () => {
  setupDbLifecycle();

  it("should return 401 when no authorization header is provided", async () => {
    const { commentId } = await createCommentFixture();

    const res = await updateCommentById(commentId, { content: "a".repeat(25) });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should update the comment and return 204", async () => {
    const { commentId, accessToken } = await createCommentFixture();
    const newContent = "Обновлённый контент комментария длиннее двадцати символов.";

    const updateRes = await updateCommentById(commentId, { content: newContent }, accessToken);
    expect(updateRes.status).toBe(HttpStatus.NoContent);

    const getRes = await getCommentById(commentId).expect(HttpStatus.Ok);
    expect(getRes.body.content).toBe(newContent);
  });

  it("should return 403 when updating someone else's comment", async () => {
    const { commentId } = await createCommentFixture();
    const anotherUser = await createAuthorizedUser({
      login: "user2",
      email: "user2@example.com",
    });

    const res = await updateCommentById(
      commentId,
      { content: "a".repeat(25) },
      anotherUser.accessToken,
    );

    expect(res.status).toBe(HttpStatus.Forbidden);
  });

  it("should return 404 when the comment does not exist", async () => {
    const { accessToken } = await createAuthorizedUser();

    const res = await updateCommentById(
      new ObjectId().toString(),
      { content: "a".repeat(25) },
      accessToken,
    );

    expect(res.status).toBe(HttpStatus.NotFound);
  });

  it("should return 400 when content is too short", async () => {
    const { commentId, accessToken } = await createCommentFixture();

    const res = await updateCommentById(commentId, { content: "short" }, accessToken);

    expect(res.status).toBe(HttpStatus.BadRequest);
    expect(res.body.errorsMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "content" })]),
    );
  });
});

describe("DELETE /comments/:commentId", () => {
  setupDbLifecycle();

  it("should return 401 when no authorization header is provided", async () => {
    const { commentId } = await createCommentFixture();

    const res = await deleteCommentById(commentId);

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it("should return 403 when deleting someone else's comment", async () => {
    const { commentId } = await createCommentFixture();
    const anotherUser = await createAuthorizedUser({
      login: "user2",
      email: "user2@example.com",
    });

    const res = await deleteCommentById(commentId, anotherUser.accessToken);

    expect(res.status).toBe(HttpStatus.Forbidden);
  });

  it("should delete the comment and return 204", async () => {
    const { commentId, accessToken } = await createCommentFixture();

    const deleteRes = await deleteCommentById(commentId, accessToken);
    expect(deleteRes.status).toBe(HttpStatus.NoContent);

    const getRes = await getCommentById(commentId);
    expect(getRes.status).toBe(HttpStatus.NotFound);
  });

  it("should return 404 when the comment does not exist", async () => {
    const { accessToken } = await createAuthorizedUser();

    const res = await deleteCommentById(new ObjectId().toString(), accessToken);

    expect(res.status).toBe(HttpStatus.NotFound);
  });
});
