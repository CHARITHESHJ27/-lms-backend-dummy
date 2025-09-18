# LMS Backend - Sprint 1

A Learning Management System backend built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- ✅ **Authentication & Authorization** (JWT-based)
- ✅ **Role-based Access Control** (ADMIN, TUTOR, STUDENT)
- ✅ **CSV Bulk Import** (Optimized for 20K+ users)
- ✅ **Course Management** (CRUD operations)
- ✅ **User Management** (CRUD operations)
- ✅ **Course Assignment** (Assign courses to students)
- ✅ **Event Logging** (E001, E002, E003)
- ✅ **Password Reset** (First-time login flow)

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd lms-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/lmsdb?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

4. **Setup database**
```bash
# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Reset user password
- `POST /api/auth/import-csv` - Bulk import users (ADMIN only)
- `GET /api/auth/dashboard` - Role-specific dashboard

### Users
- `GET /api/users` - Get all users (ADMIN only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (ADMIN only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (ADMIN only)
- `PUT /api/courses/:id` - Update course (ADMIN only)
- `DELETE /api/courses/:id` - Delete course (ADMIN only)
- `POST /api/courses/assign` - Assign course to user (ADMIN only)

## Testing with Postman

### 1. Login as Admin
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@lms.com",
  "password": "admin123"
}
```

### 2. Use the token for protected endpoints
```http
GET http://localhost:3000/api/users
Authorization: Bearer <your-token-here>
```

### 3. Test CSV Import
```http
POST http://localhost:3000/api/auth/import-csv
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

file: [Select your CSV file]
```

### 4. Test Course Assignment
```http
POST http://localhost:3000/api/courses/assign
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": 2,
  "courseId": 1
}
```

## Default Test Users

| Email | Password | Role | Reset Required |
|-------|----------|------|----------------|
| admin@lms.com | admin123 | ADMIN | No |
| tutor@lms.com | tutor123 | TUTOR | Yes |
| student@lms.com | student123 | STUDENT | Yes |
| newstudent@lms.com | newstudent123 | STUDENT | Yes |

## CSV Import Format

```csv
email,password,role
john@example.com,password123,STUDENT
jane@example.com,password123,TUTOR
mike@example.com,password123,STUDENT
```

## Event Logging

The system logs three main events:
- **E001** - Login Success
- **E002** - Login Failure  
- **E003** - Course Assignment

Events are logged to console with timestamps for monitoring.

## Performance Features

- Database indexes for efficient queries
- Batch processing for large CSV imports (1000 users per batch)
- Pagination support for large datasets
- Optimized for 20K+ users

## Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
npm run generate     # Generate Prisma client
npm run migrate      # Run database migrations
npm run seed         # Seed initial data
npm run lint         # Run ESLint
npm run build        # Syntax check
```

## Project Structure

```
lms-backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation middleware
│   ├── routes/          # API routes
│   ├── validator/       # Zod validation schemas
│   ├── utils/           # Utility functions
│   ├── index.js         # Main server file
│   └── prismaClient.js  # Database client
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.js          # Seed data
├── uploads/             # File uploads directory
└── package.json
```

## Sprint 1 Deliverables ✅

- [x] Authentication system with JWT
- [x] Role-based access control
- [x] CSV bulk import functionality
- [x] Course management system
- [x] User management system
- [x] Event logging (E001, E002, E003)
- [x] Password reset workflow
- [x] Performance optimization for 20K users
- [x] Comprehensive API documentation
- [x] Postman-ready endpoints

## Support

For issues or questions, check the console logs for detailed error messages and event tracking.