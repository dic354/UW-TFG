import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import { ProductoImagenService } from './producto-imagen.service';
import { CreateImagenDto } from './dto/create-imagen.dto';
import { UpdateImagenDto } from './dto/update-imagen.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Producto Imágenes')
@Controller('producto-imagen')
export class ProductoImagenController {
  constructor(private readonly productoImagenService: ProductoImagenService) {}

  @ApiOperation({ summary: 'Ver imágenes de un producto' })
  @Get('producto/:id')
  findByProducto(@Param('id', ParseIntPipe) id: number) {
    return this.productoImagenService.findByProducto(id);
  }

  @ApiOperation({ summary: 'Añadir imagen a producto (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateImagenDto) {
    return this.productoImagenService.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar imagen (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImagenDto
  ) {
    return this.productoImagenService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar imagen (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoImagenService.remove(id);
  }
}