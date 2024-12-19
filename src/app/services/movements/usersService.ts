import { User } from '@app/model/User';
import apiRequest from '../apiRequest';

const getUser = (email: string) =>
  apiRequest.get<User>(`/users/${email}`, {
    headers: {
      Accept: 'application/json',
    },
  });

export { getUser };
