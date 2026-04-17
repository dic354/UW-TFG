import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { AddCarritoDto } from './dto/add-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Todos los endpoints del carrito requieren estar logueado
// Por eso ponemos JwtAuthGuard a nivel de controlador
// y no en cada endpoint individualmente
@UseGuards(JwtAuthGuard)
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  // GET /carrito → ver mi carrito
  @Get()
  findMiCarrito(@Request() req: any) {
    return this.carritoService.findByUsuario(req.user.id);
  }

  // POST /carrito → añadir producto
  @Post()
  addItem(@Request() req: any, @Body() dto: AddCarritoDto) {
    return this.carritoService.addItem(req.user.id, dto);
  }

  // PUT /carrito/:id → actualizar cantidad
  @Put(':id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateCarritoDto
  ) {
    return this.carritoService.updateItem(id, req.user.id, dto);
  }

  // DELETE /carrito/:id → eliminar un item
  @Delete(':id')
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.carritoService.removeItem(id, req.user.id);
  }

  // DELETE /carrito → vaciar carrito completo
  @Delete()
  clearCarrito(@Request() req: any) {
    return this.carritoService.clearCarrito(req.user.id);
  }
}