# TeamHub Backend

Backend API server for the TeamHub employee management and gamification platform.

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

## Prerequisites

Before running the backend, make sure you have:

1. **Node.js** (v16 or higher) installed
2. **MongoDB** installed and running locally, OR a MongoDB Atlas account

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

The `.env` file has already been created with default values. Update it if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teamhub
JWT_SECRET=teamhub_secret_key_2026_change_in_production
NODE_ENV=development
```

**Important:** 
- If using **MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string
- Change `JWT_SECRET` to a secure random string in production

### 3. Start MongoDB (if using local MongoDB)

Make sure MongoDB is running on your system:

```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# On macOS/Linux
mongod
```

### 4. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `PATCH /api/employees/:id/points` - Update employee points
- `POST /api/employees/import` - Bulk import employees

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `PATCH /api/teams/:id/points` - Update team points
- `POST /api/teams/:id/members` - Assign employee to team
- `DELETE /api/teams/:id/members/:empId` - Remove employee from team

### Games
- `GET /api/games` - Get all games
- `POST /api/games` - Add game with scores
- `GET /api/games/scheduled` - Get scheduled games
- `POST /api/games/scheduled` - Schedule game
- `PUT /api/games/scheduled/:id` - Update scheduled game
- `DELETE /api/games/scheduled/:id` - Delete scheduled game

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Workforce Teams
- `GET /api/workforce-teams` - Get all workforce teams
- `POST /api/workforce-teams` - Create workforce team
- `PUT /api/workforce-teams/:id` - Update workforce team
- `DELETE /api/workforce-teams/:id` - Delete workforce team
- `POST /api/workforce-teams/:id/members` - Add member
- `DELETE /api/workforce-teams/:id/members/:empId` - Remove member

### Activities & Settings
- `GET /api/activities` - Get activity logs
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings

All endpoints except `/api/auth/signup` and `/api/auth/login` require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User model
│   ├── Employee.js        # Employee model
│   ├── Team.js            # Team model
│   ├── Game.js            # Game model
│   ├── ScheduledGame.js   # Scheduled game model
│   ├── Announcement.js    # Announcement model
│   ├── WorkforceTeam.js   # Workforce team model
│   ├── Activity.js        # Activity log model
│   └── Settings.js        # Settings model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── employees.js       # Employee routes
│   ├── teams.js           # Team routes
│   ├── games.js           # Game routes
│   ├── announcements.js   # Announcement routes
│   ├── workforceTeams.js  # Workforce team routes
│   ├── activities.js      # Activity routes
│   └── settings.js        # Settings routes
├── .env                   # Environment variables
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
├── package.json           # Dependencies
└── server.js              # Main server file
```

## Testing the API

You can test the API using tools like:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands

Example signup request:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` to a different port
- Or kill the process using port 5000

### Authentication Errors
- Ensure you're including the JWT token in the Authorization header
- Check that the token hasn't expired (default: 30 days)
