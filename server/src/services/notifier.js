import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

export const sendEmail = async (to, subject, text) => {
    if (process.env.NODEMAILER_EMAIL?.includes('mock') || !process.env.NODEMAILER_EMAIL) {
        console.log(`MOCK EMAIL To: ${to} | Subject: ${subject} | Body: ${text}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendWhatsApp = async (to, message) => {
    if (!process.env.TWILIO_ACCOUNT_SID) {
        console.log(`MOCK WHATSAPP To: ${to} | Message: ${message}`);
        return;
    }

    console.log(`WHATSAPP To: ${to} | Message: ${message}`);
};
