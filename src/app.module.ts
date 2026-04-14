import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

// Módulo raíz de la aplicación
// Aquí se registran todos los módulos principales
@Module({
  imports: [
    PrismaModule, // Primero porque todos los demás lo necesitan
    AuthModule,   // Módulo de autenticación
    // Aquí irán llegando: CategoriasModule, ProductosModule...
  ],
})
export class AppModule {}