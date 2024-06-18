# AnswersAi-Backend

### Node backend for a small-scale AI chat app.

To run the app locally, create a `.env` file with your API key & Mysql database credentials

    ANTHROPIC_API_KEY=<api key for the LLM>
    TOKEN_SECRET=<secret key for hasing pwd>
    DB_NAME=<database name>
    DB_USER=<database user>
    DB_PASSWORD=<database password>
    DB_HOST=<database host>
    DB_ROOT_PASSWORD=<database root password>

Install dependencies

    npm install

Run the app locally

    node .

To build & run the web app & database docker images,

    docker-compose up --build

Head over to http://localhost:3000/. Mysql port is default 3306.

### API documentation

| HTTP Method | Endpoints                      | Action                                                   |
| ----------- | ------------------------------ | -------------------------------------------------------- |
| GET         | `/`                            | List all the routes available                            |
| GET         | `/api/questions`               | Accept user question, and return AI-generated answer     |
| POST        | `/api/questions/:questionId`   | Retrieve specific question and answer by question ID     |
| GET         | `/api/users`                   | Create a new user account                                |
| PATCH       | `/api/users/:userId`           | Retrieve a user profile with a given userId              |
| DELETE      | `/api/users/:userId/questions` | Retrieve all questions asked by user with a given userId |
| DELETE      | `/api/auth/login`              | User login endpoint                                      |

### Response (Content-Type: application/json)

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 401         | `UNAUTHORIZED`          |
| 403         | `FORBIDDEN`             |
| 404         | `NOT FOUND`             |
| 409         | `CONFLICT`              |
| 500         | `INTERNAL SERVER ERROR` |
