## Requirements

-   [Node.js](https://nodejs.org/en/) 
-   [Redis](https://redis.io/) 

## Environment Variables

```bash
# Redis Host
REDIS_HOST=
# Redis Port
REDIS_PORT=
```

## Installation

```bash
$ npm install

$ npx prisma migrate dev --name init

$ npx prisma generate

```

## Running the app

```bash
# development
$ npm start

# watch mode
$ npm start:dev

# production mode
$ npm start:prod
```