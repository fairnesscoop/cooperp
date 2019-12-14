import React, {useEffect} from 'react';
import {Row, Col, Form} from 'react-bootstrap';
import {Field, reduxForm, InjectedFormProps} from 'redux-form';
import {useTranslation} from 'react-i18next';
import TextInput from '../../../core/components/form/TextInput';
import {SubmitButton} from '../../../core/components/form/SubmitButton';
import {validate} from './validator/project';
import {CustomerInput} from '../../../customer/components/form/input/CustomerInput';
import {Customer} from '../../../customer/models/Customer';

interface IProps {
  loading: boolean;
}

export interface ProjectFormData {
  id?: string;
  name: string;
  customerId: string;
  customer?: Customer;
}

const ProjectForm: React.FC<InjectedFormProps<ProjectFormData, IProps> &
  IProps> = ({handleSubmit, initialValues, loading}) => {
  const {t} = useTranslation();

  useEffect(() => {
    if (initialValues) {
      initialValues.customerId = initialValues.customer?.id;
    }
  }, [initialValues]);

  return (
    <Row>
      <Col sm={12}>
        <Form onSubmit={handleSubmit} className={'m-3'}>
          <Field
            name={'name'}
            label={t('project.form.name')}
            component={TextInput}
          />
          <CustomerInput />
          <SubmitButton loading={loading} />
        </Form>
      </Col>
    </Row>
  );
};

export default reduxForm<ProjectFormData, IProps>({form: 'project', validate})(
  ProjectForm
);
