import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { QueueMapper } from './mapper/queue.mapper';
import { IAppointment } from './interfaces/appointment.interface';
import { AppointmentEntity } from './entities/appointment.entity';

@Injectable()
export class QueueRepository {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClient,
    private readonly mapper: QueueMapper,
  ) {}

  async addPatientInQueue(
    appointmentEntity: AppointmentEntity,
  ): Promise<AppointmentEntity> {
    const appointment: IAppointment = this.mapper.toRow(appointmentEntity);
    const rpushAsync = promisify(this.redisClient.rpush).bind(this.redisClient);
    await rpushAsync(`queueTo${appointment.doctor_id}`, appointment.patient_id);
    return appointmentEntity;
  }

  async getCurrentInQueue(queueID: string): Promise<AppointmentEntity> {
    const lindexAsync = promisify(this.redisClient.lindex).bind(
      this.redisClient,
    );
    const patientID = await lindexAsync(`queueTo${queueID}`, 0);
    return this.mapper.toEntity({
      patient_id: patientID,
      doctor_id: queueID,
    });
  }

  async takeNextFromQueue(queueID: string): Promise<void> {
    const lpopAsync = promisify(this.redisClient.lpop).bind(this.redisClient);
    await lpopAsync(`queueTo${queueID}`);
  }

  async getAllPatientsFromQueue(queueID: string): Promise<AppointmentEntity[]> {
    const lrangeAsync = promisify(this.redisClient.lrange).bind(
      this.redisClient,
    );
    const patientIDs: string[] = await lrangeAsync(`queueTo${queueID}`, 0, -1);
    return patientIDs.map((patientID) => {
      return this.mapper.toEntity({
        patient_id: patientID,
        doctor_id: queueID,
      });
    });
  }
}
