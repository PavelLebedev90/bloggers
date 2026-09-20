import { Router } from "express";
import { deleteTestingHandler } from "./handlers/delete.handler";
import { TESTING_ROUTER } from "./consts/testing-router-path.const";

export const testingRouter: Router = Router({});

testingRouter.delete(TESTING_ROUTER.ALL_DATA, deleteTestingHandler);
