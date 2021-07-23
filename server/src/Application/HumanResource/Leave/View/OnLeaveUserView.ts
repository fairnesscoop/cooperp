import { UserSummaryView } from '../../User/View/UserSummaryView';

export class OnLeaveUserView {
    constructor(
        public readonly id: string,
        public readonly user: UserSummaryView,
    ) {}
}
