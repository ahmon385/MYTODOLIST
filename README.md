# MYTODOLIST

A full-stack TODO list application with authentication and data persistence.

## Features

- ✅ User authentication (signup/login with JWT)
- ✅ Create, read, update, and delete todos
- ✅ Mark todos as completed
- ✅ Data persistence with SQLite database
- ✅ Frontend and backend on different ports
- ✅ Secure password hashing
- ✅ RESTful API architecture

## Tech Stack

### Backend (Port 5000)
- Node.js with Express
- SQLite database (better-sqlite3)
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

### Frontend (Port 3000)
- React
- Axios for API calls
- Local storage for auth tokens

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ahmon385/MYTODOLIST.git
cd MYTODOLIST
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Create a `.env` file in the backend directory:
```bash
cd backend
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```
PORT=5000
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

### Running the Application

1. Start the backend server (from the backend directory):
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

2. Start the frontend (from the frontend directory):
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Todos
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Usage

1. Open `http://localhost:3000` in your browser
2. Sign up with a new account or login if you already have one
3. Start creating and managing your todos!

## Project Structure

```
MYTODOLIST/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Todo.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── todos.js
│   │   └── server.js
│   ├── data/ (created automatically)
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── TodoList.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   └── Signup.js
    │   ├── services/
    │   │   ├── api.js
    │   │   └── auth.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env
```

## Security Features

- Passwords are hashed using bcryptjs before storage
- JWT tokens for stateless authentication
- Protected routes requiring valid tokens
- User-specific data isolation

## License

MIT