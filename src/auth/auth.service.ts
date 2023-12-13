import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userService.findOneByEmail(email);
  }

  async generateToken(user: Partial<UserEntity>): Promise<string> {
    const payload = { username: user.nickname, uid: user.id, role: user.role };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: Partial<UserEntity>): Promise<string> {
    const payload = { uid: user.id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
        },
      );
      const userId: number = payload['uid'];
      const user: Partial<UserEntity> | null = await this.userService.findOneByUid(userId);
      if (user === null) {
        throw new UnauthorizedException('Unauthorized', '401');
      }
      const accessToken: string = await this.generateToken(user);
      return { accessToken };
    } catch (error) {
      this.logger.error(`refreshAccessToken [error: ${error.message}]`);
      throw new UnauthorizedException('Unauthorized', '401');
    }
  }

  async createUser(user: CreateUserDto): Promise<Partial<UserEntity> | null> {
    return this.userService.createUser(user);
  }

  async setCookie(
    res: Response,
    userId: number,
    googleToken: string | null,
    refreshToken: string | null,
  ) {
    if (googleToken) {
      res.cookie('google_token', googleToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      });
    }
    if (refreshToken) {
      await this.userService.updateRefreshToken(userId, refreshToken);
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
    }
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await this.userService.deleteRefreshToken(id);
  }
}
