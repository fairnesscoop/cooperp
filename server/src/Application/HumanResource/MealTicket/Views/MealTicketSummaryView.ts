export class MealTicketSummaryView {
  constructor(
    public readonly month: number,
    public readonly base: number,
    public readonly mealTicketRemovalCount: number,
    public readonly total: number
  ) {}
}
