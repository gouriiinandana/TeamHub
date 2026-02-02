# TeamHub - Complete Setup Guide

This guide will help you set up both the backend and frontend of the TeamHub application.

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

The `.env` file is already created. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teamhub
JWT_SECRET=teamhub_secret_key_2026_change_in_production
NODE_ENV=development
```

**For MongoDB Atlas:**
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teamhub?retryWrites=true&w=majority
```

### 4. Start MongoDB (Local Only)

If using local MongoDB:

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
mongod
```

### 5. Start Backend Server

```bash
npm start
```

Or with auto-reload for development:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Project Root

```bash
cd ..
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

The `.env` file is already created with:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## First Time Usage

### 1. Create an Account

1. Open your browser and go to `http://localhost:5173`
2. Click on "Sign Up" or navigate to the signup page
3. Create a new account with:
   - Name
   - Email
   - Password (minimum 6 characters)

### 2. Login

After signup, you'll be automatically logged in. Otherwise:
1. Go to the login page
2. Enter your email and password
3. Click "Login"

### 3. Start Using TeamHub

Once logged in, you can:
- Add employees
- Create teams
- Assign employees to teams
- Track points and performance
- Schedule games
- Make announcements
- And more!

## Running Both Servers Simultaneously

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Important Notes

### Data Migration from localStorage

If you had data in localStorage from a previous version:
- The old localStorage data will NOT automatically migrate to the backend
- You'll need to re-add employees, teams, etc. through the UI
- Or you can use the bulk import feature for employees

### Authentication

- JWT tokens are stored in localStorage
- Tokens expire after 30 days
- If you get authentication errors, try logging out and logging back in

### CORS

The backend is configured to accept requests from any origin during development. For production, you should configure CORS to only accept requests from your frontend domain.

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify the `MONGODB_URI` in `backend/.env`
- Check if port 5000 is available

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Authentication errors
- Clear localStorage and try logging in again
- Check if the JWT_SECRET matches between requests
- Verify the token hasn't expired

### MongoDB connection errors
- Ensure MongoDB service is running
- For Atlas: Check IP whitelist and credentials
- Verify the connection string format

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong, random `JWT_SECRET`
3. Configure CORS for your frontend domain
4. Use a production MongoDB instance (MongoDB Atlas recommended)
5. Deploy to a service like Heroku, Railway, or DigitalOcean

### Frontend
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder to a static hosting service (Vercel, Netlify, etc.)
3. Update `VITE_API_URL` to point to your production backend URL

## Support

For issues or questions:
1. Check the backend logs in the terminal
2. Check the browser console for frontend errors
3. Verify all environment variables are set correctly
