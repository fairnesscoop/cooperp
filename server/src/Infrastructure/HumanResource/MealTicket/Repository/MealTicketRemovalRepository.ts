import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MealTicketRemoval } from 'src/Domain/HumanResource/MealTicket/MealTicketRemoval.entity';
import { IMealTicketRemovalRepository } from 'src/Domain/HumanResource/MealTicket/Repository/IMealTicketRemovalRepository';
import { User } from 'src/Domain/HumanResource/User/User.entity';
import { MealTicketRemovalSummaryDTO } from '../DTO/MealTicketRemovalSummaryDTO';
import { MealTicketRemovalView } from 'src/Application/HumanResource/MealTicket/Views/MealTicketRemovalView';

export class MealTicketRemovalRepository
  implements IMealTicketRemovalRepository {
  constructor(
    @InjectRepository(MealTicketRemoval)
    private readonly repository: Repository<MealTicketRemoval>
  ) {}

  public save(
    mealTicketRemoval: MealTicketRemoval
  ): Promise<MealTicketRemoval> {
    return this.repository.save(mealTicketRemoval);
  }

  public findOneByUserAndDate(
    user: User,
    date: Date
  ): Promise<MealTicketRemoval | undefined> {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    const day = new Date(date).getDay();

    return this.repository
      .createQueryBuilder('mealTicketRemoval')
      .select(['mealTicketRemoval.id'])
      .where('mealTicketRemoval.user = :userId', { userId: user.getId() })
      .andWhere('extract(month FROM mealTicketRemoval.date) = :month', {
        month
      })
      .andWhere('extract(year FROM mealTicketRemoval.date) = :year', { year })
      .andWhere('extract(day FROM mealTicketRemoval.date) = :day', { day })
      .getOne();
  }

  public getAllByUserGroupedByMonth(
    user: User,
    date: Date
  ): Promise<MealTicketRemovalSummaryDTO[]> {
    const year = new Date(date).getFullYear();

    return this.repository
      .createQueryBuilder('mealTicketRemoval')
      .select(['EXTRACT(month FROM date) as monthnumber', 'COUNT(id)'])
      .where('mealTicketRemoval.user = :userId', { userId: user.getId() })
      .andWhere('extract(year FROM mealTicketRemoval.date) = :year', { year })
      .groupBy('monthnumber')
      .getRawMany();
  }

  public getOneByDate(
    date: string
  ): Promise<MealTicketRemovalView | undefined> {
    return this.repository
      .createQueryBuilder('mealTicketRemoval')
      .select([
        'mealTicketRemoval.id',
        'mealTicketRemoval.date',
        'mealTicketRemoval.userId'
      ])
      .where('mealTicketRemoval.date = :date', { date })
      .getRawOne();
  }

  public async deleteOne(id: string, user: User): Promise<void> {
    await this.repository
      .createQueryBuilder('mealTicketRemoval')
      .delete()
      .where('mealTicketRemoval.id = :id', { id })
      .andWhere('mealTicketRemoval.userId = :userId', { userId: user.getId() })
      .execute();
  }
}
