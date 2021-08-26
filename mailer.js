const nodemailer = require('nodemailer');
require('dotenv').config();

exports.transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        password: process.env.EMAIL_PASSWORD,
    },
    secure: true
});

exports.createEmail = function(to, subject, text, html) {
    return {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html
    }
}

exports.sendMail = function(mailData, callback) {
    transporter.sendMail(mailData, callback);
}