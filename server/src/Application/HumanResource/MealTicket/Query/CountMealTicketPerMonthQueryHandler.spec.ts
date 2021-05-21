import { mock, instance, when } from 'ts-mockito';
import { User } from 'src/Domain/HumanResource/User/User.entity';
import { MealTicketRemovalRepository } from 'src/Infrastructure/HumanResource/MealTicket/Repository/MealTicketRemovalRepository';
import { CountMealTicketPerMonthQueryHandler } from './CountMealTicketPerMonthQueryHandler';
import { CountMealTicketPerMonthQuery } from './CountMealTicketPerMonthQuery';
import { DateUtilsAdapter } from 'src/Infrastructure/Adapter/DateUtilsAdapter';
import { MealTicketRemoval } from 'src/Domain/HumanResource/MealTicket/MealTicketRemoval.entity';
import { WorkingDayOfYearByMonth } from 'src/Domain/HumanResource/MealTicket/Strategy/WorkingDayOfYearByMonth';
import { MealTicketSummaryView } from '../Views/MealTicketSummaryView';
import { MealTicketRemovalSummaryDTO } from 'src/Infrastructure/HumanResource/MealTicket/DTO/MealTicketRemovalSummaryDTO';

describe('CountMealTicketPerMonthQueryHandler', () => {
  let mealTicketRemovalRepository: MealTicketRemovalRepository;
  let handler: CountMealTicketPerMonthQueryHandler;
  let dateUtilsAdapter: DateUtilsAdapter;

  const now = new Date();

  const user = mock(User);

  const command = new CountMealTicketPerMonthQuery(instance(user), now);

  beforeEach(() => {
    mealTicketRemovalRepository = mock(MealTicketRemovalRepository);
    dateUtilsAdapter = mock(DateUtilsAdapter);

    handler = new CountMealTicketPerMonthQueryHandler(
      instance(dateUtilsAdapter),
      instance(mealTicketRemovalRepository)
    );
  });

  it('should return the MealTicket Count for each month of the current year', async () => {
    const workingDayByMonth1 = new WorkingDayOfYearByMonth(1, 20);

    const workingDayByMonth2 = new WorkingDayOfYearByMonth(2, 21);

    const workingDayByMonth3 = new WorkingDayOfYearByMonth(3, 23);

    const mealTicketsExceptions: Array<MealTicketRemovalSummaryDTO> = [
      /*
        There are 2 meal exceptions for the month of March
      */
      {
        count: 2,
        monthnumber: 3
      }
    ];

    const expectedResult: MealTicketSummaryView[] = [
      new MealTicketSummaryView(1, 20, 0, 20),
      new MealTicketSummaryView(2, 21, 0, 21),
      new MealTicketSummaryView(3, 23, 2, 21)
    ];

    const ticketRemoval1 = mock(MealTicketRemoval);
    when(ticketRemoval1.getDate()).thenReturn(`${now.getFullYear()}-12-12`);
    const ticketRemoval2 = mock(MealTicketRemoval);
    when(ticketRemoval2.getDate()).thenReturn(`${now.getFullYear()}-12-12`);
    when(dateUtilsAdapter.getAllWorkingDayOfYearByMonth(now)).thenReturn([
      workingDayByMonth1,
      workingDayByMonth2,
      workingDayByMonth3
    ]);

    when(
      mealTicketRemovalRepository.getAllByUserGroupedByMonth(
        instance(user),
        now
      )
    ).thenResolve(mealTicketsExceptions);

    expect(await handler.execute(command)).toStrictEqual(expectedResult);
  });

  it('should return a minimum of 0  meal ticket even if there are more exceptions', async () => {
    const workingDayByMonth1 = new WorkingDayOfYearByMonth(1, 20);

    const workingDayByMonth2 = new WorkingDayOfYearByMonth(2, 21);

    const workingDayByMonth3 = new WorkingDayOfYearByMonth(3, 23);

    const mealTicketsExceptions: Array<MealTicketRemovalSummaryDTO> = [
      /*
        There is 1 meal exceptions for the month of january
      */
      {
        count: 1,
        monthnumber: 1
      },

      /*
        There are 2 meal exceptions for the month of February
      */

      {
        count: 2,
        monthnumber: 2
      },

      /*
        There are 6 meal exceptions for the month of March
      */
      {
        count: 6,
        monthnumber: 3
      }
    ];

    const expectedResult: MealTicketSummaryView[] = [
      new MealTicketSummaryView(1, 20, 1, 19),
      new MealTicketSummaryView(2, 21, 2, 19),
      new MealTicketSummaryView(3, 23, 6, 17)
    ];

    const ticketRemoval1 = mock(MealTicketRemoval);
    when(ticketRemoval1.getDate()).thenReturn(`${now.getFullYear()}-12-12`);
    const ticketRemoval2 = mock(MealTicketRemoval);
    when(ticketRemoval2.getDate()).thenReturn(`${now.getFullYear()}-11-12`);
    when(dateUtilsAdapter.getAllWorkingDayOfYearByMonth(now)).thenReturn([
      workingDayByMonth1,
      workingDayByMonth2,
      workingDayByMonth3
    ]);

    when(
      mealTicketRemovalRepository.getAllByUserGroupedByMonth(
        instance(user),
        now
      )
    ).thenResolve(mealTicketsExceptions);

    expect(await handler.execute(command)).toStrictEqual(expectedResult);
  });
});
