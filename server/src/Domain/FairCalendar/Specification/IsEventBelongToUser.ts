import {Event} from '../Event.entity';
import {User} from 'src/Domain/User/User.entity';

export class IsEventBelongToUser {
  public isSatisfiedBy(event: Event, user: User): boolean {
    return event.getUser().getId() === user.getId();
  }
}
