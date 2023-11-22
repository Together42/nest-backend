import { SetMetadata } from '@nestjs/common';
import UserRole from '../user/enum/user.enum';

export const Role = (role: UserRole) => SetMetadata('role', role);
