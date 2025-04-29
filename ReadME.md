# Employees App

## tech Stack

backend: Node.js, Express, Sequelize, PostgreSQL
frontend: HTML, CSS, Vanilla JavaScript

## getting Started

1. clone the repository:
   ```bash
   git clone https://github.com/your-username/employees-app.git
   cd employees-test-task

2. install dependencies:
   ```bash
   yarn

3. set up environment variables and create a .env file in the root directory:
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=employees
   DB_USER=admin 
   DB_PASSWORD=admin

   **DB_USER, DB_PASSWORD, DB_NAME - indicate yours

4. set up the database. make sure PostgreSQL is running. create the database manually in psql or pgAdmin:
   ```bash
   createdb employees

5. start the app:
   ```bash
   yarn start