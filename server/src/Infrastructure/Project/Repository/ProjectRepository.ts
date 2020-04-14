import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {IProjectRepository} from 'src/Domain/Project/Repository/IProjectRepository';
import {Project} from 'src/Domain/Project/Project.entity';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>
  ) {}

  public save(project: Project): Promise<Project> {
    return this.repository.save(project);
  }

  public findOneByName(name: string): Promise<Project | undefined> {
    return this.repository
      .createQueryBuilder('project')
      .where('LOWER(project.name) = LOWER(:name)', {name})
      .getOne();
  }

  public findOneById(id: string): Promise<Project | undefined> {
    return this.repository
      .createQueryBuilder('project')
      .select(['project.id', 'project.name', 'customer.id', 'customer.name'])
      .innerJoin('project.customer', 'customer')
      .where('project.id = :id', {id})
      .getOne();
  }

  public findProjects(): Promise<Project[]> {
    return this.repository
      .createQueryBuilder('project')
      .select(['project.id', 'project.name', 'customer.id', 'customer.name'])
      .innerJoin('project.customer', 'customer')
      .orderBy('project.name', 'ASC')
      .addOrderBy('customer.name', 'ASC')
      .getMany();
  }
}
