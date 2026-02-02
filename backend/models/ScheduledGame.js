import mongoose from 'mongoose';

const scheduledGameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide game name'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide game date']
    },
    time: {
        type: String,
        required: [true, 'Please provide game time']
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

const ScheduledGame = mongoose.model('ScheduledGame', scheduledGameSchema);

export default ScheduledGame;
