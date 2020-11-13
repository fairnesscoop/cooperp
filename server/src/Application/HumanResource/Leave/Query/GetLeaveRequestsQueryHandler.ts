import { QueryHandler } from '@nestjs/cqrs';
import { GetLeaveRequestsQuery } from './GetLeaveRequestsQuery';
import { Inject } from '@nestjs/common';
import { IDateUtils } from 'src/Application/IDateUtils';
import { LeaveRequestView } from '../View/LeaveRequestView';
import { UserSummaryView } from '../../User/View/UserSummaryView';
import { Pagination } from 'src/Application/Common/Pagination';
import { ILeaveRequestRepository } from 'src/Domain/HumanResource/Leave/Repository/ILeaveRequestRepository';

@QueryHandler(GetLeaveRequestsQuery)
export class GetLeaveRequestsQueryHandler {
  constructor(
    @Inject('ILeaveRequestRepository')
    private readonly leaveRequestRepository: ILeaveRequestRepository,
    @Inject('IDateUtils')
    private readonly dateUtils: IDateUtils
  ) {}

  public async execute(
    query: GetLeaveRequestsQuery
  ): Promise<Pagination<LeaveRequestView>> {
    const leaveRequestViews: LeaveRequestView[] = [];
    const [ leaves, total ] = await this.leaveRequestRepository.findLeaveRequests(
      query.page
    );

    for (const leave of leaves) {
      const user = leave.getUser();
      let duration = this.dateUtils.getWorkedDaysDuringAPeriod(
        new Date(leave.getStartDate()),
        new Date(leave.getEndDate())
      ).length;

      if (false === leave.isStartsAllDay()) {
        duration -= 0.5;
      }

      if (false === leave.isEndsAllDay()) {
        duration -= 0.5;
      }

      leaveRequestViews.push(
        new LeaveRequestView(
          leave.getId(),
          leave.getType(),
          leave.getStatus(),
          leave.getStartDate(),
          leave.getEndDate(),
          duration,
          new UserSummaryView(
            user.getId(),
            user.getFirstName(),
            user.getLastName()
          )
        )
      );
    }

    return new Pagination<LeaveRequestView>(leaveRequestViews, total);
  }
}
