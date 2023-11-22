import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async googleLogin(user: any): Promise<boolean> {
    this.logger.debug(`googleLogin [user: ${JSON.stringify(user)}]`);
    // const userId = user.sub;
    const userEntity = await this.userService.findOneByEmail(user.email);
    if (typeof userEntity === 'undefined' || userEntity === null) {
      await this.userService.createUser(user);
      return false;
    }
    return true;
  }
  async generateToken(user: Partial<User>): Promise<string> {
    const payload = { username: user.nickname, uid: user.id, role: user.role };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: Partial<User>): Promise<string> {
    const payload = { uid: user.id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });
  }
  async findOrCreateUser(
    user: any,
  ): Promise<{ isNew: boolean; user: Partial<User> }> {
    let userEntity: Partial<User> = await this.userService.findOneByEmail(
      user.email,
    );
    if (typeof userEntity === 'undefined' || userEntity === null) {
      userEntity = await this.userService.createUser(user);
      return { isNew: true, user: userEntity };
    }
    return { isNew: false, user: userEntity };
  }
}
