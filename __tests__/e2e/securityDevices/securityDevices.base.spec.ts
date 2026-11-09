import { ObjectId } from "mongodb";
import { HttpStatus } from "../../../src/core/types/http-statuses.type";
import { SECURITY_DEVICES_ROUTER_PATH } from "../../../src/modules/securityDevices/const/securityDevices-router-path.const";
import { securityDevicesCollection } from "../../../src/db/collections";
import {
  extractRefreshCookie,
  login,
  logout,
  refreshToken,
} from "../../utils/auth/crud-auth-test.util";
import { collectUserToCreate } from "../../utils/users/collect-user-test.util";
import { createUser } from "../../utils/users/crud-user-test.util";
import { setupDbLifecycle } from "../../utils/db/setup-db-lifecycle.util";
import {
  deleteOtherSecurityDevices,
  deleteSecurityDevice,
  extractDeviceId,
  getSecurityDevices,
} from "../../utils/securityDevices/crud-securityDevices-test.util";

describe("Security devices CRUD", () => {
  setupDbLifecycle();

  const createLoggedInUser = async (loginName = "user1", email = "user1@example.com") => {
    const user = { ...collectUserToCreate(), login: loginName, email };
    await createUser(user).expect(HttpStatus.Created);
    const response = await login({ loginOrEmail: user.login, password: user.password }).expect(
      HttpStatus.Ok,
    );
    return { user, cookie: extractRefreshCookie(response) };
  };

  const createAnotherSession = async (credentials: { login: string; password: string }) => {
    const response = await login({
      loginOrEmail: credentials.login,
      password: credentials.password,
    }).expect(HttpStatus.Ok);
    return extractRefreshCookie(response);
  };

  const loginWithUserAgent = async (
    credentials: { login: string; password: string },
    userAgent: string,
  ) => {
    const response = await login({
      loginOrEmail: credentials.login,
      password: credentials.password,
    })
      .set("User-Agent", userAgent)
      .expect(HttpStatus.Ok);
    return extractRefreshCookie(response);
  };

  describe(`GET ${SECURITY_DEVICES_ROUTER_PATH}`, () => {
    it("should return 401 when no refresh cookie is provided", async () => {
      const response = await getSecurityDevices();
      expect(response.status).toBe(HttpStatus.Unauthorized);
    });

    it("should return the current user's active devices", async () => {
      const { user, cookie } = await createLoggedInUser();
      const secondCookie = await createAnotherSession(user);

      const response = await getSecurityDevices(cookie);

      expect(response.status).toBe(HttpStatus.Ok);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            deviceId: expect.any(String),
            ip: expect.any(String),
            title: expect.any(String),
            lastActiveDate: expect.any(String),
          }),
        ]),
      );
      expect(secondCookie).not.toBe(cookie);
    });

    it("should preserve devices after refreshing one token and update its lastActiveDate", async () => {
      const user = { ...collectUserToCreate() };
      await createUser(user).expect(HttpStatus.Created);
      const cookies = await Promise.all(
        [1, 2, 3, 4].map((number) => loginWithUserAgent(user, `security-device-test-${number}`)),
      );
      const firstDeviceId = extractDeviceId(cookies[0]!);
      const initialResponse = await getSecurityDevices(cookies[0]!);
      const initialDevices = initialResponse.body as Array<{
        deviceId: string;
        lastActiveDate: string;
      }>;
      const initialFirstDevice = initialDevices.find((device) => device.deviceId === firstDeviceId);

      expect(initialResponse.status).toBe(HttpStatus.Ok);
      expect(initialDevices).toHaveLength(4);
      expect(initialFirstDevice).toBeDefined();

      await new Promise((resolve) => setTimeout(resolve, 1100));
      const refreshedResponse = await refreshToken(cookies[0]!);
      expect(refreshedResponse.status).toBe(HttpStatus.Ok);
      const refreshedCookie = extractRefreshCookie(refreshedResponse);
      const refreshedDevicesResponse = await getSecurityDevices(refreshedCookie);
      const refreshedDevices = refreshedDevicesResponse.body as typeof initialDevices;
      const refreshedFirstDevice = refreshedDevices.find(
        (device) => device.deviceId === firstDeviceId,
      );

      expect(refreshedDevicesResponse.status).toBe(HttpStatus.Ok);
      expect(refreshedDevices).toHaveLength(4);
      expect(refreshedDevices.map((device) => device.deviceId).sort()).toEqual(
        initialDevices.map((device) => device.deviceId).sort(),
      );
      expect(refreshedFirstDevice?.lastActiveDate).not.toBe(initialFirstDevice?.lastActiveDate);
    });

    it("should return 401 when the refresh cookie is malformed", async () => {
      const response = await getSecurityDevices("refreshToken=not-a-valid-token");
      expect(response.status).toBe(HttpStatus.Unauthorized);
    });
  });

  describe(`DELETE ${SECURITY_DEVICES_ROUTER_PATH}/:deviceId`, () => {
    it("should return 401 when no refresh cookie is provided", async () => {
      const response = await deleteSecurityDevice(new ObjectId().toString());
      expect(response.status).toBe(HttpStatus.Unauthorized);
    });

    it("should delete a device belonging to the current user", async () => {
      const { user, cookie } = await createLoggedInUser();
      const otherCookie = await createAnotherSession(user);
      const sessions = await securityDevicesCollection.find({}).toArray();
      const targetDevice = sessions.find((session) => session.deviceId !== extractDeviceId(cookie));

      expect(targetDevice).toBeDefined();
      const response = await deleteSecurityDevice(targetDevice!.deviceId, cookie);

      expect(response.status).toBe(HttpStatus.NoContent);
      expect(await securityDevicesCollection.countDocuments({ userId: targetDevice!.userId })).toBe(
        1,
      );
      const devicesResponse = await getSecurityDevices(cookie);
      expect(
        devicesResponse.body.map((device: { deviceId: string }) => device.deviceId),
      ).not.toContain(targetDevice!.deviceId);
      expect(otherCookie).not.toBe(cookie);
    });

    it("should return 403 when deleting another user's device", async () => {
      const first = await createLoggedInUser("user1", "user1@example.com");
      await createLoggedInUser("user2", "user2@example.com");
      const targetUser = await securityDevicesCollection.findOne({
        deviceId: { $ne: extractDeviceId(first.cookie) },
      });

      expect(targetUser).toBeDefined();
      const response = await deleteSecurityDevice(targetUser!.deviceId, first.cookie);
      expect(response.status).toBe(HttpStatus.Forbidden);
    });

    it("should return 404 when the device does not exist", async () => {
      const { cookie } = await createLoggedInUser();
      const response = await deleteSecurityDevice("missing-device", cookie);
      expect(response.status).toBe(HttpStatus.NotFound);
    });

    it("should return 400 when deviceId is empty", async () => {
      const { cookie } = await createLoggedInUser();
      const response = await deleteSecurityDevice("%20", cookie);
      expect(response.status).toBe(HttpStatus.BadRequest);
    });
  });

  describe(`DELETE ${SECURITY_DEVICES_ROUTER_PATH}`, () => {
    it("should return 401 when no refresh cookie is provided", async () => {
      const response = await deleteOtherSecurityDevices();
      expect(response.status).toBe(HttpStatus.Unauthorized);
    });

    it("should delete all other devices and keep the current device", async () => {
      const { user, cookie } = await createLoggedInUser();
      await createAnotherSession(user);

      const response = await deleteOtherSecurityDevices(cookie);

      expect(response.status).toBe(HttpStatus.NoContent);
      const devicesResponse = await getSecurityDevices(cookie);
      expect(devicesResponse.status).toBe(HttpStatus.Ok);
      expect(devicesResponse.body).toHaveLength(1);
      expect(devicesResponse.body[0]?.deviceId).toBe(extractDeviceId(cookie));
    });

    it("should remove a device after logout and keep it out of the device list", async () => {
      const { user } = await createLoggedInUser();
      const firstCookie = await loginWithUserAgent(user, "security-device-logout-1");
      const thirdCookie = await loginWithUserAgent(user, "security-device-logout-3");
      const thirdDeviceId = extractDeviceId(thirdCookie);

      await logout(thirdCookie).expect(HttpStatus.NoContent);
      const response = await getSecurityDevices(firstCookie);

      expect(response.status).toBe(HttpStatus.Ok);
      expect(response.body.map((device: { deviceId: string }) => device.deviceId)).not.toContain(
        thirdDeviceId,
      );
    });

    it("should return 404 when there are no other devices to delete", async () => {
      const { cookie } = await createLoggedInUser();
      const response = await deleteOtherSecurityDevices(cookie);
      expect(response.status).toBe(HttpStatus.NotFound);
    });
  });
});
