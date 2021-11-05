import { QueueRepository } from '../queue.repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetCurrentPatientFromQueue {
  constructor(
    @Inject('REDIS_REPOSITORY') private readonly repository: QueueRepository,
  ) {}

  async getCurrentPatientFromQueue(
    doctorID: string,
  ): Promise<AppointmentEntity> {
    return await this.repository.getCurrentInQueue(doctorID);
  }
}
