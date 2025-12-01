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

# API Endpoints

Base URL (from Docker Compose):

backend: http://localhost:8081/api/v1
frontend: http://localhost:3000

# Running with Docker

Start Containers
docker-compose up --build -d

Stop Containers
docker-compose down