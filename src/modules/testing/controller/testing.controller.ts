import { Response, Request } from "express";
import { inject, injectable } from "inversify";
import { HttpStatus } from "../../../core/types/http-statuses.type";
import { TestingRepository } from "../repository/testing.repository";

@injectable()
export class TestingController {
  constructor(@inject(TestingRepository) private testingRepository: TestingRepository) {}
  async deleteAll(_req: Request, res: Response) {
    await this.testingRepository.clearDB();
    res.sendStatus(HttpStatus.NoContent);
  }
}
