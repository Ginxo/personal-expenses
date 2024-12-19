const usersKeys = {
  all: ['users'] as const,
  getAuth: () => [...usersKeys.all, 'auth'] as const,
  getUser: () => [...usersKeys.all, 'user'] as const,
};

export { usersKeys };
