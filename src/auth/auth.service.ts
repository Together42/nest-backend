import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
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

  async createUser(user: CreateUserDto): Promise<Partial<UserEntity> | null> {
    return this.userService.createUser(user);
  }

  setCookie(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
    });
  }
}
