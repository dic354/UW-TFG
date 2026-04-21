import {
  Controller, Get, Post, Put,
  Body, Param, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // POST /pedidos → crear pedido desde carrito
  @Post()
  create(@Request() req: any, @Body() dto: CreatePedidoDto) {
    return this.pedidosService.create(req.user.id, dto);
  }

  // GET /pedidos/mis-pedidos → mis pedidos
  @Get('mis-pedidos')
  findMisPedidos(@Request() req: any) {
    return this.pedidosService.findByUsuario(req.user.id);
  }

  // GET /pedidos/:id → ver un pedido
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const esAdmin = req.user.rol === 'administrador';
    return this.pedidosService.findOne(id, req.user.id, esAdmin);
  }

  // GET /pedidos → todos los pedidos (solo admin)
  @UseGuards(RolesGuard)
  @Roles('administrador')
  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  // PUT /pedidos/:id/estado → actualizar estado (solo admin)
  @UseGuards(RolesGuard)
  @Roles('administrador')
  @Put(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoDto
  ) {
    return this.pedidosService.updateEstado(id, dto);
  }
}