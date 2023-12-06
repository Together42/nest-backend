import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    this.logger.debug(`findOneByEmail [email: ${email}]`);
    return this.userRepository.findOneByEmail(email);
  }

  async findOneByUid(id: number): Promise<UserEntity | null> {
    this.logger.debug(`findOneByUid [id: ${id}]`);
    return this.userRepository.findOneById(id);
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    this.logger.debug(`findOneById [id: ${id}]`);
    return await this.userRepository.findOneById(id);
  }

  async findOneByIntraId(intraId: string): Promise<UserEntity | null> {
    this.logger.debug(`findOneByIntraId [intraId: ${intraId}]`);
    return await this.userRepository.findOneByIntraId(intraId);
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.createUser(user);
  }

  async getAllActiveUser(): Promise<UserEntity[]> {
    return await this.userRepository.getAllActiveUser();
  }
}
