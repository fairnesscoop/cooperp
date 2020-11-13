import {ICommand} from 'src/Application/ICommand';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly dayDuration: number,
    public readonly customerId: string
  ) {}
}
