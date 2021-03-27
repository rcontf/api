# rcon.tf [![test](https://github.com/rcontf/api/actions/workflows/test.yml/badge.svg)](https://github.com/rcontf/api/actions/workflows/test.yml)

# Description

The backend API for rcon.tf, written in TypeScript and NestJS. This serves as the public and private REST api for those who want to interact with their TF2 or CSGO server. More server types TBA.

# Installation and Development

- Clone the repo
- Install dependencies
- Configure ENV
- Run Nest in either development or production mode.

**Docker**
You may also build the docker image yourself.

`docker build . -t "rcontf-api"`
`docker run -d -p 8080:8080 -env-file "path-to-env" "rcontf-api"`

# Tests

Run `npm run test` to run the jest suite.

# Links

- [rcon.tf](https://rcon.tf/)
