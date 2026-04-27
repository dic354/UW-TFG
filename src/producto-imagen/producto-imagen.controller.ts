import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { ProductoImagenService } from './producto-imagen.service';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { UpdateImagenDto } from './dto/update-imagen.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('producto-imagen')
export class ProductoImagenController {
  constructor(private readonly productoImagenService: ProductoImagenService) {}

  // GET /producto-imagen/producto/:id → ver imágenes (público)
  @Get('producto/:id')
  findByProducto(@Param('id', ParseIntPipe) id: number) {
    return this.productoImagenService.findByProducto(id);
  }

  // Solo admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateImagenDto) {
    return this.productoImagenService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImagenDto
  ) {
    return this.productoImagenService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoImagenService.remove(id);
  }
}