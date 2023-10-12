# Chuck Norris Joke API

## Prerequisites

1. Node v18.x
2. Installed [PostgreSQL](https://www.postgresql.org/download/)
3. Installed [Redis](https://redis.io/download/)

## Initial steps

1. Copy contents of `.example.env` to `.env`
    - Update the content of the `.env` file
2. Update `config/config.json` file with your database credentials
2. Run 
    ```bash 
    $ npm i 
    ```
3. If the database does not exist run
    ```bash
    $ npx sequelize-cli db:create
    ```
4. Run the migrations
    ```bash
    $ npx sequelize-cli db:migrate
    ```
5. Running the application
    ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```

## Documentation
- Swagger is used for generating the documentation
- You can find the documentation on `http://localhost:3000/documentation`

## Test
### Unit tests
```bash
$ npm run test
```