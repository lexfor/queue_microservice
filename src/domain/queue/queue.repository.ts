import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { promisify } from 'util';

@Injectable()
export class QueueRepository {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClient,
  ) {}

  async addPatientInQueue(queueID: string, patientID: string): Promise<string> {
    const rpushAsync = promisify(this.redisClient.rpush).bind(this.redisClient);
    await rpushAsync(`queueTo${queueID}`, patientID);
    return patientID;
  }

  async getCurrentInQueue(queueID: string): Promise<string> {
    const lindexAsync = promisify(this.redisClient.lindex).bind(
      this.redisClient,
    );
    return await lindexAsync(`queueTo${queueID}`, 0);
  }

  async takeNextFromQueue(queueID: string): Promise<string> {
    const lpopAsync = promisify(this.redisClient.lpop).bind(this.redisClient);
    await lpopAsync(`queueTo${queueID}`);
    return queueID;
  }

  async getAllPatientsFromQueue(queueID: string): Promise<string[]> {
    const lrangeAsync = promisify(this.redisClient.lrange).bind(
      this.redisClient,
    );
    return await lrangeAsync(`queueTo${queueID}`, 0, -1);
  }
}
