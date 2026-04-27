import {
  Controller, Get, Post, Put,
  Body, Param, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Pedidos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @ApiOperation({ summary: 'Crear pedido desde carrito' })
  // @ApiResponse({ status: 400, description: 'Carrito vacío o stock insuficiente' })
  @Post()
  create(@Request() req: any, @Body() dto: CreatePedidoDto) {
    return this.pedidosService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Ver mis pedidos' })
  @Get('mis-pedidos')
  findMisPedidos(@Request() req: any) {
    return this.pedidosService.findByUsuario(req.user.id);
  }

  @ApiOperation({ summary: 'Ver un pedido' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const esAdmin = req.user.rol === 'administrador';
    return this.pedidosService.findOne(id, req.user.id, esAdmin);
  }

  @ApiOperation({ summary: 'Ver todos los pedidos (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @ApiOperation({ summary: 'Actualizar estado de pedido (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Put(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoDto
  ) {
    return this.pedidosService.updateEstado(id, dto);
  }
}