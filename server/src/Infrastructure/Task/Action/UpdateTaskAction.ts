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
import {UpdateTaskCommand} from 'src/Application/Task/Command/UpdateTaskCommand';
import {TaskDTO} from './DTO/TaskDTO';
import {TaskIdDTO} from './DTO/TaskIdDTO';

@Controller('tasks')
@ApiUseTags('Task')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
export class UpdateTaskAction {
  constructor(
    @Inject('ICommandBus')
    private readonly commandBus: ICommandBus
  ) {}

  @Put(':id')
  @ApiOperation({title: 'Update task'})
  public async index(@Param() taskIdDto: TaskIdDTO, @Body() taskDto: TaskDTO) {
    try {
      const {id} = taskIdDto;
      await this.commandBus.execute(new UpdateTaskCommand(id, taskDto.name));

      return {id};
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
