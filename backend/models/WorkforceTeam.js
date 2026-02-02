import mongoose from 'mongoose';

const workforceTeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide team name'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, {
    timestamps: true
});

const WorkforceTeam = mongoose.model('WorkforceTeam', workforceTeamSchema);

export default WorkforceTeam;
