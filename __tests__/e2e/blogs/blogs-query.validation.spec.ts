import request from "supertest";
import { app } from "../../consts/express.const";
import { BlogSortBy } from "../../../src/routers/blogs/types/blogs-query-input.type";
import { SortDirection } from "../../../src/core/types/query.type";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { BLOGS_ROUTER_PATH } from "../../../src/routers/blogs/const/blogs-router-path.const";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

describe("blogs query validation", () => {
  setupDbLifecycle();

  it.each([
    { query: { sortBy: "invalid" } },
    { query: { sortDirection: "invalid" } },
    { query: { pageNumber: "0" } },
    { query: { pageNumber: "1.5" } },
    { query: { pageSize: "0" } },
    { query: { pageSize: "101" } },
    { query: { pageSize: "1.5" } },
  ])("rejects invalid query: %o", async ({ query }) => {
    await request(app).get(BLOGS_ROUTER_PATH).query(query).expect(HttpStatus.BadRequest);
  });

  it("accepts valid query parameters and applies defaults", async () => {
    const defaults = await request(app).get(BLOGS_ROUTER_PATH).expect(HttpStatus.Ok);
    expect(defaults.body).toEqual(
      expect.objectContaining({
        page: 1,
        pageSize: 10,
        items: expect.any(Array),
      }),
    );

    const response = await request(app)
      .get(BLOGS_ROUTER_PATH)
      .query({
        sortBy: BlogSortBy.NAME,
        sortDirection: SortDirection.ASC,
        pageNumber: "2",
        pageSize: "20",
        searchNameTerm: "blog",
      })
      .expect(HttpStatus.Ok);

    expect(response.body.page).toBe(2);
    expect(response.body.pageSize).toBe(20);
  });
});
