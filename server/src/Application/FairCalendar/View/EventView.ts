import { ProjectView } from 'src/Application/Project/View/ProjectView';
import { TaskView } from 'src/Application/Task/View/TaskView';
import { MealTicketRemovalView } from 'src/Application/HumanResource/MealTicket/Views/MealTicketRemovalView';

export class EventView {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly time: number,
    public readonly billable: boolean,
    public readonly date: string,
    public readonly summary?: string,
    public readonly project?: ProjectView,
    public readonly task?: TaskView,
    public readonly mealTicketRemoval?: MealTicketRemovalView
  ) {}
}
