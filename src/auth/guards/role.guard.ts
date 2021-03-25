import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Role from 'src/users/schemas/role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (roles && roles.length) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!(user && user.role && roles.includes(user.role))) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
