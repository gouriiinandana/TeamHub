import express from 'express';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/activities
// @desc    Get activity logs
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query;

        const activities = await Activity.find()
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Activity.countDocuments();

        res.json({
            activities,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/activities
// @desc    Log an activity
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { type, user, action } = req.body;

        const activity = await Activity.create({
            type,
            user,
            action,
            timestamp: new Date()
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
