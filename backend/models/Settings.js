import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    appName: {
        type: String,
        default: 'TeamHub'
    },
    logo: {
        type: String,
        default: null
    },
    primaryColor: {
        type: String,
        default: 'indigo'
    },
    // Add other settings as needed
    emailNotifications: {
        type: Boolean,
        default: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
