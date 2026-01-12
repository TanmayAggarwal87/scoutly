import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendEmail, sendWhatsApp } from './notifier.js';

export const matchAndNotify = async (job) => {
    try {
        const users = await User.find({ 'keywords.0': { $exists: true } });

        const jobText = `${job.title} ${job.company} ${job.location || ''}`.toLowerCase();

        let jobKeywords = new Set();

        for (const user of users) {
            const matches = user.keywords.filter(k => jobText.includes(k.toLowerCase()));

            if (matches.length > 0) {
                matches.forEach(m => jobKeywords.add(m));

                const message = `Startup Job Alert: ${job.title} at ${job.company}\nApply: ${job.url}`;

                await Notification.create({
                    userId: user._id,
                    title: `New Role: ${job.title}`,
                    message: `${job.company} is hiring!`,
                    type: 'job_alert',
                    data: { jobId: job._id, url: job.url }
                });

                if (user.preferences.emailNotifications) {
                    await sendEmail(user.email, `New Job Alert: ${job.title}`, message);
                }

                if (user.preferences.whatsappNotifications && user.phone) {
                    await sendWhatsApp(user.phone, message);
                }
            }
        }

        if (jobKeywords.size > 0) {
            job.matchedKeywords = Array.from(jobKeywords);
            await job.save();
        }

    } catch (error) {
        console.error('Error in matcher:', error);
    }
};
