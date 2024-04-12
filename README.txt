Prerequisites

- Node.js installed
- MySQL server installed locally

Installation

1. Clone the repository:
   git clone <repository-url>
3. Install dependencies:
   npm install

Database Setup

1. Make sure your local MySQL server is running.
2. Create a .env file in the root directory and set your MySQL database credentials:
   DATABASE_URL=mysql://user:password@localhost:3306/database
   Replace user, password, and database with your MySQL credentials.
3. add these env variables to the .env file
    PORT=
    ACCESS_TOKEN_KEY=
    REFRESH_TOKEN_KEY=
    HASH_SAULT=

You can see env example file in .env.example located in the root directory.

3. Run the following commands to initialize the database schema:
   npx prisma generate
   npx prisma db push

To start the application in

Development

    npm run dev

Production

1. Build the application:
   npm run build
2. Start the application:
   npm start

If you set env PORT variable the application will be served at http://localhost:PORT host otherwise at http://localhost:6000.
