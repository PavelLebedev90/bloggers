import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;

export const BASE_PATH = process.env.BASE_PATH || "";

export const AUTH_LOGIN = process.env.AUTH_LOGIN;
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

export const MONGO_PATH =
  (isProduction
    ? process.env.MONGO_PATH_PROD
    : isTest
      ? process.env.MONGO_PATH_TEST
      : process.env.MONGO_PATH_DEV) || "";

export const DB_NAME =
  (isProduction
    ? process.env.MONGO_DB_NAME_PROD
    : isTest
      ? process.env.MONGO_DB_NAME_TEST
      : process.env.MONGO_DB_NAME_DEV) || "";
