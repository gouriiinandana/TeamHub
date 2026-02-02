import express from 'express';
import { body, validationResult } from 'express-validator';
import WorkforceTeam from '../models/WorkforceTeam.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/workforce-teams
// @desc    Get all workforce teams
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const teams = await WorkforceTeam.find()
            .populate('members', 'name empId designation')
            .populate('lead', 'name empId designation');
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/workforce-teams
// @desc    Create workforce team
// @access  Private
router.post('/', protect, [
    body('name').trim().notEmpty().withMessage('Team name is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, members, lead } = req.body;

        const team = await WorkforceTeam.create({
            name,
            description: description || '',
            members: members || [],
            lead: lead || null
        });

        const populatedTeam = await WorkforceTeam.findById(team._id)
            .populate('members', 'name empId designation')
            .populate('lead', 'name empId designation');

        res.status(201).json(populatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/workforce-teams/:id
// @desc    Update workforce team
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const team = await WorkforceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Workforce team not found' });
        }

        const { name, description, lead } = req.body;

        team.name = name || team.name;
        team.description = description !== undefined ? description : team.description;
        team.lead = lead !== undefined ? lead : team.lead;

        const updatedTeam = await team.save();
        const populatedTeam = await WorkforceTeam.findById(updatedTeam._id)
            .populate('members', 'name empId designation')
            .populate('lead', 'name empId designation');

        res.json(populatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/workforce-teams/:id
// @desc    Delete workforce team
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const team = await WorkforceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Workforce team not found' });
        }

        await team.deleteOne();
        res.json({ message: 'Workforce team removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/workforce-teams/:id/members
// @desc    Add member to workforce team
// @access  Private
router.post('/:id/members', protect, async (req, res) => {
    try {
        const { employeeId } = req.body;

        const team = await WorkforceTeam.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Workforce team not found' });
        }

        if (!team.members.includes(employeeId)) {
            team.members.push(employeeId);
            await team.save();
        }

        const populatedTeam = await WorkforceTeam.findById(team._id)
            .populate('members', 'name empId designation')
            .populate('lead', 'name empId designation');

        res.json(populatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/workforce-teams/:id/members/:empId
// @desc    Remove member from workforce team
// @access  Private
router.delete('/:id/members/:empId', protect, async (req, res) => {
    try {
        const team = await WorkforceTeam.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Workforce team not found' });
        }

        team.members = team.members.filter(memberId => memberId.toString() !== req.params.empId);
        await team.save();

        const populatedTeam = await WorkforceTeam.findById(team._id)
            .populate('members', 'name empId designation')
            .populate('lead', 'name empId designation');

        res.json(populatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
