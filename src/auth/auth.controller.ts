import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Response,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google.guard';
import { JwtGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(
    @Request() req,
  ){
    this.logger.debug(`googleAuth [req: ${JSON.stringify(req)}]`);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Request() req,
  ){
    const user = req.user;
    this.logger.debug(`googleAuthRedirect [user: ${JSON.stringify(user)}]`);
    return this.authService.googleLogin(user);
  }

  @Get('test')
  @UseGuards(JwtGuard)
  async jwtAuthTest(
    @Request() req,
  ){
    return 'jwtAuthTest';
  }
}