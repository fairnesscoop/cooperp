import { mock, instance, when, verify } from 'ts-mockito';
import { EventRepository } from 'src/Infrastructure/FairCalendar/Repository/EventRepository';
import { Event } from 'src/Domain/FairCalendar/Event.entity';
import { EventView } from 'src/Application/FairCalendar/View/EventView';
import { GetEventByIdQueryHandler } from './GetEventByIdQueryHandler';
import { GetEventByIdQuery } from './GetEventByIdQuery';
import { EventNotFoundException } from 'src/Domain/FairCalendar/Exception/EventNotFoundException';
import { Task } from 'src/Domain/Task/Task.entity';
import { Project } from 'src/Domain/Project/Project.entity';
import { ProjectView } from 'src/Application/Project/View/ProjectView';
import { TaskView } from 'src/Application/Task/View/TaskView';
import { MealTicketRemovalRepository } from 'src/Infrastructure/HumanResource/MealTicket/Repository/MealTicketRemovalRepository';
import { MealTicketRemoval } from 'src/Domain/HumanResource/MealTicket/MealTicketRemoval.entity';
import { MealTicketRemovalView } from 'src/Application/HumanResource/MealTicket/Views/MealTicketRemovalView';

describe('GetEventByIdQueryHandler', () => {
  const query = new GetEventByIdQuery('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2');

  it('testGetEvent', async () => {
    const eventRepository = mock(EventRepository);
    const mealTicketRepository = mock(MealTicketRemovalRepository);
    const queryHandler = new GetEventByIdQueryHandler(
      instance(eventRepository),
      instance(mealTicketRepository)
    );
    const expectedResult = new EventView(
      'eb9e1d9b-dce2-48a9-b64f-f0872f3157d2',
      'mission',
      420,
      true,
      '2019-12-12',
      'Summary',
      new ProjectView('bf4a645c-9754-4943-baec-783361c6d814', 'RadioFrance'),
      new TaskView('7fb77f06-2d0b-4758-886a-42bba5445fcd', 'Development')
    );

    const task = mock(Task);
    const project = mock(Project);

    const date = '2019-12-12';

    when(project.getId()).thenReturn('bf4a645c-9754-4943-baec-783361c6d814');
    when(project.getName()).thenReturn('RadioFrance');
    when(task.getId()).thenReturn('7fb77f06-2d0b-4758-886a-42bba5445fcd');
    when(task.getName()).thenReturn('Development');

    const event1 = mock(Event);
    when(event1.getId()).thenReturn('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2');
    when(event1.getType()).thenReturn('mission');
    when(event1.getTime()).thenReturn(420);
    when(event1.getDate()).thenReturn(date);
    when(event1.isBillable()).thenReturn(true);
    when(event1.getSummary()).thenReturn('Summary');
    when(event1.getTask()).thenReturn(instance(task));
    when(event1.getProject()).thenReturn(instance(project));

    when(
      eventRepository.findOneById('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2')
    ).thenResolve(instance(event1));

    when(mealTicketRepository.getOneByDate(date)).thenResolve(undefined);

    expect(await queryHandler.execute(query)).toMatchObject(expectedResult);

    verify(
      eventRepository.findOneById('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2')
    ).once();

    verify(mealTicketRepository.getOneByDate(date)).once();
  });

  it('testGetEventNotFound', async () => {
    const date = '2019-12-12';

    const eventRepository = mock(EventRepository);
    const mealTicketRepository = mock(MealTicketRemovalRepository);
    const queryHandler = new GetEventByIdQueryHandler(
      instance(eventRepository),
      instance(mealTicketRepository)
    );
    when(
      eventRepository.findOneById('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2')
    ).thenResolve(null);

    when(mealTicketRepository.getOneByDate(date)).thenResolve(undefined);

    try {
      await queryHandler.execute(query);
    } catch (e) {
      expect(e).toBeInstanceOf(EventNotFoundException);
      expect(e.message).toBe('faircalendar.errors.event_not_found');
      verify(
        eventRepository.findOneById('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2')
      ).once();
    }
  });

  it('should return an EventView with canReceive mail ticket set to true', async () => {
    const eventRepository = mock(EventRepository);
    const mealTicketRepository = mock(MealTicketRemovalRepository);
    const queryHandler = new GetEventByIdQueryHandler(
      instance(eventRepository),
      instance(mealTicketRepository)
    );
    const date = '2019-12-12';
    const mealTicketRemovalId = 666;

    const mealTicketRemovalView = new MealTicketRemovalView(
      date,
      mealTicketRemovalId
    );
    const expectedResult = new EventView(
      'eb9e1d9b-dce2-48a9-b64f-f0872f3157d2',
      'mission',
      420,
      true,
      '2019-12-12',
      'Summary',
      new ProjectView('bf4a645c-9754-4943-baec-783361c6d814', 'RadioFrance'),
      new TaskView('7fb77f06-2d0b-4758-886a-42bba5445fcd', 'Development'),
      mealTicketRemovalView
    );

    const task = mock(Task);
    const project = mock(Project);

    when(project.getId()).thenReturn('bf4a645c-9754-4943-baec-783361c6d814');
    when(project.getName()).thenReturn('RadioFrance');
    when(task.getId()).thenReturn('7fb77f06-2d0b-4758-886a-42bba5445fcd');
    when(task.getName()).thenReturn('Development');

    const event1 = mock(Event);
    when(event1.getId()).thenReturn('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2');
    when(event1.getType()).thenReturn('mission');
    when(event1.getTime()).thenReturn(420);
    when(event1.getDate()).thenReturn(date);
    when(event1.isBillable()).thenReturn(true);
    when(event1.getSummary()).thenReturn('Summary');
    when(event1.getTask()).thenReturn(instance(task));
    when(event1.getProject()).thenReturn(instance(project));

    when(
      eventRepository.findOneById('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2')
    ).thenResolve(instance(event1));

    const mealTicketRemoval = mock(MealTicketRemoval);

    when(mealTicketRemoval.getDate()).thenReturn(date);

    when(mealTicketRepository.getOneByDate(date)).thenResolve(
      mealTicketRemovalView
    );

    expect(await queryHandler.execute(query)).toMatchObject(expectedResult);

    verify(
      eventRepository.findOneById('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2')
    ).once();

    verify(mealTicketRepository.getOneByDate(date)).once();
  });
});
