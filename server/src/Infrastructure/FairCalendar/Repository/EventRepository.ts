import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {IEventRepository} from 'src/Domain/FairCalendar/Repository/IEventRepository';
import {Event} from 'src/Domain/FairCalendar/Event.entity';
import {User} from 'src/Domain/User/User.entity';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>
  ) {}

  public save(event: Event): Promise<Event> {
    return this.repository.save(event);
  }

  public delete(event: Event): void {
    this.repository.delete(event);
  }

  public async getDayTimeSpentByUser(
    user: User,
    date: string
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('event')
      .select('SUM(event.time) as time')
      .where('event.date = :date', {date})
      .andWhere('event.user = :user', {user: user.getId()})
      .getRawOne();

    return Number(result.time) || 0;
  }

  public findOneById(id: string): Promise<Event> {
    return this.repository
      .createQueryBuilder('event')
      .select([
        'event.id',
        'event.time',
        'event.summary',
        'event.date',
        'event.type',
        'project.id',
        'project.name',
        'task.id',
        'task.name'
      ])
      .where('event.id = :id', {id})
      .innerJoin('event.user', 'user')
      .leftJoin('event.project', 'project')
      .leftJoin('event.task', 'task')
      .getOne();
  }

  public findMonthlyEvents(date: string, userId: string): Promise<Event[]> {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    return this.repository
      .createQueryBuilder('event')
      .select([
        'event.id',
        'event.time',
        'event.summary',
        'event.date',
        'event.type',
        'project.id',
        'project.name',
        'task.id',
        'task.name'
      ])
      .where('user.id = :userId', {userId})
      .andWhere('extract(month FROM event.date) = :month', {month})
      .andWhere('extract(year FROM event.date) = :year', {year})
      .innerJoin('event.user', 'user')
      .leftJoin('event.project', 'project')
      .leftJoin('event.task', 'task')
      .orderBy('event.date', 'ASC')
      .getMany();
  }

  public findMonthlyOverview(date: string, userId: string): Promise<Event[]> {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    return this.repository
      .createQueryBuilder('event')
      .select(['event.time', 'event.date', 'event.type'])
      .where('user.id = :userId', {userId})
      .andWhere('extract(month FROM event.date) = :month', {month})
      .andWhere('extract(year FROM event.date) = :year', {year})
      .innerJoin('event.user', 'user')
      .orderBy('event.date', 'ASC')
      .getMany();
  }
}
