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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  InternalServerExceptionBody,
  NotFoundExceptionBody,
  UnauthorizedExceptionBody,
} from 'src/common/dto/error-response.dto';
import { UserRankingDto } from './dto/user-ranking.dto';
import {
  UpdateUserActivityByIdDto,
  UpdateUserActivityByNameDto,
} from './dto/update-user-activity.dto';
import { UserInfoDto } from './dto/user-info.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard, RoleGuard)
  @Role([UserRole.ADMIN])
  @ApiOperation({
    summary: '자기 자신의 정보 조회',
    description:
      '로그인한 유저가 어떤 유저 인지 정보를 반환해줍니다. 해당 api는 관리자만 사용 가능합니다.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserInfoDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async getMe(@GetUser() user: UserInfoDto): Promise<UserInfoDto> {
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
  @ApiOperation({
    summary: '유저의 사서 활동 여부 수정',
    description: `취업 혹은 42 과정 중단으로 인해 사서 활동 여부가 힘들어진 경우 isActive를 false로 설정합니다.\n
isActive가 false인 경우, 일일 사서 신청 내역도 함께 삭제됩니다.\n
반대로 사서 활동이 가능해질 경우 isActive를 true로 설정합니다.\n
해당 api는 관리자만 사용 가능합니다.`,
  })
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
  @ApiOkResponse({ description: '유저의 사서 활동 여부 수정 성공' })
  @ApiNotFoundResponse({ description: '유저가 존재하지 않는 경우', type: NotFoundExceptionBody })
  @ApiInternalServerErrorResponse({ type: InternalServerExceptionBody })
  async updateUserActivity(
    @Body() updateUserActiviyDto: UpdateUserActivityByIdDto | UpdateUserActivityByNameDto,
  ): Promise<void> {
    return await this.userService.updateUserActivity(updateUserActiviyDto);
  }
}
