import {
  Body,
  Post,
  Controller,
  Inject,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiUseTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {ICommandBusAdapter} from 'src/Application/Adapter/ICommandBusAdapter';
import {LoggedUser} from 'src/Infrastructure/User/Decorator/LoggedUser';
import {User} from 'src/Domain/User/User.entity';
import {AddActivityCommand} from 'src/Application/Activity/Command/AddActivityCommand';
import {ActivityDTO} from './DTO/ActivityDTO';
import {ActivityView} from 'src/Application/Activity/View/ActivityView';
import {IQueryBusAdapter} from 'src/Application/Adapter/IQueryBusAdapter';
import {GetActivityByIdQuery} from 'src/Application/Activity/Query/GetActivityByIdQuery';

@Controller('activities')
@ApiUseTags('Activity')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
export class AddActivityAction {
  constructor(
    @Inject('ICommandBusAdapter')
    private readonly commandBus: ICommandBusAdapter,
    @Inject('IQueryBusAdapter')
    private readonly queryBus: IQueryBusAdapter
  ) {}

  @Post()
  @ApiOperation({title: 'Add new activity'})
  public async index(
    @Body() activityDto: ActivityDTO,
    @LoggedUser() user: User
  ): Promise<ActivityView> {
    try {
      const {date, projectId, taskId, summary, time} = activityDto;
      const id = await this.commandBus.execute(
        new AddActivityCommand(
          user,
          new Date(date),
          Number(time),
          projectId,
          taskId,
          summary
        )
      );

      return await this.queryBus.execute(new GetActivityByIdQuery(id));
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
