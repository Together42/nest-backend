import { Controller, Get, UseGuards, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google.guard';
import { User as AuthUser } from 'passport';
import { User } from 'src/user/entity/user.entity';

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
    try {
      const user = req.user;
      this.logger.debug(`googleAuthRedirect [user: ${JSON.stringify(user)}]`);
      const userEntity: { isNew: boolean; user: Partial<User> } =
        await this.authService.findOrCreateUser(user);
      const accessToken: string = await this.authService.generateToken(userEntity.user);
      const refreshToken: string = await this.authService.generateRefreshToken(userEntity.user);
      // res.cookie('access_token', accessToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'none',
      //   // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      // });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      res.redirect(`http://localhost:3050/auth/callback/?token=${accessToken}`);
    } catch (error) {
      this.logger.error(`googleAuthRedirect [error: ${error.message}]`);
      res.status(500).json({ message: error.message });
    }
  }
}
