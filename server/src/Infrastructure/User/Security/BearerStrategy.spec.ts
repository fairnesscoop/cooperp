import {mock, instance, verify, when} from 'ts-mockito';
import {UnauthorizedException} from '@nestjs/common';
import {UserRepository} from 'src/Infrastructure/User/Repository/UserRepository';
import {BearerStrategy} from 'src/Infrastructure/User/Security/BearerStrategy';
import {User} from 'src/Domain/User/User.entity';

describe('BearerStrategy', () => {
  let bearerStrategy: BearerStrategy;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = mock(UserRepository);
    bearerStrategy = new BearerStrategy(instance(userRepository));
  });

  it('testUserNotFound', async () => {
    when(userRepository.findOneByApiToken('apiToken')).thenResolve(undefined);

    try {
      await bearerStrategy.validate('apiToken');
    } catch (e) {
      expect(e instanceof UnauthorizedException).toBe(true);
      verify(userRepository.findOneByApiToken('apiToken')).once();
    }
  });

  it('testUserFound', async () => {
    const user = new User(
      'Mathieu',
      'MARCHOIS',
      'mathieu@fairness.coop',
      'token',
      'password',
      '2019-09-12'
    );

    when(userRepository.findOneByApiToken('apiToken')).thenResolve(user);
    expect(await bearerStrategy.validate('apiToken')).toMatchObject(user);
    verify(userRepository.findOneByApiToken('apiToken')).once();
  });

  it('testUserNotFound', async () => {
    when(userRepository.findOneByApiToken('apiToken')).thenResolve(undefined);

    try {
      await bearerStrategy.validate('apiToken');
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      verify(userRepository.findOneByApiToken('apiToken')).once();
    }
  });
});
