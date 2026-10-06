import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { createUser, getAllUsers } from "../../utils/users/crud-user-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

describe("users validation", () => {
  setupDbLifecycle();

  describe("POST /users", () => {
    it("should return 400 when login is missing", async () => {
      const res = await createUser({ ...collectUserToCreate(), login: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "login" })]),
      );
    });

    it("should return 400 when login is empty", async () => {
      const res = await createUser({ ...collectUserToCreate(), login: "   " });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "login" })]),
      );
    });

    it("should return 400 when login is shorter than minLength (3)", async () => {
      const res = await createUser({ ...collectUserToCreate(), login: "ab" });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "login" })]),
      );
    });

    it("should return 400 when login exceeds maxLength (10)", async () => {
      const res = await createUser({ ...collectUserToCreate(), login: "a".repeat(11) });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "login" })]),
      );
    });

    it("should return 400 when login contains invalid characters", async () => {
      const res = await createUser({ ...collectUserToCreate(), login: "user@1" });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "login" })]),
      );
    });

    it("should return 400 when login is not a string", async () => {
      const res = await createUser({ ...collectUserToCreate(), login: [] });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "login" })]),
      );
    });

    it("should return 400 when email is missing", async () => {
      const res = await createUser({ ...collectUserToCreate(), email: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email" })]),
      );
    });

    it("should return 400 when email has an invalid format", async () => {
      const res = await createUser({ ...collectUserToCreate(), email: "not-an-email" });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email" })]),
      );
    });

    it("should return 400 when email exceeds maxLength (100)", async () => {
      const longLocalPart = "a".repeat(95);
      const res = await createUser({
        ...collectUserToCreate(),
        email: `${longLocalPart}@a.com`,
      });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email" })]),
      );
    });

    it("should return 400 when email is not a string", async () => {
      const res = await createUser({ ...collectUserToCreate(), email: {} });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email" })]),
      );
    });

    it("should return 400 when password is missing", async () => {
      const res = await createUser({ ...collectUserToCreate(), password: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 when password is shorter than minLength (6)", async () => {
      const res = await createUser({ ...collectUserToCreate(), password: "12345" });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 when password exceeds maxLength (20)", async () => {
      const res = await createUser({ ...collectUserToCreate(), password: "a".repeat(21) });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 when password is not a string", async () => {
      const res = await createUser({ ...collectUserToCreate(), password: 123456 });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 with all fields invalid when body is empty", async () => {
      const res = await createUser({});
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "login" }),
          expect.objectContaining({ field: "email" }),
          expect.objectContaining({ field: "password" }),
        ]),
      );
    });

    it("should not create a user when validation fails", async () => {
      await createUser({ ...collectUserToCreate(), login: "a" });
      const res = await createUser(collectUserToCreate());
      const allUsers = await getAllUsers();
      expect(allUsers.status).toBe(HttpStatus.Ok);
      expect(allUsers.body.items.length).toBe(1);
      expect(res.status).toBe(HttpStatus.Created);
    });
  });
});
