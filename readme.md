# 🔐 SecureAuth API

SecureAuth API is a secure authentication backend built with **Node.js, Express, MongoDB, JWT, and Redis**.  
It implements a production-style authentication flow using **Access Tokens and Refresh Tokens**, along with **Redis-based token blacklisting** to prevent token reuse after logout.

This project demonstrates real-world backend concepts such as **JWT authentication, middleware-based authorization, password hashing, token lifecycle management, and Redis integration.**

---

# 🚀 Key Features

- JWT-based authentication
- Access Token and Refresh Token architecture
- Redis-based token blacklisting for logout security
- Password hashing using bcrypt
- Cookie-based authentication
- Middleware-based route protection
- User CRUD APIs
- Request validation using validator.js
- Modular and scalable backend architecture

---

# 🛠 Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Tokens (JWT)
- bcrypt
- validator.js

### Caching / Token Revocation
- Redis

### Other Tools
- cookie-parser
- dotenv

---

# 🧱 Architecture Overview

```
Client
  │
  │ Login Request
  ▼
Express Server
  │
  │ Verify Credentials
  ▼
Generate Tokens
  ├── Access Token (Short Expiry)
  └── Refresh Token (Long Expiry)
  │
  ▼
Stored in Cookies
  │
  ▼
Protected Routes
  │
  ▼
Auth Middleware
  │
  ├── Verify JWT
  └── Check Redis Blacklist
```

---

# 📁 Project Structure

```
SecureAuth-API
│
├── Configs
│   ├── dbConfig.js
│   └── redisConfigs.js
│
├── Middleware
│   ├── userAuth.js
│   └── rateLimiter.js
│
├── Models
│   └── User.js
│
├── Routes
│   ├── authRouter.js
│   └── userRouter.js
│
├── Validators
│   ├── validateUser.js
│   └── validateUserLogin.js
│
├── server.js
└── package.json
```

---

# 🔐 Authentication Flow

## 1. Login

User submits email and password.

Server:
- Validates credentials
- Generates tokens

```
Access Token → short expiration
Refresh Token → longer expiration
```

Both tokens are stored in **HTTP cookies**.

---

## 2. Access Protected Routes

Authentication middleware verifies:

1. JWT signature
2. Token expiration
3. Redis blacklist

If valid → request proceeds.

---

## 3. Logout

On logout:

1. Access token added to Redis blacklist
2. Refresh token added to Redis blacklist
3. Cookies cleared

Example Redis keys:

```
access:<token>
refresh:<token>
```

---

# 📡 API Endpoints

## Auth Routes

### Register User

```
POST /auth/register
```

Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123!",
  "gender": "Male"
}
```

Response

```
User registered successfully
```

---

### Login

```
POST /auth/login
```

Request Body

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

Response

```
User logged in successfully
```

Cookies set:

```
accessToken
refreshToken
```

---

### Logout

```
POST /auth/logout
```

Functionality:

- Blacklists tokens in Redis
- Clears authentication cookies

---

### Refresh Access Token

```
POST /auth/refresh
```

Generates new access token using refresh token.

---

## User Routes (Protected)

These routes require authentication middleware.

### Get Current User

```
GET /user
```

Returns authenticated user.

---

### Update User

```
PATCH /user
```

Example Request Body

```json
{
  "_id": "userId",
  "name": "Updated Name"
}
```

---

### Delete User

```
DELETE /user/:id
```

Deletes user by ID.

---

# 🔒 Security Practices Implemented

### Password Hashing

Passwords are hashed using bcrypt before storing in the database.

```
bcrypt.hash(password, 10)
```

---

### JWT Verification

Access tokens are verified using:

```
jwt.verify(token, SECRET_KEY)
```

---

### Token Revocation with Redis

Blocked tokens are stored in Redis until they expire.

```
access:<token>
refresh:<token>
```

This prevents reuse of tokens after logout.

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

Example:

```
PORT=8000

SECRET_KEY=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret

MONGO_URI=your_mongodb_connection

REDIS_URL=redis://localhost:6379
```

---

# ▶️ Running the Project

### Install dependencies

```
npm install
```

---

### Start Redis Server

```
redis-server
```

---

### Start MongoDB

```
mongod
```

---

### Run the server

```
node server.js
```

Server runs at:

```
http://localhost:8000
```

---

# 📈 Skills Demonstrated

- Secure authentication architecture
- JWT token lifecycle management
- Redis integration for token revocation
- Middleware-based authorization
- REST API development
- Backend project structuring
- Security best practices

---

# 👨‍💻 Author

Hemant Kushwaha
