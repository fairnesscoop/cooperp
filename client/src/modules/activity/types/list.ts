import {Error} from '../../core/models/Error';
import {ILoadingAction, IErrorAction} from '../../core/types/actions';
import {
  ACTIVITY_LIST_LOADING,
  ACTIVITY_LIST_SUCCESS,
  ACTIVITY_LIST_ERROR,
  ACTIVITY_LIST_RESET
} from '../constants/list';
import {IMonthlyActivities} from '../models/IMonthlyActivities';

export type ActivityListState = Readonly<{
  loading: boolean;
  errors: Error[];
  payload: IMonthlyActivities | null;
}>;

export interface IActivityListLoadingAction extends ILoadingAction {
  type: typeof ACTIVITY_LIST_LOADING;
}

export interface IActivityListSuccessAction {
  type: typeof ACTIVITY_LIST_SUCCESS;
  payload: IMonthlyActivities;
}

export interface IActivityListErrorAction extends IErrorAction {
  type: typeof ACTIVITY_LIST_ERROR;
}

export interface IActivityListResetAction {
  type: typeof ACTIVITY_LIST_RESET;
}

export type ActivityListActionTypes =
  | IActivityListLoadingAction
  | IActivityListSuccessAction
  | IActivityListErrorAction
  | IActivityListResetAction;
