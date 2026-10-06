import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { SortDirection } from "../../../src/core/types/query.type";
import { UserSortBy } from "../../../src/modules/users/types/users-query-input.type";
import { createUser, getAllUsers } from "../../utils/users/crud-user-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

describe("GET /users query validation", () => {
  setupDbLifecycle();

  it("uses defaults when query parameters are omitted", async () => {
    const res = await getAllUsers();

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toEqual(expect.objectContaining({ page: 1, pageSize: 10 }));
  });

  it("accepts valid sorting and pagination parameters", async () => {
    const res = await getAllUsers({
      sortBy: UserSortBy.LOGIN,
      sortDirection: SortDirection.ASC,
      pageNumber: "2",
      pageSize: "25",
    });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body).toEqual(expect.objectContaining({ page: 2, pageSize: 25 }));
  });

  it("filters users by searchLoginTerm", async () => {
    await createUser(collectUserToCreate()).expect(HttpStatus.Created);
    await createUser({
      ...collectUserToCreate(),
      login: "another",
      email: "another@example.com",
    }).expect(HttpStatus.Created);

    const res = await getAllUsers({ searchLoginTerm: "user1" });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].login).toBe("user1");
  });

  it("filters users by searchEmailTerm", async () => {
    await createUser(collectUserToCreate()).expect(HttpStatus.Created);
    await createUser({
      ...collectUserToCreate(),
      login: "another",
      email: "another@example.com",
    }).expect(HttpStatus.Created);

    const res = await getAllUsers({ searchEmailTerm: "another" });

    expect(res.status).toBe(HttpStatus.Ok);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].email).toBe("another@example.com");
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
    const res = await getAllUsers({ [key]: value });
    expect(res.status).toBe(HttpStatus.BadRequest);
  });
});
