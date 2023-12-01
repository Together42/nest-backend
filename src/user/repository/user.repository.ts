import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly dataSource: DataSource,
  ) {
    super(UserEntity, dataSource.manager);
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.create({
      googleEmail: user.email,
      nickname: user.nickname,
      googleID: await bcrypt.hash(user.googleId, 10),
      slackMemberId: user.slackId,
    });
    await this.save(newUser);
    return newUser;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        googleEmail: email,
      },
    });
  }

  async findOneByUid(id: number): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
