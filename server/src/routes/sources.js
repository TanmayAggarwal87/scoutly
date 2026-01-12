import express from 'express';
import Source from '../models/Source.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.get('/', protect, async (req, res) => {
    try {
        const sources = await Source.find({ isActive: true });
        res.json(sources);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', protect, async (req, res) => {
    const { name, url, type } = req.body;
    try {
        const source = await Source.create({ name, url, type });
        res.json(source);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
