import { Module } from '@nestjs/common';
import { ProductoImagenService } from './producto-imagen.service';
import { ProductoImagenController } from './producto-imagen.controller';

@Module({
  providers: [ProductoImagenService],
  controllers: [ProductoImagenController]
})
export class ProductoImagenModule {}
