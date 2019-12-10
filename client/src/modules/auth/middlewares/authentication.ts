import {Dispatch} from 'redux';
import {loading, errors, success} from '../actions/authentication';
import {AppState} from '../../../store/reducers';
import {errorNormalizer} from '../../../normalizer/errors';
import {TokenStorage} from '../../../utils/tokenStorage';
import {LoggedUser} from '../models/LoggedUser';
import {IAuthenticationForm} from '../types/authentication';

export const authenticate = (payload: IAuthenticationForm) => async (
  dispatch: Dispatch,
  state: AppState,
  axios: any
): Promise<void> => {
  dispatch(loading(true));

  try {
    const response = await axios.post('login', payload);
    const {firstName, lastName, email, apiToken} = response.data;

    TokenStorage.save(apiToken);
    dispatch(success(new LoggedUser(firstName, lastName, email)));
  } catch (e) {
    dispatch(errors(errorNormalizer(e)));
  } finally {
    dispatch(loading(false));
  }
};
