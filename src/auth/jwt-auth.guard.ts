import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Un Guard es un "portero" que decide si una petición
// puede entrar a un endpoint o no
// Se coloca encima de los endpoints que queremos proteger
// Si el token no es válido devuelve 401 Unauthorized
// Si el token es válido deja pasar y ejecuta el endpoint
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Ejemplo de uso en un controlador:
// @UseGuards(JwtAuthGuard)   ← protege este endpoint
// @Get('mis-pedidos')
// getMisPedidos(@Request() req) {
//   return req.user; // usuario verificado por JwtStrategy
// }