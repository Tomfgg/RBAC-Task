# Node.js Backend App

This is a backend application built with Node.js, Express, Prisma ORM, and PostgreSQL.

## Installation

1. Clone the repository:
    ```bash
    git clone git@github.com:Tomfgg/RBAC-Task.git
    ```

2. Change to the project directory:
    ```bash
    cd RBAC-Task
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Set Up Environment Variables

- Duplicate the `.env.tmp` file and rename it to `.env`:

```bash
cp .env.tmp .env
```

- Open the `.env` file in your favorite text editor and update the environment variables as needed.

5. Apply the Prisma migrations to set up the database schema:
    ```bash
    npx prisma migrate deploy
    ```

6. Generate the Prisma client:
    ```bash
    npx prisma generate
    ```

7. Start the development server:
    ```bash
    npm run dev
    ```

8. The server will be running at `http://localhost:5000`.

## License

This project is licensed under the MIT License.