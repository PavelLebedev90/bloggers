import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { login } from "../../utils/auth/crud-auth-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";

const validCredentials = { loginOrEmail: "user1", password: "qwerty1" };

describe("auth validation", () => {
  setupDbLifecycle();

  describe("POST /auth/login", () => {
    it("should return 400 when loginOrEmail is missing", async () => {
      const res = await login({ ...validCredentials, loginOrEmail: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "loginOrEmail" })]),
      );
    });

    it("should return 400 when loginOrEmail is empty", async () => {
      const res = await login({ ...validCredentials, loginOrEmail: "   " });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "loginOrEmail" })]),
      );
    });

    it("should return 400 when loginOrEmail is not a string", async () => {
      const res = await login({ ...validCredentials, loginOrEmail: [] });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "loginOrEmail" })]),
      );
    });

    it("should return 400 when loginOrEmail does not match login or email format", async () => {
      const res = await login({ ...validCredentials, loginOrEmail: "a@b" });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "loginOrEmail" })]),
      );
    });

    it("should return 400 when password is missing", async () => {
      const res = await login({ ...validCredentials, password: undefined });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 when password is empty", async () => {
      const res = await login({ ...validCredentials, password: "   " });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 when password is shorter than minLength (6)", async () => {
      const res = await login({ ...validCredentials, password: "12345" });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 when password exceeds maxLength (20)", async () => {
      const res = await login({ ...validCredentials, password: "a".repeat(21) });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 when password is not a string", async () => {
      const res = await login({ ...validCredentials, password: 123456 });
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password" })]),
      );
    });

    it("should return 400 with both fields invalid when body is empty", async () => {
      const res = await login({});
      expect(res.status).toBe(HttpStatus.BadRequest);
      expect(res.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "loginOrEmail" }),
          expect.objectContaining({ field: "password" }),
        ]),
      );
    });
  });
});
