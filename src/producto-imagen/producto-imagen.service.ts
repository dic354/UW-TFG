import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { UpdateImagenDto } from './dto/update-imagen.dto';

@Injectable()
export class ProductoImagenService {
    constructor(private prisma: PrismaService) { }

    // ─── VER IMÁGENES DE UN PRODUCTO ───────────────────────
    async findByProducto(productoId: number) {
        const producto = await this.prisma.producto.findUnique({
            where: { id: productoId }
        });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        return this.prisma.productoImagen.findMany({
            where: { productoId },
            orderBy: { orden: 'asc' }
        });
    }

    // ─── AÑADIR IMAGEN ─────────────────────────────────────
    async create(dto: CreateImagenDto) {
        const producto = await this.prisma.producto.findUnique({
            where: { id: dto.productoId }
        });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        return this.prisma.productoImagen.create({
            data: dto
        });
    }

    // ─── ACTUALIZAR IMAGEN ─────────────────────────────────
    async update(id: number, dto: UpdateImagenDto) {
        const imagen = await this.prisma.productoImagen.findUnique({
            where: { id }
        });

        if (!imagen) {
            throw new NotFoundException('Imagen no encontrada');
        }

        return this.prisma.productoImagen.update({
            where: { id },
            data: dto
        });
    }

    // ─── ELIMINAR IMAGEN ───────────────────────────────────
    async remove(id: number) {
        const imagen = await this.prisma.productoImagen.findUnique({
            where: { id }
        });

        if (!imagen) {
            throw new NotFoundException('Imagen no encontrada');
        }

        await this.prisma.productoImagen.delete({ where: { id } });

        return { message: 'Imagen eliminada correctamente' };
    }
}