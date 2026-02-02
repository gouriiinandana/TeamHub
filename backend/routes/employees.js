import express from 'express';
import { body, validationResult } from 'express-validator';
import Employee from '../models/Employee.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const employees = await Employee.find().populate('teamId', 'name');
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/employees
// @desc    Add new employee
// @access  Private
router.post('/', protect, [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('empId').trim().notEmpty().withMessage('Employee ID is required'),
    body('designation').trim().notEmpty().withMessage('Designation is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, empId, designation, email, role, status } = req.body;

        // Check if employee ID already exists
        const empExists = await Employee.findOne({ empId });
        if (empExists) {
            return res.status(400).json({ message: 'Employee ID already exists' });
        }

        const employee = await Employee.create({
            name,
            empId,
            designation,
            email: email || '',
            role: role || 'Member',
            status: status || 'Active',
            points: 0
        });

        res.status(201).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/employees/import
// @desc    Bulk import employees
// @access  Private
router.post('/import', protect, async (req, res) => {
    try {
        const { employees } = req.body;

        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of employees' });
        }

        // Filter out employees with duplicate empIds
        const empIds = employees.map(emp => emp.empId);
        const existingEmployees = await Employee.find({ empId: { $in: empIds } });
        const existingEmpIds = existingEmployees.map(emp => emp.empId);

        const newEmployees = employees.filter(emp => !existingEmpIds.includes(emp.empId));

        if (newEmployees.length === 0) {
            return res.status(400).json({ message: 'All employees already exist' });
        }

        const formattedEmployees = newEmployees.map(emp => ({
            name: emp.name,
            empId: emp.empId,
            designation: emp.designation,
            email: emp.email || '',
            role: emp.role || 'Member',
            status: emp.status || 'Active',
            points: 0
        }));

        const createdEmployees = await Employee.insertMany(formattedEmployees);

        res.status(201).json({
            message: `Successfully imported ${createdEmployees.length} employees`,
            employees: createdEmployees,
            skipped: employees.length - createdEmployees.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const { name, empId, designation, email, role, status } = req.body;

        // Check if new empId conflicts with existing employee
        if (empId && empId !== employee.empId) {
            const empExists = await Employee.findOne({ empId });
            if (empExists) {
                return res.status(400).json({ message: 'Employee ID already exists' });
            }
        }

        employee.name = name || employee.name;
        employee.empId = empId || employee.empId;
        employee.designation = designation || employee.designation;
        employee.email = email !== undefined ? email : employee.email;
        employee.role = role || employee.role;
        employee.status = status || employee.status;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.deleteOne();
        res.json({ message: 'Employee removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PATCH /api/employees/:id/points
// @desc    Update employee points
// @access  Private
router.patch('/:id/points', protect, async (req, res) => {
    try {
        const { points } = req.body;

        if (points === undefined || points < 0) {
            return res.status(400).json({ message: 'Please provide valid points' });
        }

        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.points = points;
        const updatedEmployee = await employee.save();

        res.json(updatedEmployee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
