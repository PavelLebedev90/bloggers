const PORT = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === "production";

const checkEnvironment = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable: ${name}`);
  }
  return value;
};

export const config = {
  port: Number(PORT),
  basePath: checkEnvironment("BASE_PATH"),
  authLogin: checkEnvironment("AUTH_LOGIN"),
  authPassword: checkEnvironment("AUTH_PASSWORD"),
  mongodbUrl: checkEnvironment(isProduction ? "MONGO_PATH_PROD" : "MONGO_PATH"),
  mongodbName: checkEnvironment(isProduction ? "MONGO_DB_NAME_PROD" : "MONGO_DB_NAME"),
};
