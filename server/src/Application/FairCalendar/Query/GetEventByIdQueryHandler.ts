import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEventByIdQuery } from './GetEventByIdQuery';
import { IEventRepository } from 'src/Domain/FairCalendar/Repository/IEventRepository';
import { EventView } from '../View/EventView';
import { EventNotFoundException } from 'src/Domain/FairCalendar/Exception/EventNotFoundException';
import { ProjectView } from 'src/Application/Project/View/ProjectView';
import { TaskView } from 'src/Application/Task/View/TaskView';
import { IMealTicketRemovalRepository } from 'src/Domain/HumanResource/MealTicket/Repository/IMealTicketRemovalRepository';

@QueryHandler(GetEventByIdQuery)
export class GetEventByIdQueryHandler {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    @Inject('IMealTicketRemovalRepository')
    private readonly mealTicketRepository: IMealTicketRemovalRepository
  ) {}

  public async execute(query: GetEventByIdQuery): Promise<EventView> {
    const event = await this.eventRepository.findOneById(query.id);

    if (!event) {
      throw new EventNotFoundException();
    }

    const project = event.getProject();
    const task = event.getTask();
    const date = event.getDate();

    const meatTicketRemovalView = await this.mealTicketRepository.getOneByDate(
      date
    );

    return new EventView(
      event.getId(),
      event.getType(),
      event.getTime(),
      event.isBillable(),
      event.getDate(),
      event.getSummary(),
      project ? new ProjectView(project.getId(), project.getName()) : null,
      task ? new TaskView(task.getId(), task.getName()) : null,
      meatTicketRemovalView
    );
  }
}
