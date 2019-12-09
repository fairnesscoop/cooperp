import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Spinner, Row, Col, Table} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import {AppState} from '../../../store/reducers';
import {TaskListState, ITaskListResetAction} from '../types/list';
import {listTasks} from '../middlewares/list';
import {reset} from '../actions/list';
import Breadcrumb from '../../common/components/Breadcrumb';
import ServerErrors from '../../common/components/ServerErrors';
import {BreadcrumbItem} from '../../common/models/BreadcrumbItem';
import {Task} from '../models/Task';

interface IProps {
  list: TaskListState;
  listTasks(): void;
  reset(): ITaskListResetAction;
}

const ListView: React.FC<IProps> = ({list, listTasks, reset}) => {
  const {t} = useTranslation();

  useEffect(() => {
    listTasks();

    return () => {
      reset();
    };
  }, [listTasks, reset]);

  return (
    <>
      <Row>
        <Col>
          <Breadcrumb items={[new BreadcrumbItem(t('task.title'))]} />
          <ServerErrors errors={list.errors} />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>{t('task.title')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.payload.map((task: Task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td></td>
                </tr>
              ))}
              {0 === list.payload.length && (
                <tr>
                  <td colSpan={2}>{t('task.list.noItems')}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      {list.loading && (
        <Row className={'justify-content-md-center'}>
          <Col md={'auto'}>
            <Spinner animation={'border'} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default connect(
  (state: AppState) => ({
    list: state.task.list
  }),
  dispatch => ({
    ...bindActionCreators({listTasks, reset}, dispatch)
  })
)(ListView);
