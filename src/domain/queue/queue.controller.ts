import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  OnModuleInit,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddPatientInQueue } from './actions/addPatientInQueue';
import { AppointmentDto } from './dto/appointment.dto';
import { GetCurrentPatientFromQueue } from './actions/getCurrentPatientFromQueue';
import { TakeNextFromQueue } from './actions/takeNextFromQueue';
import { IDoctorService } from './interfaces/doctor.service.interface';
import { IPatientService } from './interfaces/patients.service.interface';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { JwtGuard } from '../../infrastructure/guards/jwt.guard';
import { join } from 'path';
import { IPatientMessage } from './interfaces/patient-message.interface';
import { IDoctorMessage } from './interfaces/doctor-message.interface';
import { lastValueFrom } from 'rxjs';
import { AppointmentEntity } from './entities/appointment.entity';
import { IPatient } from './interfaces/patient.interface';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PatientSwagger } from './interfaces/patient-swagger';

@ApiTags('Appointment')
@ApiBearerAuth()
@Controller('api/queue')
@UseGuards(JwtGuard)
export class QueueController implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.USERS_MICROSERVICE_GRPC,
      package: 'lab',
      protoPath: join(__dirname, '../../../grpc/grpc.proto'),
    },
  })
  client: ClientGrpc;
  private doctorService: IDoctorService;
  private patientService: IPatientService;

  constructor(
    private readonly addPatientInQueueClass: AddPatientInQueue,
    private readonly getCurrentPatientFromQueueClass: GetCurrentPatientFromQueue,
    private readonly takeNextFromQueueClass: TakeNextFromQueue,
  ) {}

  onModuleInit() {
    this.patientService =
      this.client.getService<IPatientService>('PatientService');
    this.doctorService =
      this.client.getService<IDoctorService>('DoctorService');
  }

  @ApiCreatedResponse({
    description: 'your number in doctor queue',
  })
  @Post(':id/patient/me')
  async addPatientInQueue(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() { user },
  ): Promise<number> {
    const patient: IPatientMessage = await lastValueFrom(
      this.patientService.getPatientByUserID({ userID: user }),
    );
    if (patient.id === null) {
      throw new HttpException('patient not exist', HttpStatus.BAD_REQUEST);
    }
    const createAppointmentDto: AppointmentDto = {
      doctorID: id,
      patientID: patient.id,
    };
    return await this.addPatientInQueueClass.addPatientInQueue(
      createAppointmentDto,
    );
  }

  @ApiOkResponse({
    description: 'current patient in queue',
    type: PatientSwagger,
  })
  @Get('me/current')
  async getCurrentInMyQueue(@Req() { user }): Promise<IPatient> {
    const doctor: IDoctorMessage = await lastValueFrom(
      this.doctorService.getDoctorByUserID({
        userID: user,
      }),
    );
    if (doctor.id === null) {
      throw new HttpException('doctor not exist', HttpStatus.BAD_REQUEST);
    }
    const appointment: AppointmentEntity =
      await this.getCurrentPatientFromQueueClass.getCurrentPatientFromQueue(
        doctor.id,
      );
    const patient: IPatientMessage = await lastValueFrom(
      this.patientService.getPatientByID({
        userID: appointment.getPatientID,
      }),
    );
    if (patient.id === null) {
      throw new HttpException('patient not exist', HttpStatus.BAD_REQUEST);
    }
    return {
      id: patient.id,
      name: patient.name,
      mail: patient.mail,
      birthday: patient.birthday,
      gender: patient.gender,
      user_id: patient.userID,
    };
  }

  @ApiOkResponse({
    description: 'current patient in queue',
    type: PatientSwagger,
  })
  @Get(':id/current')
  async getCurrentInQueue(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IPatient> {
    const appointment: AppointmentEntity =
      await this.getCurrentPatientFromQueueClass.getCurrentPatientFromQueue(id);
    const patient: IPatientMessage = await lastValueFrom(
      this.patientService.getPatientByID({
        userID: appointment.getPatientID,
      }),
    );
    if (patient.id === null) {
      throw new HttpException('patient not exist', HttpStatus.BAD_REQUEST);
    }
    return {
      id: patient.id,
      name: patient.name,
      mail: patient.mail,
      birthday: patient.birthday,
      gender: patient.gender,
      user_id: patient.userID,
    };
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    description: 'get next patient in queue',
    type: PatientSwagger,
  })
  @Get('me/next')
  async takeNextInMyQueue(@Req() { user }) {
    const doctor: IDoctorMessage = await lastValueFrom(
      this.doctorService.getDoctorByUserID({ userID: user }),
    );
    const appointment: AppointmentEntity =
      await this.takeNextFromQueueClass.takeNextFromQueue(doctor.id);
    const patient: IPatientMessage = await lastValueFrom(
      this.patientService.getPatientByID({
        userID: appointment.getPatientID,
      }),
    );
    if (patient.id === null) {
      throw new HttpException('patient not exist', HttpStatus.BAD_REQUEST);
    }
    return {
      id: patient.id,
      name: patient.name,
      mail: patient.mail,
      birthday: patient.birthday,
      gender: patient.gender,
      user_id: patient.userID,
    };
  }
}
