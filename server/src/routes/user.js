import express from 'express';
import User from '../models/User.js';
import Source from '../models/Source.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('activeSources');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/keywords', protect, async (req, res) => {
    const { keywords } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.keywords = keywords;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/sources', protect, async (req, res) => {
    const { sourceIds } = req.body; // Array of Source IDs
    try {
        const user = await User.findById(req.user._id);
        user.activeSources = sourceIds;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
