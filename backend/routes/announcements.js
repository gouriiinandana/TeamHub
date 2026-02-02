import express from 'express';
import { body, validationResult } from 'express-validator';
import Announcement from '../models/Announcement.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/announcements
// @desc    Create announcement
// @access  Private
router.post('/', protect, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, priority, author } = req.body;

        const announcement = await Announcement.create({
            title,
            content,
            priority: priority || 'medium',
            author: author || 'Admin'
        });

        res.status(201).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const { title, content, priority, author } = req.body;

        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;
        announcement.priority = priority || announcement.priority;
        announcement.author = author || announcement.author;

        const updatedAnnouncement = await announcement.save();
        res.json(updatedAnnouncement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
