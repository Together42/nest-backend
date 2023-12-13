import { UseGuards, Controller, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Role } from 'src/decorator/role.decorator';
import UserRole from './enum/user.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtRefreshGuard } from 'src/auth/guard/jwt-refresh.guard';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('test')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @Role([UserRole.USER, UserRole.LIBRARIAN, UserRole.ADMIN])
  async jwtAuthTest(@GetUser() user) {
    this.logger.debug(`jwtAuthTest [user: ${JSON.stringify(user)}]`);
    return 'jwtAuthTest';
  }
}
