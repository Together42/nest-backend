import {
  UseGuards,
  Controller,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator/user.decorator';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('user')
export class UserController{
  constructor(
    private readonly userService: UserService,
  ){}

  @Get('test')
  @UseGuards(JwtGuard)
  async jwtAuthTest(
    @GetUser() user,
  ){
    console.log('user', user);
    return 'jwtAuthTest';
  }
}