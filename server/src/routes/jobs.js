import express from 'express';
import Job from '../models/Job.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.get('/', protect, async (req, res) => {
    try {
        const userKeywords = req.user.keywords;
        let query = {};

        if (userKeywords.length > 0) {
            query = {
                matchedKeywords: { $in: userKeywords }
            };
        } else {
            // If no keywords, show all jobs (Limit 50)
            query = {};
        }

        const jobs = await Job.find(query).sort({ datePosted: -1 }).limit(50);
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
