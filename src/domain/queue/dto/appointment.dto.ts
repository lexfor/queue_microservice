import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator/types';

export class AppointmentDto {
  @ApiProperty()
  @IsUUID('all')
  patientID: string;

  @ApiProperty()
  @IsUUID('all')
  doctorID: string;
}
