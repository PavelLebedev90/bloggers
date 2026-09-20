import express from "express";
import { setupApp } from "../../src/setup-app";

const expressApp = express();
export const app = setupApp(expressApp);
