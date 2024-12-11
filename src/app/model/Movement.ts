type Movement = {
  id: string;
  attributes: {
    date: number;
    name: string;
    description?: string;
    amount: number;
    type: 'income' | 'expense';
    categoryId: string;
    userId: string;
  };
};

export { Movement };
