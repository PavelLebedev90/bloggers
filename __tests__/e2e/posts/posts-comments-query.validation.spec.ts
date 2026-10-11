import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { CommentSortBy } from "../../../src/modules/comments/types/comments-query-input.type";
import { SortDirection } from "../../../src/core/types/query.type";
import { createBlog } from "../../utils/blogs/crud-blog-test.util";
import { collectBlogToCreate } from "../../utils/blogs/collect-blog-test.util";
import { collectPostToCreate } from "../../utils/posts/collect-post-test.util";
import { createPost } from "../../utils/posts/crud-post-test.util";
import { getCommentsByPostId } from "../../utils/comments/crud-comment-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

describe("GET /posts/:postId/comments query validation", () => {
  setupDbLifecycle();

  it("uses defaults when query parameters are omitted", async () => {
    const blog = await createBlog(collectBlogToCreate());
    const post = await createPost(collectPostToCreate(blog.body.id));

    const res = await getCommentsByPostId(post.body.id).expect(HttpStatus.Ok);

    expect(res.body).toEqual(expect.objectContaining({ page: 1, pageSize: 10 }));
  });

  it("accepts valid sorting and pagination parameters", async () => {
    const blog = await createBlog(collectBlogToCreate());
    const post = await createPost(collectPostToCreate(blog.body.id));

    const res = await getCommentsByPostId(post.body.id, {
      sortBy: CommentSortBy.CONTENT,
      sortDirection: SortDirection.ASC,
      pageNumber: "2",
      pageSize: "25",
    }).expect(HttpStatus.Ok);

    expect(res.body).toEqual(expect.objectContaining({ page: 2, pageSize: 25 }));
  });

  it.each([
    ["sortBy", "invalid"],
    ["sortDirection", "invalid"],
    ["pageNumber", "0"],
    ["pageNumber", "1.5"],
    ["pageNumber", "not-a-number"],
    ["pageSize", "0"],
    ["pageSize", "101"],
    ["pageSize", "1.5"],
    ["pageSize", "not-a-number"],
  ])("rejects invalid %s=%s", async (key, value) => {
    const blog = await createBlog(collectBlogToCreate());
    const post = await createPost(collectPostToCreate(blog.body.id));

    await getCommentsByPostId(post.body.id, { [key]: value }).expect(HttpStatus.BadRequest);
  });
});
