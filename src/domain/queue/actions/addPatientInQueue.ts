import { QueueMapper } from '../mapper/queue.mapper';
import { QueueRepository } from '../queue.repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentDto } from '../dto/appointment.dto';
import { IAppointment } from '../interfaces/appointment.interface';

export class AddPatientInQueue {
  constructor(
    private readonly mapper: QueueMapper,
    private readonly repository: QueueRepository,
    private readonly entity: AppointmentEntity,
  ) {}

  async addPatientInQueue(
    createAppointmentDto: AppointmentDto,
  ): Promise<number> {
    const appointmentEntity: AppointmentEntity =
      this.entity.create(createAppointmentDto);
    const appointmentRow: IAppointment = this.mapper.toRow(appointmentEntity);
    await this.repository.addPatientInQueue(
      appointmentRow.doctor_id,
      appointmentRow.patient_id,
    );
    const total: string[] = await this.repository.getAllPatientsFromQueue(
      appointmentRow.doctor_id,
    );
    return total.length;
  }
}
