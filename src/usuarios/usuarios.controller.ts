import {
  Controller, Get, Put, Delete,
  Body, Param, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // GET /usuarios/me → ver mi perfil
  @Get('me')
  findMe(@Request() req: any) {
    return this.usuariosService.findMe(req.user.id);
  }

  // PUT /usuarios/me → actualizar mi perfil
  @Put('me')
  updateMe(@Request() req: any, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.updateMe(req.user.id, dto);
  }

  // PUT /usuarios/me/password → cambiar contraseña
  @Put('me/password')
  changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.usuariosService.changePassword(req.user.id, dto);
  }

  // GET /usuarios → todos los usuarios (solo admin)
  @UseGuards(RolesGuard)
  @Roles('administrador')
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  // GET /usuarios/:id → ver un usuario (solo admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }
}