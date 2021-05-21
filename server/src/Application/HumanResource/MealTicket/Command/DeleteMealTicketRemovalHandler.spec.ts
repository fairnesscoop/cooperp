import { mock, instance, when, verify } from 'ts-mockito';
import { MealTicketRemovalRepository } from 'src/Infrastructure/HumanResource/MealTicket/Repository/MealTicketRemovalRepository';
import { DeleteMealTicketRemovalCommand } from './DeleteMealTicketRemovalCommand';
import { DeleteMealTicketRemovalCommandHandler } from './DeleteMealTicketRemovalCommandHandler';

describe('DeleteMealTicketRemovalHandler', () => {
  let mealTicketRemovalRepository: MealTicketRemovalRepository;
  let handler: DeleteMealTicketRemovalCommandHandler;

  const id = 666;
  const command = new DeleteMealTicketRemovalCommand(id);

  beforeEach(() => {
    mealTicketRemovalRepository = mock(MealTicketRemovalRepository);

    handler = new DeleteMealTicketRemovalCommandHandler(
      instance(mealTicketRemovalRepository)
    );
  });

  it('should delete a meal ticket removal handler', async () => {
    when(mealTicketRemovalRepository.deleteOne(id)).thenResolve(null);

    await handler.execute(command);

    verify(mealTicketRemovalRepository.deleteOne(id)).once();
  });
});
