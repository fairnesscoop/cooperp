import {Error} from '../../core/models/Error';
import {LoggedUser} from '../models/LoggedUser';
import {ILoadingAction, IErrorAction} from '../../core/types/actions';
import {
  AUTH_AUTHENTICATION_LOADING,
  AUTH_AUTHENTICATION_ERROR,
  AUTH_AUTHENTICATION_SUCCESS,
  AUTH_AUTHENTICATION_LOGOUT,
  AUTH_AUTHENTICATION_RESET
} from '../constants/authentication';
import {ICoreUpsertSuccessAction} from '../../core/types/upsert';

export type AuthenticationState = Readonly<{
  loading: boolean;
  errors: Error[];
  user: LoggedUser | null;
}>;

export interface IAuthenticationLoadingAction extends ILoadingAction {
  type: typeof AUTH_AUTHENTICATION_LOADING;
}

export interface IAuthenticationErrorAction extends IErrorAction {
  type: typeof AUTH_AUTHENTICATION_ERROR;
}

export interface IAuthenticationSuccessAction {
  type: typeof AUTH_AUTHENTICATION_SUCCESS;
  payload: LoggedUser;
}

export interface IAuthenticationLogoutAction {
  type: typeof AUTH_AUTHENTICATION_LOGOUT;
}

export interface IAuthenticationResetAction {
  type: typeof AUTH_AUTHENTICATION_RESET;
}

export type AuthenticationActionTypes =
  | IAuthenticationLoadingAction
  | IAuthenticationErrorAction
  | IAuthenticationSuccessAction
  | IAuthenticationResetAction
  | IAuthenticationLogoutAction
  | ICoreUpsertSuccessAction<any>;
