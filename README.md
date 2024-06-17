## AnswersAi-Backend

### Backend for a small-scale AI chat app.

To run the app locally, create .env file with the following credentials

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

To build & run the Docker image,

    docker-compose up --build


