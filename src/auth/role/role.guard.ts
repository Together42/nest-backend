import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UserRole from 'src/user/enum/user.enum';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<UserRole[]>('role', context.getHandler());
    if (!role) {
      return true;
    }
    const user: Partial<User> = context.switchToHttp().getRequest().user;
    if (!user) {
      return false;
    }
    return this.matchRoles(role, user);
  }

  matchRoles(roles: UserRole[], user: Partial<User>): boolean {
    return roles.includes(user.role);
  }
}
