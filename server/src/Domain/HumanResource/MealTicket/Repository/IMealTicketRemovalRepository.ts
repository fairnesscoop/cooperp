import { MealTicketRemovalView } from 'src/Application/HumanResource/MealTicket/Views/MealTicketRemovalView';
import { MealTicketRemovalSummaryDTO } from 'src/Infrastructure/HumanResource/MealTicket/DTO/MealTicketRemovalSummaryDTO';
import { User } from '../../User/User.entity';
import { MealTicketRemoval } from '../MealTicketRemoval.entity';

export interface IMealTicketRemovalRepository {
  save(MealTicketRemoval: MealTicketRemoval): Promise<MealTicketRemoval>;
  getOneByDate(date: string): Promise<MealTicketRemovalView | undefined>;
  findOneByUserAndDate(
    user: User,
    date: Date
  ): Promise<MealTicketRemoval | undefined>;
  getAllByUserGroupedByMonth(
    user: User,
    date: Date
  ): Promise<MealTicketRemovalSummaryDTO[]>;

  deleteOne(id: number, userId: number): Promise<void>;
}
P;
