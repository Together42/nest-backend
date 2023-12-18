import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRankingDto } from './dto/user-ranking.dto';

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

  /*
    find refresh token from database with user id
    if refresh token is not expired, return refresh token
  */
  async isRefreshTokenVaild(
    refreshToken: string,
    userUid: number,
  ): Promise<UserEntity | null> {
    const user: UserEntity | null = await this.findOneByUid(userUid);
    if (user === null || user.refreshToken === null) {
      return null;
    }
    const isRefreshTokenValid: boolean = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (isRefreshTokenValid === false) {
      return null;
    }
    return user;
  }

  async updateRefreshToken(
    userUid: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken: string =
      await this.hashedRefreshToken(refreshToken);
    const currentDate: Date = new Date();
    const refreshTokenExpiredAt: Date = new Date(
      currentDate.getTime() + 1000 * 60 * 60 * 24 * 7,
    );
    await this.userRepository.updateRefreshToken(
      userUid,
      hashedRefreshToken,
      refreshTokenExpiredAt,
    );
  }

  async deleteRefreshToken(userUid: number): Promise<void> {
    await this.userRepository.deleteRefreshToken(userUid);
  }

  private async hashedRefreshToken(refreshToken: string): Promise<string> {
    const saltRounds = 10;
    try {
      const hashedRefreshToken: string = await bcrypt.hash(
        refreshToken,
        saltRounds,
      );
      return hashedRefreshToken;
    } catch (error) {
      this.logger.error(`hashedRefreshToken [error: ${error.message}]`);
      throw error;
    }
  }

  async getUserRanking() {
    // TODO: 쿼리빌더가 타입 반환을 any로 반환하는 것을 해결하기
    const userRanking = await this.userRepository.getUserRanking();
    const userRankingDto: UserRankingDto[] = userRanking.map((ranking) => {
      return {
        ...ranking,
        meetingPoint: +ranking.meetingPoint,
        eventPoint: +ranking.eventPoint,
        totalPoint: +ranking.totalPoint,
      };
    });
    return userRankingDto;
  }
}
