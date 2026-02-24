# Club Management System

A full-stack web application built using **Node.js**, **Express**, and **EJS** for managing college or organizational clubs. The system includes **authentication, role-based authorization, event management, and administrative controls**.


## Overview

The Club Management System is designed to streamline club administration through structured role management, event handling, and centralized user control.

The application follows an MVC-style architecture with:

* Express for routing and middleware
* EJS for server-side rendering
* Authentication and session management
* Modular route organization
* Structured data models



## Core Features

### 1. Authentication & Authorization

* User registration and login
* Secure password handling 
* Session-based authentication 
* Role-based access control (Admin / Coordinator / Member)
* Protected routes using middleware

### 2. Role-Based Dashboards

* Admin: Full system control
* Club Coordinator: Manage club-specific events and members
* Member: Register for events and view club information

### 3. Event Management

* Create, update, delete events
* Member event registration
* Track participation records

### 4. Club Management

* Create and manage clubs
* Assign coordinators
* Publish announcements

### 5. Server-Side Rendering

* Dynamic rendering with EJS
* Separation of concerns between views and logic



## Tech Stack

**Backend**

* Node.js
* Express.js

**Templating**

* EJS

**Authentication**

* bcrypt (password hashing)
* express-session (session management)
* Middleware-based route protection

**Frontend**

* HTML5
* CSS3
* Static assets served from `public/`

**Package Manager**

* npm

**Database**

* (Specify database used — e.g., MongoDB with Mongoose / SQLite / PostgreSQL)



## Project Structure

```
club-management-system/
│
├── models/            # Database schemas/models
├── routes/            # Express route modules
├── middleware/        # Authentication and authorization middleware
├── views/             # EJS templates
├── public/            # Static files (CSS, JS, images)
├── seed.js            # Optional database seeding
├── index.js           # Application entry point
├── package.json
└── .gitignore
```



## Installation

### 1. Clone Repository

```bash
git clone https://github.com/Vadiaaaaaaa/club-management-system.git
cd club-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```
PORT=3000
DB_URL=<your_database_connection_string>
SESSION_SECRET=<your_session_secret>
```

### 4. Run Application

```bash
npm start
```

or

```bash
node index.js
```

Application runs at:

```
http://localhost:3000
```



## Authentication Flow

1. User submits registration form.
2. Password is hashed before storage.
3. Login validates hashed credentials.
4. Session is created upon successful authentication.
5. Middleware verifies session and role before granting access to protected routes.



## Security Considerations

* Password hashing
* Session-based authentication
* Route-level access control
* Server-side validation



## Scalability & Extension

* Can be extended into RESTful API architecture
* Can integrate JWT-based authentication
* Can be containerized using Docker
* Suitable for deployment on platforms like Render, AWS, or Heroku
* Easily extendable to microservices architecture



