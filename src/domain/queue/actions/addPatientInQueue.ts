import { QueueRepository } from '../queue.repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentDto } from '../dto/appointment.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AddPatientInQueue {
  constructor(
    @Inject('REDIS_REPOSITORY') private readonly repository: QueueRepository,
  ) {}

  async addPatientInQueue(
    createAppointmentDto: AppointmentDto,
  ): Promise<number> {
    const appointmentEntity: AppointmentEntity =
      AppointmentEntity.create(createAppointmentDto);
    await this.repository.addPatientInQueue(appointmentEntity);
    const total: AppointmentEntity[] =
      await this.repository.getAllPatientsFromQueue(
        appointmentEntity.getDoctorID,
      );
    return total.length;
  }
}
