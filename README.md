# Personal Expenses

## Quick-start

```bash
git clone https://github.com/Ginxo/personal-expenses
cd personal-expenses
yarn install && yarn start:dev
```

## Development scripts

```sh
# Install development/build dependencies
npm install --prefix backend && npm install --prefix frontend

# Start the development server
npm run start:dev --prefix frontend

# Run a production build (outputs to "dist" dir)
npm run build --prefix backend
npm run build --prefix frontend

# Run the test suite
yarn test

# Run the test suite with coverage
yarn test:coverage

# Run the linter
yarn lint

# Run the code formatter
yarn format

# Launch a tool to inspect the bundle size
yarn bundle-profile:analyze

# Start the express server (run a production build first)
yarn start
```

## Configurations

- [TypeScript Config](./tsconfig.json)
- [Webpack Config](./webpack.common.js)
- [Jest Config](./jest.config.js)
- [Editor Config](./.editorconfig)

## Authentication

the authentication is performed throw auth0 service. See `index.ts` `Auth0Provider` for getting/changing domain/clientId
