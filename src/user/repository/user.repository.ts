import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/user.entity';
import { Logger } from '@nestjs/common';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly dataSource: DataSource,
  ) {
    super(User, dataSource.manager);
  }
  private readonly logger = new Logger(UserRepository.name);

  async createUser(user: any): Promise<User> {
    const newUser = new User();
    newUser.googleEmail = user.email;
    newUser.nickname = user.name;
    newUser.googleID = await bcrypt.hash(user.sub, 10);
    await this.save(newUser);
    return newUser;
  }

  async getAllActiveUser(): Promise<User[]> {
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

  async findOneByEmail(
    email: string,
  ): Promise<User | undefined | Partial<User>> {
    return await this.findOne({
      where: {
        googleEmail: email,
      },
    });
  }

  async findOneById(id: number): Promise<User | undefined> {
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
}
