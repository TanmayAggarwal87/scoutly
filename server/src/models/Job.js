import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: String,
    url: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    source: String, // 'Greenhouse', 'Lever', etc.
    sourceUrl: String,
    datePosted: {
        type: Date,
        default: Date.now
    },
    matchedKeywords: [{
        type: String
    }]
}, { timestamps: true });

// Index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

export default mongoose.model('Job', jobSchema);
