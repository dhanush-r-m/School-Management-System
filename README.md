# School Management System - Frontend

## Project Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Features

- Role-based authentication (Student, Teacher, Parent, Admin)
- Responsive design for all screen sizes
- Interactive dashboard for each user type
- Real-time data display (grades, attendance, etc.)
- Form validation and error handling

## Available Scripts

- `npm start`: Start the development server
- `npm run build`: Build the project (not applicable for plain HTML/CSS/JS)
- `npm test`: Run tests (none configured yet)
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Backend Integration

The frontend expects a backend server running at `http://localhost:3000` with the following endpoints:

- `/api/auth/login` - User authentication
- `/api/students` - Student data
- `/api/teachers` - Teacher data
- `/api/parents` - Parent data
- `/api/admin` - Admin endpoints

## Environment Variables

Create a `.env` file in the root directory with your configuration:


VITE_API_BASE_URL=http://localhost:3000/api


VITE_APP_NAME=School Management System
