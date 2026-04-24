import {
    Injectable,
    NotFoundException,
    ConflictException,
    UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) { }

    // ─── VER MI PERFIL ─────────────────────────────────────
    async findMe(id: number) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                direccion: true,
                ciudad: true,
                codigoPostal: true,
                rol: true,
                fechaRegistro: true,
            }
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    // ─── ACTUALIZAR MI PERFIL ──────────────────────────────
    async updateMe(id: number, dto: UpdateUsuarioDto) {

        // Si viene email nuevo verificar que no está en uso
        if (dto.email) {
            const existe = await this.prisma.usuario.findUnique({
                where: { email: dto.email }
            });

            if (existe && existe.id !== id) {
                throw new ConflictException('Este email ya está en uso');
            }
        }

        const usuario = await this.prisma.usuario.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                direccion: true,
                ciudad: true,
                codigoPostal: true,
                rol: true,
            }
        });

        return usuario;
    }

    // ─── CAMBIAR CONTRASEÑA ────────────────────────────────
    async changePassword(id: number, dto: ChangePasswordDto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id }
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Verificar contraseña actual
        const contrasenaValida = await bcrypt.compare(
            dto.contrasenaActual,
            usuario.contrasenaHash
        );

        if (!contrasenaValida) {
            throw new UnauthorizedException('La contraseña actual no es correcta');
        }

        const nuevoHash = await bcrypt.hash(dto.contrasenaNueva, 10);

        await this.prisma.usuario.update({
            where: { id },
            data: { contrasenaHash: nuevoHash }
        });

        return { message: 'Contraseña actualizada correctamente' };
    }

    // ─── TODOS LOS USUARIOS (solo admin) ──────────────────
    async findAll() {
        return this.prisma.usuario.findMany({
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                rol: true,
                fechaRegistro: true,
                _count: {
                    select: { pedidos: true }
                }
            },
            orderBy: { fechaRegistro: 'desc' }
        });
    }

    // ─── VER UN USUARIO (solo admin) ──────────────────────
    async findOne(id: number) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                direccion: true,
                ciudad: true,
                codigoPostal: true,
                rol: true,
                fechaRegistro: true,
                pedidos: {
                    select: {
                        id: true,
                        estado: true,
                        total: true,
                        fechaPedido: true,
                    },
                    orderBy: { fechaPedido: 'desc' }
                }
            }
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }
}