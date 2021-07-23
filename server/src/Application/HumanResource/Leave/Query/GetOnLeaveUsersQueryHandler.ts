import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IDateUtils } from 'src/Application/IDateUtils';
import { UserSummaryView } from '../../User/View/UserSummaryView';
import { ILeaveRepository } from 'src/Domain/HumanResource/Leave/Repository/ILeaveRepository';
import { GetOnLeaveUsersQuery } from "./GetOnLeaveUsersQuery";
import { OnLeaveUserView } from "../View/OnLeaveUserView";

@QueryHandler(GetOnLeaveUsersQuery)
export class GetOnLeaveUsersQueryHandler {
    constructor(
        @Inject('ILeaveRepository')
        private readonly leaveRepository: ILeaveRepository,
        @Inject('IDateUtils')
        private readonly dateUtils: IDateUtils
    ) {}

    public async execute({}: GetOnLeaveUsersQuery): Promise<Array<OnLeaveUserView>> {
        const onLeaveUserViews: OnLeaveUserView[] = [];

        const date = this.dateUtils.getCurrentDate();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const leaves = await this.leaveRepository.findLeavesForDate(year + '-' + month + '-' + day);

        for (const leave of leaves) {
            const user = leave.getLeaveRequest().getUser();

            onLeaveUserViews.push(
                new OnLeaveUserView(
                    leave.getId(),
                    new UserSummaryView(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName()
                    )
                )
            );
        }

        return onLeaveUserViews;
    }
}
