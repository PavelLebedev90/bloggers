import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { login, registration } from "../../utils/auth/crud-auth-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { createBlog } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import { createPost } from "../../utils/posts/crud-post-test.util";
import { collectCommentToCreate } from "../../utils/comments/collect-comment-test.util";
import { createCommentByPostId } from "../../utils/comments/crud-comment-test.util";
import { smtpAdapter } from "../../../src/core/adapters/smtp.adapter";

jest.mock("../../../src/core/adapters/smtp.adapter", () => ({
  smtpAdapter: {
    sendMail: jest.fn(),
  },
}));

const mockedSendEmail = smtpAdapter.sendMail as jest.Mock;

describe("Bearer auth requires a confirmed email", () => {
  setupDbLifecycle();

  beforeEach(() => {
    mockedSendEmail.mockResolvedValue(undefined);
  });

  it("should return 403 when creating a comment with an unconfirmed email", async () => {
    const user = collectUserToCreate();
    await registration(user).expect(HttpStatus.NoContent);
    const loginRes = await login({ loginOrEmail: user.login, password: user.password }).expect(
      HttpStatus.Ok,
    );
    const { accessToken } = loginRes.body as { accessToken: string };

    const blog = await createBlog(collectBlogToCreate()).expect(HttpStatus.Created);
    const post = await createPost(collectPostToCreate(blog.body.id)).expect(HttpStatus.Created);

    const res = await createCommentByPostId(post.body.id, collectCommentToCreate(), accessToken);

    expect(res.status).toBe(HttpStatus.Forbidden);
  });
});
