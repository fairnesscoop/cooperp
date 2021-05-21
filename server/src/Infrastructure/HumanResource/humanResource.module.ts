import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { BusModule } from '../bus.module';
import { User } from 'src/Domain/HumanResource/User/User.entity';
import { File } from 'src/Domain/File/File.entity';
import { PaySlip } from 'src/Domain/HumanResource/PaySlip/PaySlip.entity';
import { LoginAction } from './User/Action/LoginAction';
import { CreateUserAction } from './User/Action/CreateUserAction';
import { GetMeAction } from './User/Action/GetMeAction';
import { UpdateMeAction } from './User/Action/UpdateMeAction';
import { GetUsersAction } from './User/Action/GetUsersAction';
import { UserRepository } from './User/Repository/UserRepository';
import { PasswordEncoderAdapter } from '../Adapter/PasswordEncoderAdapter';
import { DateUtilsAdapter } from '../Adapter/DateUtilsAdapter';
import { PaySlipRepository } from './PaySlip/Repository/PaySlipRepository';
import { FileRepository } from '../File/Repository/FileRepository';
import { CreatePaySlipCommandHandler } from 'src/Application/HumanResource/PaySlip/Command/CreatePaySlipCommandHandler';
import { IsPaySlipAlreadyExist } from 'src/Domain/HumanResource/PaySlip/Specification/IsPaySlipAlreadyExist';
import { LoginQueryHandler } from 'src/Application/HumanResource/User/Query/LoginQueryHandler';
import { CreateUserCommandHandler } from 'src/Application/HumanResource/User/Command/CreateUserCommandHandler';
import { GetUsersQueryHandler } from 'src/Application/HumanResource/User/Query/GetUsersQueryHandler';
import { IsEmailAlreadyExist } from 'src/Domain/HumanResource/User/Specification/IsEmailAlreadyExist';
import { UpdateProfileCommandHandler } from 'src/Application/HumanResource/User/Command/UpdateProfileCommandHandler';
import { BearerStrategy } from './User/Security/BearerStrategy';
import { GetUserByIdQueryHandler } from 'src/Application/HumanResource/User/Query/GetUserByIdQueryHandler';
import { UserAdministrative } from 'src/Domain/HumanResource/User/UserAdministrative.entity';
import { UserAdministrativeRepository } from './User/Repository/UserAdministrativeRepository';
import { GetPaySlipsQueryHandler } from 'src/Application/HumanResource/PaySlip/Query/GetPaySlipsQueryHandler';
import { CreatePaySlipAction } from './PaySlip/Action/CreatePaySlipAction';
import { GetPaySlipsAction } from './PaySlip/Action/GetPaySlipsAction';
import { DownloadPaySlipAction } from './PaySlip/Action/DownloadPaySlipAction';
import { GetPaySlipByIdQueryHandler } from 'src/Application/HumanResource/PaySlip/Query/GetPaySlipByIdQueryHandler';
import { LeaveRequest } from 'src/Domain/HumanResource/Leave/LeaveRequest.entity';
import { LeaveRequestRepository } from './Leave/Repository/LeaveRequestRepository';
import { CreateLeaveRequestCommandHandler } from 'src/Application/HumanResource/Leave/Command/CreateLeaveRequestCommandHandler';
import { DoesLeaveRequestExistForPeriod } from 'src/Domain/HumanResource/Leave/Specification/DoesLeaveRequestExistForPeriod';
import { CreateLeaveRequestAction } from './Leave/Action/CreateLeaveRequestAction';
import { RefuseLeaveRequestCommandHandler } from 'src/Application/HumanResource/Leave/Command/RefuseLeaveRequestCommandHandler';
import { RefuseLeaveRequestAction } from './Leave/Action/RefuseLeaveRequestAction';
import { CanLeaveRequestBeModerated } from 'src/Domain/HumanResource/Leave/Specification/CanLeaveRequestBeModerated';
import { AcceptedLeaveRequestEventListener } from 'src/Application/HumanResource/Leave/Event/AcceptedLeaveRequestEventListener';
import { EventRepository } from '../FairCalendar/Repository/EventRepository';
import { Event } from 'src/Domain/FairCalendar/Event.entity';
import { AcceptLeaveRequestCommandHandler } from 'src/Application/HumanResource/Leave/Command/AcceptLeaveRequestCommandHandler';
import { AcceptLeaveRequestAction } from './Leave/Action/AcceptLeaveRequestAction';
import { GetLeaveRequestsQueryHandler } from 'src/Application/HumanResource/Leave/Query/GetLeaveRequestsQueryHandler';
import { GetLeaveRequestsAction } from './Leave/Action/GetLeaveRequestsAction';
import { GetLeaveRequestAction } from './Leave/Action/GetLeaveRequestAction';
import { DoesEventsOrLeaveExistForPeriod } from 'src/Domain/FairCalendar/Specification/DoesEventsOrLeaveExistForPeriod';
import { LeaveRequestToLeavesConverter } from 'src/Domain/HumanResource/Leave/Converter/LeaveRequestToLeavesConverter';
import { LeaveRepository } from './Leave/Repository/LeaveRepository';
import { Leave } from 'src/Domain/HumanResource/Leave/Leave.entity';
import { GetLeaveRequestByIdQueryHandler } from 'src/Application/HumanResource/Leave/Query/GetLeaveRequestByIdQueryHandler';
import { CooperativeRepository } from '../Settings/Repository/CooperativeRepository';
import { Cooperative } from 'src/Domain/Settings/Cooperative.entity';
import { UpdateUserAction } from './User/Action/UpdateUserAction';
import { GetUserAction } from './User/Action/GetUserAction';
import { UpdateUserCommandHandler } from 'src/Application/HumanResource/User/Command/UpdateUserCommandHandler';
import { GetUserAdministrativeByIdQueryHandler } from 'src/Application/HumanResource/User/Query/GetUserAdministrativeByIdQueryHandler';
import { GetLeavesAction } from './Leave/Action/GetLeavesAction';
import { MealTicketRemoval } from 'src/Domain/HumanResource/MealTicket/MealTicketRemoval.entity';
import { MealTicketRemovalRepository } from './MealTicket/Repository/MealTicketRemovalRepository';
import { IsMealTicketRemovalAlreadyExist } from 'src/Domain/HumanResource/MealTicket/Specification/IsMealTicketRemovalAlreadyExist';
import { CreateMealTicketRemovalCommandHandler } from 'src/Application/HumanResource/MealTicket/Command/CreateMealTicketRemovalCommandHandler';
import { CreateMealTicketRemovalAction } from './MealTicket/Action/CreateMealTicketRemovalAction';
import { CanLeaveRequestBeRemoved } from 'src/Domain/HumanResource/Leave/Specification/CanLeaveRequestBeRemoved';
import { DeleteLeaveRequestCommandHandler } from 'src/Application/HumanResource/Leave/Command/DeleteLeaveRequestCommandHandler';
import { DeleteLeaveRequestAction } from './Leave/Action/DeleteLeaveRequestAction';
import { GetAvailableMealTicketsAction } from './MealTicket/Action/GetAvailableMealTicketsAction';
import { CountMealTicketPerMonthQueryHandler } from 'src/Application/HumanResource/MealTicket/Query/CountMealTicketPerMonthQueryHandler';
import { DeleteMealTicketRemovalAction } from './MealTicket/Action/DeleteMealTicketRemovalAction';

