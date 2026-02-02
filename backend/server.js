import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import teamRoutes from './routes/teams.js';
import gameRoutes from './routes/games.js';
import announcementRoutes from './routes/announcements.js';
import workforceTeamRoutes from './routes/workforceTeams.js';
import activityRoutes from './routes/activities.js';
import settingsRoutes from './routes/settings.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/workforce-teams', workforceTeamRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/settings', settingsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'TeamHub API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
