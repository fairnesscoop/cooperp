import { MealTicketRemovalSummaryDTO } from 'src/Infrastructure/HumanResource/MealTicket/DTO/MealTicketRemovalSummaryDTO';
import { User } from '../../User/User.entity';
import { MealTicketRemoval } from '../MealTicketRemoval.entity';

export interface IMealTicketRemovalRepository {
  save(MealTicketRemoval: MealTicketRemoval): Promise<MealTicketRemoval>;
  getCountByDate(date: string): Promise<number>;
  findOneByUserAndDate(
    user: User,
    date: Date
  ): Promise<MealTicketRemoval | undefined>;
  getAllByUserGroupedByMonth(
    user: User,
    date: Date
  ): Promise<MealTicketRemovalSummaryDTO[]>;
}
