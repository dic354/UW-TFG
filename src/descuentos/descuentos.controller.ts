import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import { DescuentosService } from './descuentos.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { ValidarDescuentoDto } from './dto/validar-descuento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Descuentos')
@Controller('descuentos')
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) {}

  @ApiOperation({ summary: 'Validar código de descuento' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 400, description: 'Código no válido o expirado' })
  @UseGuards(JwtAuthGuard)
  @Post('validar')
  validar(@Body() dto: ValidarDescuentoDto) {
    return this.descuentosService.validar(dto);
  }

  @ApiOperation({ summary: 'Listar descuentos (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get()
  findAll() {
    return this.descuentosService.findAll();
  }

  @ApiOperation({ summary: 'Ver un descuento (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear descuento (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateDescuentoDto) {
    return this.descuentosService.create(dto);
  }

  @ApiOperation({ summary: 'Editar descuento (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDescuentoDto
  ) {
    return this.descuentosService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar descuento (solo admin)' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.remove(id);
  }
}