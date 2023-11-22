import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly dataSource: DataSource,
  ) {
    super(User, dataSource.manager);
  }

  async createUser(user: any): Promise<User> {
    const newUser = new User();
    newUser.googleEmail = user.email;
    newUser.nickname = user.name;
    newUser.createdAt = new Date();
    newUser.googleID = user.sub;
    await this.save(newUser);
    return newUser;
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
}
