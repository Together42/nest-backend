import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Controller('rotations')
export class RotationsController {
  private readonly logger = new Logger(RotationsController.name);

  constructor(private readonly rotationsService: RotationsService) {}

  /*
   * 본인 로테이션 생성 (달력)
   * Auth : own
   */
  @Post('/')
  createOwnRotation(@Body() createRotationDto: CreateRotationDto) {
    return this.rotationsService.createRotation(createRotationDto);
  }

  /*
   * 사서 로테이션 조회 (달력)
   * Query: month=?&day=? : 당일 사서 조회 (구글 시트)
   * Auth : None
   */
  @Get('/')
  findAllRotation() {
    return this.rotationsService.findAllRotation();
  }

  // @Get('/:id')
  // findOne(@Param('id') id: string) {
  //   return this.rotationsService.findOne(+id);
  // }

  /*
   * 사서 로테이션 수정 (달력)
   * Auth : user
   */
  @Patch('/:id')
  updateUserRotation(@Param('id') id: string, @Body() updateRotationDto: UpdateRotationDto) {
    return this.rotationsService.updateRotation(+id, updateRotationDto);
  }

  /*
   * 사서 로테이션 삭제 (달력)
   * Auth : own
   */
  @Delete('/:id')
  removeOwnRotation(@Param('id') id: string) {
    return this.rotationsService.removeRotation(+id);
  }

  /*
   * 본인 로테이션 신청
   * Auth : own
   * annotation getuser 찾아보기
   * 도커 다시 설치 후 yarn start로 올리기
   * class-validator class-transformer 설치하자고 말하기
   */
  @Post('/attendee')
  // @UsePipes(new ValidationPipe({ transform: true }))
  createOwnRegistration(@Body() createRotationDto: CreateRotationDto) {
    const user_id = 1; // need to parse own user_id
    return this.rotationsService.createRegistration(createRotationDto, user_id);
  }

  /*
   * User Test
   * Need to delete!
   */
  @Post('/test')
  createTestUser(@Body() body: any) {
    const { nickname } = body;
    return this.rotationsService.createTestUser(nickname)
  }

  /*
   * 본인 로테이션 신청 조회
   * Auth : own
   */
  @Get('/attendee')
  findOwnRegistration() {
    return this.rotationsService.findAllRegistration();
  }

  /*
   * 본인 로테이션 신청 취소
   * Auth : own
   */
  @Delete('/attendee')
  removeOwnRegistration(@Param('id') id: string) {
    return this.rotationsService.removeRegistration(+id);
  }
}
