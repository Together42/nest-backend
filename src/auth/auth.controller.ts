import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google.guard';
import { User as AuthUser } from 'passport';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignUpUserDto } from 'src/user/dto/signup-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request & { user: AuthUser },
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(`googleAuthRedirect`);
    try {
      const user: AuthUser = req.user;
      const findUser: Partial<UserEntity> =
        await this.authService.findOneByEmail(user.email);
      if (typeof findUser === 'undefined' || findUser === null) {
        this.logger.debug(`new user [user: ${JSON.stringify(user)}]`);
        res.cookie('google_token', user.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        res.redirect(`${process.env.FRONT_URL}/auth/signup`);
      } else {
        this.logger.debug(`existing user [user: ${JSON.stringify(user)}]`);
        const accessToken: string =
          await this.authService.generateToken(findUser);
        const refreshToken: string =
          await this.authService.generateRefreshToken(findUser);
        this.authService.setCookie(res, accessToken, refreshToken);
        res.redirect(`${process.env.FRONT_URL}/auth/callback/`);
      }
    } catch (error) {
      this.logger.error(`googleAuthRedirect [error: ${error.message}]`);
      res.status(500).json({ message: error.message });
    }
  }

  @Post('signup')
  async signup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SignUpUserDto,
  ) {
    const user = req['user'];
    const userInfo: CreateUserDto = {
      email: user.email,
      googleId: user.sub,
      nickname: body.nickname,
      slackId: body.slackId,
    };
    console.log('userInfo', userInfo);
    const newUser = await this.authService.createUser(userInfo);
    const accessToken = await this.authService.generateToken(newUser);
    const refreshToken = await this.authService.generateRefreshToken(newUser);
    this.authService.setCookie(res, accessToken, refreshToken);
    res.redirect(`${process.env.FRONT_URL}/auth/callback/`);
  }
}
