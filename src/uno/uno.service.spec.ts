import { Test, TestingModule } from '@nestjs/testing';
import { UnoService } from './uno.service';

describe('UnoService', () => {
  let service: UnoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnoService],
    }).compile();

    service = module.get<UnoService>(UnoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
