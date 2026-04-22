import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { ValidarDescuentoDto } from './dto/validar-descuento.dto';

@Injectable()
export class DescuentosService {
  constructor(private prisma: PrismaService) {}

  // ─── LISTAR TODOS (admin) ──────────────────────────────
  async findAll() {
    return this.prisma.descuento.findMany({
      include: {
        _count: { select: { pedidos: true } }
      },
      orderBy: { fechaInicio: 'desc' }
    });
  }

  // ─── VER UNO (admin) ───────────────────────────────────
  async findOne(id: number) {
    const descuento = await this.prisma.descuento.findUnique({
      where: { id },
      include: {
        _count: { select: { pedidos: true } }
      }
    });

    if (!descuento) {
      throw new NotFoundException(`Descuento con id ${id} no encontrado`);
    }

    return descuento;
  }

  // ─── CREAR (admin) ─────────────────────────────────────
  async create(dto: CreateDescuentoDto) {
    const existe = await this.prisma.descuento.findUnique({
      where: { codigo: dto.codigo }
    });

    if (existe) {
      throw new ConflictException('Ya existe un descuento con ese código');
    }

    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFin = new Date(dto.fechaFin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio'
      );
    }

    return this.prisma.descuento.create({
      data: {
        ...dto,
        fechaInicio,
        fechaFin,
      }
    });
  }

  // ─── EDITAR (admin) ────────────────────────────────────
  async update(id: number, dto: UpdateDescuentoDto) {
    await this.findOne(id);

    if (dto.codigo) {
      const existe = await this.prisma.descuento.findUnique({
        where: { codigo: dto.codigo }
      });

      if (existe && existe.id !== id) {
        throw new ConflictException('Ya existe un descuento con ese código');
      }
    }

    const data: any = { ...dto };
    if (dto.fechaInicio) data.fechaInicio = new Date(dto.fechaInicio);
    if (dto.fechaFin) data.fechaFin = new Date(dto.fechaFin);

    return this.prisma.descuento.update({
      where: { id },
      data
    });
  }

  // ─── ELIMINAR (admin) ──────────────────────────────────
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.descuento.delete({
      where: { id }
    });
  }

  // ─── VALIDAR CÓDIGO (público) ──────────────────────────
  // Para que el frontend pueda comprobar si un código
  // es válido antes de confirmar el pedido
  async validar(dto: ValidarDescuentoDto) {
    const descuento = await this.prisma.descuento.findUnique({
      where: { codigo: dto.codigo }
    });

    if (!descuento || !descuento.activo) {
      throw new BadRequestException('Código de descuento no válido');
    }

    const ahora = new Date();
    if (ahora < descuento.fechaInicio || ahora > descuento.fechaFin) {
      throw new BadRequestException('El código de descuento ha expirado');
    }

    if (descuento.usosMaximos && descuento.usosActuales >= descuento.usosMaximos) {
      throw new BadRequestException(
        'El código de descuento ha alcanzado su límite de usos'
      );
    }

    return {
      valido: true,
      porcentaje: descuento.porcentaje,
      codigo: descuento.codigo,
    };
  }
}