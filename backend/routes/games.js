import express from 'express';
import { body, validationResult } from 'express-validator';
import Game from '../models/Game.js';
import ScheduledGame from '../models/ScheduledGame.js';
import Team from '../models/Team.js';
import Employee from '../models/Employee.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/games
// @desc    Get all games
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const games = await Game.find()
            .populate('teamScores.teamId', 'name')
            .populate('employeeScores.empId', 'name empId')
            .sort({ date: -1 });
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/games
// @desc    Add game with scores
// @access  Private
router.post('/', protect, [
    body('name').trim().notEmpty().withMessage('Game name is required'),
    body('date').notEmpty().withMessage('Game date is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, date, teamScores, employeeScores } = req.body;

        const game = await Game.create({
            name,
            date,
            teamScores: teamScores || [],
            employeeScores: employeeScores || []
        });

        // Update team points
        if (teamScores && teamScores.length > 0) {
            for (const score of teamScores) {
                const team = await Team.findById(score.teamId);
                if (team) {
                    team.points += score.points;
                    await team.save();
                }
            }
        }

        // Update employee points
        if (employeeScores && employeeScores.length > 0) {
            for (const score of employeeScores) {
                const employee = await Employee.findById(score.empId);
                if (employee) {
                    employee.points += score.points;
                    await employee.save();
                }
            }
        }

        const populatedGame = await Game.findById(game._id)
            .populate('teamScores.teamId', 'name')
            .populate('employeeScores.empId', 'name empId');

        res.status(201).json(populatedGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/games/scheduled
// @desc    Get scheduled games
// @access  Private
router.get('/scheduled', protect, async (req, res) => {
    try {
        const scheduledGames = await ScheduledGame.find()
            .populate('teams', 'name')
            .sort({ date: 1 });
        res.json(scheduledGames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/games/scheduled
// @desc    Schedule a game
// @access  Private
router.post('/scheduled', protect, [
    body('name').trim().notEmpty().withMessage('Game name is required'),
    body('date').notEmpty().withMessage('Game date is required'),
    body('time').notEmpty().withMessage('Game time is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, date, time, teams, description } = req.body;

        const scheduledGame = await ScheduledGame.create({
            name,
            date,
            time,
            teams: teams || [],
            description: description || '',
            status: 'scheduled'
        });

        const populatedGame = await ScheduledGame.findById(scheduledGame._id)
            .populate('teams', 'name');

        res.status(201).json(populatedGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/games/scheduled/:id
// @desc    Update scheduled game
// @access  Private
router.put('/scheduled/:id', protect, async (req, res) => {
    try {
        const scheduledGame = await ScheduledGame.findById(req.params.id);

        if (!scheduledGame) {
            return res.status(404).json({ message: 'Scheduled game not found' });
        }

        const { name, date, time, teams, description, status } = req.body;

        scheduledGame.name = name || scheduledGame.name;
        scheduledGame.date = date || scheduledGame.date;
        scheduledGame.time = time || scheduledGame.time;
        scheduledGame.teams = teams !== undefined ? teams : scheduledGame.teams;
        scheduledGame.description = description !== undefined ? description : scheduledGame.description;
        scheduledGame.status = status || scheduledGame.status;

        const updatedGame = await scheduledGame.save();
        const populatedGame = await ScheduledGame.findById(updatedGame._id)
            .populate('teams', 'name');

        res.json(populatedGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/games/scheduled/:id
// @desc    Delete scheduled game
// @access  Private
router.delete('/scheduled/:id', protect, async (req, res) => {
    try {
        const scheduledGame = await ScheduledGame.findById(req.params.id);

        if (!scheduledGame) {
            return res.status(404).json({ message: 'Scheduled game not found' });
        }

        await scheduledGame.deleteOne();
        res.json({ message: 'Scheduled game removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
