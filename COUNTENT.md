# My React Dashboard

## Overview

My React Dashboard is a Vite-powered React application with a protected analytics dashboard and a separate Express API. Users can register, log in, view dashboard metrics, browse the team page, and switch between light and dark themes.

## Features

- Username and password registration
- JWT-based login and protected routes
- Dashboard with statistics, charts, tables, and activity feed
- Team/users page
- Authenticated Messages page with shared conversations
- Realtime message and sidebar updates with Socket.IO
- Message attachments, emoji picker, replies, editing, deletion, copying, and seen status
- Responsive sidebar and header layout
- Light and dark theme persisted in `localStorage`
- MySQL-backed user accounts
- Backend health and authenticated greeting endpoints

## Project Structure

```text
.
|-- Backend/
|   |-- package.json
|   `-- server.js
|-- public/
|-- src/
|   |-- components/
|   |   |-- Layout/
|   |   `-- dashboard/
|   |-- page/
|   |   |-- Dashboard.jsx
|   |   |-- Login.jsx
|   |   |-- Profile.jsx
|   |   |-- Register.jsx
|   |   `-- Users.jsx
|   |-- services/
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- data.md
|-- package.json
|-- tailwind.config.js
|-- vite.config.js
`-- COUNTENT.md
```

## Requirements

- Node.js and npm
- MySQL or MariaDB
- A database named `my_app_db`

## Installation

Install the frontend dependencies from the project root:

```bash
npm install
```

Install the backend dependencies:

```bash
cd Backend
npm install
```

## Database Setup

Run the SQL in `data.md`, or create the database and `users` table with the following schema:

```sql
CREATE DATABASE IF NOT EXISTS my_app_db
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_unicode_ci;

USE my_app_db;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### phpMyAdmin / XAMPP

1. Start **MySQL** in the XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Open the **Import** tab and import the SQL from `data.md`, or run it in the SQL tab.
4. Confirm the `my_app_db` database contains `users`, `conversations`, `messages`, and `team_members`.
5. Keep the backend settings in `Backend/.env` aligned with phpMyAdmin's MySQL server:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=my_app_db
```

The default XAMPP MySQL port is `3306`. The backend has been verified against `my_app_db` on that port.

## Environment Variables

Create `Backend/.env` with the database connection settings:

```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=my_app_db
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
GREETING=Welcome to the dashboard!
```

The frontend API client supports this optional root-level variable:

```env
VITE_API_URL=http://localhost:5000
```

Keep environment files out of source control. They are already excluded by `.gitignore`.

## Running Locally

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

Start the Vite frontend in another terminal from the project root:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

For a production-style frontend preview:

```bash
npm run build
npm run preview
```

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in with a username and password |
| `/register` | Public | Create a user account |
| `/dashboard` | Authenticated | View dashboard statistics and activity |
| `/team` | Authenticated | View the users/team page |
| `/messages` | Authenticated | Read and send realtime team messages |
| `/profile` | Authenticated | Update username, cover image, bio, and skills |
| `/` | Redirect | Sends authenticated users to `/dashboard`, otherwise `/login` |

The frontend checks for a token in `localStorage`. The backend validates bearer tokens with the JWT secret before serving protected API responses.

## API Endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/register` | No | Create a user with a bcrypt-hashed password |
| `POST` | `/api/login` | No | Validate credentials and return a one-hour JWT |
| `GET` | `/api/health` | No | Confirm that the backend is running |
| `GET` | `/api/dashboard` | Bearer token | Return an authenticated dashboard greeting |
| `GET` | `/api/greeting` | Bearer token | Return the configured or fallback greeting |
| `GET` | `/api/conversations` | Bearer token | List available conversations |
| `GET` | `/api/conversations/:id/messages` | Bearer token | Load messages for a conversation |
| `POST` | `/api/conversations/:id/messages` | Bearer token | Save and broadcast a message |
| `PUT` | `/api/conversations/:id/read` | Bearer token | Mark a conversation as read |
| `PUT` | `/api/conversations/:conversationId/messages/:messageId` | Bearer token | Edit one of the current user's messages |
| `DELETE` | `/api/conversations/:conversationId/messages/:messageId` | Bearer token | Soft-delete one of the current user's messages |
| `GET` | `/api/profile` | Bearer token | Load the authenticated user's profile |
| `PUT` | `/api/profile` | Bearer token | Update the authenticated user's profile |

## Realtime Messaging

The backend serves Socket.IO through the same HTTP server as Express. When a user opens a conversation, the frontend joins its Socket.IO room and listens for:

- `receive_message` for new messages in the active conversation
- `update_sidebar` for conversation preview and time changes
- `message_updated` when a message is edited
- `message_deleted` when a message is deleted

Messages support text, base64-encoded attachments up to 5MB, replies through `reply_to_id`, and read timestamps through `read_at`. Run the message-table migration in `data.md` before using these fields with an existing database.

Message authors use the authenticated username from the JWT. The current database schema provides shared conversations; private one-to-one conversations require participant or recipient columns.

## Available Scripts

### Frontend

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.
- `npm run lint` runs Oxlint.
- `npm run preview` serves the production build locally.

### Backend

- `npm start` starts the Express server with Node.js.
- `npm run dev` starts the server with Nodemon.

## Notes

- Login and registration currently call `http://localhost:5000` directly.
- The shared API service uses `VITE_API_URL` for the authenticated greeting request.
- The frontend uses `VITE_API_URL` for the Messages API and Socket.IO connection.
- The backend uses `socket.io`, and the frontend uses `socket.io-client`.
- Passwords are never stored in plain text; the backend hashes them with `bcryptjs`.
- Do not use the fallback JWT secret in a production deployment.

