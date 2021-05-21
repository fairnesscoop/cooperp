import { ICommand } from 'src/Application/ICommand';
import { User } from 'src/Domain/HumanResource/User/User.entity';
export class DeleteMealTicketRemovalCommand implements ICommand {
  constructor(public readonly id: string, public readonly user: User) {}
}
