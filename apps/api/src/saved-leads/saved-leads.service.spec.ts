import { Test, TestingModule } from '@nestjs/testing';
import { SavedLeadsService } from './saved-leads.service';

describe('SavedLeadsService', () => {
  let service: SavedLeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedLeadsService],
    }).compile();

    service = module.get<SavedLeadsService>(SavedLeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
