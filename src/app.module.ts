import { Module } from '@nestjs/common';
import { QueueModule } from './domain/queue/queue.module';
import { GrpcController } from './grpc.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from './infrastructure/config';
import { HealthController } from "./infrastructure/healthcheck/health.controller";
import { getRedisClient } from "./infrastructure/configs/redis.config";
import { RedisHealthIndicator } from "./infrastructure/healthcheck/redis.health";

@Module({
  imports: [
    QueueModule,
    TerminusModule,
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [GrpcController, HealthController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: getRedisClient,
    },
    RedisHealthIndicator,
  ],
})
export class AppModule {}
