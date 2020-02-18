const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vincentiussss@gmail.com',
        pass: 'agkmdvbemorkppjv'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;