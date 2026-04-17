import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) { }

  // ─── LISTAR TODAS ──────────────────────────────────────
  async findAll() {
    return this.prisma.categoria.findMany({
      // Incluimos el contador de productos de cada categoría
      include: {
        _count: {
          select: { productos: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });
  }

  // ─── VER UNA CON SUS PRODUCTOS ─────────────────────────
  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: {
          // Solo productos activos
          where: { activo: true },
          select: {
            id: true,
            nombre: true,
            precio: true,
            imagenUrl: true,
            stock: true,
            talla: true,
            color: true,
          }
        }
      }
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    return categoria;
  }

  // ─── CREAR ─────────────────────────────────────────────
  async create(dto: CreateCategoriaDto) {
    // Verificar que no existe una categoría con el mismo nombre
    const existe = await this.prisma.categoria.findUnique({
      where: { nombre: dto.nombre }
    });

    if (existe) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    return this.prisma.categoria.create({
      data: dto
    });
  }

  // ─── EDITAR ────────────────────────────────────────────
  async update(id: number, dto: UpdateCategoriaDto) {
    // Verificar que la categoría existe
    await this.findOne(id);

    // Si viene un nombre nuevo verificar que no está en uso
    if (dto.nombre) {
      const existe = await this.prisma.categoria.findUnique({
        where: { nombre: dto.nombre }
      });

      if (existe && existe.id !== id) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
    }

    return this.prisma.categoria.update({
      where: { id },
      data: dto
    });
  }

  // ─── ELIMINAR ──────────────────────────────────────────
  async remove(id: number) {
    // Verificar que existe
    await this.findOne(id);

    // Verificar que no tiene productos asociados
    const productos = await this.prisma.producto.count({
      where: { categoriaId: id }
    });

    if (productos > 0) {
      throw new ConflictException(
        `No se puede eliminar la categoría porque tiene ${productos} productos asociados`
      );
    }

    return this.prisma.categoria.delete({
      where: { id }
    });
  }
}