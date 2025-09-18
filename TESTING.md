# Testing Guide - LMS Backend Sprint 1

## Test Environment Setup

### 1. Prerequisites Check
- [ ] Node.js v18+ installed
- [ ] PostgreSQL running
- [ ] Postman installed
- [ ] Git installed

### 2. Setup Steps
```bash
# Clone and setup
git clone https://github.com/CHARITHESHJ27/-lms-backend-dummy.git
cd -lms-backend-dummy
npm install

# Database setup
npm run generate
npm run migrate
npm run seed

# Start server
npm run dev
```

### 3. Verify Setup
- Server should start on `http://localhost:3000`
- Console should show: "Server running on http://localhost:3000"
- Test endpoint: `GET http://localhost:3000/` should return "LMS Backend is running!"



### Test Case 1: E001 - Login Success ✅
**Endpoint:** `POST /api/auth/login`
**Test Data:**
```json
{
  "email": "admin@lms.com",
  "password": "admin123"
}
```
**Expected Result:**
- Status: 200
- Response contains: token, role, userId
- Console log: `[E001] Login Success - User: admin@lms.com, Role: ADMIN`

### Test Case 2: E002 - Login Failure ✅
**Endpoint:** `POST /api/auth/login`
**Test Data:**
```json
{
  "email": "wrong@email.com",
  "password": "wrongpass"
}
```
**Expected Result:**
- Status: 401
- Response: `{"message": "Invalid credentials"}`
- Console log: `[E002] Login Failure - Email: wrong@email.com, Reason: User not found`

### Test Case 3: Password Reset Required ✅
**Endpoint:** `POST /api/auth/login`
**Test Data:**
```json
{
  "email": "student@lms.com",
  "password": "student123"
}
```
**Expected Result:**
- Status: 403
- Response: `{"message": "Password reset required on first login", "action": "RESET_PASSWORD"}`

### Test Case 4: Password Reset ✅
**Endpoint:** `POST /api/auth/reset-password`
**Test Data:**
```json
{
  "email": "student@lms.com",
  "newPassword": "newpassword123"
}
```
**Expected Result:**
- Status: 200
- Response: `{"message": "Password reset successful. Please login again."}`

### Test Case 5: E003 - Course Assignment ✅
**Prerequisites:** Login as admin first, get token
**Endpoint:** `POST /api/courses/assign`
**Headers:** `Authorization: Bearer <admin-token>`
**Test Data:**
```json
{
  "userId": 2,
  "courseId": 1
}
```
**Expected Result:**
- Status: 200
- Response contains enrollment details
- Console log: `[E003] Course Assigned - User: tutor@lms.com, Course: JavaScript Fundamentals`

### Test Case 6: CSV Import ✅
**Prerequisites:** Login as admin, create CSV file
**Endpoint:** `POST /api/auth/import-csv`
**Headers:** `Authorization: Bearer <admin-token>`
**Body:** form-data with file upload
**CSV Content:**
```csv
email,password,role
test1@example.com,password123,STUDENT
test2@example.com,password123,TUTOR
```
**Expected Result:**
- Status: 200
- Response: `{"message": "CSV import successful", "imported": 2}`

### Test Case 7: Get Users (Admin Only) ✅
**Endpoint:** `GET /api/users`
**Headers:** `Authorization: Bearer <admin-token>`
**Expected Result:**
- Status: 200
- Response: Array of users with pagination

### Test Case 8: Get Courses ✅
**Endpoint:** `GET /api/courses`
**Headers:** `Authorization: Bearer <token>`
**Expected Result:**
- Status: 200
- Response: Array of courses

### Test Case 9: Dashboard Access ✅
**Endpoint:** `GET /api/auth/dashboard`
**Headers:** `Authorization: Bearer <token>`
**Expected Result:**
- Status: 200
- Response: Role-specific dashboard data

### Test Case 10: Unauthorized Access ✅
**Endpoint:** `GET /api/users`
**Headers:** No Authorization header
**Expected Result:**
- Status: 401
- Response: `{"message": "Access denied. No token provided."}`

## Performance Tests

### Test Case 11: Large CSV Import
**Generate test file:**
```bash
node generate-test-csv.js
```
**Import:** Use generated `students_20k.csv`
**Expected:** Batch processing with progress logs

### Test Case 12: Pagination
**Endpoint:** `GET /api/users?page=1&limit=10`
**Expected:** 10 users per page with pagination info

## Validation Tests

### Test Case 13: Invalid Email Format
**Endpoint:** `POST /api/auth/login`
**Test Data:**
```json
{
  "email": "invalid-email",
  "password": "password123"
}
```
**Expected Result:**
- Status: 400
- Response contains validation errors

### Test Case 14: Missing Required Fields
**Endpoint:** `POST /api/auth/login`
**Test Data:**
```json
{
  "email": "test@example.com"
}
```
**Expected Result:**
- Status: 400
- Response: Password required error

## Security Tests

### Test Case 15: JWT Token Validation
**Endpoint:** `GET /api/users`
**Headers:** `Authorization: Bearer invalid-token`
**Expected Result:**
- Status: 403
- Response: Invalid token error

### Test Case 16: Role-based Access
**Login as STUDENT, try admin endpoint:**
**Endpoint:** `DELETE /api/users/1`
**Expected Result:**
- Status: 403
- Response: Access denied

## Test Checklist

### Authentication & Authorization
- [ ] Admin login works (E001)
- [ ] Wrong credentials fail (E002)
- [ ] Password reset required for new users
- [ ] Password reset functionality works
- [ ] JWT tokens are generated and validated
- [ ] Role-based access control works

### Core Features
- [ ] CSV import works (small and large files)
- [ ] Course assignment works (E003)
- [ ] User CRUD operations work
- [ ] Course CRUD operations work
- [ ] Dashboard shows role-specific data

### Performance & Scalability
- [ ] Large CSV import processes in batches
- [ ] Pagination works for large datasets
- [ ] Database queries are optimized
- [ ] Memory usage is reasonable

### Error Handling
- [ ] Validation errors are clear
- [ ] Authentication errors are handled
- [ ] Database errors are caught
- [ ] File upload errors are handled

### Event Logging
- [ ] E001 events logged for successful logins
- [ ] E002 events logged for failed logins
- [ ] E003 events logged for course assignments
- [ ] All events include timestamps

## Test Data

### Default Users
```
admin@lms.com / admin123 (ADMIN, no reset required)
tutor@lms.com / tutor123 (TUTOR, reset required)
student@lms.com / student123 (STUDENT, reset required)
newstudent@lms.com / newstudent123 (STUDENT, reset required)
```

### Default Courses
```
1. JavaScript Fundamentals
2. React Development
```

## Troubleshooting

### Common Issues
1. **Server won't start:** Check PostgreSQL is running
2. **Database errors:** Run `npm run migrate`
3. **Import fails:** Check CSV format and file permissions
4. **Token errors:** Ensure proper Authorization header format

### Debug Commands
```bash
# Check database connection
node test-db.js

# View logs
npm run dev (check console output)

# Lint code
npm run lint
```