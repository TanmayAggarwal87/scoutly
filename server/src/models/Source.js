import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['greenhouse', 'lever', 'custom'],
        default: 'custom'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastScrapedAt: Date,
    selector: String // Optional: Custom CSS selector for 'custom' type
}, { timestamps: true });

export default mongoose.model('Source', sourceSchema);
