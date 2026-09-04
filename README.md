# 👨‍💼 Employee Task Management System

<p align="center">
  <strong>🚀 Smart Task Management for Modern Teams</strong>
</p>

<p align="center">
  A modern web-based platform for managing employees, assigning tasks,
  tracking progress, monitoring deadlines, and improving team productivity.
</p>

---

## 📌 About The Project

**Employee Task Management System** is a full-stack web application developed using **React.js, Spring Boot, and PostgreSQL**.

The system provides a centralized platform for organizations to manage employees and their assigned tasks efficiently.

Administrators and managers can create tasks, assign them to employees, set priorities and deadlines, and monitor task progress. Employees can view their assigned tasks and update their task status.

### 🎯 Project Goal

> **Plan → Assign → Track → Complete → Improve**

The main objective of this project is to simplify task management, improve employee productivity, reduce manual work, and provide better visibility into organizational tasks.

---

# ✨ Features

<table>
<tr>
<td width="50%">

### 👨‍💼 Employee Management

* ➕ Add employees
* ✏️ Update employee information
* 👁️ View employee profiles
* 🗑️ Delete employees
* 🔎 Search employees
* 🏢 Manage departments
* 💼 Manage designations

</td>

<td width="50%">

### 📋 Task Management

* ➕ Create tasks
* 📌 Assign tasks to employees
* ✏️ Update tasks
* 🗑️ Delete tasks
* 👁️ View task details
* 🔎 Search and filter tasks
* 🔄 Update task status

</td>
</tr>

<tr>
<td>

### 🎯 Task Priority

Tasks can be organized according to priority:

* 🔴 **High**
* 🟠 **Medium**
* 🟢 **Low**

</td>

<td>

### 📊 Task Status

Track tasks through different stages:

* ⚪ **Pending**
* 🔵 **In Progress**
* 🟡 **Review**
* 🟢 **Completed**
* 🔴 **Overdue**

</td>
</tr>

<tr>
<td>

### 📅 Deadline Management

* Set task deadlines
* Monitor upcoming deadlines
* Identify overdue tasks
* Track completion dates
* Improve time management

</td>

<td>

### 📈 Dashboard

Get a quick overview of:

* 👨‍💼 Total employees
* 📋 Total tasks
* ⏳ Pending tasks
* 🔵 In-progress tasks
* 🟢 Completed tasks
* 🔴 Overdue tasks

</td>
</tr>
</table>

---

# 🖥️ Application Screenshots

> 📸 Add your actual screenshots to the `screenshots` folder.

### 📊 Dashboard

<p align="center">
  <img src="screenshots/dashboard.png" width="90%" alt="Employee Task Management Dashboard">
</p>

### 📋 Task Management

<p align="center">
  <img src="screenshots/tasks.png" width="90%" alt="Task Management">
</p>

### 👨‍💼 Employee Management

<p align="center">
  <img src="screenshots/employees.png" width="90%" alt="Employee Management">
</p>

### 📝 Task Details

<p align="center">
  <img src="screenshots/task-details.png" width="90%" alt="Task Details">
</p>

---

# 🛠️ Technology Stack

## 🎨 Frontend

<p align="left">
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React.js">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

### Frontend Technologies

* **React.js** — Component-based UI development
* **JavaScript** — Application logic
* **HTML5** — Page structure
* **CSS3** — Styling and responsive design
* **Axios** — API communication

---

## ⚙️ Backend

<p align="left">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Data JPA">
</p>

### Backend Technologies

* **Java**
* **Spring Boot**
* **Spring Web / REST API**
* **Spring Data JPA**
* **Hibernate**
* **Maven**

---

## 🗄️ Database

<p align="left">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

### Database Technologies

* **PostgreSQL**
* Relational database design
* SQL
* JPA/Hibernate ORM

---

# 🏗️ System Architecture

```text
                         👤 USER
                           │
                           ▼
                ┌────────────────────┐
                │    ⚛️ REACT.JS     │
                │     FRONTEND       │
                └─────────┬──────────┘
                          │
                          │ REST API
                          │ HTTP / JSON
                          ▼
                ┌────────────────────┐
                │  🌱 SPRING BOOT    │
                │      BACKEND       │
                ├────────────────────┤
                │  REST Controllers  │
                │  Services          │
                │  Repositories      │
                │  JPA / Hibernate   │
                └─────────┬──────────┘
                          │
                          │ SQL
                          ▼
                ┌────────────────────┐
                │ 🐘 POSTGRESQL      │
                │     DATABASE       │
                └────────────────────┘
```

---

# 📂 Project Structure

