const BASE_PATH = process.env.BASE_PATH || "";

export enum ROUTER_PATH {
  TESTING = "testing",
  VIDEOS = "videos",
}

export const getFullProuterPath = (path: ROUTER_PATH) => {
  return `${BASE_PATH}/${path}`;
};
