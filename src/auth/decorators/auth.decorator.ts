import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Role from 'src/users/schemas/role';
import { RoleGuard } from '../guards/role.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt')),
    SetMetadata('roles', roles),
    UseGuards(RoleGuard),
  );
}
