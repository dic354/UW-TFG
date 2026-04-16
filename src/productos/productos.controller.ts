import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FiltroProductoDto } from './dto/filtro-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Público con filtros opcionales por query params:
  // GET /productos?nombre=camiseta&precioMin=10&precioMax=50&talla=M
  @Get()
  findAll(@Query() filtros: FiltroProductoDto) {
    return this.productosService.findAll(filtros);
  }

  // Público
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // Solo admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  // Solo admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto
  ) {
    return this.productosService.update(id, dto);
  }

  // Solo admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}