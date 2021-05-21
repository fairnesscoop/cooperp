import { ProjectView } from 'src/Application/Project/View/ProjectView';
import { TaskView } from 'src/Application/Task/View/TaskView';

export class EventView {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly time: number,
    public readonly billable: boolean,
    public readonly date: string,
    public readonly canReceiveMealTicket: boolean,
    public readonly summary?: string,
    public readonly project?: ProjectView,
    public readonly task?: TaskView
  ) {}
}
