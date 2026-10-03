import { config } from "../../../core/config/setup.config";

export const TESTING_ROUTER = {
  ROOT: "/testing",
  BASE: "/",
  ALL_DATA: "/all-data",
} as const;

export const TESTING_ROUTER_PATH = `${config.basePath}${TESTING_ROUTER.ROOT}`;
export const TESTING_ALL_DATA = `${TESTING_ROUTER_PATH}${TESTING_ROUTER.ALL_DATA}`;
