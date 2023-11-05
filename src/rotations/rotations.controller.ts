import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Controller('rotations')
export class RotationsController {
  constructor(private readonly rotationsService: RotationsService) {}

  @Post('/')
  createOwnRotation(@Body() createRotationDto: CreateRotationDto) {
    return this.rotationsService.create(createRotationDto);
  }

  @Get('/')
  findAllRotation() {
    return this.rotationsService.findAll();
  }

  // @Get('/:id')
  // findOne(@Param('id') id: string) {
  //   return this.rotationsService.findOne(+id);
  // }

  @Patch('/:id')
  updateUserRotation(@Param('id') id: string, @Body() updateRotationDto: UpdateRotationDto) {
    return this.rotationsService.update(+id, updateRotationDto);
  }

  @Delete('/:id')
  removeOwnRotation(@Param('id') id: string) {
    return this.rotationsService.remove(+id);
  }

  @Post('/attendee')
  createOwnRegistration(@Body() CreateRotationDto: CreateRotationDto) {
    return this.rotationsService.create(CreateRotationDto);
  }

  @Get('/attendee')
  findOwnRegistration() {
    return this.rotationsService.findAll();
  }

  @Delete('/attendee')
  removeOwnRegistration(@Param('id') id: string) {
    return this.rotationsService.remove(+id);
  }

}
