import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true, // Allow nulls (if phone only)
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allow nulls
    },
    name: {
        type: String,
        default: 'User'
    },
    otpHash: String,
    otpExpires: Date,
    keywords: [{
        type: String
    }],
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        whatsappNotifications: { type: Boolean, default: false }
    },
    activeSources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source'
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