```text
employee-task-management-system/
│
├── 📁 frontend/
│   ├── 📁 public/
│   └── 📁 src/
│       ├── 📁 components/
│       ├── 📁 pages/
│       ├── 📁 services/
│       ├── 📁 hooks/
│       ├── 📁 assets/
│       ├── 📄 App.jsx
│       └── 📄 main.jsx
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 com/example/
│   │   │   │       ├── 📁 controller/
│   │   │   │       ├── 📁 service/
│   │   │   │       ├── 📁 repository/
│   │   │   │       ├── 📁 entity/
│   │   │   │       ├── 📁 dto/
│   │   │   │       └── 📄 Application.java
│   │   │   │
│   │   │   └── 📁 resources/
│   │   │       └── 📄 application.properties
│   │   │
│   │   └── 📁 test/
│   │
│   └── 📄 pom.xml
│
├── 📁 screenshots/
│   ├── dashboard.png
│   ├── tasks.png
│   ├── employees.png
│   └── task-details.png
│
├── 📄 .gitignore
└── 📄 README.md
```

---

# 🔄 Application Workflow

```text
             👤 LOGIN
                │
                ▼
        ┌───────────────┐
        │  📊 DASHBOARD │
        └───────┬───────┘
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
 👨‍💼 EMPLOYEES       📋 TASKS
       │                 │
       │                 ▼
       │          📝 CREATE TASK
       │                 │
       │                 ▼
       │           📌 ASSIGN TASK
       │                 │
       │                 ▼
       │          🔵 IN PROGRESS
       │                 │
       │                 ▼
       │            🟡 REVIEW
       │                 │
       │                 ▼
       │           🟢 COMPLETED
       │
       ▼
  👤 EMPLOYEE
     PROFILE
```

---

# 👥 User Roles

|        Role        | Permissions                       |
| :----------------: | --------------------------------- |
|    👑 **Admin**    | Full system access                |
|  🧑‍💼 **Manager** | Manage employees and assign tasks |
| 👨‍💻 **Employee** | View and manage assigned tasks    |

---

# 📋 Task Management

Each task contains important information required for effective task tracking.

| Field                       | Description                                |
| --------------------------- | ------------------------------------------ |
| 🆔 **Task ID**              | Unique task identifier                     |
| 📌 **Title**                | Task name                                  |
| 📝 **Description**          | Detailed task information                  |
| 👨‍💼 **Assigned Employee** | Employee responsible for the task          |
| 👤 **Created By**           | Manager/Admin who created the task         |
| 🎯 **Priority**             | High / Medium / Low                        |
| 📊 **Status**               | Pending / In Progress / Review / Completed |
| 📅 **Start Date**           | Task starting date                         |
| ⏰ **Due Date**              | Task deadline                              |
| 📝 **Remarks**              | Additional information                     |

---

# 📊 Dashboard

The dashboard provides a centralized overview of employee and task activity.

### Dashboard Metrics

```text
┌─────────────────────┐    ┌─────────────────────┐
│ 👨‍💼 TOTAL EMPLOYEES │    │ 📋 TOTAL TASKS      │
│                     │    │                     │
│        120          │    │        350          │
└─────────────────────┘    └─────────────────────┘

┌─────────────────────┐    ┌─────────────────────┐
│ ⏳ PENDING TASKS    │    │ 🔵 IN PROGRESS      │
│                     │    │                     │
│         45          │    │         80          │
└─────────────────────┘    └─────────────────────┘

┌─────────────────────┐    ┌─────────────────────┐
│ 🟢 COMPLETED        │    │ 🔴 OVERDUE          │
│                     │    │                     │
│        210          │    │         15          │
└─────────────────────┘    └─────────────────────┘
```

---

# 🔌 REST API

The React.js frontend communicates with the Spring Boot backend through RESTful APIs.

## 👨‍💼 Employee APIs

|  Method  | Endpoint              | Description        |
| :------: | --------------------- | ------------------ |
|   `GET`  | `/api/employees`      | Get all employees  |
|   `GET`  | `/api/employees/{id}` | Get employee by ID |
|  `POST`  | `/api/employees`      | Create employee    |
|   `PUT`  | `/api/employees/{id}` | Update employee    |
| `DELETE` | `/api/employees/{id}` | Delete employee    |

## 📋 Task APIs

