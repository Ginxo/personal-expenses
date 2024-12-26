# Start up the server

`yarn start`

## API

The API is implemented with express connecting it to prisma

To generate API doc

```
yarn stack:generate
```

## BBDD

For the database connection prisma is being used.

```
npx zenstack@latest init
yarn db:generate
yarn db:push
```
