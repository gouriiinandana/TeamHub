import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide game name'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide game date']
    },
    teamScores: [{
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        points: {
            type: Number,
            default: 0
        }
    }],
    employeeScores: [{
        empId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        points: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
