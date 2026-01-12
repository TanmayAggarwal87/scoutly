import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: String,
    message: String,
    type: {
        type: String,
        enum: ['job_alert', 'system', 'other'],
        default: 'job_alert',
    },
    read: {
        type: Boolean,
        default: false,
    },
    data: Object, // Link to job ID etc
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
