import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import {
  registration,
  registrationConfirmation,
  registrationEmailResending,
} from "../../utils/auth/crud-auth-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import { usersCollection } from "../../../src/db/collections";
import { smtpAdapter } from "../../../src/core/adapters/smtp.adapter";

jest.mock("../../../src/core/adapters/smtp.adapter", () => ({
  smtpAdapter: {
    sendMail: jest.fn(),
  },
}));

const mockedSendEmail = smtpAdapter.sendMail as jest.Mock;

const getEmailConfirmationCode = async (email: string): Promise<string> => {
  const user = await usersCollection.findOne({ email });
  if (!user?.emailConfirmationCode) throw new Error("emailConfirmationCode not found");
  return user.emailConfirmationCode;
};

describe("Auth registration", () => {
  setupDbLifecycle();

  beforeEach(() => {
    mockedSendEmail.mockResolvedValue(undefined);
  });

  describe("POST /auth/registration", () => {
    it("should return 204, create an unconfirmed user and send a confirmation email", async () => {
      const user = collectUserToCreate();

      const res = await registration(user);

      expect(res.status).toBe(HttpStatus.NoContent);

      const createdUser = await usersCollection.findOne({ login: user.login });
      expect(createdUser).toMatchObject({
        login: user.login,
        email: user.email,
        emailConfirmationIsConfirmed: false,
      });
      expect(createdUser?.emailConfirmationCode).toEqual(expect.any(String));

      expect(mockedSendEmail).toHaveBeenCalledTimes(1);
      expect(mockedSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.any(String),
          html: expect.stringContaining(createdUser!.emailConfirmationCode!),
        }),
      );
    });

    it("should return 400 when login is already taken", async () => {
      await registration(collectUserToCreate()).expect(HttpStatus.NoContent);

      const res = await registration({
        ...collectUserToCreate(),
        email: "another@example.com",
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("should return 400 when email is already taken", async () => {
      await registration(collectUserToCreate()).expect(HttpStatus.NoContent);

      const res = await registration({
        ...collectUserToCreate(),
        login: "user2",
      });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("should return 400 on invalid input (short password)", async () => {
      const res = await registration({ ...collectUserToCreate(), password: "123" });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });
  });

  describe("POST /auth/registration-confirmation", () => {
    it("should return 204 and confirm the user with a valid code", async () => {
      const user = collectUserToCreate();
      await registration(user).expect(HttpStatus.NoContent);
      const code = await getEmailConfirmationCode(user.email);

      const res = await registrationConfirmation({ code });

      expect(res.status).toBe(HttpStatus.NoContent);
      const confirmedUser = await usersCollection.findOne({ email: user.email });
      expect(confirmedUser?.emailConfirmationIsConfirmed).toBe(true);
    });

    it("should return 400 when the code does not exist", async () => {
      const res = await registrationConfirmation({ code: "e8b8c3f0-1a2b-4c3d-9e0f-1234567890ab" });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("should return 400 when the code has already been applied", async () => {
      const user = collectUserToCreate();
      await registration(user).expect(HttpStatus.NoContent);
      const code = await getEmailConfirmationCode(user.email);
      await registrationConfirmation({ code }).expect(HttpStatus.NoContent);

      const res = await registrationConfirmation({ code });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("should return 400 when the code is not a valid uuid", async () => {
      const res = await registrationConfirmation({ code: "not-a-uuid" });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });
  });

  describe("POST /auth/registration-email-resending", () => {
    it("should return 204, rotate the confirmation code and resend the email", async () => {
      const user = collectUserToCreate();
      await registration(user).expect(HttpStatus.NoContent);
      const initialCode = await getEmailConfirmationCode(user.email);
      mockedSendEmail.mockClear();

      const res = await registrationEmailResending({ email: user.email });

      expect(res.status).toBe(HttpStatus.NoContent);
      const newCode = await getEmailConfirmationCode(user.email);
      expect(newCode).not.toBe(initialCode);

      expect(mockedSendEmail).toHaveBeenCalledTimes(1);
      expect(mockedSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          html: expect.stringContaining(newCode),
        }),
      );
    });

    it("should return 400 when the email does not exist", async () => {
      const res = await registrationEmailResending({ email: "unknown@example.com" });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("should return 400 when the email is already confirmed", async () => {
      const user = collectUserToCreate();
      await registration(user).expect(HttpStatus.NoContent);
      const code = await getEmailConfirmationCode(user.email);
      await registrationConfirmation({ code }).expect(HttpStatus.NoContent);

      const res = await registrationEmailResending({ email: user.email });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("should return 400 on invalid email format", async () => {
      const res = await registrationEmailResending({ email: "not-an-email" });

      expect(res.status).toBe(HttpStatus.BadRequest);
    });
  });
});
