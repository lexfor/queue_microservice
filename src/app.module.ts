import { Module } from '@nestjs/common';
import { QueueModule } from './domain/queue/queue.module';
import { GrpcController } from './grpc.controller';

@Module({
  imports: [QueueModule],
  controllers: [GrpcController],
})
export class AppModule {}
