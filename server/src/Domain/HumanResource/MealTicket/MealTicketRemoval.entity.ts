import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique
} from 'typeorm';
import { User } from '../User/User.entity';

@Entity()
@Unique(['date', 'user'])
export class MealTicketRemoval {
  @PrimaryGeneratedColumn('uuid')
  private id: string;

  @Column({ type: 'timestamp', nullable: false })
  private date: string;

  @Column({ type: 'varchar', nullable: false })
  private comment: string;

  @ManyToOne(type => User, { nullable: false, onDelete: 'CASCADE' })
  private user: User;

  constructor(date: string, comment: string, user: User) {
    this.date = date;
    this.comment = comment;
    this.user = user;
  }

  public getId(): string {
    return this.id;
  }

  public getDate(): string {
    return this.date;
  }

  public getComment(): string {
    return this.comment;
  }

  public getUser(): User {
    return this.user;
  }
}
