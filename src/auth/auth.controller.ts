import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// @Controller('auth') define el prefijo de todas las rutas
// de este controlador. Quedarán así:
// POST /auth/register
// POST /auth/login
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register') → POST /auth/register
  // @Body() extrae el JSON del cuerpo de la petición
  // y lo convierte en RegisterDto automáticamente
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // @Post('login') → POST /auth/login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}