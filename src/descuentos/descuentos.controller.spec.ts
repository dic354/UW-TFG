import { Test, TestingModule } from '@nestjs/testing';
import { DescuentosController } from './descuentos.controller';

describe('DescuentosController', () => {
  let controller: DescuentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DescuentosController],
    }).compile();

    controller = module.get<DescuentosController>(DescuentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
