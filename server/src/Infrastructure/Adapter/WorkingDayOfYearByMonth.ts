export class WorkingDayOfYearByMonth {
  readonly month: number;
  workingDaysCount: number
  constructor(month: number, workedDaysOfYear = 0) {
    this.month = month;
    this.workingDaysCount = workedDaysOfYear
  }

  addOneWorkingDay() {
    this.workingDaysCount += 1;
  }
}
