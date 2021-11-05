import { Injectable } from '@nestjs/common';
import { AppointmentDto } from '../dto/appointment.dto';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class AppointmentEntity {
  @ApiProperty()
  private readonly doctorID: string;
  @ApiProperty()
  private readonly patientID: string;

  constructor(doctorID: string, patientID: string) {
    this.doctorID = doctorID;
    this.patientID = patientID;
  }

  static create(appointmentDto: AppointmentDto): AppointmentEntity {
    return new AppointmentEntity(
      appointmentDto.doctorID,
      appointmentDto.patientID,
    );
  }

  get getDoctorID(): string {
    return this.doctorID;
  }

  get getPatientID(): string {
    return this.patientID;
  }
}
