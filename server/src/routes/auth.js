import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendEmail, sendWhatsApp } from '../services/notifier.js';

const router = express.Router();

router.post('/login-otp', async (req, res) => {
    console.log('Login OTP Request received:', req.body);
    const { email, phone } = req.body;

    if (!email && !phone) {
        return res.status(400).json({ message: 'Please provide email or phone' });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        const identifier = {};
        if (email) identifier.email = email.toLowerCase();
        if (phone) identifier.phone = phone;

        let user = await User.findOne({
            $or: [
                { email: email ? email.toLowerCase() : null },
                { phone: phone }
            ].filter(c => Object.values(c)[0])
        });

        if (!user) {
            user = await User.create({
                email: email ? email.toLowerCase() : undefined,
                phone,
                otpHash: otp,
                otpExpires
            });
        } else {
            user.otpHash = otp;
            user.otpExpires = otpExpires;
            if (email) user.email = email.toLowerCase();
            if (phone) user.phone = phone;
            await user.save();
        }

        console.log(`OTP for ${email} / ${phone}: ${otp}`);

        if (email) {
            await sendEmail(email, 'Your Scoutly OTP', `Your login code is: ${otp}`);
        }

        if (phone) {
            await sendWhatsApp(phone, `Your Scoutly OTP is: ${otp}`);
        }

        res.json({ message: 'OTP sent successfully', devOtp: otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, phone, otp } = req.body;

    try {
        const query = {};
        if (email) query.email = email.toLowerCase();
        else if (phone) query.phone = phone;
        else return res.status(400).json({ message: 'Identifier required' });

        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otpHash !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        user.otpHash = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                keywords: user.keywords,
                preferences: user.preferences
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logged out' });
});

export default router;
