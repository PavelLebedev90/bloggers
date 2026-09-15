import { Router } from "express";
import { deleteTestingHandler } from "./handlers/deleteTestingHandler";
import { ROUTER_PATH } from "../../core/consts/routers-path";

export const testingRouter: Router = Router({});

testingRouter.delete(ROUTER_PATH.TESTING.ALL_DATA, deleteTestingHandler);
