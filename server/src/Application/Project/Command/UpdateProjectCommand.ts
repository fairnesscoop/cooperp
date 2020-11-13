import {ICommand} from 'src/Application/ICommand';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly dayDuration: number,
    public readonly customerId: string
  ) {}
}
