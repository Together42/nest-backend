import { Injectable, Logger } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByEmail(email: string): Promise<User | null | Partial<User>> {
    this.logger.debug(`findOneByEmail [email: ${email}]`);
    return await this.userRepository.findOneByEmail(email);
  }

  async createUser(user: Partial<User>): Promise<User> {
    this.logger.debug(`createUser [user: ${JSON.stringify(user)}]`);
    return await this.userRepository.createUser(user);
  }
}
