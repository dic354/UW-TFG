import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { DescuentosService } from './descuentos.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { ValidarDescuentoDto } from './dto/validar-descuento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('descuentos')
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) {}

  // POST /descuentos/validar → validar código (usuario logueado)
  @UseGuards(JwtAuthGuard)
  @Post('validar')
  validar(@Body() dto: ValidarDescuentoDto) {
    return this.descuentosService.validar(dto);
  }

  // Solo admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get()
  findAll() {
    return this.descuentosService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateDescuentoDto) {
    return this.descuentosService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDescuentoDto
  ) {
    return this.descuentosService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.remove(id);
  }
}