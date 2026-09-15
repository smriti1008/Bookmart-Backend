# 📚 BookMart – Online Bookstore

BookMart is a full-stack online bookstore application designed to provide a smooth platform for users to browse and manage books, while providing administrative functionality for managing the bookstore.

The project focuses on implementing **backend development, authentication, database management, CRUD operations, and role-based functionality** using Node.js, Express.js, and MongoDB.

## 🚀 Features

### 👤 User

* User registration and login
* Secure password hashing
* JWT-based authentication
* Browse available books
* View book details
* Manage user-specific data
* Protected routes for authenticated users

### 🛠️ Admin

* Admin authentication
* Add new books
* Edit book details
* Delete books
* Manage the book inventory
* Separate Admin and User functionality

### 🔐 Authentication & Security

* JWT-based authentication
* HTTP cookies for maintaining login sessions
* Password hashing using bcrypt
* Authentication middleware for protected routes
* Role-based access control

## 🧑‍💻 Tech Stack

**Frontend**

* HTML
* CSS
* EJS
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Authentication**

* JSON Web Token (JWT)
* bcrypt
* Cookie Parser

**Tools**

* Git & GitHub
* VS Code
* Nodemon

## 📂 Project Structure

```text
BookMart/
│
├── models/
│   ├── user.js
│   └── book.js
│
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── home.ejs
│   └── ...
│
├── public/
│   └── ...
│
├── middleware/
│   └── ...
│
├── index.js
├── package.json
├── package-lock.json
└── .gitignore
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/BookMart.git
```

### 2. Navigate to the project

```bash
cd BookMart
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory and add your required configuration:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Start the server

For development:

```bash
npx nodemon index.js
```

Or:

```bash
node index.js
```

The application will run on your local server.

## 📌 Key Learning

Through this project, I gained practical experience in:

* Building RESTful backend routes using Express.js
* Connecting a Node.js application with MongoDB
* Designing and working with MongoDB schemas using Mongoose
* Implementing CRUD operations
* Implementing JWT-based authentication
* Using middleware for authentication and authorization
* Password hashing and secure user authentication
* Managing cookies and sessions
* Structuring a full-stack application
* Handling user and admin roles
* Debugging backend and database-related issues


## 👩‍💻 Author

Smriti Singh

Mechanical Engineering Student | Full-Stack Developer

---

⭐ If you found this project useful, consider giving it a star!
