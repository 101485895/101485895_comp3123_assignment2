# COMP3123 – Assignment 2

Author: Laurence Liang
Student ID: 101485895

# Tech Stack
## Frontend

React.js (Create React App)

Material-UI (MUI) for responsive UI components

Axios for API communication

React Router for navigation

React Query for server state management

## Backend

Node.js / Express.js

MongoDB + Mongoose

bcrypt for password hashing

multer for image upload

CORS enabled API

## DevOps

Docker for containerization

Docker Compose for multi-service orchestration

Containers:

frontend

backend

mongodb

mongo-express

# Project Structure
101485895_comp3123_assignment2/
│
├── backend/
│   ├── models/
│   │   ├── user.js
│   │   └── employee.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── employeeRoutes.js
│   ├── uploads/            # stores employee profile pictures
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/api.js
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── EmployeeList.jsx
│   ├── public/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml

🔌 API Endpoints

Base URL (from Docker Compose):

http://localhost:8081/api/v1

# Authentication Routes
Method	Endpoint	Description
POST	/user/signup	Registers a new user
POST	/user/login	Logs in a user, returns session token
## Employee Routes
Method	Endpoint	Description
GET	/emp/employees	Get all employees
POST	/emp/employees	Add employee (supports image upload)
GET	/emp/employees/:id	View employee details
PUT	/emp/employees/:id	Update employee (supports image upload)
DELETE	/emp/employees?eid=id	Delete employee
GET	/emp/search?department=&position=	Search employees by criteria

# Running with Docker

Start Containers
docker-compose up --build -d

Stop Containers
docker-compose down