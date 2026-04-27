import { Test, TestingModule } from '@nestjs/testing';
import { ProductoImagenService } from './producto-imagen.service';

describe('ProductoImagenService', () => {
  let service: ProductoImagenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoImagenService],
    }).compile();

    service = module.get<ProductoImagenService>(ProductoImagenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
