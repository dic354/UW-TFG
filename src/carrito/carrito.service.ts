import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCarritoDto } from './dto/add-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';

@Injectable()
export class CarritoService {
  constructor(private prisma: PrismaService) {}

  // ─── VER MI CARRITO ────────────────────────────────────
  async findByUsuario(usuarioId: number) {
    const items = await this.prisma.carrito.findMany({
      where: { usuarioId },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            imagenUrl: true,
            stock: true,
            activo: true,
          }
        }
      },
      orderBy: { fechaAgregado: 'desc' }
    });

    // Calculamos el total del carrito
    const total = items.reduce((acc, item) => {
      return acc + Number(item.producto.precio) * item.cantidad;
    }, 0);

    return {
      items,
      total: total.toFixed(2),
      totalItems: items.length
    };
  }

  // ─── AÑADIR PRODUCTO ───────────────────────────────────
  async addItem(usuarioId: number, dto: AddCarritoDto) {

    // 1. Verificar que el producto existe y está activo
    const producto = await this.prisma.producto.findUnique({
      where: { id: dto.productoId }
    });

    if (!producto || !producto.activo) {
      throw new NotFoundException('Producto no encontrado o no disponible');
    }

    // 2. Verificar que hay stock suficiente
    if (producto.stock < dto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Solo quedan ${producto.stock} unidades`
      );
    }

    // 3. Si el producto ya está en el carrito, actualizar cantidad
    // Si no, crearlo
    // upsert = update si existe, insert si no existe
    const item = await this.prisma.carrito.upsert({
      where: {
        usuarioId_productoId: {
          usuarioId,
          productoId: dto.productoId,
        }
      },
      update: {
        // Si ya existe sumamos la cantidad nueva a la actual
        cantidad: { increment: dto.cantidad }
      },
      create: {
        usuarioId,
        productoId: dto.productoId,
        cantidad: dto.cantidad,
      },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            imagenUrl: true,
            stock: true,
          }
        }
      }
    });

    return item;
  }

  // ─── ACTUALIZAR CANTIDAD ───────────────────────────────
  async updateItem(id: number, usuarioId: number, dto: UpdateCarritoDto) {

    // Verificar que el item existe y pertenece al usuario
    const item = await this.prisma.carrito.findFirst({
      where: { id, usuarioId },
      include: { producto: true }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    // Verificar stock
    if (item.producto.stock < dto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Solo quedan ${item.producto.stock} unidades`
      );
    }

    return this.prisma.carrito.update({
      where: { id },
      data: { cantidad: dto.cantidad },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            imagenUrl: true,
          }
        }
      }
    });
  }

  // ─── ELIMINAR UN ITEM ──────────────────────────────────
  async removeItem(id: number, usuarioId: number) {

    // Verificar que el item existe y pertenece al usuario
    const item = await this.prisma.carrito.findFirst({
      where: { id, usuarioId }
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    await this.prisma.carrito.delete({ where: { id } });

    return { message: 'Producto eliminado del carrito' };
  }

  // ─── VACIAR CARRITO ────────────────────────────────────
  async clearCarrito(usuarioId: number) {
    await this.prisma.carrito.deleteMany({
      where: { usuarioId }
    });

    return { message: 'Carrito vaciado correctamente' };
  }
}