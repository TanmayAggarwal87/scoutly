import cron from 'node-cron';
import { runScraper } from './scraper.js';

// Run every hour: '0 * * * *'
export const startScheduler = () => {
    cron.schedule('0 * * * *', () => {
        console.log('Running Scheduled Scrape...');
        runScraper();
    });
};
