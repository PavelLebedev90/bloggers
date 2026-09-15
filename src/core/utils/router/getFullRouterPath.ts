import { BASE_PATH } from "../../consts/routers-path";

export const getFullRouterPath = (path: string) => {
  return `${BASE_PATH}/${path}`;
};
