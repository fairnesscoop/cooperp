import { MealTicketRemovalSummaryDTO } from 'src/Infrastructure/HumanResource/MealTicket/DTO/MealTicketRemovalSummaryDTO';
import { User } from '../../User/User.entity';
import { MealTicketRemoval } from '../MealTicketRemoval.entity';

export interface IMealTicketRemovalRepository {
  save(MealTicketRemoval: MealTicketRemoval): Promise<MealTicketRemoval>;
  findOneByUserAndDate(
    user: User,
    date: Date
  ): Promise<MealTicketRemoval | undefined>;
  getAllByUserGroupedByDate(user: User): Promise<MealTicketRemovalSummaryDTO[]>;
}
