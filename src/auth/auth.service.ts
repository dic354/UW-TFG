import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,   // Conexión con la BD
    private jwtService: JwtService,  // Generación de tokens JWT
  ) {}

  // ─── REGISTRO ────────────────────────────────────────────
  async register(dto: RegisterDto) {

    // 1. Verificar que el email no esté ya registrado
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // HTTP 409 Conflict = el recurso ya existe
    if (existe) {
      throw new ConflictException('Este correo ya está registrado');
    }

    // 2. Hashear la contraseña antes de guardarla
    // bcrypt genera un hash diferente cada vez aunque
    // la contraseña sea la misma, gracias al "salt"
    // El número 10 indica las rondas de encriptación
    const hash = await bcrypt.hash(dto.contrasena, 10);

    // 3. Guardar el usuario en la BD
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        contrasenaHash: hash,
        telefono: dto.telefono,
        direccion: dto.direccion,
        ciudad: dto.ciudad,
        codigoPostal: dto.codigoPostal,
      },
    });

    // 4. Eliminar el hash de la respuesta por seguridad
    // El operador ... (spread) copia todo excepto contrasenaHash
    const { contrasenaHash, ...resultado } = usuario;
    return resultado;
  }

  // ─── LOGIN ───────────────────────────────────────────────
  async login(dto: LoginDto) {

    // 1. Buscar el usuario por email
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    // Mismo mensaje para email y contraseña incorrectos
    // así no damos pistas de cuál de los dos falló
    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // 2. Comparar contraseña enviada con el hash guardado
    // bcrypt.compare() internamente hashea dto.contrasena
    // y compara el resultado con usuario.contrasenaHash
    const contrasenaValida = await bcrypt.compare(
      dto.contrasena,
      usuario.contrasenaHash,
    );

    if (!contrasenaValida) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // 3. Crear el payload que irá dentro del token JWT
    // sub es el estándar JWT para identificar al usuario
    // Esta info la recuperamos después en JwtStrategy.validate()
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    // 4. Devolver el token y datos básicos del usuario
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}