import { Test, TestingModule } from '@nestjs/testing';
import { LabTestsController } from './lab-tests.controller';

describe('LabTestsController', () => {
  let controller: LabTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabTestsController],
    }).compile();

    controller = module.get<LabTestsController>(LabTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
