import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BusModule} from '../bus.module';
import {Project} from 'src/Domain/Project/Project.entity';
import {Customer} from 'src/Domain/Customer/Customer.entity';
import {CreateProjectAction} from './Action/CreateProjectAction';
import {CreateProjectCommandHandler} from 'src/Application/Project/Command/CreateProjectCommandHandler';
import {ProjectRepository} from './Repository/ProjectRepository';
import {IsProjectAlreadyExist} from 'src/Domain/Project/Specification/IsProjectAlreadyExist';
import {CustomerRepository} from '../Customer/Repository/CustomerRepository';
import {GetProjectsAction} from './Action/GetProjectsAction';
import {GetProjectsQueryHandler} from 'src/Application/Project/Query/GetProjectsQueryHandler';
import {UpdateProjectAction} from './Action/UpdateProjectAction';
import {GetProjectAction} from './Action/GetProjectAction';
import {GetProjectByIdQueryHandler} from 'src/Application/Project/Query/GetProjectByIdQueryHandler';
import {UpdateProjectCommandHandler} from 'src/Application/Project/Command/UpdateProjectCommandHandler';

@Module({
  imports: [BusModule, TypeOrmModule.forFeature([Project, Customer])],
  controllers: [
    GetProjectsAction,
    GetProjectAction,
    CreateProjectAction,
    UpdateProjectAction
  ],
  providers: [
    {provide: 'IProjectRepository', useClass: ProjectRepository},
    {provide: 'ICustomerRepository', useClass: CustomerRepository},
    CreateProjectCommandHandler,
    IsProjectAlreadyExist,
    GetProjectsQueryHandler,
    GetProjectByIdQueryHandler,
    UpdateProjectCommandHandler
  ]
})
export class ProjectModule {}