@Module({
  imports: [
    BusModule,
    PassportModule,
    TypeOrmModule.forFeature([
      User,
      UserAdministrative,
      File,
      PaySlip,
      LeaveRequest,
      Leave,
      Event,
      Cooperative,
      MealTicketRemoval
    ])
  ],
  controllers: [
    LoginAction,
    CreateUserAction,
    GetLeavesAction,
    UpdateUserAction,
    GetMeAction,
    UpdateMeAction,
    GetUserAction,
    GetUsersAction,
    CreatePaySlipAction,
    GetPaySlipsAction,
    DownloadPaySlipAction,
    GetLeaveRequestsAction,
    GetLeaveRequestAction,
    CreateLeaveRequestAction,
    RefuseLeaveRequestAction,
    AcceptLeaveRequestAction,
    CreateMealTicketRemovalAction,
    GetAvailableMealTicketsAction,
    DeleteLeaveRequestAction,
    DeleteMealTicketRemovalAction
  ],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'ILeaveRepository', useClass: LeaveRepository },
    { provide: 'ILeaveRequestRepository', useClass: LeaveRequestRepository },
    { provide: 'IPasswordEncoder', useClass: PasswordEncoderAdapter },
    { provide: 'IDateUtils', useClass: DateUtilsAdapter },
    { provide: 'IPaySlipRepository', useClass: PaySlipRepository },
    { provide: 'IFileRepository', useClass: FileRepository },
    { provide: 'IEventRepository', useClass: EventRepository },
    { provide: 'ICooperativeRepository', useClass: CooperativeRepository },
    {
      provide: 'IMealTicketRemovalRepository',
      useClass: MealTicketRemovalRepository
    },
    {
      provide: 'IUserAdministrativeRepository',
      useClass: UserAdministrativeRepository
    },
    {
      provide: 'IMealTicketRemovalRepository',
      useClass: MealTicketRemovalRepository
    },
    Date,
    CreatePaySlipCommandHandler,
    IsPaySlipAlreadyExist,
    LoginQueryHandler,
    CreateUserCommandHandler,
    IsEmailAlreadyExist,
    GetUsersQueryHandler,
    UpdateProfileCommandHandler,
    UpdateUserCommandHandler,
    BearerStrategy,
    GetUserByIdQueryHandler,
    GetUserAdministrativeByIdQueryHandler,
    GetPaySlipsQueryHandler,
    GetPaySlipByIdQueryHandler,
    CreateLeaveRequestCommandHandler,
    DoesLeaveRequestExistForPeriod,
    RefuseLeaveRequestCommandHandler,
    CanLeaveRequestBeModerated,
    AcceptLeaveRequestCommandHandler,
    AcceptedLeaveRequestEventListener,
    LeaveRequestToLeavesConverter,
    GetLeaveRequestsQueryHandler,
    GetLeaveRequestByIdQueryHandler,
    DoesEventsOrLeaveExistForPeriod,
    CanLeaveRequestBeRemoved,
    DeleteLeaveRequestCommandHandler,
    IsMealTicketRemovalAlreadyExist,
    CreateMealTicketRemovalCommandHandler,
    CountMealTicketPerMonthQueryHandler
  ]
})
export class HumanResourceModule {}
