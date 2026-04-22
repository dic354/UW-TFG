import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { CarritoModule } from './carrito/carrito.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { DescuentosModule } from './descuentos/descuentos.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoriasModule,
    ProductosModule,
    CarritoModule,
    PedidosModule,
    DescuentosModule,
  ],
})
export class AppModule {}