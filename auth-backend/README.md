# Auth Backend - Node.js + Express + MongoDB

A RESTful API backend built with Node.js, Express, and MongoDB following MVC architecture. Includes user authentication with JWT tokens.

## Features

- ✅ MVC Architecture
- ✅ MongoDB with Mongoose ODM
- ✅ JWT Authentication
- ✅ Password hashing with bcryptjs
- ✅ Environment variable configuration
- ✅ Global error handling
- ✅ Input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment Config**: dotenv

## Project Structure

```
auth-backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── User.js            # User schema
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── userController.js  # User logic
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── userRoutes.js      # User endpoints
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── errorHandler.js    # Global error handler
│   └── utils/
│       └── generateToken.js   # JWT token generator
├── .env.example               # Environment template
├── .gitignore
├── package.json
├── server.js                  # Entry point
└── README.md
```

## Installation

1. **Clone or navigate to the project directory**

```bash
cd auth-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=your_super_secret_jwt_key_change_this
```

4. **Start MongoDB**

Make sure MongoDB is running locally or use MongoDB Atlas connection string.

```bash
# Local MongoDB
mongod
```

5. **Run the application**

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Profile

#### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-12-17T10:15:30.000Z"
  }
}
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Handling

The API uses a global error handler that returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/auth-db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Password field excluded from queries by default
- Email validation
- Protected routes with middleware

## License

ISC
