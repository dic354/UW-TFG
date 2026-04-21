import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  // ─── CREAR PEDIDO DESDE CARRITO ────────────────────────
  async create(usuarioId: number, dto: CreatePedidoDto) {

    // 1. Obtener items del carrito del usuario
    const carrito = await this.prisma.carrito.findMany({
      where: { usuarioId },
      include: { producto: true }
    });

    if (carrito.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    // 2. Verificar stock de todos los productos
    for (const item of carrito) {
      if (!item.producto.activo) {
        throw new BadRequestException(
          `El producto ${item.producto.nombre} ya no está disponible`
        );
      }
      if (item.producto.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${item.producto.nombre}. Solo quedan ${item.producto.stock} unidades`
        );
      }
    }

    // 3. Calcular total
    let total = carrito.reduce((acc, item) => {
      return acc + Number(item.producto.precio) * item.cantidad;
    }, 0);

    // 4. Aplicar descuento si viene código
    let descuentoId: number | undefined;
    if (dto.codigoDescuento) {
      const descuento = await this.prisma.descuento.findUnique({
        where: { codigo: dto.codigoDescuento }
      });

      if (!descuento || !descuento.activo) {
        throw new BadRequestException('Código de descuento no válido');
      }

      const ahora = new Date();
      if (ahora < descuento.fechaInicio || ahora > descuento.fechaFin) {
        throw new BadRequestException('El código de descuento ha expirado');
      }

      if (descuento.usosMaximos && descuento.usosActuales >= descuento.usosMaximos) {
        throw new BadRequestException('El código de descuento ha alcanzado su límite de usos');
      }

      // Aplicar porcentaje de descuento
      total = total - (total * Number(descuento.porcentaje) / 100);
      descuentoId = descuento.id;
    }

    // 5. Crear pedido con sus detalles en una transacción
    // Si algo falla todo se revierte automáticamente
    const pedido = await this.prisma.$transaction(async (tx) => {

      // Crear el pedido
      const nuevoPedido = await tx.pedido.create({
        data: {
          usuarioId,
          total,
          direccionEnvio: dto.direccionEnvio,
          ciudadEnvio: dto.ciudadEnvio,
          codigoPostalEnvio: dto.codigoPostalEnvio,
          metodoPago: dto.metodoPago,
          descuentoId,
          // Crear los detalles del pedido automáticamente
          detalles: {
            create: carrito.map(item => ({
              productoId: item.productoId,
              cantidad: item.cantidad,
              precioUnitario: item.producto.precio,
              subtotal: Number(item.producto.precio) * item.cantidad,
            }))
          }
        },
        include: {
          detalles: {
            include: { producto: true }
          }
        }
      });

      // Descontar stock de cada producto
      for (const item of carrito) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: { stock: { decrement: item.cantidad } }
        });
      }

      // Incrementar usos del descuento si se usó
      if (descuentoId) {
        await tx.descuento.update({
          where: { id: descuentoId },
          data: { usosActuales: { increment: 1 } }
        });
      }

      // Vaciar el carrito
      await tx.carrito.deleteMany({ where: { usuarioId } });

      return nuevoPedido;
    });

    return pedido;
  }

  // ─── MIS PEDIDOS (usuario) ─────────────────────────────
  async findByUsuario(usuarioId: number) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                imagenUrl: true,
              }
            }
          }
        },
        descuento: {
          select: { codigo: true, porcentaje: true }
        }
      },
      orderBy: { fechaPedido: 'desc' }
    });
  }

  // ─── VER UN PEDIDO ─────────────────────────────────────
  async findOne(id: number, usuarioId: number, esAdmin: boolean) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        detalles: {
          include: { producto: true }
        },
        usuario: {
          select: { id: true, nombre: true, email: true }
        },
        descuento: true
      }
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    // Un cliente solo puede ver sus propios pedidos
    if (!esAdmin && pedido.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para ver este pedido');
    }

    return pedido;
  }

  // ─── TODOS LOS PEDIDOS (solo admin) ───────────────────
  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true }
        },
        detalles: true,
      },
      orderBy: { fechaPedido: 'desc' }
    });
  }

  // ─── ACTUALIZAR ESTADO (solo admin) ───────────────────
  async updateEstado(id: number, dto: UpdateEstadoDto) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id }
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    return this.prisma.pedido.update({
      where: { id },
      data: {
        estado: dto.estado,
        // Si se marca como enviado guardamos la fecha
        fechaEnvio: dto.estado === 'enviado' ? new Date() : undefined,
      }
    });
  }
}