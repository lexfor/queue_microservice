import { QueueMapper } from '../mapper/queue.mapper';
import { QueueRepository } from '../queue.repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { IAppointment } from '../interfaces/appointment.interface';

export class GetCurrentPatientFromQueue {
  constructor(
    private readonly mapper: QueueMapper,
    private readonly repository: QueueRepository,
  ) {}

  async getCurrentPatientFromQueue(
    doctorID: string,
  ): Promise<AppointmentEntity> {
    const patientID: string = await this.repository.getCurrentInQueue(doctorID);
    const appointment: IAppointment = {
      patient_id: patientID,
      doctor_id: doctorID,
    };
    return this.mapper.toEntity(appointment);
  }
}
