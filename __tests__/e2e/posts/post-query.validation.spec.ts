import request from "supertest";
import { app } from "../../consts/express.const";
import { PostSortBy } from "../../../src/modules/posts/types/posts-query-input.type";
import { SortDirection } from "../../../src/core/types/query.type";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { POSTS_ROUTER_PATH } from "../../../src/modules/posts/const/posts-router-path.const";

describe("GET /posts query validation", () => {
  setupDbLifecycle();
  it("uses defaults when query parameters are omitted", async () => {
    const response = await request(app).get(POSTS_ROUTER_PATH).expect(HttpStatus.Ok);

    expect(response.body).toEqual(expect.objectContaining({ page: 1, pageSize: 10 }));
  });

  it("accepts valid sorting and pagination parameters", async () => {
    const response = await request(app)
      .get(POSTS_ROUTER_PATH)
      .query({
        sortBy: PostSortBy.TITLE,
        sortDirection: SortDirection.ASC,
        pageNumber: "2",
        pageSize: "25",
      })
      .expect(HttpStatus.Ok);

    expect(response.body).toEqual(expect.objectContaining({ page: 2, pageSize: 25 }));
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
    await request(app)
      .get(POSTS_ROUTER_PATH)
      .query({ [key]: value })
      .expect(HttpStatus.BadRequest);
  });
});
