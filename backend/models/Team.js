import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide team name'],
        unique: true,
        trim: true
    },
    points: {
        type: Number,
        default: 0
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }]
}, {
    timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
