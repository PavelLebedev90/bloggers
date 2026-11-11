import { Router } from "express";
import { TESTING_ROUTER } from "../modules/testing/consts/testing-router-path.const";
import { container } from "../composition-root";
import { TestingController } from "../modules/testing/controller/testing.controller";

export const testingRouter: Router = Router({});
const testingController = container.get(TestingController);

testingRouter.delete(TESTING_ROUTER.ALL_DATA, testingController.deleteAll.bind(testingController));
