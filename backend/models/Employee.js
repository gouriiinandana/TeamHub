import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide employee name'],
        trim: true
    },
    empId: {
        type: String,
        required: [true, 'Please provide employee ID'],
        unique: true,
        trim: true
    },
    designation: {
        type: String,
        required: [true, 'Please provide designation'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    points: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['Member', 'Team Lead', 'Manager', 'Admin'],
        default: 'Member'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    }
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
