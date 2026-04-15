import { SetMetadata } from '@nestjs/common';

// Este decorador permite indicar qué roles pueden
// acceder a un endpoint concreto
// Se usa así encima de un endpoint:
// @Roles('administrador')
// @Get('panel')
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);