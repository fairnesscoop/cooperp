import { User } from '../../User/User.entity';
import { Leave } from '../Leave.entity';

export interface ILeaveRepository {
  save(leave: Leave[]): void;
  findMonthlyLeaves(date: string, userId: string): Promise<Leave[]>;
  findLeavesForDate(date: string): Promise<Leave[]>;
  countLeavesByUserAndPeriod(
    user: User,
    startDate: string,
    endDate: string
  ): Promise<number>;
  sumOfDurationLeaveByUserAndDate(user: User, date: string): Promise<number>;
}
