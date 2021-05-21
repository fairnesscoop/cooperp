import { ICommand } from 'src/Application/ICommand';

export class DeleteMealTicketRemovalCommand implements ICommand {
  constructor(public readonly id: number) {}
}
