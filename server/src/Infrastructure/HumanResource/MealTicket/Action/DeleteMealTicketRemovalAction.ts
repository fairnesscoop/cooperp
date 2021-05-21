import {
  Controller,
  Inject,
  BadRequestException,
  UseGuards,
  Param,
  Delete
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ICommandBus } from 'src/Application/ICommandBus';
import { User, UserRole } from 'src/Domain/HumanResource/User/User.entity';
import { RolesGuard } from 'src/Infrastructure/HumanResource/User/Security/RolesGuard';
import { Roles } from 'src/Infrastructure/HumanResource/User/Decorator/Roles';
import { LoggedUser } from '../../User/Decorator/LoggedUser';
import { IdDTO } from 'src/Infrastructure/Common/DTO/IdDTO';
import { DeleteMealTicketRemovalCommand } from 'src/Application/HumanResource/MealTicket/Command/DeleteMealTicketRemovalCommand';

@Controller('meal-tickets-removals')
@ApiTags('Human Resource')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'), RolesGuard)
export class DeleteMealTicketRemovalAction {
  constructor(
    @Inject('ICommandBus')
    private readonly commandBus: ICommandBus
  ) {}
  @Delete(':id')
  @Roles(UserRole.COOPERATOR, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Delete meal ticket removal' })
  public async index(@Param() idDto: IdDTO, @LoggedUser() user: User) {
    try {
      await this.commandBus.execute(
        new DeleteMealTicketRemovalCommand(idDto.id, user)
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
