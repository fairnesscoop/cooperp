import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PassportModule} from '@nestjs/passport';
import {BusModule} from '../bus.module';
import {User} from 'src/Domain/HumanResource/User/User.entity';
import {File} from 'src/Domain/File/File.entity';
import {PaySlip} from 'src/Domain/HumanResource/PaySlip/PaySlip.entity';
import {LoginAction} from './User/Action/LoginAction';
import {CreateUserAction} from './User/Action/CreateUserAction';
import {GetMeAction} from './User/Action/GetMeAction';
import {UpdateMeAction} from './User/Action/UpdateMeAction';
import {GetUsersAction} from './User/Action/GetUsersAction';
import {UserRepository} from './User/Repository/UserRepository';
import {PasswordEncoderAdapter} from '../Adapter/PasswordEncoderAdapter';
import {DateUtilsAdapter} from '../Adapter/DateUtilsAdapter';
import {PaySlipRepository} from './PaySlip/Repository/PaySlipRepository';
import {FileRepository} from '../File/Repository/FileRepository';
import {CreatePaySlipCommandHandler} from 'src/Application/HumanResource/PaySlip/Command/CreatePaySlipCommandHandler';
import {IsPaySlipAlreadyExist} from 'src/Domain/HumanResource/PaySlip/Specification/IsPaySlipAlreadyExist';
import {LoginQueryHandler} from 'src/Application/HumanResource/User/Query/LoginQueryHandler';
import {CreateUserCommandHandler} from 'src/Application/HumanResource/User/Command/CreateUserCommandHandler';
import {GetUsersQueryHandler} from 'src/Application/HumanResource/User/Query/GetUsersQueryHandler';
import {IsEmailAlreadyExist} from 'src/Domain/HumanResource/User/Specification/IsEmailAlreadyExist';
import {UpdateProfileCommandHandler} from 'src/Application/HumanResource/User/Command/UpdateProfileCommandHandler';
import {BearerStrategy} from './User/Security/BearerStrategy';
import {GetUserByIdQueryHandler} from 'src/Application/HumanResource/User/Query/GetUserByIdQueryHandler';
import {UserAdministrative} from 'src/Domain/HumanResource/User/UserAdministrative.entity';
import {UserAdministrativeRepository} from './User/Repository/UserAdministrativeRepository';
import {GetPaySlipsQueryHandler} from 'src/Application/HumanResource/PaySlip/Query/GetPaySlipsQueryHandler';
import {CreatePaySlipAction} from './PaySlip/Action/CreatePaySlipAction';
import {GetPaySlipsAction} from './PaySlip/Action/GetPaySlipsAction';
import {DownloadPaySlipAction} from './PaySlip/Action/DownloadPaySlipAction';
import {GetPaySlipByIdQueryHandler} from 'src/Application/HumanResource/PaySlip/Query/GetPaySlipByIdQueryHandler';
import {Holiday} from 'src/Domain/HumanResource/Holiday/Holiday.entity';
import {HolidayRepository} from './Holiday/Repository/HolidayRepository';
import {CreateHolidayCommandHandler} from 'src/Application/HumanResource/Holiday/Command/CreateHolidayCommandHandler';
import {DoesHolidayExistForPeriod} from 'src/Domain/HumanResource/Holiday/Specification/DoesHolidayExistForPeriod';
import {CreateHolidayAction} from './Holiday/Action/CreateHolidayAction';

@Module({
  imports: [
    BusModule,
    PassportModule,
    TypeOrmModule.forFeature([User, UserAdministrative, File, PaySlip, Holiday])
  ],
  controllers: [
    LoginAction,
    CreateUserAction,
    GetMeAction,
    UpdateMeAction,
    GetUsersAction,
    CreatePaySlipAction,
    GetPaySlipsAction,
    DownloadPaySlipAction,
    CreateHolidayAction
  ],
  providers: [
    {provide: 'IUserRepository', useClass: UserRepository},
    {provide: 'IHolidayRepository', useClass: HolidayRepository},
    {provide: 'IPasswordEncoder', useClass: PasswordEncoderAdapter},
    {provide: 'IDateUtils', useClass: DateUtilsAdapter},
    {provide: 'IPaySlipRepository', useClass: PaySlipRepository},
    {provide: 'IFileRepository', useClass: FileRepository},
    {
      provide: 'IUserAdministrativeRepository',
      useClass: UserAdministrativeRepository
    },
    CreatePaySlipCommandHandler,
    IsPaySlipAlreadyExist,
    LoginQueryHandler,
    CreateUserCommandHandler,
    IsEmailAlreadyExist,
    GetUsersQueryHandler,
    UpdateProfileCommandHandler,
    BearerStrategy,
    GetUserByIdQueryHandler,
    GetPaySlipsQueryHandler,
    GetPaySlipByIdQueryHandler,
    CreateHolidayCommandHandler,
    DoesHolidayExistForPeriod
  ]
})
export class HumanResourceModule {}