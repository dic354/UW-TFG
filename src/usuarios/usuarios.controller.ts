import {
  Controller, Get, Put,
  Body, Param, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiOperation({ summary: 'Ver mi perfil' })
  @Get('me')
  findMe(@Request() req: any) {
    return this.usuariosService.findMe(req.user.id);
  }

  @ApiOperation({ summary: 'Actualizar mi perfil' })
  @Put('me')
  updateMe(@Request() req: any, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.updateMe(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiResponse({ status: 401, description: 'Contraseña actual incorrecta' })
  @Put('me/password')
  changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return this.usuariosService.changePassword(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Listar todos los usuarios (solo admin)' })
  @UseGuards(RolesGuard)
  @Roles('administrador')
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @ApiOperation({ summary: 'Ver un usuario (solo admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }
}