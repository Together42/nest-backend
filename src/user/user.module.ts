import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ])
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserRepository,
  ],
  exports: [
    UserService,
    UserRepository,
  ]
})
export class UserModule {}