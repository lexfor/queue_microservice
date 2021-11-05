import { CreatePatientDto } from '../dto/create-patient.dto';
import { IPatient } from './patient.interface';

export interface IPatientService {
  createPatient(data: CreatePatientDto): IPatient;
}
