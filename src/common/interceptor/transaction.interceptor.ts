import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  catchError,
  finalize,
  Observable,
  concatMap,
} from 'rxjs';
import { QueryRunner, DataSource } from 'typeorm';
// import { Request } from 'express';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ) : Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const queryRunner: QueryRunner = await this.initRunner();
    request.queryRunnerManager = queryRunner.manager;

    return next.handle().pipe(
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        console.log('data', data);
        return data;
      }),
      catchError(async (error) => {
        console.log('error', error);
        await queryRunner.rollbackTransaction();
        throw error;
      }),
      finalize(async () => {
        console.log('finalize');
        await queryRunner.release();
      }),
    );
  }

  private async initRunner(): Promise<QueryRunner> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
