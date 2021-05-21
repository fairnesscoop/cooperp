import { mock, instance, when, verify } from 'ts-mockito';
import { MealTicketRemovalRepository } from 'src/Infrastructure/HumanResource/MealTicket/Repository/MealTicketRemovalRepository';
import { DeleteMealTicketRemovalCommand } from './DeleteMealTicketRemovalCommand';
import { DeleteMealTicketRemovalCommandHandler } from './DeleteMealTicketRemovalCommandHandler';
import { User } from 'src/Domain/HumanResource/User/User.entity';

describe('DeleteMealTicketRemovalHandler', () => {
  let mealTicketRemovalRepository: MealTicketRemovalRepository;
  let handler: DeleteMealTicketRemovalCommandHandler;

  const id = 'best-id-ever';
  const userId = 'best-user-id-ever';

  const user = mock(User);
  when(user.getId()).thenReturn(userId);
  const command = new DeleteMealTicketRemovalCommand(id, instance(user));

  beforeEach(() => {
    mealTicketRemovalRepository = mock(MealTicketRemovalRepository);

    handler = new DeleteMealTicketRemovalCommandHandler(
      instance(mealTicketRemovalRepository)
    );
  });

  it('should delete a meal ticket removal handler', async () => {
    when(mealTicketRemovalRepository.deleteOne(id, instance(user))).thenResolve(
      null
    );

    await handler.execute(command);

    verify(mealTicketRemovalRepository.deleteOne(id, instance(user))).once();
  });
});
