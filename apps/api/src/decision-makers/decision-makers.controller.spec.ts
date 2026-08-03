import { Test, TestingModule } from '@nestjs/testing';
import { DecisionMakersController } from './decision-makers.controller';

describe('DecisionMakersController', () => {
  let controller: DecisionMakersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecisionMakersController],
    }).compile();

    controller = module.get<DecisionMakersController>(DecisionMakersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
