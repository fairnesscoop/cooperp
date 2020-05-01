import {
  Body,
  Controller,
  Inject,
  BadRequestException,
  UseGuards,
  Put,
  Param
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiUseTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {ICommandBus} from 'src/Application/ICommandBus';
import {DailyRateDTO} from '../../DTO/DailyRateDTO';
import {IdDTO} from 'src/Infrastructure/Common/DTO/IdDTO';
import {UpdateDailyRateCommand} from 'src/Application/Accounting/Command/DailyRate/UpdateDailyRateCommand';
import {Roles} from 'src/Infrastructure/User/Decorator/Roles';
import {UserRole} from 'src/Domain/User/User.entity';
import {RolesGuard} from 'src/Infrastructure/User/Security/RolesGuard';

@Controller('daily_rates')
@ApiUseTags('Accounting')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'), RolesGuard)
export class UpdateDailyRateAction {
  constructor(
    @Inject('ICommandBus')
    private readonly commandBus: ICommandBus
  ) {}

  @Put(':id')
  @Roles(UserRole.COOPERATOR, UserRole.EMPLOYEE)
  @ApiOperation({title: 'Update daily rate'})
  public async index(@Param() idDto: IdDTO, @Body() dto: DailyRateDTO) {
    try {
      const {userId, customerId, taskId, amount} = dto;

      const id = await this.commandBus.execute(
        new UpdateDailyRateCommand(idDto.id, amount, userId, customerId, taskId)
      );

      return {id};
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}