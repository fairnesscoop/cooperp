import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IMealTicketRemovalRepository } from 'src/Domain/HumanResource/MealTicket/Repository/IMealTicketRemovalRepository';
import { CountMealTicketPerMonthQuery } from './CountMealTicketPerMonthQuery';
import { IDateUtils } from 'src/Application/IDateUtils';
import { AvailableMealTicketStrategy } from 'src/Domain/HumanResource/MealTicket/Strategy/AvailableMealTicketStrategy';
import { MealTicketGroupedByMonthSummary } from 'src/Domain/HumanResource/MealTicket/Strategy/MealTicketGroupedByMonthSummary';
import { MealTicketRemovalSummaryDTO } from 'src/Infrastructure/HumanResource/MealTicket/DTO/MealTicketRemovalSummaryDTO';
import { MealTicketSummaryView } from '../Views/MealTicketSummaryView';

@QueryHandler(CountMealTicketPerMonthQuery)
export class CountMealTicketPerMonthQueryHandler {
  constructor(
    @Inject('IDateUtils')
    private readonly dateUtils: IDateUtils,
    @Inject('IMealTicketRemovalRepository')
    private readonly mealTicketRemovalRepository: IMealTicketRemovalRepository
  ) {}

  private buildMealTicketSummary = (
    mealTicketRemovals: MealTicketRemovalSummaryDTO[],
    mealTicketGroupedByMonthSummaries: MealTicketGroupedByMonthSummary[]
  ): MealTicketSummaryView[] => {
    return mealTicketGroupedByMonthSummaries.map(summary => {
      const month = summary.month;
      const base = summary.mealTicketCount;
      let total = base;

      const foundTicketRemoval = mealTicketRemovals.find(item => {
        return summary.month == item.monthnumber;
      });

      if (foundTicketRemoval) {
        total = total - foundTicketRemoval.count;
      }
      return new MealTicketSummaryView(
        month,
        base,
        foundTicketRemoval ? foundTicketRemoval.count : 0,
        total
      );
    });
  };

  public async execute(
    command: CountMealTicketPerMonthQuery
  ): Promise<MealTicketSummaryView[]> {
    const { user, currentDate } = command;
    const workingDaysByMonth = this.dateUtils.getAllWorkingDayOfYearByMonth(
      currentDate
    );
    const yearlyAvailableMealTickets = AvailableMealTicketStrategy.getMealTicketCountForEachMonthOfTheYear(
      workingDaysByMonth
    );

    const mealTicketRemovals = await this.mealTicketRemovalRepository.getAllByUserGroupedByMonth(
      user,
      currentDate
    );

    return this.buildMealTicketSummary(
      mealTicketRemovals,
      yearlyAvailableMealTickets
    );
  }
}
