import {CommandHandler} from '@nestjs/cqrs';
import {Inject} from '@nestjs/common';
import {LoginCommand} from './LoginCommand';
import {AuthenticatedView} from '../../View/AuthenticatedView';
import {IUserRepository} from 'src/Domain/User/Repository/IUserRepository';
import {IEncryptionAdapter} from 'src/Application/Adapter/IEncryptionAdapter';
import {User} from 'src/Domain/User/User.entity';
import {PasswordNotMatchException} from 'src/Domain/User/Exception/PasswordNotMatchException';
import {UserNotFoundException} from 'src/Domain/User/Exception/UserNotFoundException';

@CommandHandler(LoginCommand)
export class LoginCommandHandler {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IEncryptionAdapter')
    private readonly encryptionAdapter: IEncryptionAdapter
  ) {}

  public async execute(command: LoginCommand): Promise<AuthenticatedView> {
    const {password} = command;
    const email = command.email.toLowerCase();
    const user = await this.userRepository.findOneByEmail(email);

    if (!(user instanceof User)) {
      throw new UserNotFoundException();
    }

    if (
      false ===
      (await this.encryptionAdapter.compare(user.getPassword(), password))
    ) {
      throw new PasswordNotMatchException();
    }

    return new AuthenticatedView(
      user.getFirstName(),
      user.getLastName(),
      user.getEmail(),
      user.getApiToken()
    );
  }
}
