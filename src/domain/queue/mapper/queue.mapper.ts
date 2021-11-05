import { AppointmentEntity } from '../entities/appointment.entity';
import { IAppointment } from '../interfaces/appointment.interface';

export class QueueMapper {
  toEntity(appointment: IAppointment): AppointmentEntity {
    return new AppointmentEntity(appointment.doctor_id, appointment.patient_id);
  }

  toRow(doctorEntity: AppointmentEntity): IAppointment {
    return {
      doctor_id: doctorEntity.getDoctorID,
      patient_id: doctorEntity.getPatientID,
    };
  }
}
