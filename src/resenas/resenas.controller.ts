import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards, Request
} from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  // GET /resenas/producto/:id → ver reseñas de un producto (público)
  @Get('producto/:id')
  findByProducto(@Param('id', ParseIntPipe) id: number) {
    return this.resenasService.findByProducto(id);
  }

  // POST /resenas → crear reseña (usuario logueado)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateResenaDto) {
    return this.resenasService.create(req.user.id, dto);
  }

  // PUT /resenas/:id → editar reseña (solo el autor)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateResenaDto
  ) {
    return this.resenasService.update(id, req.user.id, dto);
  }

  // DELETE /resenas/:id → eliminar (autor o admin)
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