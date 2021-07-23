import { Controller, Inject, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IQueryBus } from 'src/Application/IQueryBus';
import { RolesGuard } from 'src/Infrastructure/HumanResource/User/Security/RolesGuard';
import { UserRole } from 'src/Domain/HumanResource/User/User.entity';
import { Roles } from 'src/Infrastructure/HumanResource/User/Decorator/Roles';
import { GetOnLeaveUsersQuery } from 'src/Application/HumanResource/Leave/Query/GetOnLeaveUsersQuery';
import {OnLeaveUserView} from "../../../../Application/HumanResource/Leave/View/OnLeaveUserView";

@Controller('on-leave')
@ApiTags('Human Resource')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'), RolesGuard)
export class GetOnLeaveUsersAction {
    constructor(
        @Inject('IQueryBus')
        private readonly queryBus: IQueryBus
    ) {}

    @Get()
    @Roles(UserRole.COOPERATOR, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get today on leave users' })
    public async index(): Promise<Array<OnLeaveUserView>> {
        return await this.queryBus.execute(
            new GetOnLeaveUsersQuery()
        );
    }
}
