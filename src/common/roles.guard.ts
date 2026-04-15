import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

// RolesGuard verifica que el usuario tiene el rol necesario
// para acceder al endpoint
// Siempre se usa DESPUÉS de JwtAuthGuard porque necesita
// que req.user ya esté disponible
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // Obtiene los roles requeridos del decorador @Roles()
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si el endpoint no tiene @Roles() deja pasar a cualquiera
    if (!rolesRequeridos) {
      return true;
    }

    // Obtiene el usuario del request (puesto por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Verifica que el rol del usuario está en los roles requeridos
    return rolesRequeridos.includes(user.rol);
  }
}