import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {IDailyRateRepository} from 'src/Domain/Billing/Repository/IDailyRateRepository';
import {DailyRate} from 'src/Domain/Billing/DailyRate.entity';
import {User} from 'src/Domain/User/User.entity';
import {Customer} from 'src/Domain/Customer/Customer.entity';
import {Task} from 'src/Domain/Task/Task.entity';

export class DailyRateRepository implements IDailyRateRepository {
  constructor(
    @InjectRepository(DailyRate)
    private readonly repository: Repository<DailyRate>
  ) {}

  public save(dailyRate: DailyRate): Promise<DailyRate> {
    return this.repository.save(dailyRate);
  }

  public findOneByUserCustomerAndTask(
    user: User,
    customer: Customer,
    task: Task
  ): Promise<DailyRate | undefined> {
    return this.repository
      .createQueryBuilder('dailyRate')
      .select('dailyRate.id')
      .where('dailyRate.user = :user', {user: user.getId()})
      .andWhere('dailyRate.customer = :customer', {customer: customer.getId()})
      .andWhere('dailyRate.task = :task', {task: task.getId()})
      .getOne();
  }
}
