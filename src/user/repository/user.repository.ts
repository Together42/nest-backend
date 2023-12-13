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
    /*
      duplicate check
    */
    const saltRounds = 10;
    const newUser = this.create({
      googleEmail: user.email,
      nickname: user.nickname,
      googleID: await bcrypt.hash(user.googleId, saltRounds),
      slackMemberId: user.slackId,
      profileImageUrl: user.imageUrl,
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

  async updateRefreshToken(
    id: number,
    refreshToken: string,
    refreshTokenExpiredAt: Date,
  ): Promise<void> {
    const user: UserEntity = await this.findOneByUid(id);
    user.refreshToken = refreshToken;
    user.refreshTokenExpiredAt = refreshTokenExpiredAt;
    await this.update(id, user);
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await this.update(id, {
      refreshToken: null,
      refreshTokenExpiredAt: null,
    });
  }
}
