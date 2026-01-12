const mongoose = require('mongoose');
require('dotenv').config();
const Source = require('./models/Source');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scoutly')
    .then(async () => {
        console.log('Connected to DB');

        // Clear existing bad sources
        await Source.deleteMany({});

        // Add known working ones
        const newSources = [
            { name: 'Figma', url: 'https://boards.greenhouse.io/figma', type: 'greenhouse' },
            { name: 'Discord', url: 'https://boards.greenhouse.io/discord', type: 'greenhouse' },
            { name: 'Twitch', url: 'https://boards.greenhouse.io/twitch', type: 'greenhouse' },
            { name: 'Canonical', url: 'https://boards.greenhouse.io/canonical', type: 'greenhouse' },
            // Lever examples
            { name: 'Fampay', url: 'https://jobs.lever.co/fampay', type: 'lever' },
            { name: 'Postman', url: 'https://jobs.lever.co/postman', type: 'lever' }
        ];

        await Source.insertMany(newSources);
        console.log('Updated sources with valid URLs');
        process.exit();
    })
    .catch(err => console.error(err));
