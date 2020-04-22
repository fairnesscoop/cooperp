import {
  Delete,
  Controller,
  Inject,
  BadRequestException,
  UseGuards,
  Param,
  HttpCode
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiUseTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {ICommandBus} from 'src/Application/ICommandBus';
import {LoggedUser} from 'src/Infrastructure/User/Decorator/LoggedUser';
import {User} from 'src/Domain/User/User.entity';
import {DeleteEventCommand} from 'src/Application/FairCalendar/Command/DeleteEventCommand';
import {IdDTO} from 'src/Infrastructure/Common/DTO/IdDTO';

@Controller('events')
@ApiUseTags('Event')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
export class DeleteEventAction {
  constructor(
    @Inject('ICommandBus')
    private readonly commandBus: ICommandBus
  ) {}

  @Delete(':id')
  @ApiOperation({title: 'Delete an event'})
  @HttpCode(204)
  public async index(@Param() dto: IdDTO, @LoggedUser() user: User) {
    try {
      await this.commandBus.execute(new DeleteEventCommand(dto.id, user));
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
