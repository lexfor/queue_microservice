import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { AddPatientInQueue } from './actions/addPatientInQueue';
import { GetCurrentPatientFromQueue } from './actions/getCurrentPatientFromQueue';
import { TakeNextFromQueue } from './actions/takeNextFromQueue';
import { getRedisClient } from '../../infrastructure/configs/redis.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueMapper } from './mapper/queue.mapper';
import { QueueRepository } from './queue.repository';
import { JwtStrategy } from '../../infrastructure/strategies/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [QueueController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: getRedisClient,
    },
    {
      provide: 'REDIS_REPOSITORY',
      useClass: QueueRepository,
    },
    AddPatientInQueue,
    GetCurrentPatientFromQueue,
    TakeNextFromQueue,
    QueueMapper,
    JwtStrategy,
  ],
})
export class QueueModule {}
