import { Test, TestingModule } from '@nestjs/testing';
import { SavedLeadsController } from './saved-leads.controller';

describe('SavedLeadsController', () => {
  let controller: SavedLeadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedLeadsController],
    }).compile();

    controller = module.get<SavedLeadsController>(SavedLeadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
