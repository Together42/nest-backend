import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly dataSource: DataSource,
  ) {
    super(UserEntity, dataSource.manager);
  }
  private readonly logger = new Logger(UserRepository.name);

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

  async getAllActiveUser(): Promise<UserEntity[]> {
    try {
      const records = await this.find({
        where: {
          isActive: true,
        },
      });

      return records;
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        googleEmail: email,
      },
    });
  }

  async findOneById(id: number): Promise<UserEntity | undefined> {
    try {
      const record = await this.find({
        where: {
          id: id,
        },
      });

      if (record.length > 1) {
        this.logger.warn(`Duplicated records found on ${id}`);
      }

      return record[0];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOneByIntraId(intraId: string): Promise<UserEntity | undefined> {
    try {
      const record = await this.find({
        where: {
          nickname: intraId,
        },
      });

      if (record.length > 1) {
        this.logger.warn(`Duplicated records found on ${intraId}`);
      }

      return record[0];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
