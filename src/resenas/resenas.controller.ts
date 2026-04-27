import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards, Request
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reseñas')
@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @ApiOperation({ summary: 'Ver reseñas de un producto' })
  @Get('producto/:id')
  findByProducto(@Param('id', ParseIntPipe) id: number) {
    return this.resenasService.findByProducto(id);
  }

  @ApiOperation({ summary: 'Crear reseña' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 400, description: 'No has comprado este producto' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateResenaDto) {
    return this.resenasService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Editar reseña' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateResenaDto
  ) {
    return this.resenasService.update(id, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Eliminar reseña' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    const esAdmin = req.user.rol === 'administrador';
    return this.resenasService.remove(id, req.user.id, esAdmin);
  }
}