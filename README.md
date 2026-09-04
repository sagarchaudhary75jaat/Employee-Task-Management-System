# Employee Task Management System

A full-stack Employee Task Management System built with **React, Spring Boot, Spring Security, JWT, and PostgreSQL**.

The application provides role-based authentication and allows administrators to manage employees and tasks, while employees can view and manage their assigned tasks.

## 🚀 Features

### Authentication & Authorization

* User login using email and password
* JWT-based authentication
* Spring Security integration
* Role-based access control
* Separate access for Admin and Employee users
* Protected frontend routes
* Automatic JWT authentication for API requests

### Employee Management

* Add employees
* View employees
* Update employee information
* Delete employees
* Employee department and designation management
* Employee role management
* Employee task statistics

### Task Management

* Create tasks
* Assign tasks to employees
* View tasks
* Update tasks
* Delete tasks
* Accept assigned tasks
* Complete tasks
* Mark tasks as failed
* Track task status
* Track task due dates

### Dashboard

* Admin dashboard
* Employee dashboard
* Employee task statistics
* Task status information
* Task management interface

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* JavaScript
* CSS

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* JWT
* Bean Validation
* Lombok
* Maven

### Database

* PostgreSQL

---

## 📁 Project Structure

```text
Employee-Task-Management-System/
│
├── Employee-frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Tasks.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── Employee-backend/
│   └── demo/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/example/employeemanagement/
│       │   │   │       ├── config/
│       │   │   │       ├── controller/
│       │   │   │       ├── dto/
│       │   │   │       ├── entity/
│       │   │   │       ├── repository/
│       │   │   │       ├── security/
│       │   │   │       └── service/
│       │   │   │
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   │
│       │   └── test/
│       │
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
│
└── README.md
```

---

## ⚙️ Requirements

Before running the application, make sure you have installed:

* Java 21
* Node.js
* npm
* PostgreSQL
* Git

---

# 🗄️ Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE employee_management;
```

Configure your database connection in:

```text
Employee-backend/demo/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/employee_management
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD
```

Do not commit real database passwords or other sensitive credentials to GitHub.

---

# 🔐 JWT Configuration

The backend uses JWT for authentication.

For local development, configure your JWT secret through an environment variable rather than committing the secret to GitHub.

Example:

```properties
jwt.secret=${JWT_SECRET}
```

Set the environment variable before starting the backend.

---

# ▶️ Running the Backend

Open a terminal and navigate to:

```bash
cd Employee-backend/demo
```

Run the Spring Boot application using Maven:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

# ▶️ Running the Frontend

Open another terminal:

```bash
cd Employee-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal, normally:

```text
http://localhost:5173
```

---

# 🔄 Application Flow

```text
                   ┌──────────────────┐
                   │     React UI     │
                   │     Frontend     │
                   └────────┬─────────┘
                            │
                         Axios
                            │
                            ▼
                   ┌──────────────────┐
                   │   Spring Boot    │
                   │      REST API    │
                   └────────┬─────────┘
                            │
                    Spring Security
                            │
                         JWT
                            │
                            ▼
                   ┌──────────────────┐
                   │   PostgreSQL     │
                   │     Database     │
                   └──────────────────┘
```

---

# 🔑 Authentication Flow

```text
User
 │
 ▼
Login Page
 │
 ▼
POST /api/auth/login
 │
 ▼
Spring Security
 │
 ▼
Authentication
 │
 ▼
JWT Token
 │
 ▼
Frontend stores authentication information
 │
 ▼
Axios sends JWT with API requests
 │
 ▼
JWT Filter validates request
 │
 ▼
Protected API
```

---

# 👥 User Roles

## Admin

Administrators can:

* Access the admin dashboard
* Manage employees
* Create tasks
* Assign tasks
* Update tasks
* Delete tasks
* Monitor employee task information

## Employee

Employees can:

* Access their employee dashboard
* View assigned tasks
* Accept assigned tasks
* Complete tasks
* Mark tasks as failed
* View their task information

---

# 📋 Task Workflow

The current task workflow is based on the application's implemented status handling:

```text
PENDING
   │
   ▼
 ACTIVE
  /   \
 ▼     ▼
COMPLETED
       
or

ACTIVE
   │
   ▼
FAILED
```

Employees can only perform task actions permitted by the application's authorization and task-state rules.

---

# 🔌 Main Backend Components

### Controllers

The backend contains controllers responsible for:

* Authentication
* Employee management
* Task management

### Services

Service classes contain reusable application/business logic.

### Repositories

Spring Data JPA repositories provide database access.

### Entities

The application currently contains domain entities for employees and tasks.

### Security

Spring Security and JWT provide:

* Authentication
* Authorization
* Protected endpoints
* Role-based access

---

# 🌐 Frontend Pages

The React application contains pages for:

* Login
* Admin Dashboard
* Employee Dashboard
* Employee Management
* Task Management

Protected routes prevent unauthorized users from accessing restricted pages.

---

# 🧪 Build

### Frontend

```bash
npm run build
```

### Backend

```bash
mvnw.cmd clean package
```

---

# 🔒 Security Notes

This project uses:

* Spring Security
* JWT authentication
* BCrypt password hashing
* Role-based authorization
* Protected API endpoints
* Employee task ownership checks

For production deployment, sensitive values such as:

* JWT secrets
* Database passwords
* API keys

should be provided through environment variables or a secure secrets-management system.

---

# 🚀 Future Improvements

Possible improvements include:

* Add comprehensive unit and integration tests
* Add Swagger/OpenAPI documentation
* Improve global exception handling
* Add pagination and filtering
* Add task priorities
* Add task search
* Add email notifications
* Add Docker support
* Add CI/CD with GitHub Actions
* Deploy frontend and backend
* Improve dashboard analytics
* Add automated database migrations
* Improve application logging and monitoring

---

# 👨‍💻 Author

**Sagar Chaudhary**

Full Stack Developer

GitHub:

https://github.com/sagarchaudhary75jaat

---

# ⭐ Project

If you find this project useful, consider giving the repository a star.

**Employee Task Management System**
React + Spring Boot + PostgreSQL
