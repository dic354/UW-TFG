import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FiltroProductoDto } from './dto/filtro-producto.dto';

@Injectable()
export class ProductosService {
    constructor(private prisma: PrismaService) { }

    // ─── LISTAR CON FILTROS Y PAGINACIÓN ───────────────────
    async findAll(filtros: FiltroProductoDto) {
        const {
            nombre, categoriaId, precioMin,
            precioMax, talla, color,
            pagina = 1, limite = 12
        } = filtros;

        // Construimos el objeto where dinámicamente
        // solo añadimos filtros que vengan en la petición
        const where: any = { activo: true };

        if (nombre) {
            where.nombre = { contains: nombre }; // búsqueda parcial
        }
        if (categoriaId) {
            where.categoriaId = categoriaId;
        }
        if (precioMin || precioMax) {
            where.precio = {};
            if (precioMin) where.precio.gte = precioMin; // greater than or equal
            if (precioMax) where.precio.lte = precioMax; // less than or equal
        }
        if (talla) {
            where.talla = talla;
        }
        if (color) {
            where.color = { contains: color };
        }

        // Paginación
        const skip = (pagina - 1) * limite;

        // Ejecutamos dos consultas en paralelo:
        // una para los datos y otra para el total
        const [productos, total] = await Promise.all([
            this.prisma.producto.findMany({
                where,
                include: {
                    categoria: {
                        select: { id: true, nombre: true }
                    },
                    imagenes: true,
                },
                skip,
                take: limite,
                orderBy: { fechaCreacion: 'desc' }
            }),
            this.prisma.producto.count({ where })
        ]);

        return {
            datos: productos,
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite)
        };
    }

    // ─── VER UNO ───────────────────────────────────────────
    async findOne(id: number) {
        const producto = await this.prisma.producto.findUnique({
            where: { id },
            include: {
                categoria: true,
                imagenes: {
                    orderBy: { orden: 'asc' }
                },
                resenas: {
                    include: {
                        usuario: {
                            select: { id: true, nombre: true }
                        }
                    },
                    orderBy: { fechaResena: 'desc' }
                }
            }
        });

        if (!producto) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }

        return producto;
    }

    // ─── CREAR ─────────────────────────────────────────────
    async create(dto: CreateProductoDto) {
        // Verificar que la categoría existe
        const categoria = await this.prisma.categoria.findUnique({
            where: { id: dto.categoriaId }
        });

        if (!categoria) {
            throw new NotFoundException(`Categoría con id ${dto.categoriaId} no encontrada`);
        }

        return this.prisma.producto.create({
            data: dto,
            include: { categoria: true }
        });
    }

    // ─── EDITAR ────────────────────────────────────────────
    async update(id: number, dto: UpdateProductoDto) {
        await this.findOne(id);

        if (dto.categoriaId) {
            const categoria = await this.prisma.categoria.findUnique({
                where: { id: dto.categoriaId }
            });

            if (!categoria) {
                throw new NotFoundException(`Categoría con id ${dto.categoriaId} no encontrada`);
            }
        }

        return this.prisma.producto.update({
            where: { id },
            data: dto,
            include: { categoria: true }
        });
    }

    // ─── ELIMINAR (desactivar) ─────────────────────────────
    // En ecommerce nunca se borran productos reales
    // se desactivan para no perder el historial de pedidos
    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.producto.update({
            where: { id },
            data: { activo: false }
        });
    }
}