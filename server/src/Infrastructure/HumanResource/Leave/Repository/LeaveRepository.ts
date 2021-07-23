import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILeaveRepository } from 'src/Domain/HumanResource/Leave/Repository/ILeaveRepository';
import { Leave } from 'src/Domain/HumanResource/Leave/Leave.entity';
import { User } from 'src/Domain/HumanResource/User/User.entity';

export class LeaveRepository implements ILeaveRepository {
  constructor(
    @InjectRepository(Leave)
    private readonly repository: Repository<Leave>
  ) {}

  public save(leaves: Leave[]): void {
    this.repository.save(leaves);
  }

  public findMonthlyLeaves(date: string, userId: string): Promise<Leave[]> {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    return this.repository
      .createQueryBuilder('leave')
      .select(['leave.time', 'leave.date', 'leaveRequest.type'])
      .where('user.id = :userId', { userId })
      .andWhere('extract(month FROM leave.date) = :month', { month })
      .andWhere('extract(year FROM leave.date) = :year', { year })
      .innerJoin('leave.leaveRequest', 'leaveRequest')
      .innerJoin('leaveRequest.user', 'user')
      .orderBy('leave.date', 'ASC')
      .getMany();
  }

  public async findLeavesForDate(date: string): Promise<Leave[]> {
    return this.repository
      .createQueryBuilder('leave')
      .select([
        'leave.time',
        'leave.date',
        'leaveRequest.type',
        'user.id',
        'user.firstName',
        'user.lastName',
      ])
      .andWhere('leave.date = :date', { date })
      .innerJoin('leave.leaveRequest', 'leaveRequest')
      .innerJoin('leaveRequest.user', 'user')
      .orderBy('leave.date', 'ASC')
      .getMany();
  }

  public async countLeavesByUserAndPeriod(
    user: User,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('leave')
      .select('count(leave.id) as id')
      .where('user.id = :id', { id: user.getId() })
      .andWhere('leave.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .innerJoin('leave.leaveRequest', 'leaveRequest')
      .innerJoin('leaveRequest.user', 'user')
      .getRawOne();

    return Number(result.id) || 0;
  }

  public async sumOfDurationLeaveByUserAndDate(
    user: User,
    date: string
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('leave')
      .select('SUM(leave.time) as time')
      .where('leave.date = :date', { date })
      .andWhere('user.id = :user', { user: user.getId() })
      .innerJoin('leave.leaveRequest', 'leaveRequest')
      .innerJoin('leaveRequest.user', 'user')
      .getRawOne();

    return Number(result.time) || 0;
  }
}
