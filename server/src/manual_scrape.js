import mongoose from mongoose
require('dotenv').config();
import  { runScraper } from'./services/scraper';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scoutly')
    .then(async () => {
        console.log('Connected to DB');
        await runScraper();
        console.log('Done');
        process.exit();
    })
    .catch(err => console.error(err));
