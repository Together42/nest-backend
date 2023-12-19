import { UseGuards, Controller, Get, Logger, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Role } from 'src/decorator/role.decorator';
import UserRole from './enum/user.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { InternalServerExceptionBody } from 'src/common/dto/error-response.dto';
import { UserRankingDto } from './dto/user-ranking.dto';
import {
  UpdateUserActivityByIdDto,
  UpdateUserActivityByNameDto,
} from './dto/update-user-activity.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('test')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.ADMIN])
  @ApiBearerAuth()
  async jwtAuthTest(@GetUser() user) {
    this.logger.debug(`jwtAuthTest [user: ${JSON.stringify(user)}]`);
    return user;
  }

  @Get('ranking')
  @ApiOperation({ summary: '친해지길 바라 점수 및 랭킹 조회' })
  @ApiOkResponse({ type: [UserRankingDto] })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async findUserRanking(): Promise<UserRankingDto[]> {
    return await this.userService.getUserRanking();
  }

  @Patch('activity')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.ADMIN])
  @ApiBearerAuth()
  @ApiExtraModels(UpdateUserActivityByIdDto, UpdateUserActivityByNameDto)
  @ApiBody({
    description: '유저 고유 아이디 혹은 유저의 닉네임을 통해 유저의 isActive를 수정합니다.',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(UpdateUserActivityByIdDto) },
        { $ref: getSchemaPath(UpdateUserActivityByNameDto) },
      ],
    },
    examples: {
      'By userId': { value: { userId: 1, isActive: false } },
      'By nickname': { value: { nickname: 'jwoo', isActive: true } },
    },
  })
  async updateUserActivity(
    @Body() updateUserActiviyDto: UpdateUserActivityByIdDto | UpdateUserActivityByNameDto,
  ) {
    return await this.userService.updateUserActivity(updateUserActiviyDto);
  }
}
