import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import userRoutes from './routes/user.js';
import sourceRoutes from './routes/sources.js';
import notificationRoutes from './routes/notifications.js';

import { startScheduler } from './services/scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scoutly')
  .then(async () => {
    console.log('MongoDB Connected');

    try {
      const Source = (await import('./models/Source.js')).default;
      const count = await Source.countDocuments();
      const defaults = [
        { name: 'Google', url: 'https://careers.google.com/jobs/results/', type: 'custom' },
        { name: 'Amazon', url: 'https://www.amazon.jobs/en/search', type: 'custom' },
        { name: 'Meta', url: 'https://www.metacareers.com/jobs', type: 'custom' },
        { name: 'Apple', url: 'https://jobs.apple.com/en-us/search', type: 'custom' },
        { name: 'Netflix', url: 'https://jobs.netflix.com/search', type: 'custom' },
        { name: 'Stripe', url: 'https://jobs.lever.co/stripe', type: 'lever' },
        { name: 'Fampay', url: 'https://jobs.lever.co/fampay', type: 'lever' },
        { name: 'Figma', url: 'https://boards.greenhouse.io/figma', type: 'greenhouse' },
        { name: 'Discord', url: 'https://boards.greenhouse.io/discord', type: 'greenhouse' },
      ];

      for (const source of defaults) {
        await Source.findOneAndUpdate(
          { name: source.name },
          source,
          { upsert: true, new: true }
        );
      }
      console.log('Seeded/Updated sources');
    } catch (e) {
      console.error("Seeding error", e);
    }
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

startScheduler();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
