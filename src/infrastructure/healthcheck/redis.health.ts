import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { promisify } from 'util';
import { sendMessage } from '../aws/sendMessage';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@Inject('REDIS_CLIENT') private client) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const ping = promisify(this.client.ping).bind(this.client);
    const pong = await ping();
    const isHealthy = pong === 'PONG';
    const result = this.getStatus(key, isHealthy, { pong: pong });
    if (isHealthy) {
      return result;
    }
    await sendMessage('Redis from queue microservice not available');
    throw new HealthCheckError('redis server failed', result);
  }
}
