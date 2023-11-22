import { UseGuards, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator/user.decorator';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Role } from 'src/decorator/role.decorator';
import UserRole from './enum/user.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.USER, UserRole.LIBRARIAN])
  async jwtAuthTest(@GetUser() user) {
    console.log('user', user);
    return 'jwtAuthTest';
  }
}
