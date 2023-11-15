import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async googleLogin(user: any): Promise<{ accessToken: string }> {
    this.logger.debug(`googleLogin [user: ${JSON.stringify(user)}]`);
    const payload = { username: user.name, email: user.email };
    // const userId = user.sub;
    const userEntity = await this.userService.findOneByEmail(user.email);
    this.logger.error(`userEntity: ${JSON.stringify(userEntity)}`);
    if (typeof userEntity === 'undefined' || userEntity === null) {
      await this.userService.createUser(user);
    }
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: accessToken,
    };
  }
}