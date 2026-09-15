import express from "express";
import { setupApp } from "../../src/setup-app";
import { ROUTER_PATH } from "../../src/core/consts/routers-path";
import { getFullRouterPath } from "../../src/core/utils/router/getFullRouterPath";

const expressApp = express();
export const app = setupApp(expressApp);

export const VIDEOS_PATH = getFullRouterPath(ROUTER_PATH.VIDEOS.ROOT);
const TESTING_PATH = getFullRouterPath(ROUTER_PATH.TESTING.ROOT);
export const TESTING_ALL_DATA = `${TESTING_PATH}${ROUTER_PATH.TESTING.ALL_DATA}`;
