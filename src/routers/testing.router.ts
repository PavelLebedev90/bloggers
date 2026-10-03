import { Router } from "express";
import { deleteTestingHandler } from "../modules/testing/handlers/delete.handler";
import { TESTING_ROUTER } from "../modules/testing/consts/testing-router-path.const";

export const testingRouter: Router = Router({});

testingRouter.delete(TESTING_ROUTER.ALL_DATA, deleteTestingHandler);
