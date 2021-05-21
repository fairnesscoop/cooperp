import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IMealTicketRemovalRepository } from 'src/Domain/HumanResource/MealTicket/Repository/IMealTicketRemovalRepository';
import { DeleteMealTicketRemovalCommand } from './DeleteMealTicketRemovalCommand';

@CommandHandler(DeleteMealTicketRemovalCommand)
export class DeleteMealTicketRemovalCommandHandler {
  constructor(
    @Inject('IMealTicketRemovalRepository')
    private readonly mealTicketRemovalRepository: IMealTicketRemovalRepository
  ) {}

  public async execute(command: DeleteMealTicketRemovalCommand): Promise<void> {
    const { id, user } = command;

    await this.mealTicketRemovalRepository.deleteOne(id, user);
  }
}
