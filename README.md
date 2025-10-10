# Contact Management System

A Node.js backend application for managing contacts with JWT-based authentication.

## Features

- User authentication using JWT
- Protected routes for contact management
- Middleware for route protection

## Project Structure

ContactManagementSystem/
├── middleware/
│ └── authMiddleware.js
├── routes/
├── models/
├── controllers/
├── .env
├── package.json
└── README.md


## Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ContactManagementSystem

2. Install dependencies:
    npm install

3. Configure environment variables:

    Create a .env file in the root directory.

    Add your JWT secret:
    JWT_SECRET=your_jwt_secret

4. Run application:
   npm start

## Usage

Use the /login endpoint to obtain a JWT token.

Include the token in the Authorization header as Bearer <token> for accessing protected routes.

