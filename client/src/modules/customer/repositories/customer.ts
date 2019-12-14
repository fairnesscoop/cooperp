import {client as axios} from '../../../utils/axios';
import {Customer} from '../models/Customer';
import {CustomerFormData} from '../components/form/CustomerForm';
import {CustomerFactory} from '../factory/CustomerFactory';

export const findCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get('customers');
  const customers: Customer[] = [];

  for (const data of response.data) {
    customers.push(CustomerFactory.create(data));
  }

  return customers;
};

export const findOneById = async (id: string): Promise<Customer> => {
  const {data} = await axios.get(`customers/${id}`);

  return CustomerFactory.create(data);
};

export const saveCustomer = async (
  payload: CustomerFormData
): Promise<Customer> => {
  let response;

  if (payload.id) {
    response = await axios.put(`customers/${payload.id}`, payload);
  } else {
    response = await axios.post('customers', payload);
  }

  return CustomerFactory.create(response.data);
};
