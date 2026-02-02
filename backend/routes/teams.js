import express from 'express';
import { body, validationResult } from 'express-validator';
import Team from '../models/Team.js';
import Employee from '../models/Employee.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/teams
// @desc    Get all teams
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const teams = await Team.find().populate('members', 'name empId designation');
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/teams
// @desc    Create team
// @access  Private
router.post('/', protect, [
    body('name').trim().notEmpty().withMessage('Team name is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;

        // Check if team already exists
        const teamExists = await Team.findOne({ name });
        if (teamExists) {
            return res.status(400).json({ message: 'Team already exists' });
        }

        const team = await Team.create({
            name,
            points: 0,
            members: []
        });

        res.status(201).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/teams/:id
// @desc    Update team
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const { name } = req.body;

        // Check if new name conflicts with existing team
        if (name && name !== team.name) {
            const teamExists = await Team.findOne({ name });
            if (teamExists) {
                return res.status(400).json({ message: 'Team name already exists' });
            }
        }

        team.name = name || team.name;

        const updatedTeam = await team.save();
        res.json(updatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/teams/:id
// @desc    Delete team
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Remove team reference from employees
        await Employee.updateMany(
            { teamId: team._id },
            { $set: { teamId: null, role: 'Member' } }
        );

        await team.deleteOne();
        res.json({ message: 'Team removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PATCH /api/teams/:id/points
// @desc    Update team points
// @access  Private
router.patch('/:id/points', protect, async (req, res) => {
    try {
        const { points } = req.body;

        if (points === undefined || points < 0) {
            return res.status(400).json({ message: 'Please provide valid points' });
        }

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.points = points;
        const updatedTeam = await team.save();

        res.json(updatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/teams/:id/members
// @desc    Assign employee to team
// @access  Private
router.post('/:id/members', protect, async (req, res) => {
    try {
        const { employeeId, role } = req.body;

        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update employee
        employee.teamId = team._id;
        employee.role = role || 'Member';
        await employee.save();

        // Add to team members if not already there
        if (!team.members.includes(employeeId)) {
            team.members.push(employeeId);
            await team.save();
        }

        const updatedTeam = await Team.findById(team._id).populate('members', 'name empId designation');
        res.json(updatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/teams/:id/members/:empId
// @desc    Remove employee from team
// @access  Private
router.delete('/:id/members/:empId', protect, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const employee = await Employee.findById(req.params.empId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update employee
        employee.teamId = null;
        employee.role = 'Member';
        await employee.save();

        // Remove from team members
        team.members = team.members.filter(memberId => memberId.toString() !== req.params.empId);
        await team.save();

        const updatedTeam = await Team.findById(team._id).populate('members', 'name empId designation');
        res.json(updatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
