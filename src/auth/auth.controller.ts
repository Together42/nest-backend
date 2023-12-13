import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guard/google.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { User as AuthUser } from 'passport';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignUpUserDto } from 'src/user/dto/signup-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtGuard } from './guard/jwt.guard';

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
      const findedUser: Partial<UserEntity> | null = await this.authService.findOneByEmail(
        user.email,
      );
      if (findedUser === null) {
        this.logger.debug(`new user [user: ${JSON.stringify(user)}]`);
        await this.authService.setCookie(res, null, user.accessToken, null);
        return res.redirect(`${process.env.FRONT_URL}/auth/signup`);
      } else {
        this.logger.debug(`existing user [user: ${JSON.stringify(user)}]`);
        const accessToken: string = await this.authService.generateToken(findedUser);
        const refreshToken: string = await this.authService.generateRefreshToken(findedUser);
        await this.authService.setCookie(res, findedUser.id, user.access_token, refreshToken);
        /*
          todo : redirect to front-end with access token
        */
        // res.send({
        //   message: 'success',
        //   access_token: accessToken,
        // });
        return res.redirect(`${process.env.FRONT_URL}/auth/callback/?token=${accessToken}`);
      }
    } catch (error) {
      this.logger.error(`googleAuthRedirect [error: ${error.message}]`);
      res.status(500).json({ message: error.message });
    }
  }

  @Post('signup')
  async signup(@Req() req: Request, @Res() res: Response, @Body() body: SignUpUserDto) {
    const user = req['user'];
    const userInfo: CreateUserDto = {
      email: user.email,
      googleId: user.sub,
      nickname: body.nickname,
      slackId: body.slackId,
      imageUrl: body.imageUrl,
    };
    const newUser = await this.authService.createUser(userInfo);
    const accessToken = await this.authService.generateToken(newUser);
    const refreshToken = await this.authService.generateRefreshToken(newUser);
    await this.authService.setCookie(res, newUser.id, null, refreshToken);
    console.log('signup', accessToken);
    res.send({
      message: 'success',
      access_token: accessToken,
    });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Body() body: RefreshTokenDto, @Res() res: Response) {
    try {
      const newAccessToken = (await this.authService.refreshAccessToken(body)).accessToken;
      res.send({
        message: 'success',
        access_token: newAccessToken,
      });
    } catch (error) {
      throw new UnauthorizedException('Unauthorized refresh token', '401');
    }
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    this.logger.debug(`logout`);
    // console.log('logout', req.headers);
    // await this.authService.deleteRefreshToken(user.id);
    res.clearCookie('refresh_token');
    res.clearCookie('google_token');
    res.send({
      message: 'success',
    });
  }
}
