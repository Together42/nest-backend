import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { RotationAttendeeEntity } from './entity/rotation-attendee.entity';
import { GetUser } from 'src/decorator/user.decorator';
import { FindRotationQueryDto } from './dto/find-rotation-query.dto';
import { RemoveRotationQueryDto } from './dto/remove-rotation.dto';
import { RotationEntity } from './entity/rotation.entity';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserEntity } from 'src/user/entity/user.entity';
import { RoleGuard } from 'src/auth/guard/role.guard';
import UserRole from 'src/user/enum/user.enum';
import { Role } from 'src/decorator/role.decorator';

@Controller('rotations')
export class RotationsController {
  constructor(private readonly rotationsService: RotationsService) {}

  /*
   * 당일 사서 조회 (달력)
   * 구글 시트를 위한 API
   * Auth : None
   */
  @Get('/today')
  findTodayRotation(): Promise<Partial<RotationEntity>[]> {
    return this.rotationsService.findTodayRotation();
  }

  /*
   * 본인 로테이션 신청 조회 (다음 달)
   * Auth : own, admin
   */
  @Get('/attendance')
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @UseGuards(JwtGuard, RoleGuard)
  async findOwnRegistration(@GetUser() user: UserEntity): Promise<Partial<RotationAttendeeEntity>> {
    return await this.rotationsService.findRegistration(user.id);
  }

  /*
   * 본인 로테이션 신청 (다음 달)
   * Auth : own, admin
   */
  @Post('/attendance')
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @UseGuards(JwtGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  async createOwnRegistration(
    @GetUser() user: UserEntity,
    @Body() createRegistrationDto: CreateRegistrationDto,
  ): Promise<RotationAttendeeEntity> {
    return await this.rotationsService.createRegistration(createRegistrationDto, user.id);
  }

  /*
   * 본인 로테이션 신청 취소 (다음 달)
   * Auth : own, admin
   */
  @Delete('/attendance')
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @UseGuards(JwtGuard, RoleGuard)
  async removeOwnRegistration(@GetUser() user: UserEntity): Promise<void> {
    return await this.rotationsService.removeRegistration(user.id);
  }

  /*
   * 사서 로테이션 조회 (달력)
   * Auth : None
   */
  @Get('/')
  findAllRotation(
    @Query(ValidationPipe)
    findRotationQueryDto: FindRotationQueryDto,
  ): Promise<Partial<RotationEntity>[]> {
    const { month, year } = findRotationQueryDto;

    return this.rotationsService.findAllRotation(year, month);
  }

  /*
   * 본인 로테이션 생성 (달력)
   * Auth : own, admin
   */
  @Post('/')
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @UseGuards(JwtGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  createOwnRotation(
    @GetUser() user: UserEntity,
    @Body() createRotationDto: CreateRotationDto,
  ): Promise<string> {
    return this.rotationsService.createOrUpdateRotation(createRotationDto, user.id);
  }

  /*
   * 사서 로테이션 삭제 (달력)
   * Auth : own, admin
   */
  @Delete('/')
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @UseGuards(JwtGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  removeOwnRotation(
    @GetUser() user: UserEntity,
    @Body()
    removeRotationQueryDto: RemoveRotationQueryDto,
  ): Promise<string> {
    const { day, month, year } = removeRotationQueryDto;
    return this.rotationsService.removeRotation(user.id, day, month, year);
  }

  /*
   * 사서 로테이션 수정 (달력)
   * Auth : all user, admin
   */
  @Patch('/:id')
  @Role([UserRole.LIBRARIAN, UserRole.ADMIN])
  @UseGuards(JwtGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  updateUserRotation(
    @GetUser() user: UserEntity,
    @Param('id') intraId: string,
    @Body() updateRotationDto: UpdateRotationDto,
  ): Promise<string> {
    return this.rotationsService.updateRotation(updateRotationDto, intraId, user.id);
  }
}
