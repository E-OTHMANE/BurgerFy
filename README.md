
# BurgerFy - Create Your Perfect Burger

A web application for customizing and ordering burgers built with React, Express, and PostgreSQL.

## Prerequisites

- Node.js 20.x or later
- PostgreSQL 16.x
- npm (comes with Node.js)

## Local Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd burgerfy
```

2. Install dependencies
```bash
npm install
```

3. Set up PostgreSQL
- Make sure PostgreSQL is running
- Create a new database for the project
- Update the database connection string in your environment variables

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://0.0.0.0:5000`

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express server
- `shared/`: Shared types and schemas
- `theme.json`: UI theme configuration

## Features

- Custom burger builder
- Real-time preview
- Shopping cart
- User authentication
- Order management

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Express.js, Node.js
- Database: PostgreSQL with Drizzle ORM
- Authentication: Express session with PostgreSQL store

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
