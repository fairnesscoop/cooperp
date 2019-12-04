# CoopERP

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/mmarchois/cooperp/CI)
[![codecov](https://codecov.io/gh/mmarchois/cooperp/branch/master/graph/badge.svg)](https://codecov.io/gh/mmarchois/cooperp)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f1e9a74c64bd478b9c00d04c984466b8)](https://www.codacy.com/manual/mmarchois/cooperp?utm_source=github.com&utm_medium=referral&utm_content=mmarchois/cooperp&utm_campaign=Badge_Grade)
[![GitHub issues](https://img.shields.io/github/issues/mmarchois/cooperp.svg)](https://github.com/surmon-china/nodepress/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/mmarchois/cooperp.svg)](https://github.com/mmarchois/cooperp)
[![GitHub license](https://img.shields.io/github/license/mmarchois/cooperp.svg)](https://github.com/mmarchois/cooperp)

CoopERP is an eco-design and open-source ERP solution for cooperatives.

## Technical stack

- [Node.js](https://nodejs.org) / [Nestjs](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io)
- [Ts-mockito](https://github.com/NagRock/ts-mockito)
- [Jest](https://jestjs.io/)
- [React](https://fr.reactjs.org/) / [Redux](https://redux.js.org/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Prerequisites

You must have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your system.

## Installation

At the first launch, just execute the following command:

```bash
make install
```

Then, you just have to run these following commands to start the application:

```bash
cd server && make start
cd client && make start
```

The server and client will be started:

- API documentation available on http://localhost:3000/api
- Client avaible on http://localhost:3001

## Helpers

These following commands will display all available helpers

```bash
cd server && make help
cd client && make help
```

## Tests

Run the unit test suite with this following command:

```bash
cd server && make test
```

## Credits

Created by [Fairness](https://fairness.coop)
