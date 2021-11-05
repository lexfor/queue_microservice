import { AppointmentEntity } from '../entities/appointment.entity';

export interface QueueRepository {
  addPatientInQueue: (
    appointmentEntity: AppointmentEntity,
  ) => Promise<AppointmentEntity>;
  getCurrentInQueue: (queueID: string) => Promise<AppointmentEntity>;
  takeNextFromQueue: (queueID: string) => Promise<void>;
  getAllPatientsFromQueue: (queueID: string) => Promise<AppointmentEntity[]>;
}
