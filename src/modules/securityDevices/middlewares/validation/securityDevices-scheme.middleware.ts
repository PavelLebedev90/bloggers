import z from "zod";

export const securityDevicesParamsScheme = z.object({
  params: z.object({
    deviceId: z.string().trim().nonempty(),
  }),
});
