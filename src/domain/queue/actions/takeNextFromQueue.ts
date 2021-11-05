import { QueueRepository } from '../queue.repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TakeNextFromQueue {
  constructor(
    @Inject('REDIS_REPOSITORY') private readonly repository: QueueRepository,
  ) {}

  async takeNextFromQueue(doctorID: string): Promise<AppointmentEntity> {
    await this.repository.takeNextFromQueue(doctorID);
    return await this.repository.getCurrentInQueue(doctorID);
  }
}
