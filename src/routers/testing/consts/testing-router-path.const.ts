import { BASE_PATH } from "../../../core/config/base-path.config";

export const TESTING_ROUTER = {
  ROOT: "/testing",
  BASE: "/",
  ALL_DATA: "/all-data",
} as const;

export const TESTING_ROUTER_PATH = `${BASE_PATH}${TESTING_ROUTER.ROOT}`;
export const TESTING_ALL_DATA = `${TESTING_ROUTER_PATH}${TESTING_ROUTER.ALL_DATA}`;
