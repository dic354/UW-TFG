import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Le decimos dónde buscar el token en cada petición
      // El frontend lo mandará en la cabecera así:
      // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // false = si el token expiró lanza error automáticamente
      ignoreExpiration: false,

      // Clave secreta para verificar la firma del token
      // Debe ser la misma que usamos para crearlo en auth.module.ts
      secretOrKey: process.env.JWT_SECRET || 'secreto_urbanwear',
    });
  }

  // Este método se ejecuta automáticamente DESPUÉS de
  // verificar que el token es válido y no ha expirado
  // payload = los datos que guardamos dentro del token
  // cuando el usuario hizo login: { sub, email, rol }
  async validate(payload: { sub: number; email: string; rol: string }) {

    // Comprobamos que el usuario sigue existiendo en la BD
    // Por si fue eliminado después de recibir el token
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Lo que devolvemos aquí se guarda en req.user
    // y estará disponible en cualquier controlador protegido así:
    // @Get('perfil')
    // getPerfil(@Request() req) {
    //   console.log(req.user) //← aquí está el usuario
    // }
    return usuario;
  }
}