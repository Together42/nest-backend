import { UseGuards, Controller, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Role } from 'src/decorator/role.decorator';
import UserRole from './enum/user.enum';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtRefreshGuard } from 'src/auth/guard/jwt-refresh.guard';
import { InternalServerExceptionBody } from 'src/common/dto/error-response.dto';
import { UserRankingDto } from './dto/user-ranking.dto';

@Controller('users')
@ApiTags('users')
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

  @Get('ranking')
  @ApiOperation({ summary: '친해지길 바라 점수 및 랭킹 조회' })
  @ApiOkResponse({ type: [UserRankingDto] })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findUserRanking(): Promise<UserRankingDto[]> {
    return await this.userService.getUserRanking();
  }
}
