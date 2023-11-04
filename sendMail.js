const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendMail = async (email, subject, html, filename, pdfFilePath) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAILGUN_HOST,
        port: process.env.MAILGUN_PORT,
        secure: false,
        auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: {
            name: "IBC",
            address: process.env.EMAIL_FROM_ADDRESS
        },
        to: `${email}, ajithtejag@gmail.com`,
        subject: subject,
        html: html,
        attachments: [
            {
                filename: `${filename}_certificate.pdf`,
                path: pdfFilePath,
                contentType: 'application/pdf'
            }
        ]
    });
}
