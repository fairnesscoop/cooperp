import React from 'react';
import SecuredRoute from '../../auth/components/SecuredRoute';
import Loadable from 'react-loadable';
import LoadingComponent from '../../core/components/LoadingComponent';

const List = Loadable({
  loader: () => import('../views/ListView'),
  loading: LoadingComponent
});

const Add = Loadable({
  loader: () => import('../views/AddView'),
  loading: LoadingComponent
});

export default [
  <SecuredRoute key={'customer'} exact path={'/customers'} component={List} />,
  <SecuredRoute
    key={'customer.add'}
    exact
    path={'/customers/add'}
    component={Add}
  />
];
