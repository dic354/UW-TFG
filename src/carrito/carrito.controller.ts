import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import { CarritoService } from './carrito.service';
import { AddCarritoDto } from './dto/add-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Carrito')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @ApiOperation({ summary: 'Ver mi carrito' })
  @Get()
  findMiCarrito(@Request() req: any) {
    return this.carritoService.findByUsuario(req.user.id);
  }

  @ApiOperation({ summary: 'Añadir producto al carrito' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente' })
  @Post()
  addItem(@Request() req: any, @Body() dto: AddCarritoDto) {
    return this.carritoService.addItem(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Actualizar cantidad de un item' })
  @Put(':id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateCarritoDto
  ) {
    return this.carritoService.updateItem(id, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Eliminar un item del carrito' })
  @Delete(':id')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.carritoService.removeItem(id, req.user.id);
  }

  @ApiOperation({ summary: 'Vaciar carrito completo' })
  @Delete()
  clearCarrito(@Request() req: any) {
    return this.carritoService.clearCarrito(req.user.id);
  }
}