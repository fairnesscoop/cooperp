import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito';
import { DeleteLeaveRequestCommandHandler } from './DeleteLeaveRequestCommandHandler';
import { DeleteLeaveRequestCommand } from './DeleteLeaveRequestCommand';
import { User } from 'src/Domain/HumanResource/User/User.entity';
import { LeaveRequestNotFoundException } from 'src/Domain/HumanResource/Leave/Exception/LeaveRequestNotFoundException';
import { CanLeaveRequestBeRemoved } from 'src/Domain/HumanResource/Leave/Specification/CanLeaveRequestBeRemoved';
import { LeaveRequest } from 'src/Domain/HumanResource/Leave/LeaveRequest.entity';
import { LeaveRequestRepository } from 'src/Infrastructure/HumanResource/Leave/Repository/LeaveRequestRepository';
import { LeaveRequestCantBeRemovedException } from 'src/Domain/HumanResource/Leave/Exception/LeaveRequestCantBeRemovedException';

describe('DeleteLeaveRequestCommandHandler', () => {
  let leaveRequestRepository: LeaveRequestRepository;
  let canLeaveRequestBeRemoved: CanLeaveRequestBeRemoved;
  let handler: DeleteLeaveRequestCommandHandler;

  const user = mock(User);
  const leaveRequest = mock(LeaveRequest);
  const command = new DeleteLeaveRequestCommand(
    'cfdd06eb-cd71-44b9-82c6-46110b30ce05',
    instance(user)
  );

  beforeEach(() => {
    leaveRequestRepository = mock(LeaveRequestRepository);
    canLeaveRequestBeRemoved = mock(CanLeaveRequestBeRemoved);

    handler = new DeleteLeaveRequestCommandHandler(
      instance(leaveRequestRepository),
      instance(canLeaveRequestBeRemoved)
    );
  });

  it('testLeaveRequestNotNotFound', async () => {
    when(
      leaveRequestRepository.findOneById('cfdd06eb-cd71-44b9-82c6-46110b30ce05')
    ).thenResolve(null);

    try {
      expect(await handler.execute(command)).toBeUndefined();
    } catch (e) {
      expect(e).toBeInstanceOf(LeaveRequestNotFoundException);
      expect(e.message).toBe(
        'human_resources.leaves.requests.errors.not_found'
      );
      verify(
        leaveRequestRepository.findOneById(
          'cfdd06eb-cd71-44b9-82c6-46110b30ce05'
        )
      ).once();
      verify(
        canLeaveRequestBeRemoved.isSatisfiedBy(anything(), anything())
      ).never();
      verify(leaveRequestRepository.remove(anything())).never();
    }
  });

  it('testLeaveRequestCantBeRemoved', async () => {
    when(
      leaveRequestRepository.findOneById('cfdd06eb-cd71-44b9-82c6-46110b30ce05')
    ).thenResolve(instance(leaveRequest));
    when(
      canLeaveRequestBeRemoved.isSatisfiedBy(
        instance(leaveRequest),
        instance(user)
      )
    ).thenReturn(false);

    try {
      expect(await handler.execute(command)).toBeUndefined();
    } catch (e) {
      expect(e).toBeInstanceOf(LeaveRequestCantBeRemovedException);
      expect(e.message).toBe(
        'human_resources.leaves.requests.errors.cant_be_removed'
      );
      verify(
        canLeaveRequestBeRemoved.isSatisfiedBy(
          instance(leaveRequest),
          instance(user)
        )
      ).once();
      verify(
        leaveRequestRepository.findOneById(
          'cfdd06eb-cd71-44b9-82c6-46110b30ce05'
        )
      ).once();
      verify(leaveRequestRepository.remove(anything())).never();
    }
  });

  it('testLeaveSuccessfullyDeleted', async () => {
    when(
      leaveRequestRepository.findOneById('cfdd06eb-cd71-44b9-82c6-46110b30ce05')
    ).thenResolve(instance(leaveRequest));
    when(
      canLeaveRequestBeRemoved.isSatisfiedBy(
        instance(leaveRequest),
        instance(user)
      )
    ).thenReturn(true);

    expect(await handler.execute(command)).toBeUndefined();

    verify(
      canLeaveRequestBeRemoved.isSatisfiedBy(
        instance(leaveRequest),
        instance(user)
      )
    ).once();
    verify(
      leaveRequestRepository.findOneById('cfdd06eb-cd71-44b9-82c6-46110b30ce05')
    ).once();
    verify(leaveRequestRepository.remove(instance(leaveRequest))).once();
  });
});
