import { Category } from './Category';
import { User } from './User';

type Movement = {
  id: string;
  date: number;
  name: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  userId: string;
  category: Category;
  user: User;
};

export { Movement };
