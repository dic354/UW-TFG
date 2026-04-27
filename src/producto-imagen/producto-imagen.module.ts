import { Module } from '@nestjs/common';
import { ProductoImagenService } from './producto-imagen.service';
import { ProductoImagenController } from './producto-imagen.controller';

@Module({
  controllers: [ProductoImagenController],
  providers: [ProductoImagenService],
  exports: [ProductoImagenService],
})
export class ProductoImagenModule {}