import {IQuery} from 'src/Application/IQuery';

export class GetUsersQuery implements IQuery {
  constructor(public readonly page: number) {}
}
