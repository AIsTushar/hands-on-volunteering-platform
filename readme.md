# HandsOn – A Community-Driven Social Volunteering Platform

## Project Overview

HandsOn is a community-driven platform designed to connect individuals with social impact opportunities. It enables users to discover and join volunteer events, post requests for help and track their contributions. The platform promotes social responsibility, community collaboration, and engagement in volunteer work.

---

## Technologies Used

### Backend:

- **Node.js** with **Express.js**
- **Prisma** (ORM for PostgreSQL)
- **bcryptjs** (Password hashing)
- **jsonwebtoken** (JWT Authentication)
- **pg** (PostgreSQL client)
- **multer** (File uploads)
- **cloudinary** (Image storage)

### Frontend:

- **React.js**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Axios** (HTTP requests)
- **zustand** (State management)
- **react-router-dom** (Routing)

## Features

- **User Registration & Profile Management**:

  - Users can sign up, log in, and manage their profiles.
  - Profiles include personal information, skills, and causes they support.
  - Users can edit their profiles and track their volunteer history.

- **Discover & Join Volunteer Events**:

  - Users can create, view, and register for volunteer events.
  - Events can be filtered by category, location, and availability.

- **Community Help Requests**:

  - Users can post and respond to help requests within the community.
  - Requests are categorized by urgency level for prioritization.

- **Dark Mode Support **:

  - Users can toggle between light and dark modes for a personalized experience.

## Database Schema

A visual representation of the database structure

![Database Schema](./frontend/public/Schemadiagram.png)

## Setup Instructions

To set up and run the project locally, follow these steps for both the backend and frontend:

### 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/AIsTushar/hands-on-volunteering-platform
cd hands-on-volunteering-platform

```

### 2. Set up the Backend

Navigate to the backend folder:

```bash
cd backend
```

Install the backend dependencies:

```bash
npm install
```

Create a .env file in the backend folder and add the following environment variables:

```bash
DATABASE_URL = postgresql://postgres:root@localhost:5432/hands_on_db
PORT = 5000
JWT_SECRET = mysecretkey
NODE_ENV = development
CLIENT_URL = http://localhost:5173

CLOUDINARY_CLOUD_NAME = <your-cloud-name>
CLOUDINARY_API_KEY = <your-api-key>
CLOUDINARY_API_SECRET = <your-api-secret>

```

Run the backend server:

```bash
npm run dev
```

### 3. Set up the Frontend

Navigate to the frontend folder:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Run the frontend development server:

```bash
npm run dev
```

Ensure that you have PostgreSQL installed and a database named hands_on_db created.

## 4. API Documentation

This project exposes a set of RESTful APIs that handle authentication, user profiles, events, help requests, and comments. The authentication for protected routes is managed through cookies (not bearer tokens).

### Authentication APIs

- **POST /api/auth/signup**: Registers a new user.
  - Request body:
    - `name`: User's name
    - `email`: User's email
    - `password`: User's password
- **POST /api/auth/login**: Logs in the user and sets authentication cookies.
  - Request body:
    - `email`: User's email
    - `password`: User's password
- **POST /api/auth/logout**: Logs out the user and clears authentication cookies.
- **GET /api/auth/check-auth**: Verifies if the user is authenticated via cookies.
- **GET /api/auth/me**: Returns the authenticated user's profile data.

### Profile APIs

- **GET /api/profile**: Retrieves the authenticated user's profile (protected).
- **PUT /api/profile**: Updates the authenticated user's profile (protected).
  - Form-data: Upload a profile image along with other profile data.
- **PUT /api/profile/ChangePassword**: Allows the authenticated user to change their password (protected).
  - Request body:
    - `oldPassword`: Current password
    - `newPassword`: New password
- **DELETE /api/profile**: Deletes the authenticated user's account (protected).

### Event APIs

- **GET /api/event**: Fetches a list of events (public).
- **GET /api/event/:id**: Fetches a specific event by ID (public).
- **POST /api/event**: Creates a new event (protected).
  - Request body:
    - `title`: Event title
    - `description`: Event description
    - `eventImage`: Image for the event (multipart upload)
    - `etc`
- **PUT /api/event/:id**: Updates an event by ID (protected).
  - Request body:
    - `title`: Updated event title
    - `description`: Updated event description
    - `eventImage`: Updated event image (multipart upload)
    - `etc`
- **DELETE /api/event/:id**: Deletes an event by ID (protected).
- **GET /api/event/user/created**: Retrieves events created by the authenticated user (protected).
- **POST /api/event/:id/join**: Allows a user to join an event (protected).
- **POST /api/event/:id/leave**: Allows a user to leave an event (protected).

### Help Request APIs

- **GET /api/help-requests**: Fetches a list of help requests (public).
- **POST /api/help-requests**: Creates a new help request (protected).
  - Request body:
    - `title`: Help request title
    - `description`: Help request description
    - `urgencyLevel`: Urgency level of the help request
    - `etc`
- **GET /api/help-requests/:id**: Fetches a specific help request by ID (public).
- **PUT /api/help-requests/:id**: Updates a help request by ID (protected).
- **DELETE /api/help-requests/:id**: Deletes a help request by ID (protected).
- **GET /api/help-requests/user/created**: Retrieves help requests created by the authenticated user (protected).

### Helper APIs for Help Requests

- **POST /api/help-requests/:id/offer-help**: Allows a user to offer help for a specific help request (protected).
- **DELETE /api/help-requests/:id/withdraw-help**: Allows a user to withdraw their offer of help (protected).
- **GET /api/help-requests/:id/helpers**: Fetches a list of helpers for a specific help request (protected).

### Comment APIs

- **POST /api/help-requests/:id/comments**: Adds a comment to a specific help request (protected).
  - Request body:
    - `content`: Comment content
- **DELETE /api/help-requests/:id/comments/:commentId**: Deletes a comment from a help request (protected).

### Authentication Middleware

The application uses **cookie-parser** middleware for authentication. After logging in, a session cookie is set to authenticate further requests. For all protected routes, the cookie is checked to ensure the user is authenticated.

To access protected routes, users must have a valid session cookie. The backend will validate the cookie and allow or deny access based on the session's validity.

---

### Notes on Authentication

- **Login**: A user can authenticate via the `/api/auth/login` endpoint. Upon successful login, a session cookie is created and sent to the client.
- **Logout**: Use `/api/auth/logout` to destroy the session and remove the authentication cookies.

---

## Postman Collection

[Download Postman Collection](./postman_collection.json)

volunteering-platform.postman_collection.json

## Demo Screenshots

![volunteering-platform](./frontend/public/homePage.png)
