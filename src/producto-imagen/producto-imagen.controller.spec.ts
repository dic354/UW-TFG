import { Test, TestingModule } from '@nestjs/testing';
import { ProductoImagenController } from './producto-imagen.controller';

describe('ProductoImagenController', () => {
  let controller: ProductoImagenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoImagenController],
    }).compile();

    controller = module.get<ProductoImagenController>(ProductoImagenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
