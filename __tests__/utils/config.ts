import express from "express";
import { setupApp } from "../../src/setup-app";
import { getFullProuterPath, ROUTER_PATH } from "../../src/core/types/routes-path";

const expressApp = express();
export const app = setupApp(expressApp);

export const VIDEOS_PATH = getFullProuterPath(ROUTER_PATH.VIDEOS);
export const TESTING_PATH = getFullProuterPath(ROUTER_PATH.TESTING);
