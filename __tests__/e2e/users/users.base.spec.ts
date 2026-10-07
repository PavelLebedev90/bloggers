import request from "supertest";
import { ObjectId } from "mongodb";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { app } from "../../consts/express.const";
import { USERS_ROUTER_PATH } from "../../../src/modules/users/const/users-router-path.const";
import { createUser, deleteUserById, getAllUsers } from "../../utils/users/crud-user-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { UserOutputModel } from "../../../src/modules/users/types/users-output.type";

describe("Users CRUD", () => {
  setupDbLifecycle();

  describe("GET /users", () => {
    it("should return 401 when no auth header is provided", async () => {
      const res = await request(app).get(USERS_ROUTER_PATH);
      expect(res.status).toBe(HttpStatus.Unauthorized);
    });

    it("should return an empty list when there are no users", async () => {
      const res = await getAllUsers();

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.body.items).toEqual([]);
      expect(res.body.totalCount).toBe(0);
    });

    it("should return the list of created users", async () => {
      await createUser(collectUserToCreate()).expect(HttpStatus.Created);
      await createUser({
        ...collectUserToCreate(),
        login: "user2",
        email: "user2@example.com",
      }).expect(HttpStatus.Created);

      const res = await getAllUsers();

      expect(res.status).toBe(HttpStatus.Ok);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.totalCount).toBe(2);
    });
  });

  describe("POST /users", () => {
    it("should return 401 when no auth header is provided", async () => {
      const res = await request(app).post(USERS_ROUTER_PATH).send(collectUserToCreate());
      expect(res.status).toBe(HttpStatus.Unauthorized);
    });

    it("should create a new user and return it", async () => {
      const userData = collectUserToCreate();
      const res = await createUser(userData);

      expect(res.status).toBe(HttpStatus.Created);
      expect(res.body).toEqual<UserOutputModel>({
        id: expect.any(String),
        login: userData.login,
        email: userData.email,
        createdAt: expect.any(String),
      });
      expect(res.body).not.toHaveProperty("password");
      expect(res.body).not.toHaveProperty("passwordHash");
    });

    it("should return 409 when login is already taken", async () => {
      await createUser(collectUserToCreate()).expect(HttpStatus.Created);

      const res = await createUser({
        ...collectUserToCreate(),
        email: "another@example.com",
      });

      expect(res.status).toBe(HttpStatus.Conflict);
    });

    it("should return 409 when email is already taken", async () => {
      await createUser(collectUserToCreate()).expect(HttpStatus.Created);

      const res = await createUser({
        ...collectUserToCreate(),
        login: "user2",
      });

      expect(res.status).toBe(HttpStatus.Conflict);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should return 401 when no auth header is provided", async () => {
      const res = await request(app).delete(`${USERS_ROUTER_PATH}/${new ObjectId().toString()}`);
      expect(res.status).toBe(HttpStatus.Unauthorized);
    });

    it("should delete a user by id", async () => {
      const createdUser = await createUser(collectUserToCreate()).expect(HttpStatus.Created);

      const deleteRes = await deleteUserById(createdUser.body.id);
      expect(deleteRes.status).toBe(HttpStatus.NoContent);

      const getRes = await getAllUsers();
      expect(getRes.body.items).toEqual([]);
    });

    it("should return 404 when deleting a non-existing user", async () => {
      const res = await deleteUserById(new ObjectId().toString());
      expect(res.status).toBe(HttpStatus.NotFound);
    });

    it("should return 400 when id is not a valid ObjectId", async () => {
      const res = await deleteUserById("not-a-valid-id");
      expect(res.status).toBe(HttpStatus.BadRequest);
    });
  });
});
