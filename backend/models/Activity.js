import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['user', 'system', 'settings', 'game', 'team'],
        required: true
    },
    user: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