|  Method  | Endpoint                 | Description        |
| :------: | ------------------------ | ------------------ |
|   `GET`  | `/api/tasks`             | Get all tasks      |
|   `GET`  | `/api/tasks/{id}`        | Get task by ID     |
|  `POST`  | `/api/tasks`             | Create task        |
|   `PUT`  | `/api/tasks/{id}`        | Update task        |
| `DELETE` | `/api/tasks/{id}`        | Delete task        |
|  `PATCH` | `/api/tasks/{id}/status` | Update task status |

---

# 📦 Example Task Request

```json
{
  "title": "Design Employee Dashboard",
  "description": "Create a responsive employee management dashboard.",
  "assignedTo": 1,
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "startDate": "2026-09-01",
  "dueDate": "2026-09-10"
}
```

---

# 🗄️ Database Design

The application uses **PostgreSQL** as the relational database.

### Main Entities

```text
┌─────────────────┐
│    EMPLOYEE     │
├─────────────────┤
│ id              │
│ name            │
│ email           │
│ phone           │
│ department      │
│ designation     │
│ joining_date    │
└────────┬────────┘
         │
         │ 1
         │
         │ N
         ▼
┌─────────────────┐
│      TASK       │
├─────────────────┤
│ id              │
│ title           │
│ description     │
│ priority        │
│ status          │
│ start_date      │
│ due_date        │
│ employee_id     │
└─────────────────┘
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following software is installed:

* ☕ Java JDK 17+
* 🌱 Spring Boot
* 📦 Maven
* ⚛️ Node.js
* 📦 npm
* 🐘 PostgreSQL
* 💻 Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/employee-task-management-system.git
```

```bash
cd employee-task-management-system
```

---

# 2️⃣ PostgreSQL Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE employee_task_management;
```

Update your Spring Boot configuration in:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/employee_task_management
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

> 🔒 Do not commit real database passwords to GitHub.

---

# 3️⃣ Start the Spring Boot Backend

Navigate to the backend:

```bash
cd backend
```

Run the application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

---

# 4️⃣ Start the React Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

Or, if your project uses Vite:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:3000
```

or:

```text
http://localhost:5173
```

---

# 🔗 Frontend & Backend Communication

```text
┌───────────────────────┐
│       React.js        │
│                       │
│   http://localhost    │
│       :3000           │
└───────────┬───────────┘
            │
            │ REST API
            │
            ▼
┌───────────────────────┐
│     Spring Boot       │
│                       │
│   http://localhost    │
│       :8080           │
└───────────┬───────────┘
            │
            │ JPA / Hibernate
            │
            ▼
┌───────────────────────┐
│      PostgreSQL       │
│                       │
│        :5432          │
└───────────────────────┘
```

---

# 🔐 Security

The application can implement secure authentication and authorization using Spring Security.

Security considerations include:

* 🔐 User authentication
* 🛡️ Role-based access control
* 🔑 Password encryption
* 🚫 Protected API endpoints
* ✅ Input validation
* 🔒 Secure database credentials
* 🛡️ CORS configuration
* ⚠️ Global exception handling

---

# 🧪 Testing

### Backend

Run Spring Boot tests:

```bash
cd backend
./mvnw test
```

### Frontend

Run React tests:

```bash
cd frontend
npm test
```

### API Testing

REST APIs can be tested using:

* Postman
* Insomnia
* Swagger/OpenAPI

---

# 📈 Future Enhancements

The project can be extended with:

* 📅 Attendance Management
* 🏖️ Leave Management
* 💰 Payroll Management
* 📈 Employee Performance Tracking
* 💬 Task Comments
* 📎 File Attachments
* 🔔 Real-Time Notifications
* 📧 Email Notifications
* 📊 Productivity Analytics
* 📥 Excel/PDF Reports
* 📱 Mobile Application
* 🌙 Dark Mode
* 🔄 Real-Time Task Updates
* 📝 Activity & Audit Logs
* 🤖 AI-Powered Task Prioritization

---

# 🤝 Contributing

Contributions are welcome! 🎉

### 1. Fork the repository

### 2. Create a new branch

```bash
git checkout -b feature/new-feature
```

### 3. Make your changes

Implement your feature or fix.

### 4. Commit your changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push your branch

```bash
git push origin feature/new-feature
```

### 6. Create a Pull Request

Open a Pull Request and provide a clear description of your changes.

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

<p align="center">

## Your Name

**Full Stack Developer**

React.js • Spring Boot • PostgreSQL

</p>

---

# ⭐ Support

If you find this project useful, please consider giving it a ⭐ on GitHub.

Your support and feedback are greatly appreciated! ❤️

---

<p align="center">

## 🚀 Employee Task Management System

### **Plan. Assign. Track. Complete.**

Built with ❤️ using **React.js + Spring Boot + PostgreSQL**

</p>
