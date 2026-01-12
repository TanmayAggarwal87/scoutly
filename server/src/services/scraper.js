import axios from 'axios';
import * as cheerio from 'cheerio';
import Job from '../models/Job.js';
import Source from '../models/Source.js';
import { matchAndNotify } from './matcher.js';

const scrapeGreenhouse = async (source) => {
    try {
        const { data } = await axios.get(source.url);
        const $ = cheerio.load(data);
        const jobs = [];

        $('.opening').each((i, el) => {
            const title = $(el).find('a').text().trim();
            const relativeLink = $(el).find('a').attr('href');
            const location = $(el).find('.location').text().trim();

            if (title && relativeLink) {
                jobs.push({
                    title,
                    url: relativeLink.startsWith('http') ? relativeLink : `https://boards.greenhouse.io${relativeLink}`,
                    location,
                    company: source.name,
                    source: 'Greenhouse',
                    sourceUrl: source.url
                });
            }
        });

        return jobs;
    } catch (err) {
        return [];
    }
};

const scrapeLever = async (source) => {
    try {
        const { data } = await axios.get(source.url);
        const $ = cheerio.load(data);
        const jobs = [];

        $('.posting').each((i, el) => {
            const title = $(el).find('h5').text().trim();
            const link = $(el).find('.posting-title').attr('href');
            const location = $(el).find('.sort-by-location').text().trim();
            const team = $(el).find('.sort-by-team').text().trim();

            if (title && link) {
                jobs.push({
                    title,
                    url: link,
                    location,
                    company: source.name,
                    source: 'Lever',
                    sourceUrl: source.url,
                    description: team
                });
            }
        });

        return jobs;
    } catch (err) {
        return [];
    }
};

const scrapeCustom = async (source) => {
    try {
        const { data } = await axios.get(source.url);
        const $ = cheerio.load(data);
        const jobs = [];

        $('a').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');

            if (href && (text.includes('Engineer') || text.includes('Developer') || text.includes('Designer'))) {
                jobs.push({
                    title: text,
                    url: href.startsWith('http') ? href : new URL(href, source.url).toString(),
                    location: 'Remote/Unknown',
                    company: source.name,
                    source: 'Custom',
                    sourceUrl: source.url
                });
            }
        });

        return jobs;
    } catch (err) {
        return [];
    }
};

const processJobs = async (jobs) => {
    let newJobsCount = 0;

    for (const jobData of jobs) {
        const exists = await Job.findOne({ url: jobData.url });
        if (!exists) {
            const job = await Job.create(jobData);
            newJobsCount++;
            await matchAndNotify(job);
        }
    }

    return newJobsCount;
};

export const runScraper = async () => {
    const sources = await Source.find({ isActive: true });

    for (const source of sources) {
        let jobs = [];
        if (source.type === 'greenhouse' || source.url.includes('greenhouse.io') || source.url.includes('gh_jid')) {
            jobs = await scrapeGreenhouse(source);
        } else if (source.type === 'lever' || source.url.includes('lever.co')) {
            jobs = await scrapeLever(source);
        } else {
            jobs = await scrapeCustom(source);
        }

        if (jobs.length > 0) {
            const count = await processJobs(jobs);

            source.lastScrapedAt = new Date();
            await source.save();
        }
    }
};
