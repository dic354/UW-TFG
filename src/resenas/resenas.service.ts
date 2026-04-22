import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';

@Injectable()
export class ResenasService {
  constructor(private prisma: PrismaService) {}

  // ─── VER RESEÑAS DE UN PRODUCTO (público) ─────────────
  async findByProducto(productoId: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId }
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    const resenas = await this.prisma.resena.findMany({
      where: { productoId },
      include: {
        usuario: {
          select: { id: true, nombre: true }
        }
      },
      orderBy: { fechaResena: 'desc' }
    });

    // Calcular media de puntuaciones
    const media = resenas.length > 0
      ? resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length
      : 0;

    return {
      resenas,
      totalResenas: resenas.length,
      mediaPuntuacion: parseFloat(media.toFixed(1))
    };
  }

  // ─── CREAR RESEÑA ──────────────────────────────────────
  async create(usuarioId: number, dto: CreateResenaDto) {

    // 1. Verificar que el producto existe
    const producto = await this.prisma.producto.findUnique({
      where: { id: dto.productoId }
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // 2. Verificar que el usuario compró el producto
    const haComprado = await this.prisma.detallePedido.findFirst({
      where: {
        productoId: dto.productoId,
        pedido: {
          usuarioId,
          estado: { in: ['entregado', 'enviado'] }
        }
      }
    });

    if (!haComprado) {
      throw new BadRequestException(
        'Solo puedes reseñar productos que hayas comprado'
      );
    }

    // 3. Verificar que no ha reseñado ya este producto
    const yaReseno = await this.prisma.resena.findUnique({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId: dto.productoId
        }
      }
    });

    if (yaReseno) {
      throw new ConflictException('Ya has reseñado este producto');
    }

    return this.prisma.resena.create({
      data: {
        usuarioId,
        productoId: dto.productoId,
        puntuacion: dto.puntuacion,
        comentario: dto.comentario,
      },
      include: {
        usuario: {
          select: { id: true, nombre: true }
        }
      }
    });
  }

  // ─── EDITAR RESEÑA ─────────────────────────────────────
  async update(id: number, usuarioId: number, dto: UpdateResenaDto) {
    const resena = await this.prisma.resena.findUnique({
      where: { id }
    });

    if (!resena) {
      throw new NotFoundException('Reseña no encontrada');
    }

    // Solo el autor puede editar su reseña
    if (resena.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes editar esta reseña');
    }

    return this.prisma.resena.update({
      where: { id },
      data: dto,
      include: {
        usuario: {
          select: { id: true, nombre: true }
        }
      }
    });
  }

  // ─── ELIMINAR RESEÑA ───────────────────────────────────
  async remove(id: number, usuarioId: number, esAdmin: boolean) {
    const resena = await this.prisma.resena.findUnique({
      where: { id }
    });

    if (!resena) {
      throw new NotFoundException('Reseña no encontrada');
    }

    // Solo el autor o un admin puede eliminar
    if (!esAdmin && resena.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes eliminar esta reseña');
    }

    await this.prisma.resena.delete({ where: { id } });

    return { message: 'Reseña eliminada correctamente' };
  }
}