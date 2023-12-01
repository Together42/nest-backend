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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { RotationAttendeeEntity } from './entity/rotation-attendee.entity';
import { GetUser } from 'src/decorator/user.decorator';
import { FindRotationQueryDto } from './dto/find-rotation-query.dto';
import { getNextYearAndMonth } from './utils/date';
import { RemoveRotationQueryDto } from './dto/remove-rotation.dto';
import { RotationEntity } from './entity/rotation.entity';

/* TODO:
 * :id -> intraId로 변경
 * 반환 시 id 말고 intraId로 반환
 *
 */

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
   * Auth : own
   */
  @Get('/attendance')
  async findOwnRegistration(
    @GetUser() user: any,
  ): Promise<Partial<RotationAttendeeEntity>> {
    return await this.rotationsService.findRegistration(user.uid); // inraId도 반환 필요
  }

  /*
   * 본인 로테이션 신청 (다음 달)
   * Auth : own
   * annotation getuser 찾아보기
   * Auth 스코프는 어떻게 정해야 할까?
   * - useGuard : JWT guard : seowokim님 머지 후 다시 보기
   */
  @Post('/attendance')
  @UsePipes(ValidationPipe)
  async createOwnRegistration(
    @GetUser() user: any,
    @Body() createRegistrationDto: CreateRegistrationDto,
  ): Promise<RotationAttendeeEntity> {
    return await this.rotationsService.createRegistration(
      createRegistrationDto,
      user.uid,
    );
  }

  /*
   * 본인 로테이션 신청 취소 (다음 달)
   * Auth : own
   */
  @Delete('/attendance')
  async removeOwnRegistration(@GetUser() user: any): Promise<void> {
    return await this.rotationsService.removeRegistration(user.uid);
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
    const {
      month = getNextYearAndMonth().month,
      year = getNextYearAndMonth().year,
    } = findRotationQueryDto;

    return this.rotationsService.findAllRotation(year, month); // intraId 반환 필요
  }

  /*
   * 본인 로테이션 생성 (달력)
   * Auth : own
   */
  @Post('/')
  @UsePipes(ValidationPipe)
  createOwnRotation(
    @GetUser() user: any,
    @Body() createRotationDto: CreateRotationDto,
  ): Promise<string> {
    return this.rotationsService.createOrUpdateRotation(
      createRotationDto,
      user.uid,
    );
  }

  /*
   * 사서 로테이션 삭제 (달력)
   * Param: id
   *  - id: 삭제하고자 하는 유저의 id. 즉, API를 호출하는 유저 본인의 id
   * Query: day=?&year=?&month=?
   *  - day: 필수적으로 입력해야 하는 쿼리
   *  - year & month: year, month 스코프에 해당하는 user 정보를 삭제
   *    - 만약 없다면, 다음 달 year, month에 해당하는 user 정보를 삭제
   * Auth : own
   */
  @Delete('/')
  @UsePipes(ValidationPipe)
  removeOwnRotation(
    @GetUser() user: any,
    @Query(ValidationPipe)
    removeRotationQueryDto: RemoveRotationQueryDto,
  ): Promise<string> {
    const { day, month = undefined, year = undefined } = removeRotationQueryDto;

    return this.rotationsService.removeRotation(user.uid, day, month, year);
  }

  /*
   * 사서 로테이션 수정 (달력)
   * Auth : user
   */
  @Patch('/:id') // intraId로 변경
  @UsePipes(ValidationPipe)
  updateUserRotation(
    @GetUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRotationDto: UpdateRotationDto,
  ): Promise<string> {
    return this.rotationsService.updateRotation(
      updateRotationDto,
      id,
      user.uid,
    );
  }
}
