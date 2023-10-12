# Chuck Norris Joke API

## Description
- REST API build using [NestJS](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/) for the database. 
- API fetches random Chuck Norris joke from external API and sends it to the logged in user on it's email. 
- JWT was used for the authentication of the user. 
- [Nodemailer](https://nodemailer.com/) was used for sending emails using gmail account.
- [Bull](https://github.com/nestjs/bull) queue implementation was used for handling of sending emails to the users.
- [Winston](https://github.com/winstonjs/winston) logger is used for all of the logging overriding built in logger.
## Prerequisites

1. Node v18.x
2. Installed [PostgreSQL](https://www.postgresql.org/download/)
3. Installed [Redis](https://redis.io/download/)

## Initial steps

1. Copy contents of `.example.env` to `.env`
    - Update the content of the `.env` file
        - `LOG_LEVEL` - sets logging level
        - `LOG_DIRECTORY` - sets the directory where the logs will be saved
        - `JWT_SECRET` - secret used when generating JWT token
        - `EMAIL_OPTIONS_EMAIL` - gmail account username
        - `EMAIL_OPTIONS_PASSWORD` - application password which can be set on this [link](https://myaccount.google.com/apppasswords)
        - `DATABASE` and `REDIS` part is set based on your local environment
2. Update `config/config.json` file with your database credentials

## Manual
1. Run 
    ```bash 
    $ npm i 
    ```
2. If the database does not exist run
    ```bash
    $ npx sequelize-cli db:create
    ```
3. Run the migrations
    ```bash
    $ npx sequelize-cli db:migrate
    ```
4. Running the application
    ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```
## Docker

```bash
$ docker-compose up -d
```

## Documentation
- Swagger is used for generating the documentation
- You can find the documentation on `http://localhost:3000/documentation`

## Test
### Unit tests
```bash
$ npm run test
```