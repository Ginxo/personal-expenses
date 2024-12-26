const usersKeys = {
  all: ['users'] as const,
  getAuth: () => [...usersKeys.all, 'auth'] as const,
  getUser: () => [...usersKeys.all, 'user'] as const,
  getAccessToken: () => [...usersKeys.all, 'token'] as const,
};

export { usersKeys };
