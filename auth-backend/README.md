# Auth Backend - Node.js + Express + MongoDB + TypeScript

A RESTful API backend built with Node.js, Express, MongoDB, and TypeScript following MVC architecture. Includes user authentication with JWT tokens, ESLint, and Prettier.

## Features

- ✅ **TypeScript** - Full type safety and IntelliSense support
- ✅ **MVC Architecture** - Clean separation of concerns
- ✅ **MongoDB with Mongoose** - Type-safe database operations
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcryptjs for secure passwords
- ✅ **ESLint & Prettier** - Code quality and formatting
- ✅ **Environment Config** - dotenv for configuration
- ✅ **Global Error Handling** - Consistent error responses

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Code Quality**: ESLint + Prettier
- **Environment Config**: dotenv

## Project Structure

```
auth-backend/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection
│   ├── types/
│   │   ├── index.ts           # Shared interfaces
│   │   ├── express.d.ts       # Express type extensions
│   │   └── environment.d.ts   # Environment variables
│   ├── models/
│   │   └── User.ts            # User schema with types
│   ├── controllers/
│   │   ├── authController.ts  # Auth logic (typed)
│   │   └── userController.ts  # User logic (typed)
│   ├── routes/
│   │   ├── authRoutes.ts      # Auth endpoints
│   │   └── userRoutes.ts      # User endpoints
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   └── errorHandler.ts    # Global error handler
│   ├── utils/
│   │   └── generateToken.ts   # JWT token generator
│   └── server.ts              # Entry point
├── dist/                      # Compiled JavaScript
├── .env.example               # Environment template
├── .gitignore
├── .eslintrc.json             # ESLint config
├── .prettierrc                # Prettier config
├── tsconfig.json              # TypeScript config
├── package.json
└── README.md
```

## Installation

1. **Navigate to the project directory**

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

## Development

### Build TypeScript

```bash
npm run build
```

### Run in Development Mode

```bash
npm run dev
```

### Run in Production Mode

```bash
npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
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

## TypeScript Features

### Type Safety

All request/response objects are fully typed:

```typescript
// Request body types
interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Response types
interface IAuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

// Controller with types
export const register = async (
  req: Request<object, object, IRegisterRequest>,
  res: Response<IApiResponse<IAuthResponse>>,
  next: NextFunction
): Promise<void> => {
  // Fully typed implementation
};
```

### Custom Type Extensions

Express Request is extended to include authenticated user:

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
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
- JWT token authentication with 30-day expiration
- Password field excluded from queries by default
- Email validation with regex
- Protected routes with middleware
- Type-safe error handling

## Code Quality

- **TypeScript**: Strict mode enabled for maximum type safety
- **ESLint**: Configured with TypeScript parser and recommended rules
- **Prettier**: Consistent code formatting across the project
- **Type Definitions**: Comprehensive interfaces for all data structures

## License

ISC
