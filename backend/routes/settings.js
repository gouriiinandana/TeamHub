import express from 'express';
import Settings from '../models/Settings.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get system settings
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // Create default settings if none exist
        if (!settings) {
            settings = await Settings.create({
                appName: 'TeamHub',
                logo: null,
                primaryColor: 'indigo',
                emailNotifications: true,
                maintenanceMode: false
            });
        }

        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/settings
// @desc    Update system settings
// @access  Private
router.put('/', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            const { appName, logo, primaryColor, emailNotifications, maintenanceMode } = req.body;

            settings.appName = appName !== undefined ? appName : settings.appName;
            settings.logo = logo !== undefined ? logo : settings.logo;
            settings.primaryColor = primaryColor !== undefined ? primaryColor : settings.primaryColor;
            settings.emailNotifications = emailNotifications !== undefined ? emailNotifications : settings.emailNotifications;
            settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;

            await settings.save();
        }

        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
