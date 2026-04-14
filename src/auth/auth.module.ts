import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // PassportModule habilita el sistema de autenticación
    PassportModule,

    // JwtModule configura la generación y verificación de tokens
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto_urbanwear',
      signOptions: {
        expiresIn: '7d', // Token válido 7 días
      },
    }),
  ],
  providers: [
    AuthService,   // Lógica de registro y login
    JwtStrategy,   // Verificación de tokens en peticiones
  ],
  controllers: [AuthController],
  exports: [JwtModule], // Por si otros módulos necesitan verificar tokens
})
export class AuthModule {}