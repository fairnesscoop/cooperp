import { mock, instance, when, verify, deepEqual } from 'ts-mockito';
import { Project } from 'src/Domain/Project/Project.entity';
import { Task } from 'src/Domain/Task/Task.entity';
import { GetMonthlyFairCalendarQueryHandler } from './GetMonthlyFairCalendarQueryHandler';
import { GetMonthlyFairCalendarQuery } from './GetMonthlyFairCalendarQuery';
import { DateUtilsAdapter } from 'src/Infrastructure/Adapter/DateUtilsAdapter';
import { EventRepository } from 'src/Infrastructure/FairCalendar/Repository/EventRepository';
import { Event } from 'src/Domain/FairCalendar/Event.entity';
import { MonthlyEventsView } from '../View/MonthlyEventsView';
import { ProjectView } from 'src/Application/Project/View/ProjectView';
import { TaskView } from 'src/Application/Task/View/TaskView';
import { GetFairCalendarOverview } from 'src/Domain/FairCalendar/GetFairCalendarOverview';
import { ICalendarOverview } from 'src/Domain/FairCalendar/ICalendarOverview';
import { LeaveRepository } from 'src/Infrastructure/HumanResource/Leave/Repository/LeaveRepository';
import { Leave } from 'src/Domain/HumanResource/Leave/Leave.entity';
import { FairCalendarView } from '../View/FairCalendarView';

describe('GetMonthlyFairCalendarQueryHandler', () => {
  it('testGetEvents', async () => {
    const leaveRepository = mock(LeaveRepository);
    const eventRepository = mock(EventRepository);
    const dateUtils = mock(DateUtilsAdapter);
    const getFairCalendarOverview = mock(GetFairCalendarOverview);
    const task = mock(Task);
    const project = mock(Project);

    when(project.getId()).thenReturn('bf4a645c-9754-4943-baec-783361c6d814');
    when(project.getName()).thenReturn('RadioFrance');
    when(task.getId()).thenReturn('7fb77f06-2d0b-4758-886a-42bba5445fcd');
    when(task.getName()).thenReturn('Development');

    const event1 = mock(Event);
    when(event1.getId()).thenReturn('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2');
    when(event1.getType()).thenReturn('mission');
    when(event1.getTime()).thenReturn(75);
    when(event1.getDate()).thenReturn('2019-12-12');
    when(event1.getSummary()).thenReturn('Summary');
    when(event1.getTask()).thenReturn(instance(task));
    when(event1.getProject()).thenReturn(instance(project));

    const event2 = mock(Event);
    when(event2.getId()).thenReturn('b9a9b094-5bb2-4d0b-b01e-231b6cb50039');
    when(event2.getType()).thenReturn('dojo');
    when(event2.getTime()).thenReturn(25);
    when(event2.getDate()).thenReturn('2019-12-12');
    when(event2.getSummary()).thenReturn(null);
    when(event2.getTask()).thenReturn(null);
    when(event2.getProject()).thenReturn(null);

    const leave = mock(Leave);
    when(leave.getType()).thenReturn('paid');
    when(leave.getDate()).thenReturn('2019-12-13');
    when(leave.getTime()).thenReturn(100);

    const leave2 = mock(Leave);
    when(leave2.getType()).thenReturn('special');
    when(leave2.getDate()).thenReturn('2019-12-14');
    when(leave2.getTime()).thenReturn(50);

    const overview: ICalendarOverview = {
      mission: 0.75,
      dojo: 0.25,
      formationConference: 0,
      leave: 2,
      support: 0,
      other: 0,
      mealTicket: 1,
    };

    const events = [instance(event1), instance(event2)];
    const leaves = [instance(leave), instance(leave2)];

    when(
      dateUtils.format(
        deepEqual(new Date(`2019-12-12T17:43:14.299Z`)),
        'y-MM-dd'
      )
    ).thenReturn(`2019-12-12`);
    when(
      eventRepository.findMonthlyEvents(
        '2019-12-12',
        '00bef1e1-cb52-4914-8887-568b17d99964'
      )
    ).thenResolve(events);
    when(
      leaveRepository.findMonthlyLeaves(
        '2019-12-12',
        '00bef1e1-cb52-4914-8887-568b17d99964'
      )
    ).thenResolve(leaves);
    when(getFairCalendarOverview.index(deepEqual([...events, ...leaves]))).thenReturn(overview);

    const queryHandler = new GetMonthlyFairCalendarQueryHandler(
      instance(eventRepository),
      instance(leaveRepository),
      instance(dateUtils),
      instance(getFairCalendarOverview)
    );

    expect(
      await queryHandler.execute(
        new GetMonthlyFairCalendarQuery(
          new Date('2019-12-12T17:43:14.299Z'),
          '00bef1e1-cb52-4914-8887-568b17d99964'
        )
      )
    ).toMatchObject(
      new MonthlyEventsView(
        [
          new FairCalendarView(
            'mission',
            0.75,
            '2019-12-12',
            'eb9e1d9b-dce2-48a9-b64f-f0872f3157d2',
            'Summary',
            new ProjectView(
              'bf4a645c-9754-4943-baec-783361c6d814',
              'RadioFrance'
            ),
            new TaskView('7fb77f06-2d0b-4758-886a-42bba5445fcd', 'Development')
          ),
          new FairCalendarView(
            'dojo',
            0.25,
            '2019-12-12',
            'b9a9b094-5bb2-4d0b-b01e-231b6cb50039',
            null,
            null,
            null
          ),
          new FairCalendarView(
            'paid',
            1,
            '2019-12-13'
          ),
          new FairCalendarView(
            'special',
            0.5,
            '2019-12-14'
          )
        ],
        overview
      )
    );
    verify(
      dateUtils.format(
        deepEqual(new Date(`2019-12-12T17:43:14.299Z`)),
        'y-MM-dd'
      )
    ).once();

    verify(
      eventRepository.findMonthlyEvents(
        '2019-12-12',
        '00bef1e1-cb52-4914-8887-568b17d99964'
      )
    ).once();
    verify(
      leaveRepository.findMonthlyLeaves(
        '2019-12-12',
        '00bef1e1-cb52-4914-8887-568b17d99964'
      )
    ).once();
    verify(getFairCalendarOverview.index(deepEqual([...events, ...leaves]))).once();
  });
});
