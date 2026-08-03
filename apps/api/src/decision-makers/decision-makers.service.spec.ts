import { Test, TestingModule } from '@nestjs/testing';
import { DecisionMakersService } from './decision-makers.service';

describe('DecisionMakersService', () => {
  let service: DecisionMakersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecisionMakersService],
    }).compile();

    service = module.get<DecisionMakersService>(DecisionMakersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
